import {
  Slot,
} from 'expo-router'

import {
  MechanicAvailabilityProvider,
} from '../../src/mechanic/MechanicAvailabilityContext'

export default function MechanicAvailabilityLayout() {
  return (
    <MechanicAvailabilityProvider>
      <Slot />
    </MechanicAvailabilityProvider>
  )
}