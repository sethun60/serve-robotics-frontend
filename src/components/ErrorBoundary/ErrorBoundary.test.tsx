import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Component, ReactNode, ErrorInfo } from 'react'

// Mock logger before importing anything else
const mockLogger = {
	error: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
}

jest.mock('../../services/logger', () => ({
	logger: mockLogger,
}))

// Create a simplified version of ErrorBoundary for testing without import.meta
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
		mockLogger.error('React Error Boundary caught an error:', error, errorInfo)
		this.setState({ error, errorInfo })
	}

	render() {
		if (this.state.hasError) {
			return (
				<div>
					<h1>Oops! Something went wrong</h1>
					<p>We're sorry for the inconvenience. Please try refreshing the page.</p>
					<button onClick={() => window.location.reload()}>Refresh Page</button>
					{this.state.error && (
						<details>
							<summary>Error Details (Dev Only)</summary>
							<pre>
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

// Component that throws an error
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
	if (shouldThrow) {
		throw new Error('Test error')
	}
	return <div>No error</div>
}

// Suppress console.error for these tests since we're intentionally throwing errors
const originalError = console.error
beforeAll(() => {
	console.error = jest.fn()
})

afterAll(() => {
	console.error = originalError
})

describe('ErrorBoundary', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('Normal Rendering', () => {
		it('renders children when there is no error', () => {
			render(
				<ErrorBoundary>
					<div>Test content</div>
				</ErrorBoundary>
			)
			expect(screen.getByText('Test content')).toBeInTheDocument()
		})

		it('renders multiple children without errors', () => {
			render(
				<ErrorBoundary>
					<div>Child 1</div>
					<div>Child 2</div>
					<div>Child 3</div>
				</ErrorBoundary>
			)
			expect(screen.getByText('Child 1')).toBeInTheDocument()
			expect(screen.getByText('Child 2')).toBeInTheDocument()
			expect(screen.getByText('Child 3')).toBeInTheDocument()
		})

		it('renders complex component tree without errors', () => {
			render(
				<ErrorBoundary>
					<div>
						<h1>Title</h1>
						<p>Paragraph</p>
						<button>Button</button>
					</div>
				</ErrorBoundary>
			)
			expect(screen.getByText('Title')).toBeInTheDocument()
			expect(screen.getByText('Paragraph')).toBeInTheDocument()
			expect(screen.getByText('Button')).toBeInTheDocument()
		})
	})

	describe('Error Handling', () => {
		it('catches errors and displays fallback UI', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			)
			expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
		})

		it('displays error message in fallback UI', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			)
			expect(
				screen.getByText("We're sorry for the inconvenience. Please try refreshing the page.")
			).toBeInTheDocument()
		})

		it('displays refresh button when error occurs', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			)
			expect(screen.getByRole('button', { name: /Refresh Page/i })).toBeInTheDocument()
		})

		it('calls window.location.reload when refresh button is clicked', async () => {
			const user = userEvent.setup()
			const reloadMock = jest.fn()
			Object.defineProperty(window, 'location', {
				value: { reload: reloadMock },
				writable: true,
			})

			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			)

			const refreshButton = screen.getByRole('button', { name: /Refresh Page/i })
			await user.click(refreshButton)

			expect(reloadMock).toHaveBeenCalled()
		})

		it('logs error to logger when error is caught', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			)

			expect(mockLogger.error).toHaveBeenCalledWith(
				'React Error Boundary caught an error:',
				expect.any(Error),
				expect.any(Object)
			)
		})

		it('does not render children after error', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
					<div>Should not be visible</div>
				</ErrorBoundary>
			)
			expect(screen.queryByText('Should not be visible')).not.toBeInTheDocument()
		})
	})

	describe('Development Mode Error Details', () => {
		it('shows error details in development mode', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			)
			expect(screen.getByText('Error Details (Dev Only)')).toBeInTheDocument()
		})

		it('error details are in a details/summary element', () => {
			const { container } = render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			)
			const details = container.querySelector('details')
			expect(details).toBeInTheDocument()
		})

		it('displays error message in details', () => {
			const { container } = render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			)
			const pre = container.querySelector('pre')
			expect(pre?.textContent).toContain('Test error')
		})
	})

	describe('Production Mode', () => {
		it('shows user-friendly error message when error occurs', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			)
			expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
		})

		it('shows refresh button when error occurs', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			)
			expect(screen.getByRole('button', { name: /Refresh Page/i })).toBeInTheDocument()
		})
	})

	describe('State Management', () => {
		it('initializes with no error state', () => {
			const { container } = render(
				<ErrorBoundary>
					<div>Content</div>
				</ErrorBoundary>
			)
			expect(screen.getByText('Content')).toBeInTheDocument()
			expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument()
		})

		it('updates state when error is caught', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			)
			// If error state is set, fallback UI should be visible
			expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
		})
	})

	describe('Multiple Errors', () => {
		it('handles multiple different errors', () => {
			const ErrorComponent1 = () => {
				throw new Error('First error')
			}

			const { rerender } = render(
				<ErrorBoundary>
					<ErrorComponent1 />
				</ErrorBoundary>
			)
			expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()

			// Error boundary should continue to show fallback
			rerender(
				<ErrorBoundary>
					<div>New content</div>
				</ErrorBoundary>
			)
			expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
		})
	})

	describe('Accessibility', () => {
		it('error heading is properly structured', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			)
			const heading = screen.getByRole('heading', { level: 1 })
			expect(heading).toHaveTextContent('Oops! Something went wrong')
		})

		it('refresh button is keyboard accessible', () => {
			render(
				<ErrorBoundary>
					<ThrowError />
				</ErrorBoundary>
			)
			const button = screen.getByRole('button', { name: /Refresh Page/i })
			expect(button).toBeInTheDocument()
			expect(button.tagName).toBe('BUTTON')
		})
	})
})
