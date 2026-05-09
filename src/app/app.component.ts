import { MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import {
  IonApp,
  IonMenu,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonList,
  IonItem,
  IonRouterOutlet,
  IonLabel  ,
  IonMenuToggle 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonMenu,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonList,
    IonItem,
    IonRouterOutlet,
    IonLabel  ,
    IonMenuToggle 
  ]
})
export class AppComponent {

// constructor() {
//   addIcons({
//     'close-outline': closeOutline
//   });
// }

constructor(
  private router: Router,
  public menuCtrl: MenuController
) {}
@ViewChild('mainMenu', { static: false }) menu!: IonMenu;

async closeMenu() {
  await this.menuCtrl.close();
}


async goToDashboard() {

  await this.menuCtrl.close();

  this.router.navigateByUrl('/tabs/dashboard');

}

goToVehicle() {
  this.router.navigateByUrl('/tabs/my-vehicle');
}

async goToHistory() {

  await this.menuCtrl.close();

  this.router.navigateByUrl('/tabs/history');

}

async goToAlerts() {

  await this.menuCtrl.close();

  this.router.navigateByUrl('/tabs/alerts');

}

async goToReport() {

  await this.menuCtrl.close();

  this.router.navigateByUrl('/tabs/report');

}

async goToSettings() {

  await this.menuCtrl.close();

  this.router.navigateByUrl('/tabs/settings');

}

async goToProfile() {

  await this.menuCtrl.close();

  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn === 'true') {
    this.router.navigateByUrl('/tabs/profile');
  } else {
    this.router.navigateByUrl('/login');
  }

}

}