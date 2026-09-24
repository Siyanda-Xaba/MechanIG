import {
  ProfileImageUploadInput,
  ProfileImageUploadResult,
  UpdateUserProfileInput,
  UserProfile,
} from './types'
import { type User } from 'firebase/auth'
import { get, ref, update } from 'firebase/database'

import { auth, database } from '../firebase/firebase'

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (!auth.currentUser) {
    return null
  }

  return readUserProfile(auth.currentUser)
}

export async function readUserProfile(
  firebaseUser: User
): Promise<UserProfile | null> {
  const snapshot = await get(
    ref(database, `users/${firebaseUser.uid}`)
  )

  if (!snapshot.exists()) {
    return null
  }

  return snapshot.val() as UserProfile
}

export async function updateCurrentUserProfile(
  input: UpdateUserProfileInput
): Promise<UserProfile> {
  if (auth.currentUser?.uid !== input.userId) {
    throw new Error('You must be signed in to update your profile.')
  }

  await update(ref(database, `users/${input.userId}`), {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    updatedAt: new Date().toISOString(),
  })

  const profile = await getCurrentUser()

  if (!profile) {
    throw new Error('Your profile could not be loaded after saving.')
  }

  return profile
}

export async function uploadProfileImage(
  input: ProfileImageUploadInput
): Promise<ProfileImageUploadResult> {
  // Production implementation will upload the selected
  // image to the MechanIQ backend or configured media
  // storage service.
  //
  // The backend must return a persistent image URL.
  // A local device URI must not be treated as a
  // successfully uploaded profile image.

  void input

  throw new Error(
    'Profile image upload is not available until the user backend is connected.'
  )
}
