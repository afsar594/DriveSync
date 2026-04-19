import { Component, inject, OnInit } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService, Vehicle } from '../services/vehicle.service';

/* 🔥 ICONS IMPORT */
import { addIcons } from 'ionicons';
import { 
  speedometerOutline,
  batteryHalfOutline,
  carOutline,
  locationOutline,
  timeOutline,
  warningOutline,
  lockClosedOutline,
  lockOpenOutline,
  notificationsOutline,
  flameOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-my-vehicle',
  templateUrl: 'my-vehicle.page.html',
  styleUrls: ['my-vehicle.page.scss'],
  standalone: true,
  imports: [
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  CommonModule,
  FormsModule
]
})
export class MyVehiclePage implements OnInit {

  private vehicleService = inject(VehicleService);
  vehicles: Vehicle[] = [];

  constructor() {
    /* 🔥 ICON REGISTER */
    addIcons({
      speedometerOutline,
      batteryHalfOutline,
      carOutline,
      locationOutline,
      timeOutline,
      warningOutline,
      lockClosedOutline,
      lockOpenOutline,
      notificationsOutline,
      flameOutline
    });
  }

  ngOnInit() {
    this.vehicleService.getVehicles().subscribe((vehicles) => {
      this.vehicles = vehicles;
    });
  }

  /* 📍 Live Map Button */
  viewLiveLocation() {
    console.log('Open Live Map Here');
  }

}