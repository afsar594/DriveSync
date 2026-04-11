import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { TrackingService, VehicleLocation } from '../services/tracking.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Mapbox Types
declare var mapboxgl: any;

@Component({
  selector: 'app-tracking',
  templateUrl: 'tracking.page.html',
  styleUrls: ['tracking.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent],
})
export class TrackingPage implements OnInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  map: any;
  currentLocation: VehicleLocation | null = null;
  vehicleMarker: any;
  private destroy$ = new Subject<void>();

  constructor(private trackingService: TrackingService) {}

  ngOnInit(): void {
    this.loadMapboxScript();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map.remove();
    }
  }

  private loadMapboxScript(): void {
    // Load Mapbox GL JS dynamically
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js';
    script.async = true;
    script.onload = () => this.initMap();
    document.head.appendChild(script);

    // Load Mapbox CSS
    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  private initMap(): void {
    if (!mapboxgl) return;

    // Note: Replace with your actual Mapbox token
    const token = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjazBxcWFiMGEwMDAwMmtwYXE3NTZ1MDBrIn0.demo';
    mapboxgl.accessToken = token;

    setTimeout(() => {
      if (!this.mapContainer) return;

      this.map = new mapboxgl.Map({
        container: this.mapContainer.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.0060, 40.7128],
        zoom: 13
      });

      this.map.on('load', () => {
        this.initializeVehicleMarker();
        this.subscribeToLocationUpdates();
      });
    }, 100);
  }

  private initializeVehicleMarker(): void {
    if (!this.map) return;

    // Create a marker element
    const el = document.createElement('div');
    el.id = 'vehicle-marker';
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%2218%22 fill=%22%234285F4%22 /%3E%3Cpath d=%22M20 5L32 32H8Z%22 fill=%22white%22 /%3E%3C/svg%3E")';
    el.style.backgroundSize = 'contain';
    el.style.cursor = 'pointer';
    el.style.borderRadius = '50%';

    const currentLocation = this.trackingService.getCurrentLocation();
    this.vehicleMarker = new mapboxgl.Marker(el)
      .setLngLat([currentLocation.longitude, currentLocation.latitude])
      .addTo(this.map);

    // Center map on vehicle
    this.map.flyTo({
      center: [currentLocation.longitude, currentLocation.latitude],
      zoom: 15,
      duration: 1500
    });
  }

  private subscribeToLocationUpdates(): void {
    this.trackingService.vehicleLocation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((location: VehicleLocation) => {
        this.currentLocation = location;

        if (this.vehicleMarker && this.map) {
          // Update marker position
          this.vehicleMarker.setLngLat([location.longitude, location.latitude]);

          // Rotate marker based on heading
          const el = this.vehicleMarker.getElement();
          if (el) {
            el.style.transform = `rotate(${location.heading}deg)`;
          }

          // Update map center to follow vehicle smoothly
          this.map.setCenter([location.longitude, location.latitude]);
        }
      });
  }
}
