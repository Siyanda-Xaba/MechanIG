import parts from '../../data/parts.json' with { type: 'json' };

export const supportedCategories = [...new Set(parts.map((part) => part.category))];

function normalise(value) {
  return String(value || '').trim().toLowerCase();
}

function vehicleMatches(part, vehicle) {
  if (!vehicle.make && !vehicle.model && !vehicle.year && !vehicle.engine) return true;

  return part.fitments.some((fitment) => {
    const makeOk = !vehicle.make || normalise(fitment.make) === normalise(vehicle.make);
    const modelOk = !vehicle.model || normalise(fitment.model) === normalise(vehicle.model);
    const engineOk = !vehicle.engine || normalise(fitment.engine) === normalise(vehicle.engine);
    const year = Number(vehicle.year);
    const yearOk = !year || (year >= fitment.yearFrom && year <= fitment.yearTo);
    return makeOk && modelOk && engineOk && yearOk;
  });
}

export function findParts({ categories, vehicle }) {
  const requested = new Set(categories.map(normalise));

  return parts
    .filter((part) => requested.has(normalise(part.category)))
    .map((part) => ({ ...part, isVehicleCompatible: vehicleMatches(part, vehicle) }))
    .filter((part) => part.isVehicleCompatible)
    .sort((a, b) => a.priceZar - b.priceZar)
    .slice(0, 10);
}
