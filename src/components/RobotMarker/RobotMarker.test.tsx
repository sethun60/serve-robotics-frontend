import { render, screen } from '@testing-library/react'
import RobotMarker from './RobotMarker'

// Mock react-leaflet components
jest.mock('react-leaflet', () => ({
	Marker: ({ children, position, icon, ...props }: any) => (
		<div
			data-testid="marker"
			data-position={JSON.stringify(position)}
			data-icon={icon ? 'custom-icon' : 'default-icon'}
			{...props}
		>
			{children}
		</div>
	),
	Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
}))

// Mock leaflet
jest.mock('leaflet', () => ({
	divIcon: jest.fn((config) => ({ ...config, type: 'divIcon' })),
}))

describe('RobotMarker', () => {
	describe('Marker Rendering', () => {
		it('renders marker with correct position', () => {
			const position: [number, number] = [34.05, -118.25]
			render(<RobotMarker position={position} robotId={1} />)
			
			const marker = screen.getByTestId('marker')
			expect(marker).toHaveAttribute('data-position', JSON.stringify([34.05, -118.25]))
		})

		it('renders marker with custom icon', () => {
			render(<RobotMarker position={[34.05, -118.25]} robotId={1} />)
			
			const marker = screen.getByTestId('marker')
			expect(marker).toHaveAttribute('data-icon', 'custom-icon')
		})

		it('renders marker with correct aria-label', () => {
			render(<RobotMarker position={[34.05, -118.25]} robotId={5} />)
			
			const marker = screen.getByTestId('marker')
			const ariaLabel = marker.getAttribute('aria-label')
			expect(ariaLabel).toContain('Robot 5')
			expect(ariaLabel).toContain('34.0500')
			expect(ariaLabel).toContain('-118.2500')
		})
	})

	describe('Position Validation', () => {
		it('renders null when position is null', () => {
			const { container } = render(
				<RobotMarker position={null as any} robotId={1} />
			)
			expect(container.firstChild).toBeNull()
		})

		it('renders null when position is undefined', () => {
			const { container } = render(
				<RobotMarker position={undefined as any} robotId={1} />
			)
			expect(container.firstChild).toBeNull()
		})

		it('renders null when position is not an array', () => {
			const { container } = render(
				<RobotMarker position={{ lat: 34.05, lng: -118.25 } as any} robotId={1} />
			)
			expect(container.firstChild).toBeNull()
		})

		it('renders null when position has only one element', () => {
			const { container } = render(
				<RobotMarker position={[34.05] as any} robotId={1} />
			)
			expect(container.firstChild).toBeNull()
		})

		it('renders null when position has more than two elements', () => {
			const { container } = render(
				<RobotMarker position={[34.05, -118.25, 100] as any} robotId={1} />
			)
			expect(container.firstChild).toBeNull()
		})

		it('renders correctly when position has exactly two elements', () => {
			render(<RobotMarker position={[34.05, -118.25]} robotId={1} />)
			expect(screen.getByTestId('marker')).toBeInTheDocument()
		})
	})

	describe('Popup Content', () => {
		it('renders popup', () => {
			render(<RobotMarker position={[34.05, -118.25]} robotId={1} />)
			expect(screen.getByTestId('popup')).toBeInTheDocument()
		})

		it('displays robot ID in popup', () => {
			render(<RobotMarker position={[34.05, -118.25]} robotId={7} />)
			expect(screen.getByText('Robot #7')).toBeInTheDocument()
		})

		it('displays latitude in popup with 6 decimal places', () => {
			render(<RobotMarker position={[34.123456, -118.25]} robotId={1} />)
			expect(screen.getByText(/Lat: 34\.123456/)).toBeInTheDocument()
		})

		it('displays longitude in popup with 6 decimal places', () => {
			render(<RobotMarker position={[34.05, -118.654321]} robotId={1} />)
			expect(screen.getByText(/Lng: -118\.654321/)).toBeInTheDocument()
		})

		it('displays both coordinates correctly', () => {
			render(<RobotMarker position={[34.056789, -118.234567]} robotId={1} />)
			
			expect(screen.getByText(/Lat: 34\.056789/)).toBeInTheDocument()
			expect(screen.getByText(/Lng: -118\.234567/)).toBeInTheDocument()
		})
	})

	describe('Different Robot IDs', () => {
		it('renders marker for robot ID 0', () => {
			render(<RobotMarker position={[34.05, -118.25]} robotId={0} />)
			expect(screen.getByText('Robot #0')).toBeInTheDocument()
		})

		it('renders marker for large robot ID', () => {
			render(<RobotMarker position={[34.05, -118.25]} robotId={9999} />)
			expect(screen.getByText('Robot #9999')).toBeInTheDocument()
		})

		it('updates robot ID when prop changes', () => {
			const { rerender } = render(
				<RobotMarker position={[34.05, -118.25]} robotId={1} />
			)
			expect(screen.getByText('Robot #1')).toBeInTheDocument()

			rerender(<RobotMarker position={[34.05, -118.25]} robotId={5} />)
			expect(screen.getByText('Robot #5')).toBeInTheDocument()
		})
	})

	describe('Position Updates', () => {
		it('updates marker position when position prop changes', () => {
			const { rerender } = render(
				<RobotMarker position={[34.05, -118.25]} robotId={1} />
			)
			const marker = screen.getByTestId('marker')
			expect(marker).toHaveAttribute('data-position', JSON.stringify([34.05, -118.25]))

			rerender(<RobotMarker position={[34.06, -118.26]} robotId={1} />)
			expect(marker).toHaveAttribute('data-position', JSON.stringify([34.06, -118.26]))
		})

		it('updates popup coordinates when position changes', () => {
			const { rerender } = render(
				<RobotMarker position={[34.123456, -118.123456]} robotId={1} />
			)
			expect(screen.getByText(/Lat: 34\.123456/)).toBeInTheDocument()
			expect(screen.getByText(/Lng: -118\.123456/)).toBeInTheDocument()

			rerender(<RobotMarker position={[34.654321, -118.654321]} robotId={1} />)
			expect(screen.getByText(/Lat: 34\.654321/)).toBeInTheDocument()
			expect(screen.getByText(/Lng: -118\.654321/)).toBeInTheDocument()
		})
	})

	describe('Memoization', () => {
		it('has correct displayName for debugging', () => {
			expect(RobotMarker.displayName).toBe('RobotMarker')
		})

		it('does not re-render when props remain the same', () => {
			const position: [number, number] = [34.05, -118.25]
			const { rerender } = render(<RobotMarker position={position} robotId={1} />)
			const initialMarker = screen.getByTestId('marker')

			// Re-render with same props
			rerender(<RobotMarker position={position} robotId={1} />)
			const afterRerender = screen.getByTestId('marker')

			// Should be memoized (same instance)
			expect(afterRerender).toBe(initialMarker)
		})
	})

	describe('Edge Cases', () => {
		it('handles negative latitude', () => {
			render(<RobotMarker position={[-34.05, -118.25]} robotId={1} />)
			expect(screen.getByText(/Lat: -34\.050000/)).toBeInTheDocument()
		})

		it('handles positive longitude', () => {
			render(<RobotMarker position={[34.05, 118.25]} robotId={1} />)
			expect(screen.getByText(/Lng: 118\.250000/)).toBeInTheDocument()
		})

		it('handles zero coordinates', () => {
			render(<RobotMarker position={[0, 0]} robotId={1} />)
			expect(screen.getByText(/Lat: 0\.000000/)).toBeInTheDocument()
			expect(screen.getByText(/Lng: 0\.000000/)).toBeInTheDocument()
		})

		it('handles very small decimal values', () => {
			render(<RobotMarker position={[0.000001, -0.000001]} robotId={1} />)
			expect(screen.getByText(/Lat: 0\.000001/)).toBeInTheDocument()
			expect(screen.getByText(/Lng: -0\.000001/)).toBeInTheDocument()
		})
	})
})
