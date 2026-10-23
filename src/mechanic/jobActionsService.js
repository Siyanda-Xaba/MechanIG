/**
 * All mechanic job mutations are backend-owned.
 *
 * These functions define the frontend contracts now,
 * but they must not locally pretend that a job status
 * changed for the customer or mechanic.
 *
 * Once the MechanIQ backend is connected, each function
 * should return the authoritative updated job record.
 */

function requireJobId(jobId) {
  if (!jobId) {
    throw new Error(
      'A valid job is required for this action.'
    )
  }
}

export async function acceptMechanicJob(
  jobId
) {
  requireJobId(jobId)

  // Later:
  // POST /mechanic/jobs/:jobId/accept
  //
  // Backend responsibilities:
  // - confirm the job is still pending
  // - confirm the authenticated mechanic can accept it
  // - set authoritative job status
  // - notify the customer
  // - return the updated job

  throw new Error(
    'Job acceptance is not available until the mechanic jobs backend is connected.'
  )
}

export async function rejectMechanicJob(
  jobId
) {
  requireJobId(jobId)

  // Later:
  // POST /mechanic/jobs/:jobId/reject
  //
  // Backend responsibilities:
  // - confirm the mechanic can reject the job
  // - record the rejection
  // - update assignment state
  // - notify the customer
  // - return the authoritative result

  throw new Error(
    'Job rejection is not available until the mechanic jobs backend is connected.'
  )
}

export async function startMechanicJobTrip(
  input
) {
  requireJobId(input?.jobId)

  if (
    typeof input?.mechanicLocation
      ?.latitude !== 'number' ||
    typeof input?.mechanicLocation
      ?.longitude !== 'number'
  ) {
    throw new Error(
      'Your current location is required before starting the trip.'
    )
  }

  // Later:
  // POST /mechanic/jobs/:jobId/travel/start
  //
  // The initial mechanic location must come from
  // real device GPS.
  //
  // Backend responsibilities:
  // - confirm this is an accepted mobile job
  // - confirm location sharing permission
  // - change travel status to en-route
  // - persist the permitted mechanic location
  // - calculate/share route data where supported
  // - notify the customer
  // - return the authoritative updated job/travel state

  throw new Error(
    'Trip tracking is not available until the mechanic travel backend is connected.'
  )
}

export async function updateMechanicJobLocation(
  input
) {
  requireJobId(input?.jobId)

  if (
    typeof input?.mechanicLocation
      ?.latitude !== 'number' ||
    typeof input?.mechanicLocation
      ?.longitude !== 'number'
  ) {
    throw new Error(
      'A valid mechanic location is required.'
    )
  }

  // Later:
  // POST /mechanic/jobs/:jobId/travel/location
  //
  // This must only run while location sharing is
  // active for an authorised mobile job.
  //
  // Do not use this as a fake polling mechanism.
  // Production tracking should be coordinated with
  // the backend and appropriate location strategy.

  throw new Error(
    'Live mechanic location sharing is not available until the tracking backend is connected.'
  )
}

export async function markMechanicJobArrived(
  jobId
) {
  requireJobId(jobId)

  // Later:
  // POST /mechanic/jobs/:jobId/travel/arrived
  //
  // Backend responsibilities:
  // - confirm travel is currently en-route
  // - set authoritative arrival status
  // - stop/adjust travel tracking as appropriate
  // - notify the customer
  // - return the updated job

  throw new Error(
    'Arrival updates are not available until the mechanic jobs backend is connected.'
  )
}

export async function startMechanicJob(
  jobId
) {
  requireJobId(jobId)

  // Later:
  // POST /mechanic/jobs/:jobId/start
  //
  // Backend responsibilities:
  // - confirm the job can begin
  // - enforce workshop/mobile arrival requirements
  // - set status to in-progress
  // - notify the customer
  // - return the updated job

  throw new Error(
    'Starting a job is not available until the mechanic jobs backend is connected.'
  )
}

export async function completeMechanicJob(
  jobId
) {
  requireJobId(jobId)

  // Later:
  // POST /mechanic/jobs/:jobId/complete
  //
  // Completion will eventually require whatever
  // backend fields MechanIQ defines, such as:
  // - final work summary
  // - completed repairs
  // - final amount
  // - diagnostic outcome
  // - parts/labour
  //
  // Backend responsibilities:
  // - validate completion
  // - set authoritative completed status
  // - stop active location sharing
  // - update customer history
  // - notify the customer
  // - enable rating/review flow

  throw new Error(
    'Job completion is not available until the mechanic jobs backend is connected.'
  )
}