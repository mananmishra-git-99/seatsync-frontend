/**
 * Holds the current session token in memory so apiFetch (api/client.ts)
 * can attach `Authorization: Bearer <token>` without importing from
 * features/auth — that would be circular, since AuthContext itself
 * calls into api/auth.ts. AuthContext calls setAuthToken() on
 * login/logout; nothing else should need to touch this directly.
 *
 * In-memory only, on purpose: it resets on a hard refresh until the
 * real backend exists and a decision is made on persistence (httpOnly
 * cookie from Spring Security vs. a refresh-token flow vs. localStorage)
 * — that's a security decision for whoever wires up the real User
 * service, not one to preempt here.
 */
let currentToken: string | null = null

export function setAuthToken(token: string | null) {
  currentToken = token
}

export function getAuthToken(): string | null {
  return currentToken
}
