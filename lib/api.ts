const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://backend.lagosapps.com/api/v1'

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
      json?.message ?? json?.error ?? `Request failed (${res.status})`
    throw new ApiError(res.status, message)
  }

  return json
}
