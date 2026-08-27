import { delay } from './client'
import type { AuthSession } from './types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

/**
 * Placeholder — logs the payload, simulates a network delay, and returns
 * a fake bearer token so the rest of the app (AuthContext ->
 * api/authToken.ts -> apiFetch) already has somewhere real to put one.
 *
 * Swap the body for `apiFetch<AuthSession>('/auth/login', { method:
 * 'POST', body: payload, skipAuth: true })` once the User service exists
 * — matches a typical Spring Security JWT login endpoint. Callers
 * (AuthContext) don't need to change either way.
 */
export async function loginRequest(payload: LoginPayload): Promise<AuthSession> {
  console.log('[api/auth] login', payload)
  await delay()
  return {
    user: { id: 'user-1', name: payload.email.split('@')[0], email: payload.email },
    token: `mock-jwt.${btoa(payload.email)}.${Date.now()}`,
  }
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthSession> {
  console.log('[api/auth] register', payload)
  await delay()
  return {
    user: { id: 'user-1', name: payload.name, email: payload.email },
    token: `mock-jwt.${btoa(payload.email)}.${Date.now()}`,
  }
}
