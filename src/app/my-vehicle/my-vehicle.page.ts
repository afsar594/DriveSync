import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { NgFor } from '@angular/common';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-my-vehicle',
  templateUrl: 'my-vehicle.page.html',
  styleUrls: ['my-vehicle.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, NgFor]
})
export class MyVehiclePage {
  private vehicleService = inject(VehicleService);
  vehicles: any[] = this.vehicleService.getVehicles();
}
