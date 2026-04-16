import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonIcon
  ],
})
export class DashboardPage {

  vehicle = {
    name: 'Toyota Corolla',
    number: 'ABC-1234',
    status: 'Active',
    location: '123 Main Street, City'
  };

  constructor() {}

}