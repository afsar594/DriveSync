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
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonRouterOutlet,
  IonLabel   
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
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonRouterOutlet,
    IonLabel   
  ]
})
export class AppComponent {
  @ViewChild('mainMenu') menu!: IonMenu;

// constructor() {
//   addIcons({
//     'close-outline': closeOutline
//   });
// }

constructor(
  private router: Router,
  public menuCtrl: MenuController
) {}

async closeMenu() {
  await this.menuCtrl.close();
}
async goToProfile() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  await this.menuCtrl.close(); // 🔥 pehle menu close hoga

  if (isLoggedIn === 'true') {
    this.router.navigateByUrl('/tabs/profile');
  } else {
    this.router.navigateByUrl('/login');
  }
}

goToReport() {
  this.menuCtrl.close();

  setTimeout(() => {
    this.router.navigateByUrl('/tabs/report');
  }, 200);
}

async goToAlerts() {
  await this.menuCtrl.close(); // pehle menu close hoga
  this.router.navigateByUrl('/tabs/alerts');
}

goToSettings() {
  this.menuCtrl.close(); // pehle menu band

  setTimeout(() => {
    this.router.navigateByUrl('/tabs/settings');
  }, 200); // thoda delay important hai
}
}