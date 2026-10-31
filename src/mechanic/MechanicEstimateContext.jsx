import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'

import {
  createEstimate,
  ESTIMATE_SERVICE_ERRORS,
} from '../estimates/estimateService'

const MechanicEstimateContext =
  createContext(undefined)

export function MechanicEstimateProvider({
  children,
}) {
  const [
    createdEstimate,
    setCreatedEstimate,
  ] = useState(null)

  const [
    isCreatingEstimate,
    setIsCreatingEstimate,
  ] = useState(false)

  const [
    estimateError,
    setEstimateError,
  ] = useState(null)

  const createMechanicEstimate =
    useCallback(async (input) => {
      try {
        setIsCreatingEstimate(true)
        setEstimateError(null)

        const estimate =
          await createEstimate(input)

        setCreatedEstimate(
          estimate
        )

        return estimate
      } catch (error) {
        setCreatedEstimate(null)

        if (
          error?.code ===
          ESTIMATE_SERVICE_ERRORS
            .PERSISTENCE_NOT_CONNECTED
        ) {
          setEstimateError(
            'Estimate creation is not available until the MechanIQ estimate backend is connected.'
          )
        } else {
          setEstimateError(
            'Unable to create the estimate.'
          )
        }

        return null
      } finally {
        setIsCreatingEstimate(false)
      }
    }, [])

  const clearEstimateError =
    useCallback(() => {
      setEstimateError(null)
    }, [])

  const resetEstimate =
    useCallback(() => {
      setCreatedEstimate(null)
      setEstimateError(null)
    }, [])

  return (
    <MechanicEstimateContext.Provider
      value={{
        createdEstimate,
        isCreatingEstimate,
        estimateError,
        createMechanicEstimate,
        clearEstimateError,
        resetEstimate,
      }}
    >
      {children}
    </MechanicEstimateContext.Provider>
  )
}

export function useMechanicEstimate() {
  const context =
    useContext(
      MechanicEstimateContext
    )

  if (!context) {
    throw new Error(
      'useMechanicEstimate must be used inside MechanicEstimateProvider'
    )
  }

  return context
}