import {
  ProfileImageUploadInput,
  ProfileImageUploadResult,
  UpdateUserProfileInput,
  UserProfile,
} from './types'

const developmentUser: UserProfile = {
  id: 'customer-001',
  firstName: 'Khethukhanyo',
  lastName: 'Mbekeni',
  email: 'khethuk.mbekeni@email.com',
  phone: '+27 82 123 4567',
  profileImageUrl: null,
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  // Later this function will call the backend API.
  // Screens consuming UserContext will not need to change.
  return developmentUser
}

export async function updateCurrentUserProfile(
  input: UpdateUserProfileInput
): Promise<UserProfile> {
  // Production implementation will update the
  // authenticated user's profile through the backend.
  //
  // The backend should validate and return the
  // authoritative saved user profile.
  //
  // UserContext should only be updated after this
  // call succeeds.

  void input

  throw new Error(
    'Profile updates are not available until the user backend is connected.'
  )
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