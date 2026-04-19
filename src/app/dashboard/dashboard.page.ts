import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IonMenuButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonButton, IonGrid, IonRow,
  IonCol, IonList, IonItem, IonLabel, IonChip, IonButtons  
} from '@ionic/angular/standalone';
import { VehicleService, Vehicle } from '../services/vehicle.service';
import { TrackingService, VehicleLocation } from '../services/tracking.service';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonButton, IonIcon, IonGrid, IonRow,
    IonCol, IonList, IonItem, IonLabel, IonChip , IonButtons,  IonMenuButton
  
  ],
})
export class DashboardPage implements OnInit, OnDestroy {
  vehicles: Vehicle[] = [];
  stats: any = {};
  currentLocation: VehicleLocation | null = null;
  isTracking = false;
todayDistance: string = '12 km';
todaySpeed: string = '45 km/h';
todayStops: number = 3;

  private subscriptions: Subscription[] = [];

  constructor(
    private vehicleService: VehicleService,
    private trackingService: TrackingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();

    // Subscribe to tracking status
    this.subscriptions.push(
      this.trackingService.vehicleLocation$.subscribe(location => {
        this.currentLocation = location;
      })
    );

    // Check if tracking is active
    this.isTracking = this.trackingService.isTrackingActive();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadDashboardData() {
    // Load vehicles
    this.vehicleService.getVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
    });

    // Load stats
    this.vehicleService.getVehicleStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  navigateToTracking() {
    this.router.navigate(['/tabs/tracking']);
  }

  navigateToVehicles() {
    this.router.navigate(['/tabs/my-vehicle']);
  }

  navigateToHistory() {
    this.router.navigate(['/tabs/history']);
  }

  startTracking() {
    this.trackingService.startRouteTracking();
    this.isTracking = true;
    this.navigateToTracking();
  }

  formatSpeed(speed: number): string {
    return speed.toFixed(1) + ' mph';
  }

  getActiveVehicleCount(): number {
    return this.stats.activeVehicles || this.vehicles.filter(v => v.isActive).length;
  }

  formatTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString();
  }

   
}
