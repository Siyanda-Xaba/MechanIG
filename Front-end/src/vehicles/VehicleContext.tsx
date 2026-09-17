import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { Vehicle } from './types'
import { getUserVehicles } from './vehicleService'

type VehicleContextType = {
  vehicles: Vehicle[]
  selectedVehicle: Vehicle | null
  isLoadingVehicles: boolean
  addVehicle: (
    vehicle: Vehicle,
    shouldSelect?: boolean
  ) => void
  selectVehicle: (vehicleId: string) => void
  refreshVehicles: () => Promise<void>
}

const VehicleContext = createContext<VehicleContextType | undefined>(
  undefined
)

export function VehicleProvider({
  children,
}: {
  children: ReactNode
}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle | null>(null)
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true)

  useEffect(() => {
    refreshVehicles()
  }, [])

  async function refreshVehicles() {
    try {
      setIsLoadingVehicles(true)

      const userVehicles = await getUserVehicles()

      setVehicles(userVehicles)

      const primaryVehicle =
        userVehicles.find((vehicle) => vehicle.isPrimary) ??
        userVehicles[0] ??
        null

      setSelectedVehicle(primaryVehicle)
    } finally {
      setIsLoadingVehicles(false)
    }
  }

  function addVehicle(
    vehicle: Vehicle,
    shouldSelect = false
  ) {
    setVehicles((currentVehicles) => {
      const existingVehicles = vehicle.isPrimary
        ? currentVehicles.map((currentVehicle) => ({
            ...currentVehicle,
            isPrimary: false,
          }))
        : currentVehicles

      return [
        ...existingVehicles,
        vehicle,
      ]
    })

    setSelectedVehicle((currentVehicle) => {
      if (
        shouldSelect ||
        vehicle.isPrimary ||
        currentVehicle === null
      ) {
        return vehicle
      }

      return currentVehicle
    })
  }

  function selectVehicle(vehicleId: string) {
    const vehicle = vehicles.find(
      (item) => item.id === vehicleId
    )

    if (vehicle) {
      setSelectedVehicle(vehicle)
    }
  }

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        selectedVehicle,
        isLoadingVehicles,
        addVehicle,
        selectVehicle,
        refreshVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  )
}

export function useVehicle() {
  const context = useContext(VehicleContext)

  if (!context) {
    throw new Error(
      'useVehicle must be used inside VehicleProvider'
    )
  }

  return context
}