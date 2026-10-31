import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  getServiceTrackingData,
} from './serviceTrackingService'

/**
 * @typedef {
 *   import('./serviceTrackingTypes').ServiceTrackingData
 * } ServiceTrackingData
 */

const EMPTY_EVENTS = []

/**
 * Shared service tracking hook.
 *
 * Only authoritative backend responses may
 * populate tracking data.
 *
 * The caller must provide a function for
 * retrieving the authenticated user's token.
 *
 * @param {string | null | undefined} requestId
 * @param {{
 *   getIdToken?: () => Promise<string | null>,
 *   apiBaseUrl?: string,
 *   enabled?: boolean
 * }} [options]
 */
export function useServiceTracking(
  requestId,
  options = {}
) {
  const {
    getIdToken,
    apiBaseUrl,
    enabled = true,
  } = options

  const normalizedRequestId =
    enabled &&
    typeof requestId === 'string' &&
    requestId.trim().length > 0
      ? requestId.trim()
      : null

  const [
    trackingData,
    setTrackingData,
  ] = useState(
    /** @type {ServiceTrackingData | null} */
    (null)
  )

  const [
    isLoadingTracking,
    setIsLoadingTracking,
  ] = useState(false)

  const [
    trackingError,
    setTrackingError,
  ] = useState(
    /** @type {string | null} */
    (null)
  )

  const [
    refreshCount,
    setRefreshCount,
  ] = useState(0)

  const requestGenerationRef =
    useRef(0)

  const refreshTracking =
    useCallback(() => {
      setRefreshCount(
        (current) => current + 1
      )
    }, [])

  useEffect(() => {
    const requestGeneration =
      ++requestGenerationRef.current

    if (!normalizedRequestId) {
      setTrackingData(null)
      setTrackingError(null)
      setIsLoadingTracking(false)

      return () => {
        requestGenerationRef.current += 1
      }
    }

    setTrackingData((current) => {
      if (
        current?.tracking.requestId ===
        normalizedRequestId
      ) {
        return current
      }

      return null
    })

    setTrackingError(null)
    setIsLoadingTracking(true)

    async function loadTracking() {
      try {
        const result =
          await getServiceTrackingData(
            normalizedRequestId,
            {
              getIdToken,
              apiBaseUrl,
            }
          )

        if (
          requestGenerationRef.current !==
          requestGeneration
        ) {
          return
        }

        setTrackingData(result)
        setTrackingError(null)
      } catch (error) {
        if (
          requestGenerationRef.current !==
          requestGeneration
        ) {
          return
        }

        setTrackingError(
          error instanceof Error
            ? error.message
            : 'Unable to load service tracking.'
        )
      } finally {
        if (
          requestGenerationRef.current ===
          requestGeneration
        ) {
          setIsLoadingTracking(false)
        }
      }
    }

    void loadTracking()

    return () => {
      requestGenerationRef.current += 1
    }
  }, [
    normalizedRequestId,
    getIdToken,
    apiBaseUrl,
    refreshCount,
  ])

  const visibleTrackingData =
    trackingData?.tracking.requestId ===
    normalizedRequestId
      ? trackingData
      : null

  return {
    tracking:
      visibleTrackingData?.tracking ?? null,

    events:
      visibleTrackingData?.events ??
      EMPTY_EVENTS,

    isLoadingTracking:
      normalizedRequestId !== null &&
      isLoadingTracking,

    trackingError:
      normalizedRequestId !== null
        ? trackingError
        : null,

    refreshTracking,
  }
}