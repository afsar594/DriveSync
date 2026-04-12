import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  isActive?: boolean;
  lastLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'https://localhost:44379/api';

  // Fallback dummy data
  private dummyVehicles: Vehicle[] = [
    { id: 1, make: 'Toyota', model: 'Camry', year: 2020, licensePlate: 'ABC-123', isActive: true },
    { id: 2, make: 'Honda', model: 'Civic', year: 2019, licensePlate: 'XYZ-456', isActive: false },
    { id: 3, make: 'Ford', model: 'F-150', year: 2021, licensePlate: 'DEF-789', isActive: true },
  ];

  constructor(private http: HttpClient) { }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/Vehicles`).pipe(
      catchError(error => {
        console.log('API not available, using dummy vehicle data:', error);
        return of(this.dummyVehicles);
      })
    );
  }

  getVehicleStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Vehicles/stats`).pipe(
      catchError(error => {
        console.log('Vehicle stats API not available, using dummy stats');
        return of({
          totalVehicles: 3,
          activeVehicles: 2,
          totalTrips: 15,
          thisWeekTrips: 5
        });
      })
    );
  }
}