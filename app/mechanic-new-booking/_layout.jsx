import {
  Slot,
} from 'expo-router'

import {
  MechanicBookingProvider,
} from '../../src/mechanic/MechanicBookingContext'
import {
  MechanicCustomersProvider,
} from '../../src/mechanic/MechanicCustomersContext'

export default function MechanicNewBookingLayout() {
  return (
    <MechanicCustomersProvider>
      <MechanicBookingProvider>
        <Slot />
      </MechanicBookingProvider>
    </MechanicCustomersProvider>
  )
}