import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
imports: [
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonBackButton,
  CommonModule, 
  FormsModule,
  IonIcon
]
})
export class HistoryPage {

  selectedFilter = 'Today';

  trips: any[] = [
    {
      date: '2024-04-01',
      start: 'Home',
      end: 'Office',
      distance: '12 km',
      duration: '35 min',
      time: '09:00 AM - 09:35 AM',
      speed: '45 km/h',
      stops: 2
    },
    {
      date: '2024-03-28',
      start: 'Office',
      end: 'Market',
      distance: '5 km',
      duration: '20 min',
      time: '02:00 PM - 02:20 PM',
      speed: '35 km/h',
      stops: 1
    },
    {
      date: '2024-03-25',
      start: 'Home',
      end: 'Airport',
      distance: '18 km',
      duration: '45 min',
      time: '06:00 PM - 06:45 PM',
      speed: '50 km/h',
      stops: 3
    }
  ];

  // 🔥 SUMMARY DATA
  get totalTrips() {
    return this.trips.length;
  }

  get totalDistance() {
    let total = this.trips.reduce((sum, t) => sum + parseInt(t.distance), 0);
    return total + ' km';
  }

  get totalTime() {
    let total = this.trips.reduce((sum, t) => sum + parseInt(t.duration), 0);
    return total + ' min';
  }

  changeFilter(filter: string) {
    this.selectedFilter = filter;
  }

  viewMap(trip: any) {
    console.log('View on map:', trip);
  }
}