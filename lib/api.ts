import { IS_PRODUCTION } from './env'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ??
  (IS_PRODUCTION
    ? 'https://backend.lagosapps.com/api/v1'
    : 'http://localhost:5000/api/v1')

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('lagos_token')
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message =
      (typeof json?.message === 'string' && json.message) ||
      (typeof json?.data === 'string' && json.data) ||
      json?.error ||
      `Request failed (${res.status})`
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    throw new ApiError(res.status, message)
  }

  return json
}
