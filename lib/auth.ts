import { apiFetch } from './api'

export interface AuthUser {
  id: number
  firstName: string
  lastName: string
  middleName: string | null
  email: string
  phone: string
  avatar?: string
}

interface LoginApiResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: AuthUser
  }
  error: null
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
  const res = await apiFetch<LoginApiResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  })
  return res.data
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

export interface ProfileData {
  firstName: string
  lastName: string
  middleName: string | null
  email: string
  phone: string
  avatar?: string
}

interface ProfileApiResponse {
  success: boolean
  message: string
  data: { user: ProfileData }
  error: null | string
}

export async function apiGetProfile(): Promise<ProfileData> {
  const res = await apiFetch<ProfileApiResponse>('/app/profile')
  return res.data.user
}

export async function apiUpdateNotifications(prefs: {
  billing?: boolean
  apps?: boolean
  marketing?: boolean
}): Promise<void> {
  await apiFetch<{ success: boolean; message: string }>('/app/profile/notifications', {
    method: 'PUT',
    body: JSON.stringify(prefs),
  })
}

export async function apiDeleteAccount(): Promise<void> {
  await apiFetch<{ success: boolean; message: string }>('/app/profile', {
    method: 'DELETE',
  })
}

export async function apiChangePassword(payload: {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}): Promise<void> {
  await apiFetch<{ success: boolean; message: string }>('/app/profile/password', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function apiUpdateProfile(payload: {
  firstName: string
  lastName: string
  middleName: string
  email: string
  phone: string
}): Promise<ProfileData> {
  const res = await apiFetch<ProfileApiResponse>('/app/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return res.data.user
}

export async function apiLogout(): Promise<void> {
  await apiFetch<void>('/auth/logout', { method: 'POST' }).catch(() => {})
}

export async function apiGoogleAuth(idToken: string): Promise<LoginResponse> {
  const res = await apiFetch<LoginApiResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  })
  return res.data
}

export interface ForgotPasswordResponse {
  success: boolean
  message: string
  error: null | string
}

export async function apiForgotPassword(email: string): Promise<ForgotPasswordResponse> {
  return apiFetch<ForgotPasswordResponse>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
  error: null | string
}

export async function apiResetPassword(token: string, password: string): Promise<ResetPasswordResponse> {
  return apiFetch<ResetPasswordResponse>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  })
}
