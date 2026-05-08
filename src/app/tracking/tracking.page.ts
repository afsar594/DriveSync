import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  NgZone,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';

import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-tracking',
  templateUrl: 'tracking.page.html',
  styleUrls: ['tracking.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrackingPage implements AfterViewInit {

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  map!: maplibregl.Map;
  marker!: maplibregl.Marker;

  routeCoords: [number, number][] = [];

  isTracking = false;
  isLoading = false;
  isOnline = false;

  totalDistance: number = 0;

  currentLocation: any = null;
  lastSeen = '';

  constructor(private ngZone: NgZone) {}

  // ================= INIT MAP =================
  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {

    const startPoint: [number, number] = [70.295, 28.420];

    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.mapbox.com/styles/v1/mapbox/navigation-night-v1?access_token=YOUR_TOKEN`,
      center: startPoint,
      zoom: 14
    });

    this.map.on('load', () => {

      this.marker = new maplibregl.Marker({
        color: '#ff0000',
        rotationAlignment: 'map'
      })
        .setLngLat(startPoint)
        .addTo(this.map);

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

      this.map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        paint: {
          'line-color': '#00e5ff',
          'line-width': 4
        }
      });
    });
  }

  // ================= START TRACKING =================
  startTracking() {

    if (this.isTracking) return;

    this.isTracking = true;
    this.isLoading = true;
    this.totalDistance = 0;

    // 🔥 TEST ROUTE (REAL ROAD)
    const start = '70.295,28.420';
    const end = '70.330,28.455';

    const url =
      `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

    fetch(url)
      .then(res => res.json())
      .then(data => {

        this.routeCoords = data.routes[0].geometry.coordinates;

        this.isLoading = false;

        this.animateVehicle();
      })
      .catch(() => {
        this.isLoading = false;
        this.isTracking = false;
      });
  }

  // ================= ANIMATION =================
  animateVehicle() {

    let i = 0;

    const move = () => {

      if (!this.isTracking) return;

      if (i >= this.routeCoords.length - 1) {
        this.isTracking = false;
        return;
      }

      const current = this.routeCoords[i];
      const next = this.routeCoords[i + 1];

      const [lng, lat] = current;

      // 🔥 ROTATION
      const heading = this.getBearing(current, next);

      this.marker.setLngLat([lng, lat]);
      this.marker.setRotation(heading);

      this.map.setCenter([lng, lat]);

      // 🔥 DISTANCE
      this.totalDistance += this.getDistance(current, next);

      // 🔥 ROUTE UPDATE
      const source = this.map.getSource('route') as maplibregl.GeoJSONSource;

      source.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: this.routeCoords.slice(0, i + 1)
        }
      });

      // 🔥 UI UPDATE
      this.ngZone.run(() => {

        this.currentLocation = {
          latitude: lat,
          longitude: lng,
          speed: 30 + Math.random() * 20,
          heading: heading
        };

        this.lastSeen = new Date().toLocaleTimeString();
        this.isOnline = true;
      });

      i++;

      setTimeout(() => requestAnimationFrame(move), 40);
    };

    move();
  }

  // ================= STOP =================
  stopTracking() {
    this.isTracking = false;
  }

  // ================= RECENTER =================
  recenterMap() {
    if (this.currentLocation) {
      this.map.setCenter([
        this.currentLocation.longitude,
        this.currentLocation.latitude
      ]);
    }
  }

  // ================= BEARING =================
  getBearing(start: [number, number], end: [number, number]) {

    const y = Math.sin(end[0] - start[0]) * Math.cos(end[1]);
    const x =
      Math.cos(start[1]) * Math.sin(end[1]) -
      Math.sin(start[1]) * Math.cos(end[1]) *
      Math.cos(end[0] - start[0]);

    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  // ================= DISTANCE =================
  getDistance(a: [number, number], b: [number, number]) {

    const R = 6371;

    const dLat = (b[1] - a[1]) * Math.PI / 180;
    const dLng = (b[0] - a[0]) * Math.PI / 180;

    const lat1 = a[1] * Math.PI / 180;
    const lat2 = b[1] * Math.PI / 180;

    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLng / 2) ** 2 *
      Math.cos(lat1) *
      Math.cos(lat2);

    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  // ================= SPEED CLASS =================
  getSpeedClass(speed: number) {
    if (speed < 40) return 'slow';
    if (speed < 80) return 'normal';
    return 'fast';
  }
}