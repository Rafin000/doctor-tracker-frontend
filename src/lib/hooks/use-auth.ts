'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { AuthService } from '../services/auth.service'
import { tokenStore } from '../auth/token'
import { useAuthStore } from '../stores/auth.store'

/**
 * Single entry point for auth. Wraps the Zustand store with the login/logout
 * actions and a one-time session bootstrap (validates the cookie via /auth/me).
 */
export function useAuth() {
  const router = useRouter()
  const { user, status, setUser, clear, setUnauthenticated } = useAuthStore()

  const login = useCallback(
    async (email: string, password: string) => {
      const { accessToken, user } = await AuthService.login({ email, password })
      tokenStore.set(accessToken)
      setUser(user)
      return user
    },
    [setUser],
  )

  const logout = useCallback(() => {
    tokenStore.clear()
    clear()
    router.replace('/login')
  }, [clear, router])

  // Resolve the session once (used by the protected shell).
  const bootstrap = useCallback(async () => {
    if (!tokenStore.get()) {
      setUnauthenticated()
      return
    }
    try {
      const me = await AuthService.me()
      setUser(me)
    } catch {
      tokenStore.clear()
      setUnauthenticated()
    }
  }, [setUser, setUnauthenticated])

  return { user, status, login, logout, bootstrap }
}

/** Convenience: runs bootstrap on mount. */
export function useSessionBootstrap() {
  const { bootstrap } = useAuth()
  useEffect(() => {
    void bootstrap()
  }, [bootstrap])
}
