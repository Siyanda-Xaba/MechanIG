/**
 * Load assigned mechanic jobs from the authoritative MechanIQ backend.
 *
 * Job records and counts must be returned only after an authenticated,
 * successful backend response. An unavailable backend is not evidence
 * that the mechanic has zero jobs.
 *
 * This service intentionally rejects until the jobs API is connected.
 * Development-only jobs must never appear as genuine assignments or
 * be persisted as offline job records.
 *
 * @returns {Promise<import('./jobsTypes').MechanicJobsData>}
 */
export async function getMechanicJobsData() {
  throw new Error(
    'Verified mechanic jobs are unavailable until the MechanIQ jobs backend is connected.'
  )
}
