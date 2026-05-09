import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonButtons,
  IonBackButton,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonButtons,
    IonBackButton,
    IonIcon
  ]
})
export class ReportPage {

  selectedFilter = 'today';

  reports = [
    { date: '2026-05-01', trips: 5, distance: 40, time: 120 },
    { date: '2026-05-02', trips: 3, distance: 25, time: 80 },
    { date: '2026-05-03', trips: 4, distance: 30, time: 95 },
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

  const doc = new jsPDF();

  // TITLE
  doc.setFontSize(20);
  doc.text('DriveSync Vehicle Report', 20, 20);

  // FILTER
  doc.setFontSize(12);
  doc.text(`Filter: ${this.selectedFilter}`, 20, 35);

  // SUMMARY
  doc.setFontSize(14);
  doc.text(`Total Trips: ${this.totalTrips}`, 20, 50);
  doc.text(`Total Distance: ${this.totalDistance}`, 20, 60);
  doc.text(`Total Time: ${this.totalTime}`, 20, 70);

  // REPORT LIST
  let y = 90;

  this.reports.forEach((r, index) => {

    doc.setFontSize(13);

    doc.text(`Report ${index + 1}`, 20, y);

    y += 10;

    doc.setFontSize(11);

    doc.text(`Date: ${r.date}`, 25, y);
    y += 8;

    doc.text(`Trips: ${r.trips}`, 25, y);
    y += 8;

    doc.text(`Distance: ${r.distance} km`, 25, y);
    y += 8;

    doc.text(`Time: ${r.time} min`, 25, y);

    y += 15;

  });

  // SAVE PDF
  doc.save('DriveSync-Report.pdf');

}

  printReport() {
    window.print();
  }

}