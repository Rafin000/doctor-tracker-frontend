import { create } from 'zustand'
import { AuthUser } from '../types'

interface AuthState {
  user: AuthUser | null
  // 'loading' until we've checked the session once on mount.
  status: 'loading' | 'authenticated' | 'unauthenticated'
  setUser: (user: AuthUser) => void
  clear: () => void
  setUnauthenticated: () => void
}

/** Global auth state. Server data still comes from SWR; this holds the
 *  resolved session so the layout/topbar can read it synchronously. */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'loading',
  setUser: (user) => set({ user, status: 'authenticated' }),
  clear: () => set({ user: null, status: 'unauthenticated' }),
  setUnauthenticated: () => set({ status: 'unauthenticated' }),
}))
