import {
  Slot,
} from 'expo-router'

import {
  MechanicEstimateProvider,
} from '../../src/mechanic/MechanicEstimateContext'
import {
  MechanicJobsProvider,
} from '../../src/mechanic/MechanicJobsContext'

export default function MechanicEstimateLayout() {
  return (
    <MechanicJobsProvider>
      <MechanicEstimateProvider>
        <Slot />
      </MechanicEstimateProvider>
    </MechanicJobsProvider>
  )
}