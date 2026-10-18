/**
 * MechanIQ Mechanic Jobs Service
 *
 * Load assigned mechanic jobs from the authoritative
 * MechanIQ backend.
 *
 * Job records and counts must only be returned after
 * an authenticated, successful backend response.
 *
 * An unavailable backend is not evidence that the
 * mechanic has zero jobs.
 *
 * Development-only jobs must never appear as genuine
 * assignments or be persisted as offline job records.
 */

/**
 * Retrieve jobs belonging to an authenticated mechanic.
 *
 * @param {string} mechanicId
 * The authenticated mechanic's user ID.
 *
 * @returns {Promise<import('./jobsTypes').MechanicJobsData>}
 *
 * Future backend integration must:
 *
 * - Authenticate the requesting user.
 * - Verify that the user has the mechanic role.
 * - Verify that the requested mechanic ID belongs
 *   to the authenticated user.
 * - Retrieve only jobs assigned to that mechanic.
 * - Return authoritative job statuses and timestamps.
 * - Preserve the existing MechanicJobsData structure.
 *
 * Backend authorization must never rely solely
 * on a mechanic ID supplied by the frontend.
 */
export async function getMechanicJobsData(mechanicId) {
  /*
   * Reject requests that do not identify
   * an authenticated mechanic.
   *
   * This is frontend input validation.
   * Backend authorization is still required.
   */
  if (
    typeof mechanicId !== 'string' ||
    !mechanicId.trim()
  ) {
    throw new Error(
      'An authenticated mechanic account is required to load jobs.'
    )
  }

  /*
   * Future implementation:
   *
   * Request the mechanic's assigned jobs using
   * the authenticated MechanIQ backend session.
   *
   * The backend must independently verify
   * the mechanic's identity and permissions.
   *
   * Until that integration exists, do not
   * return fabricated jobs or an empty list.
   */
  throw new Error(
    'Verified mechanic jobs are unavailable until the MechanIQ jobs backend is connected.'
  )
}