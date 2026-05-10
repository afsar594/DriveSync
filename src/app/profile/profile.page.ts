import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton,
  IonToggle,
  IonButtons,
  IonInput,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  camera,
  createOutline,
  checkmarkOutline,
  personOutline,
  callOutline,
  locationOutline,
  settingsOutline,
  notificationsOutline,
  moonOutline,
  statsChartOutline,
  logOutOutline,
  chevronBackOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonButton,
    IonToggle,
    IonButtons,
    IonInput,
    IonIcon,
  ]
})
export class ProfilePage {

  profileForm!: FormGroup;
  isEditing = false;

  profileImage = 'https://i.pinimg.com/736x/52/e5/96/52e596ed062faeaacf73a20579f1e1c8.jpg';

  stats = {
    totalVehicles: 2,
    totalTrips: 15,
    activeVehicles: 1
  };

  constructor(private fb: FormBuilder, private router: Router , private location: Location) {

    addIcons({
      camera,
      createOutline,
      checkmarkOutline,
      personOutline,
      callOutline,
      locationOutline,
      settingsOutline,
      notificationsOutline,
      moonOutline,
      statsChartOutline,
      logOutOutline,
      chevronBackOutline
    });

    this.profileForm = this.fb.group({
      name: ['Samina Tahir'],
      email: ['samina@email.com'],
      phone: ['0300-0000000'],
      address: ['Punjab, Pakistan'],
      notifications: [true],
      darkMode: [true]
    });

  }

  toggleEdit() {
    this.isEditing = true;
  }

  saveProfile() {
    this.isEditing = false;
    console.log('Saved:', this.profileForm.value);
  }

  cancelEdit() {
    this.isEditing = false;
  }

  onImageChange(event: any) {

    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }

  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigateByUrl('/login');
  }
  goBack() {
  this.location.back();
}

}