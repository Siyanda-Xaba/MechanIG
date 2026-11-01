export type CustomerSecuritySettings = {
  customerId: string

  biometricSignInEnabled: boolean | null

  activeSessionCount: number | null

  lastPasswordChangedAt: string | null
}

export type ChangeCustomerPasswordInput = {
  customerId: string

  currentPassword: string
  newPassword: string
}

export type UpdateCustomerBiometricPreferenceInput = {
  customerId: string

  enabled: boolean
}