import { apiFetch } from './api'

export interface AuthUser {
  id: string
  first_name: string
  last_name: string
  name: string
  email: string
  phone: string
  avatar?: string
}

interface LoginResponse {
  token: string
  user: AuthUser
}

export interface SignupResponse {
  success: boolean
  message: string
  data: { userId: number }
  error: null
}

export async function apiLogin(identifier: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  })
}

export async function apiSignup(data: {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}): Promise<SignupResponse> {
  return apiFetch<SignupResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export interface ActivateResponse {
  success: boolean
  message: string
  error: null | string
}

export async function apiActivate(token: string): Promise<ActivateResponse> {
  return apiFetch<ActivateResponse>(`/auth/activate/${token}`)
}

export interface ResendActivationResponse {
  success: boolean
  message: string
}

export async function apiResendActivation(email: string): Promise<ResendActivationResponse> {
  return apiFetch<ResendActivationResponse>('/auth/resend-activation', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function apiGetMe(): Promise<AuthUser> {
  return apiFetch<AuthUser>('/auth/me')
}

export async function apiLogout(): Promise<void> {
  await apiFetch<void>('/auth/logout', { method: 'POST' }).catch(() => {})
}
