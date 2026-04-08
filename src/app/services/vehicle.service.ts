import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehicles: any[] = [
    { id: 1, make: 'Toyota', model: 'Camry', year: 2020, licensePlate: 'ABC-123' },
    { id: 2, make: 'Honda', model: 'Civic', year: 2019, licensePlate: 'XYZ-456' },
    { id: 3, make: 'Ford', model: 'F-150', year: 2021, licensePlate: 'DEF-789' },
  ];

  constructor() { }

  getVehicles(): any[] {
    return this.vehicles;
  }
}