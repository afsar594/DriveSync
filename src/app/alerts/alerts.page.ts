import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonIcon, IonButton,  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonIcon, IonButton, IonButtons,
  IonBackButton
  ]
})
export class AlertsPage {

  alerts = [
    {
      title: 'Speed Alert',
      message: 'Vehicle crossed 80 km/h limit',
      time: '5 min ago',
      type: 'High'
    },
    {
      title: 'Ignition ON',
      message: 'Vehicle started moving',
      time: '1 hour ago',
      type: 'Info'
    },
    {
      title: 'Geo Fence',
      message: 'Vehicle left safe zone',
      time: 'Yesterday',
      type: 'Warning'
    }
  ];

  clearAlerts() {
    this.alerts = [];
  }
}