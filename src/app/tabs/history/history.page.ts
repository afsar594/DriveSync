import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel]
})
export class HistoryPage {
  trips: any[] = [
    { date: '2024-04-01', destination: 'Office', status: 'Completed' },
    { date: '2024-03-28', destination: 'Home', status: 'Completed' },
    { date: '2024-03-25', destination: 'Airport', status: 'Completed' },
    { date: '2024-03-20', destination: 'Mall', status: 'Completed' },
  ];
}
