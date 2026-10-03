import {
  Slot,
} from 'expo-router'

import {
  MechanicCustomersProvider,
} from '../../src/mechanic/MechanicCustomersContext'
import {
  MechanicWalkInJobProvider,
} from '../../src/mechanic/MechanicWalkInJobContext'

export default function MechanicWalkInLayout() {
  return (
    <MechanicCustomersProvider>
      <MechanicWalkInJobProvider>
        <Slot />
      </MechanicWalkInJobProvider>
    </MechanicCustomersProvider>
  )
}