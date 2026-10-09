/**
 * MechanIQ Marketplace Network Requests
 *
 * Shared request handling for Marketplace APIs.
 *
 * Prevents requests from waiting indefinitely
 * and provides readable error messages.
 *
 * Actual recognition processing, product data
 * and compatibility verification remain
 * backend responsibilities.
 */

export const MARKETPLACE_REQUEST_TIMEOUTS = {
  PICTURE_RECOGNITION: 25000,
  RETAILER_OFFERS: 15000,
  NEARBY_STORES: 12000,
}

export const MARKETPLACE_REQUEST_ERRORS = {
  TIMEOUT: 'marketplace-timeout',
  NETWORK: 'marketplace-network-error',
}

function createMarketplaceRequestError(
  message,
  code
) {
  const error = new Error(message)

  error.code = code

  return error
}

/**
 * Perform a Marketplace request and read its
 * JSON response within a bounded time.
 *
 * @param {string} endpoint
 * @param {RequestInit} options
 * @param {number} timeoutMs
 *
 * @returns {Promise<{
 *   response: Response,
 *   payload: any
 * }>}
 */
export async function fetchMarketplaceJson(
  endpoint,
  options = {},
  timeoutMs = 15000
) {
  if (
    !Number.isFinite(timeoutMs) ||
    timeoutMs <= 0
  ) {
    throw new Error(
      'A valid Marketplace request timeout is required.'
    )
  }

  const controller = new AbortController()

  const timeout = setTimeout(() => {
    controller.abort()
  }, timeoutMs)

  try {
    const response = await fetch(endpoint, {
      ...options,
      signal: controller.signal,
    })

    const payload = await response
      .json()
      .catch(() => null)

    return {
      response,
      payload,
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : String(error)

    const timedOut =
      controller.signal.aborted ||
      /timed?\s*out|timeout/i.test(
        errorMessage
      )

    if (timedOut) {
      throw createMarketplaceRequestError(
        'This Marketplace request is taking too long. Please try again.',
        MARKETPLACE_REQUEST_ERRORS.TIMEOUT
      )
    }

    throw createMarketplaceRequestError(
      'Unable to connect to Marketplace. Check your internet connection and try again.',
      MARKETPLACE_REQUEST_ERRORS.NETWORK
    )
  } finally {
    clearTimeout(timeout)
  }
}