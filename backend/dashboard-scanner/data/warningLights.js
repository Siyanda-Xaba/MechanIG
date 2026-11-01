const warningLights = {
  Anti_Lock_Braking_System: {
    title: "Anti-lock Braking System (ABS)",
    meaning:
      "The ABS warning may indicate a problem with the system that helps prevent the wheels from locking during hard braking.",
    possibleCauses: [
      "Faulty wheel-speed sensor",
      "Damaged wiring or electrical connection",
      "ABS control-system fault",
    ],
    action: "Arrange an inspection with a qualified mechanic.",
    urgency: "prompt_inspection",
    safetyAdvice:
      "Normal braking may still work, but ABS assistance may be unavailable. If braking feels abnormal or the red brake warning is also on, stop safely and seek assistance.",
  },

  Auto_Shift_Lock: {
    title: "Automatic Shift Lock",
    meaning:
      "The shift-lock system may prevent the gear selector from moving out of Park until the required conditions are met.",
    possibleCauses: [
      "Brake pedal not detected",
      "Brake-light switch problem",
      "Shift-lock mechanism or electrical fault",
    ],
    action:
      "Check the vehicle manual. If the selector remains locked or the warning persists, arrange an inspection.",
    urgency: "prompt_inspection",
    safetyAdvice:
      "Do not force the gear selector or bypass the shift-lock mechanism.",
  },

  Braking_System_Issue: {
    title: "Brake System Warning",
    meaning:
      "The vehicle may be reporting a problem with its braking system. The symbol alone cannot confirm the exact cause.",
    possibleCauses: [
      "Low brake fluid",
      "Parking brake not fully released",
      "Brake-system fault",
    ],
    action:
      "If safe, confirm that the parking brake is released. Seek professional assistance if the warning remains.",
    urgency: "high",
    safetyAdvice:
      "If the red brake warning stays on, the pedal feels unusual, or braking performance is reduced, stop safely. Do not continue driving until the vehicle has been assessed.",
  },

  Charging_System_Issue: {
    title: "Charging System Warning",
    meaning:
      "The charging system may not be maintaining the battery charge correctly while the engine is running.",
    possibleCauses: [
      "Alternator fault",
      "Loose or damaged battery connections",
      "Drive belt problem",
    ],
    action:
      "Arrange a prompt inspection with a qualified mechanic or auto-electrician.",
    urgency: "prompt_inspection",
    safetyAdvice:
      "The vehicle may lose electrical power as the battery discharges. If it begins to stall or other important systems fail, stop safely and seek assistance.",
  },

  Check_Engine: {
    title: "Check Engine Light",
    meaning:
      "The engine management system has detected a condition that may need attention. The light alone cannot identify the exact fault.",
    possibleCauses: [
      "Engine sensor problem",
      "Fuel or ignition-system issue",
      "Emissions-control fault",
    ],
    action:
      "Arrange a diagnostic scan with a qualified mechanic to help identify the underlying problem.",
    urgency: "prompt_inspection",
    safetyAdvice:
      "If the light flashes, the engine runs roughly, power drops significantly, or the vehicle overheats, pull over safely and seek professional advice.",
  },

  Engine_Overheating_Warning: {
    title: "Engine Overheating Warning",
    meaning:
      "The engine may be running hotter than its safe operating temperature.",
    possibleCauses: [
      "Low coolant",
      "Cooling fan or thermostat problem",
      "Cooling-system leak",
    ],
    action:
      "Pull over safely and switch off the engine when safe. Allow it to cool and arrange professional assistance.",
    urgency: "high",
    safetyAdvice:
      "Do not continue driving an overheating vehicle. Never open a hot radiator or pressurised coolant reservoir cap because hot coolant can cause serious burns.",
  },

  Fog_Lamp_Indicator: {
    title: "Fog Lamp Indicator",
    meaning:
      "This indicator usually shows that a front or rear fog lamp is switched on. It does not necessarily indicate a fault.",
    possibleCauses: [
      "Fog lamps switched on",
      "A lighting-system issue if the indicator behaves unexpectedly",
    ],
    action:
      "Check which fog lamp is active and use it according to the vehicle manual and applicable road rules.",
    urgency: "informational",
    safetyAdvice:
      "Switch fog lamps off when they are no longer needed to avoid dazzling other road users.",
  },

  Lane_Departure: {
    title: "Lane Departure Warning",
    meaning:
      "The symbol may indicate a lane-departure alert or a problem with the vehicle's lane-assistance system. Its exact meaning depends on the vehicle.",
    possibleCauses: [
      "Vehicle drifting across lane markings",
      "Camera view obstructed",
      "Lane-assistance system fault",
    ],
    action:
      "Check the dashboard message and owner's manual to establish whether this is an alert or a system fault.",
    urgency: "informational",
    safetyAdvice:
      "Keep your attention on the road. Do not rely on lane-assistance technology as a substitute for safe driving.",
  },

  Low_Engine_Oil: {
    title: "Engine Oil Warning",
    meaning:
      "This symbol may indicate low engine oil or low oil pressure. These are different conditions, and the exact warning symbol matters.",
    possibleCauses: [
      "Low engine oil level",
      "Oil leak",
      "Oil-pressure or sensor problem",
    ],
    action:
      "Stop safely and consult the owner's manual. Check the oil level using the manufacturer's procedure when it is safe to do so.",
    urgency: "high",
    safetyAdvice:
      "If the red oil-pressure warning is illuminated while the engine is running, switch off the engine as soon as it is safe. Do not continue driving until the cause has been checked.",
  },

  Low_Fuel: {
    title: "Low Fuel Warning",
    meaning: "The fuel level may be approaching the vehicle's reserve level.",
    possibleCauses: [
      "Low fuel level",
      "Fuel-level sensor issue if the warning appears unexpectedly",
    ],
    action:
      "Refuel as soon as practical. If the warning appears despite having enough fuel, arrange a sensor inspection.",
    urgency: "soon",
    safetyAdvice:
      "Do not rely on a fixed remaining driving distance. Fuel reserve and consumption vary between vehicles.",
  },

  Low_Tire_Pressure: {
    title: "Tyre Pressure Warning",
    meaning:
      "One or more tyres may have low pressure, or the tyre-pressure monitoring system may have detected a problem.",
    possibleCauses: [
      "Tyre losing air",
      "Temperature-related pressure change",
      "Tyre-pressure sensor fault",
    ],
    action:
      "Check the tyre pressures against the manufacturer's recommended values, usually found on a door-jamb label or in the owner's manual.",
    urgency: "prompt_inspection",
    safetyAdvice:
      "If a tyre is visibly flat or damaged, or the vehicle handles abnormally, stop safely. Do not continue driving on a damaged tyre.",
  },

  Master_warning_light: {
    title: "Master Warning Light",
    meaning:
      "This general warning indicates that the vehicle needs attention. Its meaning depends on the vehicle and any accompanying dashboard message.",
    possibleCauses: [
      "A warning from another vehicle system",
      "A maintenance or operating condition",
      "A system fault",
    ],
    action:
      "Read any accompanying dashboard message and consult the owner's manual. Seek professional help if the warning remains unexplained.",
    urgency: "check_dashboard_message",
    safetyAdvice:
      "If another serious warning appears or the vehicle behaves abnormally, follow the guidance for that warning and stop safely if necessary.",
  },

  Seat_Belt: {
    title: "Seat Belt Warning",
    meaning:
      "A seat belt may be unfastened, or the seat-occupancy warning system may have detected an occupant or an item on a seat.",
    possibleCauses: [
      "Driver or passenger seat belt not fastened",
      "An item on a passenger seat triggering the sensor",
      "Seat-belt buckle or sensor fault",
    ],
    action:
      "Ensure all occupants are correctly wearing their seat belts. If the warning persists, have the system checked.",
    urgency: "before_driving",
    safetyAdvice:
      "Everyone should wear their seat belt before the vehicle moves.",
  },

  SRS_Airbag: {
    title: "Airbag / Supplemental Restraint System (SRS)",
    meaning:
      "The airbag or related restraint system may have a fault. This system can include airbags, sensors and seat-belt pretensioners.",
    possibleCauses: [
      "Airbag-system electrical fault",
      "Seat-belt pretensioner or sensor issue",
      "SRS control-system fault",
    ],
    action:
      "Arrange an inspection with a qualified mechanic experienced in airbag systems.",
    urgency: "prompt_inspection",
    safetyAdvice:
      "Some restraint features may not work correctly in a collision. Do not attempt to repair airbag components yourself.",
  },

  Traction_Control: {
    title: "Traction Control",
    meaning:
      "The indicator may mean that traction control is actively limiting wheel spin, that the system is switched off, or that a fault has been detected.",
    possibleCauses: [
      "Wheels losing grip",
      "Traction control switched off",
      "Traction-control system fault",
    ],
    action:
      "Check the owner's manual and note whether the light flashes or remains on continuously.",
    urgency: "informational",
    safetyAdvice:
      "Reduce speed and drive smoothly on slippery surfaces. If the indicator stays on and the manual identifies it as a fault warning, arrange an inspection.",
  },

  Washer_Fluid: {
    title: "Windscreen Washer Fluid",
    meaning: "The windscreen washer-fluid level may be low.",
    possibleCauses: [
      "Washer-fluid reservoir needs refilling",
      "Fluid-level sensor issue",
    ],
    action:
      "Refill the reservoir with suitable washer fluid according to the owner's manual.",
    urgency: "soon",
    safetyAdvice:
      "Keep the windscreen clean to maintain visibility. If the warning remains after refilling, have the sensor checked.",
  },

  // Additional class observed in the actual API response.
  "Electronic Stability Problem -ESP-": {
    title: "Electronic Stability Program (ESP)",
    meaning:
      "The stability-control system may have detected a fault. This system helps the driver maintain control when the vehicle begins to skid.",
    possibleCauses: [
      "Wheel-speed sensor problem",
      "Steering-angle sensor issue",
      "Stability-control system fault",
    ],
    action:
      "Consult the vehicle manual and arrange an inspection with a qualified mechanic if the warning remains on.",
    urgency: "prompt_inspection",
    safetyAdvice:
      "Drive cautiously and avoid sudden manoeuvres. If the vehicle handles abnormally or feels unsafe, stop safely and seek assistance.",
  },
};

function normalizeClassName(className) {
  return String(className || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

const warningLightLookup = Object.fromEntries(
  Object.entries(warningLights).map(([key, details]) => [
    normalizeClassName(key),
    details,
  ]),
);

function getWarningLight(className) {
  return warningLightLookup[normalizeClassName(className)] || null;
}

module.exports = {
  warningLights,
  getWarningLight,
};
