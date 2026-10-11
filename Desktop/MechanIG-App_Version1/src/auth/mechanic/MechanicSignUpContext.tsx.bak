import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

export type MechanicSignUpStep1Data = {
  fullName: string
  email: string
  phone: string
  idNumber: string
  businessName: string
  businessType: string
  yearsInBusiness: string
  employees: string
  address: string
  city: string
  province: string
}

export type MechanicSignUpStep2Data = {
  workshopLocation: string
  serviceRadius: string
  yearsExperience: string
  qualifications: string
  specialisation: string
  vehicleBrands: string[]
  licenseNumber: string
  registrationNumber: string
}

const initialStep1Data: MechanicSignUpStep1Data = {
  fullName: '',
  email: '',
  phone: '',
  idNumber: '',
  businessName: '',
  businessType: '',
  yearsInBusiness: '',
  employees: '',
  address: '',
  city: '',
  province: '',
}

const initialStep2Data: MechanicSignUpStep2Data = {
  workshopLocation: '',
  serviceRadius: '',
  yearsExperience: '',
  qualifications: '',
  specialisation: '',
  vehicleBrands: [],
  licenseNumber: '',
  registrationNumber: '',
}

type MechanicSignUpContextValue = {
  step1Data: MechanicSignUpStep1Data
  step2Data: MechanicSignUpStep2Data
  updateStep1Field: <
    Key extends keyof MechanicSignUpStep1Data,
  >(
    key: Key,
    value: MechanicSignUpStep1Data[Key]
  ) => void
  updateStep2Field: <
    Key extends keyof MechanicSignUpStep2Data,
  >(
    key: Key,
    value: MechanicSignUpStep2Data[Key]
  ) => void
  resetMechanicSignUp: () => void
}

const MechanicSignUpContext =
  createContext<MechanicSignUpContextValue | null>(
    null
  )

type MechanicSignUpProviderProps = {
  children: ReactNode
}

export function MechanicSignUpProvider({
  children,
}: MechanicSignUpProviderProps) {
  const [
    step1Data,
    setStep1Data,
  ] = useState<MechanicSignUpStep1Data>(
    initialStep1Data
  )

  const [
    step2Data,
    setStep2Data,
  ] = useState<MechanicSignUpStep2Data>(
    initialStep2Data
  )

  const updateStep1Field = useCallback(
    <
      Key extends keyof MechanicSignUpStep1Data,
    >(
      key: Key,
      value: MechanicSignUpStep1Data[Key]
    ) => {
      setStep1Data((current) => ({
        ...current,
        [key]: value,
      }))
    },
    []
  )

  const updateStep2Field = useCallback(
    <
      Key extends keyof MechanicSignUpStep2Data,
    >(
      key: Key,
      value: MechanicSignUpStep2Data[Key]
    ) => {
      setStep2Data((current) => ({
        ...current,
        [key]: value,
      }))
    },
    []
  )

  const resetMechanicSignUp = useCallback(() => {
    setStep1Data(initialStep1Data)
    setStep2Data(initialStep2Data)
  }, [])

  const value = useMemo(
    () => ({
      step1Data,
      step2Data,
      updateStep1Field,
      updateStep2Field,
      resetMechanicSignUp,
    }),
    [
      resetMechanicSignUp,
      step1Data,
      step2Data,
      updateStep1Field,
      updateStep2Field,
    ]
  )

  return (
    <MechanicSignUpContext.Provider value={value}>
      {children}
    </MechanicSignUpContext.Provider>
  )
}

export function useMechanicSignUp() {
  const context = useContext(
    MechanicSignUpContext
  )

  if (!context) {
    throw new Error(
      'useMechanicSignUp must be used within a MechanicSignUpProvider'
    )
  }

  return context
}