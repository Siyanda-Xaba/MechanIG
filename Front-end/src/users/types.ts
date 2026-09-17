export type UserProfile = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  profileImageUrl?: string | null
}

export type UpdateUserProfileInput = {
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type ProfileImageUploadInput = {
  userId: string

  uri: string
  fileName: string | null
  mimeType: string | null
}

export type ProfileImageUploadResult = {
  profileImageUrl: string
}