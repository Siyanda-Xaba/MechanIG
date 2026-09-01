export const vehicleModelRegistry: Record<string, number> = {
  'bmw-320i': require('../../assets/models/bmw-320i.glb'),
}

export function getVehicleModelSource(modelKey: string) {
  return vehicleModelRegistry[modelKey] ?? null
}