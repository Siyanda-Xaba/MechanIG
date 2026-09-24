export const vehicleModelRegistry = {
    'bmw-320i': require('../../assets/models/bmw-320i-e90.glb'),
};
export function getVehicleModelSource(modelKey) {
    return vehicleModelRegistry[modelKey] ?? null;
}
