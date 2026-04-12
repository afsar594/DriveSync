import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface VehicleLocation {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: Date;
}

// API Response interface
export interface TrackingHistoryItem {
  id: number;
  vehicleId: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private vehicleLocationSubject = new BehaviorSubject<VehicleLocation>({
    latitude: 40.7128,
    longitude: -74.0060,
    speed: 0,
    heading: 0,
    timestamp: new Date()
  });

  // API endpoint
  private apiUrl = 'https://localhost:44379/api/Tracking/history/v1';

  // Real tracking data from API
  private trackingHistory: VehicleLocation[] = [];
  private lastLocation: VehicleLocation | null = null;
  private routeIndex = 0;
  private isTracking = false;
  private trackingInterval: any;
  private isLoading = false;
  private lastFetchedId = 0; // Track the last processed location ID
  private allRoutePoints: [number, number][] = []; // Store route points for simulated tracking

  public vehicleLocation$: Observable<VehicleLocation> = this.vehicleLocationSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Fetch tracking history from API (for initial load)
   */
  fetchTrackingHistory(): Observable<TrackingHistoryItem[]> {
    this.isLoading = true;
    return this.http.get<TrackingHistoryItem[]>(this.apiUrl).pipe(
      map(data => {
        this.isLoading = false;
        // Convert API data to VehicleLocation format and sort by timestamp
        this.trackingHistory = data.map(item => ({
          latitude: item.latitude,
          longitude: item.longitude,
          speed: 0,
          heading: 0,
          timestamp: new Date(item.createdAt)
        })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        // Keep only the last 100 points for performance
        if (this.trackingHistory.length > 100) {
          this.trackingHistory = this.trackingHistory.slice(-100);
        }

        // Set the last fetched ID to the most recent location
        if (data.length > 0) {
          this.lastFetchedId = Math.max(...data.map(item => item.id));
        }

        // Set initial location to the most recent one
        if (this.trackingHistory.length > 0) {
          const latestLocation = this.trackingHistory[this.trackingHistory.length - 1];
          this.vehicleLocationSubject.next(latestLocation);
          this.lastLocation = latestLocation;
        }

        return data;
      }),
      catchError(error => {
        console.error('Error fetching tracking history:', error);
        this.isLoading = false;
        throw error;
      })
    );
  }

  /**
   * Fetch new locations since last fetch (for real-time updates)
   */
  fetchNewLocations(): Observable<TrackingHistoryItem[]> {
    const url = `${this.apiUrl}?afterId=${this.lastFetchedId}`;
    return this.http.get<TrackingHistoryItem[]>(url).pipe(
      map(data => {
        if (data.length > 0) {
          // Convert new data to VehicleLocation format
          const newLocations = data.map(item => ({
            latitude: item.latitude,
            longitude: item.longitude,
            speed: 0,
            heading: 0,
            timestamp: new Date(item.createdAt)
          })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

          // Add to tracking history
          this.trackingHistory.push(...newLocations);

          // Keep only the last 100 points for performance
          if (this.trackingHistory.length > 100) {
            this.trackingHistory = this.trackingHistory.slice(-100);
          }

          // Update last fetched ID
          this.lastFetchedId = Math.max(...data.map(item => item.id));

          return data;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching new locations:', error);
        throw error;
      })
    );
  }

  /**
   * Check if tracking is currently active
   */
  isTrackingActive(): boolean {
    return this.isTracking;
  }

  /**
   * Get all tracking history locations for polyline (thinned for performance)
   */
  getTrackingHistory(): VehicleLocation[] {
    return this.thinPoints(this.trackingHistory, 5); // Keep every 5th point
  }

  /**
   * Thin the array of points to reduce performance load
   * @param points Array of VehicleLocation
   * @param keepEvery Keep every nth point
   */
  private thinPoints(points: VehicleLocation[], keepEvery: number): VehicleLocation[] {
    if (points.length <= keepEvery) return points;
    const thinned = [];
    for (let i = 0; i < points.length; i += keepEvery) {
      thinned.push(points[i]);
    }
    // Always include the last point
    if (points.length > 0 && thinned[thinned.length - 1] !== points[points.length - 1]) {
      thinned.push(points[points.length - 1]);
    }
    return thinned;
  }

  /**
   * Start real-time tracking with continuous API polling
   */
  startRouteTracking(): void {
    if (this.isTracking) return;

    this.isTracking = true;
    this.routeIndex = 0;

    // First, fetch initial history
    this.fetchTrackingHistory().subscribe({
      next: (data) => {
        console.log('Loaded initial tracking history:', data.length, 'points');

        // Start continuous polling for new locations
        this.startRealTimeTracking();
      },
      error: (error) => {
        console.error('Failed to load initial tracking history:', error);
        this.isTracking = false;
        // Fall back to dummy data if API fails
        this.startDummyTracking();
      }
    });
  }

  /**
   * Start real-time tracking by continuously polling for new locations
   */
  private startRealTimeTracking(): void {
    console.log('Starting real-time tracking...');

    this.trackingInterval = interval(3000).subscribe(() => { // Poll every 3 seconds
      this.fetchNewLocations().subscribe({
        next: (newData) => {
          if (newData.length > 0) {
            console.log('Received', newData.length, 'new location(s)');

            // Get the latest location
            const latestApiData = newData[newData.length - 1];
            const newLocation: VehicleLocation = {
              latitude: latestApiData.latitude,
              longitude: latestApiData.longitude,
              speed: 0,
              heading: 0,
              timestamp: new Date(latestApiData.createdAt)
            };

            // Calculate speed and heading if we have a previous location
            if (this.lastLocation) {
              const timeDiff = (newLocation.timestamp.getTime() - this.lastLocation.timestamp.getTime()) / 1000; // seconds
              const distance = this.calculateDistance(
                this.lastLocation.latitude, this.lastLocation.longitude,
                newLocation.latitude, newLocation.longitude
              );

              // Calculate speed in mph (distance in miles, time in hours)
              newLocation.speed = timeDiff > 0 ? (distance / (timeDiff / 3600)) : 0;

              // Calculate heading (bearing) in degrees
              newLocation.heading = this.calculateBearing(
                this.lastLocation.latitude, this.lastLocation.longitude,
                newLocation.latitude, newLocation.longitude
              );
            }

            // Update the vehicle location
            this.vehicleLocationSubject.next(newLocation);
            this.lastLocation = newLocation;
          }
        },
        error: (error) => {
          console.error('Error fetching new locations:', error);
          // Continue polling even if one request fails
        }
      });
    });
  }

  /**
   * Fallback to dummy tracking if API fails
   */
  private startDummyTracking(): void {
    console.log('Using dummy tracking data as fallback');

    // Dummy route for testing - New York City area
    const dummyRoute: VehicleLocation[] = [
      { latitude: 40.7128, longitude: -74.0060, speed: 0, heading: 45, timestamp: new Date() },
      { latitude: 40.7150, longitude: -74.0050, speed: 42, heading: 45, timestamp: new Date() },
      { latitude: 40.7180, longitude: -74.0030, speed: 48, heading: 50, timestamp: new Date() },
      { latitude: 40.7210, longitude: -74.0010, speed: 55, heading: 55, timestamp: new Date() },
      { latitude: 40.7240, longitude: -73.9990, speed: 60, heading: 60, timestamp: new Date() },
      { latitude: 40.7270, longitude: -73.9960, speed: 58, heading: 65, timestamp: new Date() },
      { latitude: 40.7300, longitude: -73.9930, speed: 50, heading: 70, timestamp: new Date() },
      { latitude: 40.7320, longitude: -73.9890, speed: 45, heading: 80, timestamp: new Date() },
      { latitude: 40.7340, longitude: -73.9850, speed: 40, heading: 85, timestamp: new Date() },
      { latitude: 40.7360, longitude: -73.9800, speed: 35, heading: 90, timestamp: new Date() },
      { latitude: 40.7370, longitude: -73.9750, speed: 30, heading: 95, timestamp: new Date() },
      { latitude: 40.7380, longitude: -73.9700, speed: 25, heading: 100, timestamp: new Date() },
    ];

    this.trackingInterval = interval(2000).subscribe(() => {
      if (this.routeIndex < dummyRoute.length) {
        const location = { ...dummyRoute[this.routeIndex] };
        location.timestamp = new Date();
        this.vehicleLocationSubject.next(location);
        this.routeIndex++;
      } else {
        // Route completed, restart
        this.routeIndex = 0;
      }
    });
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Convert radians to degrees
   */
  private toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  /**
   * Calculate distance between two coordinates in miles
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Calculate bearing (heading) between two coordinates in degrees
   */
  private calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLon = this.toRadians(lon2 - lon1);
    const lat1Rad = this.toRadians(lat1);
    const lat2Rad = this.toRadians(lat2);

    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

    const bearing = Math.atan2(y, x);
    return (this.toDegrees(bearing) + 360) % 360; // Normalize to 0-360 degrees
  }

  /**
   * Fetch road route between two points using OSRM (public method)
   */
  async fetchRoute(startLat: number, startLng: number, endLat: number, endLng: number): Promise<[number, number][]> {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const geometry = data.routes[0].geometry;
        if (geometry && geometry.coordinates) {
          // OSRM returns [lng, lat], convert to [lat, lng]
          return geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
        }
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }

    return [];
  }

  async startSimulatedTracking(locations: TrackingHistoryItem[]): Promise<void> {
    if (this.isTracking) return;

    this.isTracking = true;
    this.routeIndex = 0;
    this.allRoutePoints = []; // Reset route points

    try {
      // Convert and sort locations by ID (ascending order)
      const sortedLocations = locations
        .sort((a, b) => a.id - b.id); // Sort by ID ascending

      this.trackingHistory = sortedLocations.map(item => ({
        latitude: item.latitude,
        longitude: item.longitude,
        speed: 0,
        heading: 0,
        timestamp: new Date(item.createdAt)
      }));

      console.log('🎬 Starting simulated tracking with', this.trackingHistory.length, 'waypoints');

      // Build complete route following roads
      for (let i = 0; i < this.trackingHistory.length - 1; i++) {
        const start = this.trackingHistory[i];
        const end = this.trackingHistory[i + 1];

        console.log(`🛣️  Fetching route from waypoint ${i + 1} to ${i + 2}`);
        const routePoints = await this.fetchRoute(start.latitude, start.longitude, end.latitude, end.longitude);

        if (routePoints.length > 0) {
          // Add route points (skip first point if not the first segment to avoid duplication)
          if (i === 0) {
            this.allRoutePoints.push(...routePoints);
          } else {
            this.allRoutePoints.push(...routePoints.slice(1));
          }
        } else {
          // If route fetch fails, just add a direct line between points
          console.warn(`⚠️  No route found, using direct line for segment ${i + 1}`);
          this.allRoutePoints.push([start.latitude, start.longitude]);
          this.allRoutePoints.push([end.latitude, end.longitude]);
        }
      }

      console.log(`🗺️  Total route points: ${this.allRoutePoints.length}`);

      // Set initial location to first point
      if (this.allRoutePoints.length > 0) {
        const [lat, lng] = this.allRoutePoints[0];
        const firstLocation: VehicleLocation = {
          latitude: lat,
          longitude: lng,
          speed: 0,
          heading: 0,
          timestamp: new Date()
        };
        this.vehicleLocationSubject.next(firstLocation);
        this.lastLocation = firstLocation;
      } else {
        throw new Error('No route points generated');
      }

      // Start the animation interval
      this.startSimulatedAnimation();
    } catch (error) {
      console.error('❌ Error in simulated tracking:', error);
      this.isTracking = false;
      throw error;
    }
  }

  /**
   * Start the simulated tracking animation
   */
  private startSimulatedAnimation(): void {
    this.trackingInterval = interval(100).subscribe(() => { // Update every 100ms for faster movement
      if (this.routeIndex < this.allRoutePoints.length) {
        const [lat, lng] = this.allRoutePoints[this.routeIndex];
        const newLocation: VehicleLocation = {
          latitude: lat,
          longitude: lng,
          speed: 0,
          heading: 0,
          timestamp: new Date()
        };

        // Calculate speed and heading based on previous location
        if (this.lastLocation) {
          const timeDiff = 0.1; // 100ms in seconds
          const distance = this.calculateDistance(
            this.lastLocation.latitude, this.lastLocation.longitude,
            lat, lng
          );

          // Calculate speed in mph
          newLocation.speed = distance > 0 ? (distance / (timeDiff / 3600)) : 0;

          // Calculate heading (bearing) in degrees
          newLocation.heading = this.calculateBearing(
            this.lastLocation.latitude, this.lastLocation.longitude,
            lat, lng
          );
        }

        // Update the vehicle location
        this.vehicleLocationSubject.next(newLocation);
        this.lastLocation = newLocation;
        this.routeIndex++;
      } else {
        // Route completed
        console.log('✅ Road-following tracking completed!');
        this.isTracking = false;
        if (this.trackingInterval) {
          this.trackingInterval.unsubscribe();
        }
      }
    });
  }

  /**
   * Stop tracking
   */
  stopTracking(): void {
    this.isTracking = false;
    if (this.trackingInterval) {
      this.trackingInterval.unsubscribe();
    }
  }

  /**
   * Check if loading data
   */
  isLoadingData(): boolean {
    return this.isLoading;
  }

  getCurrentLocation(): VehicleLocation {
    return this.vehicleLocationSubject.getValue();
  }

  updateLocation(location: VehicleLocation): void {
    this.vehicleLocationSubject.next(location);
  }
}
