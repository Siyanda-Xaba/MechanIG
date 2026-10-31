import {
  useCallback,
  useState,
} from 'react'

import type {
  CreateVehicleInput,
  Vehicle,
} from './types'
import { useVehicle } from './VehicleContext'
import { createUserVehicle } from './vehicleService'

type UseCreateVehicleReturn = {
  isCreatingVehicle: boolean
  createVehicleError: string | null

  createVehicle: (
    input: CreateVehicleInput
  ) => Promise<Vehicle | null>

  clearCreateVehicleError: () => void
}

export function useCreateVehicle():
  UseCreateVehicleReturn {
  const {
    addVehicle,
  } = useVehicle()

  const [
    isCreatingVehicle,
    setIsCreatingVehicle,
  ] = useState(false)

  const [
    createVehicleError,
    setCreateVehicleError,
  ] = useState<string | null>(null)

  const createVehicle =
    useCallback(
      async (
        input: CreateVehicleInput
      ) => {
        try {
          setIsCreatingVehicle(true)
          setCreateVehicleError(null)

          const savedVehicle =
            await createUserVehicle(input)

          addVehicle(
            savedVehicle,
            true
          )

          return savedVehicle
        } catch (error) {
          setCreateVehicleError(
            error instanceof Error
              ? error.message
              : 'Unable to add the vehicle.'
          )

          return null
        } finally {
          setIsCreatingVehicle(false)
        }
      },
      [
        addVehicle,
      ]
    )

  const clearCreateVehicleError =
    useCallback(() => {
      setCreateVehicleError(null)
    }, [])

  return {
    isCreatingVehicle,
    createVehicleError,
    createVehicle,
    clearCreateVehicleError,
  }
}