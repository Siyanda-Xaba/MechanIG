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
