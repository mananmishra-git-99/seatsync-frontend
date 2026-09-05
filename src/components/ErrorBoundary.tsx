import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stage-black px-6 text-center">
          <AlertTriangle className="size-8 text-marquee-red" aria-hidden="true" />
          <div>
            <p className="font-display text-2xl tracking-wide text-ink">Something broke on our end</p>
            <p className="mt-1 text-sm text-ink-muted">
              Reloading usually fixes this. If it keeps happening, the problem is on our side, not yours.
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </div>
      )
    }
    return this.props.children
  }
}
