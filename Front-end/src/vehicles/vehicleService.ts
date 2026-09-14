import { Vehicle } from './types'

const developmentVehicles: Vehicle[] = [
  {
    id: 'vehicle-001',
    make: 'BMW',
    model: '320i',
    year: 2019,
    color: 'Black',
    fuelType: 'Petrol 95',
    registration: 'CAA 123 456',
    isPrimary: true,
    modelKey: 'bmw-320i',
  },
]

export async function getUserVehicles(): Promise<Vehicle[]> {
  // Later this function will retrieve the logged-in user's
  // vehicles from the backend API.
  return developmentVehicles
}