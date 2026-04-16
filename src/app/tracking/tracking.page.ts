import { Component, ViewChild, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { TrackingService, VehicleLocation, TrackingHistoryItem } from '../services/tracking.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Leaflet global type
declare var L: any;

@Component({
  selector: 'app-tracking',
  templateUrl: 'tracking.page.html',
  styleUrls: ['tracking.page.scss'],
  imports: [CommonModule, IonContent, IonButton],
})
export class TrackingPage implements OnInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  map: any;
  currentLocation: VehicleLocation | null = null;
  vehicleMarker: any;
  isTracking = false;
  routePolyline: any;
  trackingPath: [number, number][] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();

  // Modern GPS Navigator Icon
  private vehicleIcon = L.divIcon({
    html: `<div id="vehicle-marker" style="
      width: 48px;
      height: 48px;
      transform-origin: center;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer glow/pulse circle -->
        <circle cx="24" cy="24" r="20" fill="none" stroke="#0EA5E9" stroke-width="1" opacity="0.3"/>
        <!-- GPS tracking circle (main) -->
        <circle cx="24" cy="24" r="16" fill="#0EA5E9" stroke="#0369A1" stroke-width="1.5"/>
        <!-- Navigation arrow pointing up -->
        <path d="M 24 10 L 32 24 L 28 24 L 28 32 L 20 32 L 20 24 L 16 24 Z" fill="white" stroke="white" stroke-width="0.5"/>
        <!-- Center dot -->
        <circle cx="24" cy="24" r="3" fill="white"/>
        <!-- Accuracy indicator circles -->
        <circle cx="24" cy="24" r="22" fill="none" stroke="#0EA5E9" stroke-width="0.8" opacity="0.4" stroke-dasharray="2,2"/>
      </svg>
    </div>`,
    iconSize: [48, 48],
    className: 'vehicle-marker-icon'
  });

  constructor(private trackingService: TrackingService, private ngZone: NgZone) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.initLeafletMap();
      this.loadInitialLocation();
    }, 500);
  }

  /**
   * Load initial location before tracking starts
   */
  private loadInitialLocation(): void {
    const initialLocation = this.trackingService.getCurrentLocation();
    this.currentLocation = initialLocation;
    if (this.vehicleMarker && this.map) {
      this.vehicleMarker.setLatLng([initialLocation.latitude, initialLocation.longitude]);
      this.map.setView([initialLocation.latitude, initialLocation.longitude], 15);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.trackingService.stopTracking();
    if (this.map) {
      this.map.remove();
    }
  }

  /**
   * Start real-time tracking from backend API
   */
  startTracking(): void {
    if (this.isTracking) return;

    this.isLoading = true;
    this.isTracking = true;
    this.trackingPath = [];
    this.trackingService.startRouteTracking();

    // Draw initial route after loading
    setTimeout(() => {
      this.drawTrackingRoute();
      this.subscribeToLocationUpdates();
      this.isLoading = false;
    }, 2000); // Give time for initial data load
  }

  /**
   * Start simulated tracking with test data
   * Moves vehicle through provided locations to demonstrate live tracking
   */
  async startSimulatedTracking(): Promise<void> {
    if (this.isTracking) return;

    // Test data with 10 locations
    const testData = [
      {
        "id": 22,
        "vehicleId": "V1",
        "latitude": 30.448,
        "longitude": 72.933,
        "createdAt": "2026-04-12T05:09:31.5466667"
      },
      {
        "id": 21,
        "vehicleId": "V1",
        "latitude": 30.4,
        "longitude": 72.91,
        "createdAt": "2026-04-12T05:09:31.5266667"
      },
      {
        "id": 14,
        "vehicleId": "V1",
        "latitude": 30.19,
        "longitude": 72.7,
        "createdAt": "2026-04-12T05:09:31.5166667"
      },
      {
        "id": 15,
        "vehicleId": "V1",
        "latitude": 30.22,
        "longitude": 72.73,
        "createdAt": "2026-04-12T05:09:31.5166667"
      },
      {
        "id": 16,
        "vehicleId": "V1",
        "latitude": 30.25,
        "longitude": 72.76,
        "createdAt": "2026-04-12T05:09:31.5166667"
      },
      {
        "id": 17,
        "vehicleId": "V1",
        "latitude": 30.28,
        "longitude": 72.79,
        "createdAt": "2026-04-12T05:09:31.5166667"
      },
      {
        "id": 18,
        "vehicleId": "V1",
        "latitude": 30.31,
        "longitude": 72.82,
        "createdAt": "2026-04-12T05:09:31.5166667"
      },
      {
        "id": 19,
        "vehicleId": "V1",
        "latitude": 30.34,
        "longitude": 72.85,
        "createdAt": "2026-04-12T05:09:31.5166667"
      },
      {
        "id": 20,
        "vehicleId": "V1",
        "latitude": 30.37,
        "longitude": 72.88,
        "createdAt": "2026-04-12T05:09:31.5166667"
      },
      {
        "id": 13,
        "vehicleId": "V1",
        "latitude": 30.159,
        "longitude": 72.675,
        "createdAt": "2026-04-12T05:09:31.5133333"
      }
    ];

    this.isLoading = true;
    this.isTracking = true;
    this.trackingPath = [];

    try {
      console.log('🎬 Starting simulated tracking...');
      
      // Await the service's route building process
      await this.trackingService.startSimulatedTracking(testData);
      
      console.log('✅ Routes built, drawing initial route...');
      
      // Now draw initial route and subscribe to updates
      this.drawTrackingRoute();
      this.subscribeToLocationUpdates();
      this.isLoading = false;
      
      console.log('✅ Simulated tracking started successfully');
    } catch (error) {
      console.error('❌ Error starting simulated tracking:', error);
      this.isLoading = false;
      this.isTracking = false;
    }
  }

  /**
   * Stop tracking
   */
  stopTracking(): void {
    this.isTracking = false;
    this.trackingService.stopTracking();
  }

  /**
   * Initialize Leaflet map with OpenStreetMap
   */
  private initLeafletMap(): void {
    if (!this.mapContainer) return;

    this.ngZone.runOutsideAngular(() => {
      const startLocation = this.trackingService.getCurrentLocation();

      this.map = L.map(this.mapContainer.nativeElement).setView(
        [startLocation.latitude, startLocation.longitude],
        15
      );

      // Add CartoDB Voyager tiles (professional, free, no API key needed)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastered/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© CartoDB, © OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(this.map);

      // Initialize vehicle marker
      this.vehicleMarker = L.marker(
        [startLocation.latitude, startLocation.longitude],
        { icon: this.vehicleIcon }
      ).addTo(this.map);
    });
  }

  /**
   * Draw the complete route polyline on the map
   */
  private drawTrackingRoute(): void {
    if (!this.map) return;

    const route = this.trackingService.getTrackingHistory();
    const routeCoordinates = route.map(loc => [loc.latitude, loc.longitude] as [number, number]);

    // Remove old polyline if exists
    if (this.routePolyline) {
      this.map.removeLayer(this.routePolyline);
    }

    // Create new polyline
    this.ngZone.runOutsideAngular(() => {
      this.routePolyline = L.polyline(routeCoordinates, {
        color: '#0099ff',
        weight: 3,
        opacity: 0.7,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.map);

      // Fit map to route bounds
      const bounds = this.routePolyline.getBounds();
      this.map.fitBounds(bounds, { padding: [50, 50] });
    });
  }

  /**
   * Subscribe to location updates and continuously update route with smooth slow animation
   */
  private subscribeToLocationUpdates(): void {
    let lastLocation: VehicleLocation | null = null;
    let activeAnimation: any = null;

    this.trackingService.vehicleLocation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((location: VehicleLocation) => {
        this.ngZone.runOutsideAngular(() => {
          this.currentLocation = location;

          if (this.vehicleMarker && this.map) {
            // Clear any active animation
            if (activeAnimation) {
              clearInterval(activeAnimation);
            }

            // Move along road route
            if (lastLocation) {
              // Fetch route and animate along it
              this.trackingService.fetchRoute(lastLocation.latitude, lastLocation.longitude, location.latitude, location.longitude).then(routePoints => {
                if (routePoints.length > 1) {
                  // Animate through route points along the road
                  let routeIndex = 0;
                  const totalSteps = routePoints.length;
                  const duration = 1000; // 1 second for faster animation
                  const stepDuration = Math.max(duration / totalSteps, 50);

                  activeAnimation = setInterval(() => {
                    if (routeIndex < routePoints.length) {
                      const [lat, lng] = routePoints[routeIndex];
                      this.vehicleMarker.setLatLng([lat, lng]);

                      // Update map center only every 8th point to reduce flickering
                      if (routeIndex % 8 === 0) {
                        this.map.setView([lat, lng], 15, { animate: false });
                      }

                      routeIndex++;
                    } else {
                      // Animation complete, move to final location
                      clearInterval(activeAnimation);
                      activeAnimation = null;
                      this.vehicleMarker.setLatLng([location.latitude, location.longitude]);
                      this.map.setView([location.latitude, location.longitude], 15, { animate: false });
                    }
                  }, stepDuration);
                } else {
                  // No route found, move directly to location
                  this.vehicleMarker.setLatLng([location.latitude, location.longitude]);
                  this.map.setView([location.latitude, location.longitude], 15, { animate: false });
                }
              }).catch(() => {
                // Fallback to direct move if route fetch fails
                this.vehicleMarker.setLatLng([location.latitude, location.longitude]);
                this.map.setView([location.latitude, location.longitude], 15, { animate: false });
              });
            } else {
              // First location - just set it without animation
              this.vehicleMarker.setLatLng([location.latitude, location.longitude]);
              this.map.setView([location.latitude, location.longitude], 15, { animate: false });
            }

            // Add to tracking path and update route polyline
            this.trackingPath.push([location.longitude, location.latitude]);
            this.updateRoutePolyline();

            lastLocation = location;
          }
        });
      });
  }

  /**
   * Update the route polyline with new locations
   */
  private updateRoutePolyline(): void {
    if (!this.map) return;

    const route = this.trackingService.getTrackingHistory();
    if (route.length > 1) {
      const routeCoordinates = route.map(loc => [loc.latitude, loc.longitude] as [number, number]);

      if (this.routePolyline) {
        // Update existing polyline for better performance
        this.ngZone.runOutsideAngular(() => {
          this.routePolyline.setLatLngs(routeCoordinates);
        });
      } else {
        // Create new polyline if it doesn't exist
        this.ngZone.runOutsideAngular(() => {
          this.routePolyline = L.polyline(routeCoordinates, {
            color: '#0099ff',
            weight: 3,
            opacity: 0.7,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(this.map);
        });
      }
    }
  }
}
