import {
  auth,
} from '../firebase/firebase'

/**
 * MechanIQ Messaging API Adapter
 *
 * This module handles authenticated HTTP
 * communication with the messaging backend.
 *
 * Customer and Mechanic screens should never
 * communicate with backend endpoints directly.
 *
 * Configuration:
 *
 * EXPO_PUBLIC_MESSAGING_API_URL
 *
 * Example:
 * https://api.example.com/api/v1/messaging
 *
 * The backend team must implement the agreed
 * messaging API contract.
 */

export const MESSAGING_API_ERROR_CODES = {
  AUTH_REQUIRED: 'auth-required',
  BACKEND_NOT_CONNECTED: 'backend-not-connected',
  NETWORK_ERROR: 'network-error',
  TIMEOUT: 'timeout',
  INVALID_RESPONSE: 'invalid-response',
  SESSION_CHANGED: 'session-changed',
  REQUEST_FAILED: 'request-failed',
}

/**
 * Create a consistent API error.
 */
function createMessagingApiError(
  message,
  code,
  status = null
) {
  const error = new Error(message)

  error.code = code
  error.status = status

  return error
}

/**
 * Read the configured messaging API URL.
 */
function getMessagingApiUrl() {
  const url =
    process.env.EXPO_PUBLIC_MESSAGING_API_URL
      ?.trim()

  if (!url) {
    throw createMessagingApiError(
      'MechanIQ messaging is not connected to the backend yet.',
      MESSAGING_API_ERROR_CODES
        .BACKEND_NOT_CONNECTED
    )
  }

  return url.replace(/\/+$/, '')
}

/**
 * Execute an authenticated messaging request.
 *
 * @param {string} path
 * @param {{
 *   method?: string,
 *   body?: unknown
 * }} options
 *
 * @returns {Promise<any>}
 */
export async function messagingApiRequest(
  path,
  options = {}
) {
  const currentUser = auth.currentUser

  if (!currentUser?.uid) {
    throw createMessagingApiError(
      'You must be signed in to access messages.',
      MESSAGING_API_ERROR_CODES.AUTH_REQUIRED
    )
  }

  const baseUrl = getMessagingApiUrl()

  const normalizedPath =
    path.replace(/^\/+/, '')

  const endpoint =
    `${baseUrl}/${normalizedPath}`

  // Firebase supplies the authenticated identity.
  // The backend must independently verify the token.

  const token =
    await currentUser.getIdToken()

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  }

  if (options.body !== undefined) {
    headers['Content-Type'] =
      'application/json'
  }

  const controller = new AbortController()

  const timeout = setTimeout(() => {
    controller.abort()
  }, 15000)

  let response

  try {
    response = await fetch(endpoint, {
      method: options.method ?? 'GET',
      headers,

      body:
        options.body === undefined
          ? undefined
          : JSON.stringify(options.body),

      signal: controller.signal,
    })
  } catch (error) {
    if (controller.signal.aborted) {
      throw createMessagingApiError(
        'The messaging request timed out. Please try again.',
        MESSAGING_API_ERROR_CODES.TIMEOUT
      )
    }

    throw createMessagingApiError(
      'Unable to reach MechanIQ messaging. Check your connection and try again.',
      MESSAGING_API_ERROR_CODES.NETWORK_ERROR
    )
  } finally {
    clearTimeout(timeout)
  }

  let data = null

  const responseText =
    await response.text()

  if (responseText) {
    try {
      data = JSON.parse(responseText)
    } catch (error) {
      throw createMessagingApiError(
        'The messaging backend returned an invalid response.',
        MESSAGING_API_ERROR_CODES
          .INVALID_RESPONSE,
        response.status
      )
    }
  }

  if (!response.ok) {
    const backendMessage =
      typeof data?.message === 'string'
        ? data.message
        : typeof data?.error?.message ===
            'string'
          ? data.error.message
          : `Messaging request failed (${response.status}).`

    throw createMessagingApiError(
      backendMessage,
      response.status === 401
        ? MESSAGING_API_ERROR_CODES.AUTH_REQUIRED
        : MESSAGING_API_ERROR_CODES
            .REQUEST_FAILED,
      response.status
    )
  }

  // Prevent a response from an old account
  // being returned after an account switch.

  if (
    auth.currentUser?.uid !==
    currentUser.uid
  ) {
    throw createMessagingApiError(
      'Your account changed. Please reopen messages.',
      MESSAGING_API_ERROR_CODES
        .SESSION_CHANGED
    )
  }

  return data
}