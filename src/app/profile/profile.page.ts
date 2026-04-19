import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonButton, IonToggle,
  IonButtons, IonBackButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonButton, IonToggle,
    IonButtons, IonBackButton
  ]
})
export class ProfilePage {

  user = {
    name: 'Samina Tahir',
    email: 'samina@email.com',
    phone: '0300-0000000',
    address: 'Punjab, Pakistan'
  };

  stats = {
    totalVehicles: 2,
    totalTrips: 15,
    activeVehicles: 1
  };

  settings = {
    notifications: true,
    darkMode: true
  };

  logout() {
    localStorage.removeItem('isLoggedIn');
    console.log('Logged out');
  }
}