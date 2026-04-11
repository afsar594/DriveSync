import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface VehicleLocation {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private vehicleLocationSubject = new BehaviorSubject<VehicleLocation>({
    latitude: 40.7128,
    longitude: -74.0060,
    speed: 45,
    heading: 90,
    timestamp: new Date()
  });

  public vehicleLocation$: Observable<VehicleLocation> = this.vehicleLocationSubject.asObservable();

  constructor() {
    this.startLiveTracking();
  }

  /**
   * Simulate live vehicle tracking with random location changes
   */
  private startLiveTracking(): void {
    interval(3000).subscribe(() => {
      const currentLocation = this.vehicleLocationSubject.getValue();
      
      // Simulate vehicle movement with random small changes
      const newLocation: VehicleLocation = {
        latitude: currentLocation.latitude + (Math.random() - 0.5) * 0.001,
        longitude: currentLocation.longitude + (Math.random() - 0.5) * 0.001,
        speed: Math.floor(Math.random() * 80) + 20,
        heading: Math.random() * 360,
        timestamp: new Date()
      };
      
      this.vehicleLocationSubject.next(newLocation);
    });
  }

  getCurrentLocation(): VehicleLocation {
    return this.vehicleLocationSubject.getValue();
  }

  updateLocation(location: VehicleLocation): void {
    this.vehicleLocationSubject.next(location);
  }
}
