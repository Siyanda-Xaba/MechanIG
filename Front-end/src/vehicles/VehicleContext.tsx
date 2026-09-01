import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react'

import { Vehicle } from './types'

type VehicleContextType = {
  vehicles: Vehicle[]
  selectedVehicle: Vehicle | null
  addVehicle: (vehicle: Vehicle) => void
  selectVehicle: (vehicleId: string) => void
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined)

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  function addVehicle(vehicle: Vehicle) {
    setVehicles((currentVehicles) => [...currentVehicles, vehicle])

    if (vehicle.isPrimary || selectedVehicle === null) {
      setSelectedVehicle(vehicle)
    }
  }

  function selectVehicle(vehicleId: string) {
    const vehicle = vehicles.find((item) => item.id === vehicleId)

    if (vehicle) {
      setSelectedVehicle(vehicle)
    }
  }

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        selectedVehicle,
        addVehicle,
        selectVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  )
}

export function useVehicle() {
  const context = useContext(VehicleContext)

  if (!context) {
    throw new Error('useVehicle must be used inside VehicleProvider')
  }

  return context
}