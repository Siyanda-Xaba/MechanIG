import {
  REVIEW_COMMENT_MAX_LENGTH,
  REVIEW_RATING_LIMITS,
} from './reviewTypes'

const REVIEW_REQUEST_TIMEOUT_MS = 15000

const DEFAULT_REVIEWS_PAGE_SIZE = 20
const MAX_REVIEWS_PAGE_SIZE = 50

function isNonEmptyString(value) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  )
}

function isNullableString(value) {
  return (
    value === null ||
    typeof value === 'string'
  )
}

function isValidRating(rating) {
  return (
    Number.isInteger(rating) &&
    rating >= REVIEW_RATING_LIMITS.MIN &&
    rating <= REVIEW_RATING_LIMITS.MAX
  )
}

function isValidReview(review) {
  if (
    !review ||
    typeof review !== 'object'
  ) {
    return false
  }

  return (
    isNonEmptyString(review.id) &&
    isNonEmptyString(review.jobId) &&
    isNonEmptyString(review.mechanicId) &&
    isNonEmptyString(review.customerId) &&
    isValidRating(review.rating) &&
    isNullableString(review.comment) &&
    isNullableString(review.requestId) &&
    isNullableString(review.bookingId) &&
    isNonEmptyString(review.createdAt) &&
    isNullableString(review.updatedAt)
  )
}

function validateReviewEligibility(
  payload,
  jobId
) {
  if (
    !payload ||
    typeof payload !== 'object' ||
    payload.jobId !== jobId ||
    typeof payload.canReview !== 'boolean' ||
    !isNullableString(payload.reason) ||
    !isNullableString(
      payload.existingReviewId
    )
  ) {
    throw new Error(
      'The reviews backend returned invalid eligibility information.'
    )
  }

  return payload
}

function validateCreatedReview(
  payload,
  jobId
) {
  if (
    !isValidReview(payload) ||
    payload.jobId !== jobId
  ) {
    throw new Error(
      'The reviews backend returned an invalid review.'
    )
  }

  return payload
}

function validateReviewsData(
  payload,
  mechanicId
) {
  if (
    !payload ||
    typeof payload !== 'object'
  ) {
    throw new Error(
      'The reviews backend returned invalid review data.'
    )
  }

  const {
    summary,
    reviews,
  } = payload

  const validSummary =
    isNonEmptyString(mechanicId) &&
    summary &&
    typeof summary === 'object' &&
    summary.mechanicId === mechanicId &&
    Number.isInteger(
      summary.reviewCount
    ) &&
    summary.reviewCount >= 0 &&
    (
      summary.averageRating === null ||
      (
        Number.isFinite(
          summary.averageRating
        ) &&
        summary.averageRating >=
          REVIEW_RATING_LIMITS.MIN &&
        summary.averageRating <=
          REVIEW_RATING_LIMITS.MAX
      )
    )

  const validReviews =
    reviews &&
    typeof reviews === 'object' &&
    Array.isArray(reviews.reviews) &&
    reviews.reviews.every(
      (review) =>
        isValidReview(review) &&
        review.mechanicId === mechanicId
    ) &&
    isNullableString(
      reviews.nextCursor
    ) &&
    typeof reviews.hasMore ===
      'boolean'

  if (
    !validSummary ||
    !validReviews
  ) {
    throw new Error(
      'The reviews backend returned invalid review data.'
    )
  }

  return payload
}

/**
 * Build a validated review pagination query.
 *
 * @param {{
 *   cursor?: string | null,
 *   limit?: number
 * }} options
 */
function getReviewsQuery(options) {
  const limit =
    options.limit ??
    DEFAULT_REVIEWS_PAGE_SIZE

  if (
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > MAX_REVIEWS_PAGE_SIZE
  ) {
    throw new Error(
      'The reviews page size must be between 1 and 50.'
    )
  }

  if (
    options.cursor != null &&
    !isNonEmptyString(options.cursor)
  ) {
    throw new Error(
      'The reviews pagination cursor is invalid.'
    )
  }

  let query = `?limit=${limit}`

  if (options.cursor) {
    query +=
      `&cursor=${encodeURIComponent(
        options.cursor
      )}`
  }

  return query
}

/**
 * Make an authenticated request to the
 * MechanIQ Ratings & Reviews backend.
 *
 * The backend must verify the Firebase
 * authentication token and enforce
 * role-based authorization.
 *
 * @param {string} path
 * @param {{
 *   method?: string,
 *   body?: unknown,
 *   getIdToken?: () => Promise<string | null>,
 *   apiBaseUrl?: string
 * }} [options]
 */
async function requestReviewsApi(
  path,
  options = {}
) {
  const apiBaseUrl = (
    options.apiBaseUrl ??
    process.env.EXPO_PUBLIC_REVIEWS_API_URL ??
    ''
  )
    .trim()
    .replace(/\/+$/, '')

  if (!apiBaseUrl) {
    throw new Error(
      'Ratings and reviews are unavailable until the MechanIQ reviews backend is connected.'
    )
  }

  if (
    typeof options.getIdToken !== 'function'
  ) {
    throw new Error(
      'An authenticated session is required for this review request.'
    )
  }

  const token =
    await options.getIdToken()

  if (!isNonEmptyString(token)) {
    throw new Error(
      'Please sign in to access ratings and reviews.'
    )
  }

  const controller =
    new AbortController()

  const timeoutId = setTimeout(
    () => controller.abort(),
    REVIEW_REQUEST_TIMEOUT_MS
  )

  try {
    const response = await fetch(
      `${apiBaseUrl}${path}`,
      {
        method: options.method ?? 'GET',

        headers: {
          Accept: 'application/json',

          Authorization:
            `Bearer ${token}`,

          ...(options.body !== undefined
            ? {
                'Content-Type':
                  'application/json',
              }
            : {}),
        },

        body:
          options.body !== undefined
            ? JSON.stringify(
                options.body
              )
            : undefined,

        signal: controller.signal,
      }
    )

    if (response.status === 401) {
      throw new Error(
        'Your session has expired. Please sign in again.'
      )
    }

    if (response.status === 403) {
      throw new Error(
        'You do not have permission to perform this review action.'
      )
    }

    if (response.status === 404) {
      throw new Error(
        'The requested job or review could not be found.'
      )
    }

    if (response.status === 409) {
      throw new Error(
        'This review cannot be submitted because it conflicts with the current job or review state.'
      )
    }

    if (response.status === 422) {
      throw new Error(
        'The review information was rejected. Please check the details and try again.'
      )
    }

    if (response.status === 429) {
      throw new Error(
        'Too many review requests. Please try again later.'
      )
    }

    if (!response.ok) {
      throw new Error(
        'Unable to complete the review request. Please try again.'
      )
    }

    try {
      return await response.json()
    } catch {
      throw new Error(
        'The reviews backend returned an invalid response.'
      )
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === 'AbortError'
    ) {
      throw new Error(
        'The reviews request is taking too long. Please try again.'
      )
    }

    if (error instanceof TypeError) {
      throw new Error(
        'Unable to connect to reviews. Check your connection and try again.'
      )
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Check whether the authenticated customer
 * is eligible to review a completed job.
 *
 * Proposed endpoint:
 *
 * GET /jobs/:jobId/review-eligibility
 *
 * The backend must verify:
 *
 * - The job exists
 * - The authenticated customer owns the job
 * - The job has been completed
 * - A duplicate review does not exist
 *
 * @param {string} jobId
 * @param {{
 *   getIdToken?: () => Promise<string | null>,
 *   apiBaseUrl?: string
 * }} [options]
 *
 * @returns {
 *   Promise<
 *     import('./reviewTypes').MechanicReviewEligibility
 *   >
 * }
 */
export async function getMechanicReviewEligibility(
  jobId,
  options = {}
) {
  if (!isNonEmptyString(jobId)) {
    throw new Error(
      'A valid completed job ID is required.'
    )
  }

  const normalizedJobId =
    jobId.trim()

  const payload =
    await requestReviewsApi(
      `/jobs/${encodeURIComponent(
        normalizedJobId
      )}/review-eligibility`,
      options
    )

  return validateReviewEligibility(
    payload,
    normalizedJobId
  )
}

/**
 * Submit a review for a completed job.
 *
 * Proposed endpoint:
 *
 * POST /reviews
 *
 * The backend must independently verify
 * eligibility at submission time, even if
 * a previous eligibility check succeeded.
 *
 * Customer and mechanic IDs must be
 * derived from authenticated backend records.
 *
 * @param {
 *   import('./reviewTypes').CreateMechanicReviewInput
 * } input
 *
 * @param {{
 *   getIdToken?: () => Promise<string | null>,
 *   apiBaseUrl?: string
 * }} [options]
 *
 * @returns {
 *   Promise<
 *     import('./reviewTypes').MechanicReview
 *   >
 * }
 */
export async function createMechanicReview(
  input,
  options = {}
) {
  if (
    !input ||
    !isNonEmptyString(input.jobId)
  ) {
    throw new Error(
      'A valid completed job ID is required.'
    )
  }

  if (!isValidRating(input.rating)) {
    throw new Error(
      'Select a rating between 1 and 5 stars.'
    )
  }

  if (
    input.comment != null &&
    typeof input.comment !== 'string'
  ) {
    throw new Error(
      'The review comment is invalid.'
    )
  }

  const comment =
    typeof input.comment === 'string'
      ? input.comment.trim()
      : ''

  if (
    comment.length >
    REVIEW_COMMENT_MAX_LENGTH
  ) {
    throw new Error(
      `Your review must be ${REVIEW_COMMENT_MAX_LENGTH} characters or fewer.`
    )
  }

  const normalizedJobId =
    input.jobId.trim()

  const payload =
    await requestReviewsApi(
      '/reviews',
      {
        ...options,

        method: 'POST',

        body: {
          jobId: normalizedJobId,
          rating: input.rating,
          comment: comment || null,
        },
      }
    )

  return validateCreatedReview(
    payload,
    normalizedJobId
  )
}

/**
 * Retrieve a mechanic's verified reviews
 * and backend-calculated rating summary.
 *
 * Proposed endpoint:
 *
 * GET /mechanics/:mechanicId/reviews
 *
 * Optional query parameters:
 *
 * - limit
 * - cursor
 *
 * The backend is responsible for
 * calculating the mechanic's average rating
 * and total review count.
 *
 * @param {string} mechanicId
 *
 * @param {{
 *   getIdToken?: () => Promise<string | null>,
 *   apiBaseUrl?: string,
 *   cursor?: string | null,
 *   limit?: number
 * }} [options]
 *
 * @returns {
 *   Promise<
 *     import('./reviewTypes').MechanicReviewsData
 *   >
 * }
 */
export async function getMechanicReviewsData(
  mechanicId,
  options = {}
) {
  if (!isNonEmptyString(mechanicId)) {
    throw new Error(
      'A valid mechanic ID is required.'
    )
  }

  const normalizedMechanicId =
    mechanicId.trim()

  const path =
    `/mechanics/${encodeURIComponent(
      normalizedMechanicId
    )}/reviews${getReviewsQuery(options)}`

  const payload =
    await requestReviewsApi(
      path,
      options
    )

  return validateReviewsData(
    payload,
    normalizedMechanicId
  )
}

/**
 * Retrieve reviews for the currently signed-in mechanic.
 *
 * Proposed endpoint:
 *
 * GET /mechanics/me/reviews
 *
 * The backend MUST verify the Firebase token,
 * identify the mechanic profile associated with
 * that account, and authorize the response.
 *
 * This avoids treating user.id or the Firebase UID
 * as a mechanic profile ID. The response includes
 * the authoritative mechanicId in summary.mechanicId.
 *
 * @param {{
 *   getIdToken?: () => Promise<string | null>,
 *   apiBaseUrl?: string,
 *   cursor?: string | null,
 *   limit?: number
 * }} [options]
 *
 * @returns {
 *   Promise<
 *     import('./reviewTypes').MechanicReviewsData
 *   >
 * }
 */
export async function getMyMechanicReviewsData(
  options = {}
) {
  const payload =
    await requestReviewsApi(
      `/mechanics/me/reviews${getReviewsQuery(options)}`,
      options
    )

  const mechanicId =
    payload?.summary?.mechanicId

  if (!isNonEmptyString(mechanicId)) {
    throw new Error(
      'The reviews backend returned an invalid mechanic identity.'
    )
  }

  return validateReviewsData(
    payload,
    mechanicId
  )
}
