import type {
  AttachCustomerPaymentMethodInput,
  CustomerPaymentMethod,
} from './customerPaymentTypes'

export async function getCustomerPaymentMethods(
  customerId: string
): Promise<CustomerPaymentMethod[]> {
  // Production implementation will retrieve the
  // authenticated customer's saved payment methods
  // from the MechanIQ backend.
  //
  // The frontend must only receive safe display data
  // such as:
  // - payment method ID
  // - card brand
  // - last 4 digits
  // - expiry month/year
  // - default status
  //
  // Raw card numbers and CVV values must never be
  // returned to or persisted by the MechanIQ frontend.

  void customerId

  return []
}

export async function attachCustomerPaymentMethod(
  input: AttachCustomerPaymentMethodInput
): Promise<CustomerPaymentMethod> {
  // Production flow:
  //
  // 1. A supported payment provider securely collects
  //    the customer's payment details.
  // 2. The provider returns a secure token/reference.
  // 3. MechanIQ sends that provider reference to the
  //    backend.
  // 4. The backend attaches the payment method to the
  //    authenticated customer's account.
  // 5. The backend returns safe payment method metadata.
  //
  // Never accept or store raw card numbers or CVV here.

  void input

  throw new Error(
    'Adding payment methods is not available until a payment provider and backend are connected.'
  )
}