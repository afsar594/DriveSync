import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle,
  IonItem, IonLabel, IonButton, IonSegment, IonSegmentButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle,
    IonItem, IonLabel, IonButton,
    IonSegment, IonSegmentButton
  ]
})
export class ReportPage {

  selectedFilter = 'today';

  reports = [
    { date: '2024-04-01', trips: 5, distance: 40, time: 120 },
    { date: '2024-04-02', trips: 3, distance: 25, time: 80 },
    { date: '2024-04-03', trips: 4, distance: 30, time: 95 },
  ];

  get totalTrips() {
    return this.reports.reduce((sum, r) => sum + r.trips, 0);
  }

  get totalDistance() {
    return this.reports.reduce((sum, r) => sum + r.distance, 0) + ' km';
  }

  get totalTime() {
    return this.reports.reduce((sum, r) => sum + r.time, 0) + ' min';
  }

  changeFilter(ev: any) {
    this.selectedFilter = ev.detail.value;
  }

  exportReport() {
    console.log('Exporting report...');
  }
}