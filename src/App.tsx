import { Suspense, lazy } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastProvider } from '@/components/ui/Toast'
import { AuthProvider } from '@/features/auth/AuthContext'
import { BookingProvider } from '@/features/booking/BookingContext'
import { AppLayout } from '@/layouts/AppLayout'
import { Spinner } from '@/components/ui/Spinner'

// Route-level code splitting — each page ships as its own chunk instead
// of one bundle for the whole app.
const LandingPage = lazy(() => import('@/features/home/LandingPage'))
const NotFoundPage = lazy(() => import('@/features/home/NotFoundPage'))
const LoginPage = lazy(() => import('@/features/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/RegisterPage'))
const BrowseEventsPage = lazy(() => import('@/features/events/BrowseEventsPage'))
const EventDetailPage = lazy(() => import('@/features/events/EventDetailPage'))
const CheckoutPage = lazy(() => import('@/features/booking/CheckoutPage'))
const ConfirmationPage = lazy(() => import('@/features/booking/ConfirmationPage'))
const MyTicketsPage = lazy(() => import('@/features/tickets/MyTicketsPage'))
const TicketDetailPage = lazy(() => import('@/features/tickets/TicketDetailPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" label="Loading page" />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <BookingProvider>
              <BrowserRouter>
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route element={<AppLayout />}>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/events" element={<BrowseEventsPage />} />
                      <Route path="/events/:eventId" element={<EventDetailPage />} />
                      <Route path="/checkout/:eventId" element={<CheckoutPage />} />
                      <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
                      <Route path="/tickets" element={<MyTicketsPage />} />
                      <Route path="/tickets/:bookingId" element={<TicketDetailPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </BookingProvider>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
