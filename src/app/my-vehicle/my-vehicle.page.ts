import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { VehicleService, Vehicle } from '../services/vehicle.service';

@Component({
  selector: 'app-my-vehicle',
  templateUrl: 'my-vehicle.page.html',
  styleUrls: ['my-vehicle.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel]
})
export class MyVehiclePage implements OnInit {
  private vehicleService = inject(VehicleService);
  vehicles: Vehicle[] = [];

  ngOnInit() {
    this.vehicleService.getVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
    });
  }
}
