import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { getCurrentUser } from './userService'
import { UserProfile } from './types'

type UserContextType = {
  user: UserProfile | null
  isLoadingUser: boolean
  setUser: (user: UserProfile | null) => void
  updateUser: (updates: Partial<UserProfile>) => void
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(
  undefined
)

export function UserProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  useEffect(() => {
    refreshUser()
  }, [])

  async function refreshUser() {
    try {
      setIsLoadingUser(true)

      const currentUser = await getCurrentUser()

      setUser(currentUser)
    } finally {
      setIsLoadingUser(false)
    }
  }

  function updateUser(updates: Partial<UserProfile>) {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser
      }

      return {
        ...currentUser,
        ...updates,
      }
    })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoadingUser,
        setUser,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error(
      'useUser must be used inside UserProvider'
    )
  }

  return context
}