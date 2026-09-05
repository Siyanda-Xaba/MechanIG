import { UserProfile } from './types'

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