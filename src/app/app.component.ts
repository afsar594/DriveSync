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

constructor(private router: Router) {}

closeMenu() {
this.menu.close(); 
}

goToProfile() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn === 'true') {
    this.router.navigateByUrl('/tabs/profile');
  } else {
    this.router.navigateByUrl('/login');
  }
}
}