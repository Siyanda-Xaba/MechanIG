import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  createMechanicReview,
  getMechanicReviewEligibility,
} from './reviewService'

/**
 * @typedef {
 *   import('./reviewTypes').MechanicReviewEligibility
 * } MechanicReviewEligibility
 */

/**
 * @typedef {
 *   import('./reviewTypes').MechanicReview
 * } MechanicReview
 */

/**
 * Manage review eligibility and submission
 * for a backend-confirmed completed job.
 *
 * The frontend never determines review
 * eligibility from locally displayed job data.
 *
 * @param {string | null | undefined} jobId
 * @param {{
 *   getIdToken?: () => Promise<string | null>,
 *   apiBaseUrl?: string,
 *   enabled?: boolean
 * }} [options]
 */
export function useMechanicReview(
  jobId,
  options = {}
) {
  const {
    getIdToken,
    apiBaseUrl,
    enabled = true,
  } = options

  const normalizedJobId =
    enabled &&
    typeof jobId === 'string' &&
    jobId.trim().length > 0
      ? jobId.trim()
      : null

  const [
    eligibility,
    setEligibility,
  ] = useState(
    /** @type {MechanicReviewEligibility | null} */
    (null)
  )

  const [
    isCheckingEligibility,
    setIsCheckingEligibility,
  ] = useState(false)

  const [
    eligibilityError,
    setEligibilityError,
  ] = useState(
    /** @type {string | null} */
    (null)
  )

  const [
    submittedReview,
    setSubmittedReview,
  ] = useState(
    /** @type {MechanicReview | null} */
    (null)
  )

  const [
    isSubmittingReview,
    setIsSubmittingReview,
  ] = useState(false)

  const [
    reviewError,
    setReviewError,
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

  const submissionPendingRef =
    useRef(false)

  const refreshEligibility = useCallback(() => {
    if (submissionPendingRef.current) {
      return
    }

    setRefreshCount(
      (current) => current + 1
    )
  }, [])

  useEffect(() => {
    const requestGeneration =
      ++requestGenerationRef.current

    setEligibility(null)
    setEligibilityError(null)

    if (!normalizedJobId) {
      setIsCheckingEligibility(false)

      return () => {
        requestGenerationRef.current += 1
      }
    }

    setIsCheckingEligibility(true)

    async function loadEligibility() {
      try {
        const result =
          await getMechanicReviewEligibility(
            normalizedJobId,
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

        setEligibility(result)
        setEligibilityError(null)
      } catch (error) {
        if (
          requestGenerationRef.current !==
          requestGeneration
        ) {
          return
        }

        setEligibility(null)

        setEligibilityError(
          error instanceof Error
            ? error.message
            : 'Unable to check review eligibility.'
        )
      } finally {
        if (
          requestGenerationRef.current ===
          requestGeneration
        ) {
          setIsCheckingEligibility(false)
        }
      }
    }

    void loadEligibility()

    return () => {
      requestGenerationRef.current += 1
    }
  }, [
    normalizedJobId,
    getIdToken,
    apiBaseUrl,
    refreshCount,
  ])

  const visibleEligibility =
    eligibility?.jobId === normalizedJobId
      ? eligibility
      : null

  const visibleSubmittedReview =
    submittedReview?.jobId === normalizedJobId
      ? submittedReview
      : null

  const canSubmitReview =
    Boolean(normalizedJobId) &&
    visibleEligibility?.canReview === true &&
    !visibleSubmittedReview &&
    !isCheckingEligibility &&
    !isSubmittingReview

  /**
   * Submit a review only after the backend
   * confirms eligibility.
   *
   * The backend must verify eligibility again
   * when processing the POST request.
   *
   * @param {{
   *   rating: number,
   *   comment?: string | null
   * }} input
   *
   * @returns {Promise<MechanicReview | null>}
   */
  const submitReview = useCallback(
    async (input) => {
      if (
        !normalizedJobId ||
        eligibility?.jobId !== normalizedJobId ||
        eligibility.canReview !== true ||
        submittedReview?.jobId === normalizedJobId
      ) {
        setReviewError(
          'This service is not currently eligible for a review.'
        )

        return null
      }

      if (submissionPendingRef.current) {
        return null
      }

      const requestGeneration =
        requestGenerationRef.current

      submissionPendingRef.current = true

      setIsSubmittingReview(true)
      setReviewError(null)

      try {
        const review =
          await createMechanicReview(
            {
              jobId: normalizedJobId,
              rating: input.rating,
              comment: input.comment ?? null,
            },
            {
              getIdToken,
              apiBaseUrl,
            }
          )

        if (
          requestGenerationRef.current !==
          requestGeneration
        ) {
          return null
        }

        // This review was confirmed and returned
        // by the authoritative backend.
        setSubmittedReview(review)
        setEligibility(null)

        return review
      } catch (error) {
        if (
          requestGenerationRef.current !==
          requestGeneration
        ) {
          return null
        }

        setReviewError(
          error instanceof Error
            ? error.message
            : 'Unable to submit your review.'
        )

        return null
      } finally {
        submissionPendingRef.current = false

        if (
          requestGenerationRef.current ===
          requestGeneration
        ) {
          setIsSubmittingReview(false)
        }
      }
    },
    [
      normalizedJobId,
      eligibility,
      submittedReview,
      getIdToken,
      apiBaseUrl,
    ]
  )

  const clearReviewError = useCallback(() => {
    setReviewError(null)
  }, [])

  return {
    eligibility: visibleEligibility,

    isCheckingEligibility:
      Boolean(normalizedJobId) &&
      isCheckingEligibility,

    eligibilityError:
      normalizedJobId
        ? eligibilityError
        : null,

    canSubmitReview,

    submittedReview:
      visibleSubmittedReview,

    isSubmittingReview,

    reviewError:
      normalizedJobId
        ? reviewError
        : null,

    submitReview,
    refreshEligibility,
    clearReviewError,
  }
}