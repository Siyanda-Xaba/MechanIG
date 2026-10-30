# Firebase setup

The app is configured to use the `mechaniq-3a0f2` Firebase project with:

- Firebase Authentication for email/password accounts and password resets.
- Realtime Database for profiles at `users/{firebaseUserId}`.

Before testing sign-up, complete these Firebase Console steps:

1. In **Authentication** → **Sign-in method**, enable **Email/Password**.
2. In **Realtime Database**, create the database if it does not already exist.
3. In **Realtime Database** → **Rules**, publish the contents of `database.rules.json`.
4. In **Cloud Firestore** → **Rules**, publish the contents of `firestore.rules`.
5. In **Storage** → **Rules**, publish the contents of `storage.rules`.
6. In **Authentication** → **Settings** → **Authorized domains**, add the domain used for your web build when you deploy it.

The rules keep user profiles, vehicles, saved addresses, preferences, emergency drafts, marketplace activity, and marketplace part-search history scoped to the signed-in owner. Booking and mechanic service requests are customer-created with the initial `requested` state; clients cannot update their lifecycle or pricing. Notifications, diagnostic scans, product catalogs, reviews, jobs, and audit records remain server-owned. Do not use open test-mode rules in production.

The app only writes fields that a real screen or connected service collects. It does not seed empty catalog, support, review, job, notification, or admin records.

## Marketplace part-search history

Text searches from the Marketplace screen use the same live part-offers endpoint as picture search. When a user is signed in, the app saves the search term, selected vehicle ID, result count, timestamp, and up to 20 limited offer summaries at `marketplacePartSearches/{firebaseUserId}/{searchId}`. Marketplace activity is also stored at `marketplaceActivity/{firebaseUserId}/{activityId}` and cached locally for offline display. No precise device location is saved in these histories. The Realtime Database rules restrict reads and writes to the matching signed-in user.

To enable Firebase persistence in the deployed app, publish the updated `database.rules.json` in **Realtime Database** → **Rules**. Search results still display if history saving is unavailable; the screen reports when a search was not saved.

## Superadmin dashboard

The integrated superadmin dashboard is available in the main app at `/(superadmin)`. Access requires a Firebase Authentication custom claim with `role: "superadmin"`; a profile field or Firestore administrator document alone does not grant access. Assign that claim only with a trusted Admin SDK process, then sign out and sign in again so the ID token refreshes. The dashboard reads customer and public mechanic profiles from Realtime Database and its administration records from Firestore. User profiles are review-only; account suspension, deletion, invitations, and custom-claim changes require trusted backend support and are not simulated by client-side profile edits.

The main `firebase.json` deploy configuration targets the app's merged Realtime Database rules, superadmin Firestore rules, and existing Storage rules in project `mechaniq-3a0f2`.

Emergency drafts are mirrored to `emergencyDrafts/{firebaseUserId}/{requestId}` when Firebase is reachable and remain in SecureStore for offline use. Mechanic identity, licence, address, and verification document references are kept in the owner-only `mechanicPrivate/{uid}` record; uploaded documents live under owner-restricted `mechanic_documents/{uid}/` Storage paths. Profile records keep public directory fields separate. Existing mechanic profiles are migrated from legacy public fields when that owner signs in.

OBD vehicles and scans use the OBD API repository: local development defaults to a local JSON file, while production must run with `NODE_ENV=production`, `OBD_AUTH_MODE=firebase`, `OBD_STORAGE=firebase`, Firebase Admin credentials, and the Firebase database URL. Production scan data is not written to Firebase until those server settings are configured and the database/storage rules are published.

The report also proposes backend features that the current app does not yet collect or implement, including support ticket submission, authoritative completed service history, trusted review persistence, catalog management, and admin audit actions. Their records are intentionally not fabricated or written by the mobile client. Build their trusted server workflows before enabling those paths.

## Fuel delivery data contract

The customer app now creates a delivery in `fuelDeliveries/{deliveryId}` and keeps a customer-owned copy at `users/{uid}/fuelDeliveries/{deliveryId}` for the activity history. A request starts with the `requested` status. The tracking screen listens to the shared delivery record in real time, so a dispatch service can update its `status`, `driver`, `estimatedArrivalMinutes`, `routeCoordinates`, and `updatedAt` fields and the screen will refresh without a manual reload.

Dispatch and driver updates must be made from a trusted backend (for example, a Firebase Cloud Function using the Admin SDK), because the database rules intentionally allow a customer to create a delivery but not modify it afterwards. When your dispatch service updates the shared record, it should also update the customer's history copy so the history screen shows the current status.
