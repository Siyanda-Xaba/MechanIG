# Firebase setup

The app uses the `mechaniq-3a0f2` Firebase project.

- Firebase Authentication provides email/password sign-in and password resets.
- Realtime Database continues to store app user profiles at `users/{firebaseUserId}`.
- Cloud Firestore stores superadmin data in `administrators`, `roles`, `auditLogs`, `platform/settings`, `marketplaceProducts`, `marketplaceStores`, `supportRequests`, `bookings`, and `users` collections.

## Enable Firestore superadmin access

1. In Firebase Console, create the Cloud Firestore database in the project.
2. Assign the `role: "superadmin"` custom claim to each trusted superadmin account using a trusted Admin SDK environment. Never assign admin claims from this client app. The client cannot securely create Firebase Auth users or change another user's custom claims.
3. Publish `firestore.rules` in Firestore Rules. These rules intentionally deny access to all Firestore data unless the signed-in token has the superadmin claim.
4. Publish `database.rules.json` to Realtime Database to retain profile access rules.
5. In Authentication, enable Email/Password and add the deployed web domain to Authorized domains.

The Add Administrator screen creates a pending administrator invitation/profile document. A trusted backend or Cloud Function should create the corresponding Firebase Auth account, send the invitation, and grant claims after approval. The app does not create other users' credentials from a client.

Audit records are written to `auditLogs` for administrator, role, marketplace, support, and settings changes. Audit records are intended to be append-only; the Firestore rules currently allow writes only to superadmins, so use trusted backend policy if immutable audit enforcement is required.

Do not use open test-mode database rules in production.
