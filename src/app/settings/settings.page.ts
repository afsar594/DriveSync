import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { closeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ToastController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonToggle,
  IonButton,
} from '@ionic/angular/standalone';
addIcons({
  closeOutline
});

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
 imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonToggle,
    IonButton,
    IonButtons,
  IonBackButton,
  ]})
export class SettingsPage implements OnInit {

  constructor(
  private toastController: ToastController
) {}

  ngOnInit() {
  }

  isModalOpen = false;
modalType = '';
modalTitle = '';
isClosing = false;

openModal(type: string) {

  this.modalType = type;
  this.isModalOpen = true;

  if (type === 'profile') {
    this.modalTitle = 'Edit Profile';
  }

  if (type === 'email') {
    this.modalTitle = 'Change Email';
  }

  if (type === 'password') {
    this.modalTitle = 'Change Password';
  }
}

closeModal() {

  this.isClosing = true;

  setTimeout(() => {

    this.isModalOpen = false;
    this.isClosing = false;

  }, 300);

}
async showToast(message: string) {

  const toast = await this.toastController.create({

    message: message,

    duration: 2000,

    position: 'top',

    color: 'success',

    icon: 'checkmark-circle-outline',

    cssClass: 'custom-toast'

  });

  await toast.present();
}

async saveAction(message: string) {

  const toast = await this.toastController.create({

    message: message,

    duration: 2000,

    position: 'top',

    color: 'success',

    icon: 'checkmark-circle-outline',

    cssClass: 'custom-toast'

  });

  await toast.present();

  // CLOSE POPUP

  setTimeout(() => {

    this.closeModal();

  }, 100);
}

}
