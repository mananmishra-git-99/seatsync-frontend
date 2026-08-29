import { useMutation } from '@tanstack/react-query'
import { delay, ApiError } from './client'

export interface PaymentPayload {
  cardNumber: string
  expiry: string
  cvv: string
}

/** Mock — no real processor. Any card succeeds except the well-known
 * Stripe test "declined" number, kept here on purpose so the decline
 * error state (Phase 6) is actually reachable without random flakiness.
 * Real endpoint: POST /payments/charge, handled by the Payment service
 * — likely proxying to an actual processor rather than validating card
 * numbers itself. */
export async function processPayment(payload: PaymentPayload): Promise<{ success: true }> {
  await delay(800 + Math.random() * 700)
  const digitsOnly = payload.cardNumber.replace(/\s/g, '')
  if (digitsOnly === '4000000000000002') {
    throw new ApiError('Your card was declined by the issuing bank.', 'CARD_DECLINED')
  }
  return { success: true }
}

export function usePayment() {
  return useMutation({ mutationFn: processPayment })
}
