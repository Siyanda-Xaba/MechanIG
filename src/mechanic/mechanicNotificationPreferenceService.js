export async function getMechanicNotificationPreferences(
  mechanicId
) {
  // Production implementation will retrieve the
  // authenticated mechanic's notification preferences
  // from the MechanIQ backend.
  //
  // Push delivery itself will later depend on:
  // - a notification provider / Expo notifications setup
  // - device push token registration
  // - backend notification delivery
  // - platform permission state
  //
  // Email delivery will remain backend-owned.
  //
  // Do not fabricate saved preference state locally.
  void mechanicId

  return {
    mechanicId,
    categoryPreferences: [],
  }
}

export async function updateMechanicNotificationPreferences(
  input
) {
  // Production implementation will submit the
  // mechanic's notification preferences to the
  // MechanIQ backend.
  //
  // The backend should return the authoritative
  // saved preference state.
  //
  // The frontend must not claim preferences were
  // persisted until this request succeeds.
  void input

  throw new Error(
    'Mechanic notification preferences cannot be saved until the notification backend is connected.'
  )
}