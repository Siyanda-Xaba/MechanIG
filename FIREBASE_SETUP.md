# Firebase setup

The app is configured to use the `mechaniq-3a0f2` Firebase project with:

- Firebase Authentication for email/password accounts and password resets.
- Realtime Database for profiles at `users/{firebaseUserId}`.

Before testing sign-up, complete these Firebase Console steps:

1. In **Authentication** → **Sign-in method**, enable **Email/Password**.
2. In **Realtime Database**, create the database if it does not already exist.
3. In **Realtime Database** → **Rules**, publish the contents of `database.rules.json`.
4. In **Authentication** → **Settings** → **Authorized domains**, add the domain used for your web build when you deploy it.

The rules ensure that a signed-in user can read and write only their own profile. Do not use open test-mode database rules in production.

## Fuel delivery data contract

The customer app now creates a delivery in `fuelDeliveries/{deliveryId}` and keeps a customer-owned copy at `users/{uid}/fuelDeliveries/{deliveryId}` for the activity history. A request starts with the `requested` status. The tracking screen listens to the shared delivery record in real time, so a dispatch service can update its `status`, `driver`, `estimatedArrivalMinutes`, `routeCoordinates`, and `updatedAt` fields and the screen will refresh without a manual reload.

Dispatch and driver updates must be made from a trusted backend (for example, a Firebase Cloud Function using the Admin SDK), because the database rules intentionally allow a customer to create a delivery but not modify it afterwards. When your dispatch service updates the shared record, it should also update the customer's history copy so the history screen shows the current status.
