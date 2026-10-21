export type UserProfile = {
  id: string
  role: UserRole
  firstName: string
  lastName: string
  email: string
  phone: string
  profileImageUrl?: string | null
}

export type UserRole = 'customer' | 'mechanic'

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
