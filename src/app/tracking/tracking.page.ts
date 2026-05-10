import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  NgZone,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { Location } from '@angular/common';

import { CommonModule } from '@angular/common';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';

import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrackingPage implements AfterViewInit {

  @ViewChild('mapContainer')
  mapContainer!: ElementRef;

  map!: maplibregl.Map;
  marker!: maplibregl.Marker;

  mapLoaded = false;

  isTracking = false;
  isLoading = false;

  totalDistance = 0;
  speed = 0;

  lastSeen = '';

  routeCoords: [number, number][] = [];

  constructor(private ngZone: NgZone,
    private location: Location
  ) {}

  // =========================
  // INIT
  // =========================

  ngAfterViewInit(): void {
    this.initMap();
  }

  // =========================
  // MAP
  // =========================

  initMap(): void {

    const startPoint: [number, number] = [70.295, 28.420];

    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: startPoint,
      zoom: 15.5,
pitch: 60,
bearing: -20
    });

    this.map.on('load', () => {

      this.mapLoaded = true;

      console.log('MAP LOADED');

      // VEHICLE MARKER
      this.marker = new maplibregl.Marker({
        color: '#00e5ff'
      })
        .setLngLat(startPoint)
        .addTo(this.map);

      // ROUTE SOURCE
      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });

      // ROUTE LAYER
      this.map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        paint: {
          'line-color': '#00e5ff',
'line-width': 7,
'line-opacity': 0.9
        }
      });

    });

  }

  // =========================
  // START TRACKING
  // =========================

  startTracking(): void {

    if (!this.mapLoaded) {
      alert('Map still loading...');
      return;
    }

    if (this.isTracking) return;

    this.isTracking = true;
    this.isLoading = true;

    this.totalDistance = 0;

const url =
  'https://router.project-osrm.org/route/v1/driving/72.6736,30.1603;72.3497,30.0454?overview=full&geometries=geojson';

    fetch(url)
      .then(res => res.json())
      .then(data => {

        console.log(data);

        this.routeCoords = data.routes[0].geometry.coordinates;

        this.isLoading = false;

        this.animateVehicle();

      })
      .catch(error => {

        console.log(error);

        this.isLoading = false;
        this.isTracking = false;

      });

  }

  // =========================
  // ANIMATION
  // =========================

animateVehicle() {

  if (!this.marker) return;

  let i = 0;

  const interval = setInterval(() => {

    if (!this.isTracking || i >= this.routeCoords.length) {
      clearInterval(interval);
      this.isTracking = false;
      return;
    }

    const coord = this.routeCoords[i] as [number, number];

    // MOVE MARKER
    this.marker.setLngLat(coord);

    // ⭐ IMPORTANT: MOVE MAP WITH MARKER
    this.map.jumpTo({
  center: coord,
  zoom: 15
});

    // ROUTE UPDATE
    const source = this.map.getSource('route') as maplibregl.GeoJSONSource;

    source.setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: this.routeCoords.slice(0, i + 1)
      }
    });

    i++;

  }, 500);
}
  // =========================
  // STOP
  // =========================

  stopTracking(): void {
    this.isTracking = false;
  }

  // =========================
  // RECENTER
  // =========================

  recenterMap(): void {

    if (!this.marker) return;

    const lngLat = this.marker.getLngLat();

    this.map.flyTo({
      center: [lngLat.lng, lngLat.lat],
      zoom: 15
    });

  }

  // =========================
  // DISTANCE
  // =========================

  getDistance(
    a: [number, number],
    b: [number, number]
  ): number {

    const R = 6371;

    const dLat =
      ((b[1] - a[1]) * Math.PI) / 180;

    const dLng =
      ((b[0] - a[0]) * Math.PI) / 180;

    const lat1 =
      (a[1] * Math.PI) / 180;

    const lat2 =
      (b[1] * Math.PI) / 180;

    const x =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.sin(dLng / 2) *
        Math.sin(dLng / 2) *
        Math.cos(lat1) *
        Math.cos(lat2);

    return (
      R *
      2 *
      Math.atan2(
        Math.sqrt(x),
        Math.sqrt(1 - x)
      )
    );
  }

  goBack() {
  this.location.back();
}
}