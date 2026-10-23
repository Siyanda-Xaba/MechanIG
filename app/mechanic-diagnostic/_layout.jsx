import {
  Slot,
} from 'expo-router'

import {
  MechanicDiagnosticsProvider,
} from '../../src/mechanic/MechanicDiagnosticsContext'

export default function MechanicDiagnosticLayout() {
  return (
    <MechanicDiagnosticsProvider>
      <Slot />
    </MechanicDiagnosticsProvider>
  )
}