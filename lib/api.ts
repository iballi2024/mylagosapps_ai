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

interface ApiFetchOptions extends RequestInit {
  /** When true, a 401 response will NOT dispatch auth:unauthorized or force a logout.
   *  Use for optional/non-critical endpoints where a 401 means "no data" rather than
   *  "invalid session" (e.g. plan-benefits for users without a subscription). */
  skipLogout?: boolean
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { skipLogout, ...fetchOptions } = options
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      ...(fetchOptions.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message =
      (typeof json?.message === 'string' && json.message) ||
      (typeof json?.data === 'string' && json.data) ||
      json?.error ||
      `Request failed (${res.status})`
    if (res.status === 401 && typeof window !== 'undefined' && !skipLogout) {
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    throw new ApiError(res.status, message)
  }

  return json
}
