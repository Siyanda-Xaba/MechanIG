import {
  CreateVehicleInput,
  Vehicle,
} from './types'

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

export async function createUserVehicle(
  input: CreateVehicleInput
): Promise<Vehicle> {
  // Production implementation will submit the vehicle
  // to the MechanIQ backend.
  //
  // The backend should:
  // - create the persistent vehicle record
  // - assign the vehicle ID
  // - determine / validate the internal modelKey
  // - apply primary-vehicle rules
  // - return the authoritative saved vehicle
  //
  // Do not add the locally entered vehicle to VehicleContext
  // until the backend confirms creation.

  void input

  throw new Error(
    'Vehicle creation is not available until the vehicle backend is connected.'
  )
}