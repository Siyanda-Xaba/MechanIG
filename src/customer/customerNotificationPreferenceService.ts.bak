import type {
  CustomerNotificationPreferences,
  UpdateCustomerNotificationPreferencesInput,
} from './customerNotificationPreferenceTypes'

export async function getCustomerNotificationPreferences(
  customerId: string
): Promise<CustomerNotificationPreferences> {
  // Production implementation will retrieve the
  // authenticated customer's notification preferences
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

  void customerId

  return {
    customerId,
    categoryPreferences: [],
  }
}

export async function updateCustomerNotificationPreferences(
  input: UpdateCustomerNotificationPreferencesInput
): Promise<CustomerNotificationPreferences> {
  // Production implementation will submit the
  // customer's notification preferences to the
  // MechanIQ backend.
  //
  // The backend should return the authoritative
  // saved preference state.
  //
  // The frontend must not claim preferences were
  // persisted until this request succeeds.

  void input

  throw new Error(
    'Notification preferences cannot be saved until the notification backend is connected.'
  )
}