'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { AuthUser, apiLogin, apiSignup, apiLogout, apiGetMe } from '@/lib/auth'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  login: (identifier: string, password: string) => Promise<void>
  signup: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  // kept for Header2 compatibility
  setShowAuth: (v: boolean) => void
  setShowDashboard: (v: boolean) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'lagos_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) { setLoading(false); return }
    apiGetMe()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (identifier: string, password: string) => {
    const { token, user } = await apiLogin(identifier, password)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(user)
  }, [])

  const signup = useCallback(async (data: Parameters<typeof apiSignup>[0]) => {
    await apiSignup(data)
    // No token returned — user must verify email before logging in
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  // no-ops kept for Header2 compatibility
  const setShowAuth = useCallback(() => {}, [])
  const setShowDashboard = useCallback(() => {}, [])

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, loading,
      login, signup, logout,
      setShowAuth, setShowDashboard,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>')
  return ctx
}
