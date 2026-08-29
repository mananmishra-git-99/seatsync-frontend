/**
 * Every mock endpoint in api/ awaits this instead of resolving
 * instantly, so loading states are real to build against — and so
 * swapping a mock for `fetch(...)` later doesn't change calling code.
 * Range keeps dev/testing from feeling sluggish while still being long
 * enough to see skeletons render.
 */
import { getAuthToken } from './authToken'

export function delay(ms = 500 + Math.random() * 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Thrown by mock endpoints that simulate a failure (checkout decline, etc),
 * and by apiFetch below once a real backend is wired in. */
export class ApiError extends Error {
  code: string
  status?: number
  constructor(message: string, code: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

// ── Real API client (not called by any endpoint yet) ─────────────────────
// Every api/*.ts file today returns mock data straight from lib/mock-*.ts.
// This is the client those files switch to once the Spring Boot backend
// exists — swap a mock function's body for an apiFetch call with the same
// return type, and the React Query hook wrapping it doesn't change.
//
// Defaults match a default Spring Boot dev setup (server.port=8080,
// controllers under /api). Override via VITE_API_BASE_URL — see
// .env.example — once the real backend has a real address.
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  /** Skip the Authorization header for public endpoints (login, register,
   * browsing events unauthenticated). Defaults to attaching it whenever a
   * token is present. */
  skipAuth?: boolean
}

/**
 * Fetch wrapper for the real backend: JSON in, JSON out, Bearer token
 * attached from api/authToken.ts when present, Spring's typical error
 * body ({ message, error, status, ... }) unwrapped into ApiError. A 204
 * No Content response (common for Spring DELETE/POST-without-body
 * endpoints) resolves to undefined rather than trying to parse empty JSON.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, skipAuth, headers, ...rest } = options
  const token = skipAuth ? null : getAuthToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) return undefined as T

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? await response.json().catch(() => null) : null

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'message' in payload && String(payload.message)) ||
      (payload && typeof payload === 'object' && 'error' in payload && String(payload.error)) ||
      `Request failed (${response.status})`
    throw new ApiError(message, 'HTTP_ERROR', response.status)
  }

  return payload as T
}
