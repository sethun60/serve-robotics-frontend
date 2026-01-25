import { Component, ReactNode, ErrorInfo } from 'react'
import { logger } from '../services/logger'

interface ErrorBoundaryProps {
	children: ReactNode
}

interface ErrorBoundaryState {
	hasError: boolean
	error: Error | null
	errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = { hasError: false, error: null, errorInfo: null }
	}

	static getDerivedStateFromError(_error: Error): Partial<ErrorBoundaryState> {
		return { hasError: true }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		logger.error('React Error Boundary caught an error:', error, errorInfo)
		this.setState({ error, errorInfo })

		// In production, send to monitoring service
		if (import.meta.env.PROD) {
			// TODO: Send to error tracking service
			// sendErrorToService(error, errorInfo)
		}
	}

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#1a1a1a',
          color: 'white',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1>Oops! Something went wrong</h1>
          <p style={{ marginTop: '1rem', color: '#999' }}>
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '2rem',
              padding: '0.8rem 2rem',
              fontSize: '1rem',
              cursor: 'pointer',
              backgroundColor: '#646cff',
              color: 'white',
              border: 'none',
              borderRadius: '8px'
            }}
          >
            Refresh Page
          </button>
          {!import.meta.env.PROD && this.state.error && (
            <details style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '600px' }}>
              <summary style={{ cursor: 'pointer', color: '#ff4444' }}>
                Error Details (Dev Only)
              </summary>
              <pre style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: '#000', 
                overflow: 'auto',
                fontSize: '0.875rem'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
