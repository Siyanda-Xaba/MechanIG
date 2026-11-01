import type {
  ChangeCustomerPasswordInput,
  CustomerSecuritySettings,
  UpdateCustomerBiometricPreferenceInput,
} from './customerSecurityTypes'

export async function getCustomerSecuritySettings(
  customerId: string
): Promise<CustomerSecuritySettings> {
  // Production implementation will retrieve the
  // authenticated customer's security state from the
  // shared MechanIQ auth/backend layer.
  //
  // Values such as active sessions and password-change
  // timestamps must come from authoritative auth data.
  //
  // Biometric sign-in will also require a supported
  // secure device authentication package and secure
  // credential/session storage.
  //
  // Do not fabricate security state locally.

  return {
    customerId,
    biometricSignInEnabled: null,
    activeSessionCount: null,
    lastPasswordChangedAt: null,
  }
}

export async function changeCustomerPassword(
  input: ChangeCustomerPasswordInput
): Promise<void> {
  // Production implementation will delegate password
  // changes to the shared authentication backend.
  //
  // The backend should:
  // - verify the authenticated customer
  // - validate the current password
  // - enforce password policy
  // - update credentials securely
  // - invalidate sessions if required
  //
  // Never persist raw passwords in frontend state or
  // device storage beyond the active form submission.

  void input

  throw new Error(
    'Password changes are not available until shared authentication is connected.'
  )
}

export async function updateCustomerBiometricPreference(
  input: UpdateCustomerBiometricPreferenceInput
): Promise<CustomerSecuritySettings> {
  // Production implementation will require:
  // - supported biometric/device authentication
  // - secure credential or token storage
  // - shared auth/session integration
  //
  // Do not treat a local switch as enabled biometric
  // authentication without those capabilities.

  void input

  throw new Error(
    'Biometric sign-in is not available until secure device authentication is connected.'
  )
}