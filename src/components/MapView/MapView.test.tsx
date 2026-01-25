import { render, screen } from '@testing-library/react'
import MapView from './MapView'

// Mock react-leaflet components
jest.mock('react-leaflet', () => ({
	MapContainer: ({ children, center, zoom, scrollWheelZoom, className, ...props }: any) => (
		<div
			data-testid="map-container"
			data-center={center.join(',')}
			data-zoom={zoom}
			data-scroll-wheel-zoom={scrollWheelZoom?.toString()}
			className={className}
			{...props}
		>
			{children}
		</div>
	),
	TileLayer: ({ attribution, url, ...props }: any) => (
		<div
			data-testid="tile-layer"
			data-attribution={attribution}
			data-url={url}
			{...props}
		/>
	),
	Polygon: ({ positions, pathOptions, ...props }: any) => (
		<div
			data-testid="polygon"
			data-positions={JSON.stringify(positions)}
			data-path-options={JSON.stringify(pathOptions)}
			{...props}
		/>
	),
	useMap: jest.fn(() => ({
		fitBounds: jest.fn(),
	})),
}))

// Mock RobotMarker component
jest.mock('../RobotMarker/RobotMarker', () => ({
	__esModule: true,
	default: ({ position, robotId }: any) => (
		<div data-testid={`robot-marker-${robotId}`} data-position={JSON.stringify(position)} />
	),
}))

describe('MapView', () => {
	const defaultProps = {
		robots: [] as [number, number][],
		center: [34.0375, -118.25] as [number, number],
		loading: false,
	}

	describe('Map Container', () => {
		it('renders map container', () => {
			render(<MapView {...defaultProps} />)
			expect(screen.getByTestId('map-container')).toBeInTheDocument()
		})

		it('renders with correct center coordinates', () => {
			render(<MapView {...defaultProps} center={[34.05, -118.26]} />)
			const mapContainer = screen.getByTestId('map-container')
			expect(mapContainer).toHaveAttribute('data-center', '34.05,-118.26')
		})

		it('renders with correct zoom level', () => {
			render(<MapView {...defaultProps} />)
			const mapContainer = screen.getByTestId('map-container')
			expect(mapContainer).toHaveAttribute('data-zoom', '13')
		})

		it('enables scroll wheel zoom', () => {
			render(<MapView {...defaultProps} />)
			const mapContainer = screen.getByTestId('map-container')
			expect(mapContainer).toHaveAttribute('data-scroll-wheel-zoom', 'true')
		})

		it('has correct aria-label', () => {
			render(<MapView {...defaultProps} />)
			const mapContainer = screen.getByTestId('map-container')
			expect(mapContainer).toHaveAttribute('aria-label', 'Map of Downtown Los Angeles')
		})
	})

	describe('Tile Layer', () => {
		it('renders tile layer', () => {
			render(<MapView {...defaultProps} />)
			expect(screen.getByTestId('tile-layer')).toBeInTheDocument()
		})

		it('has correct tile URL', () => {
			render(<MapView {...defaultProps} />)
			const tileLayer = screen.getByTestId('tile-layer')
			expect(tileLayer).toHaveAttribute(
				'data-url',
				'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			)
		})

		it('has OpenStreetMap attribution', () => {
			render(<MapView {...defaultProps} />)
			const tileLayer = screen.getByTestId('tile-layer')
			const attribution = tileLayer.getAttribute('data-attribution')
			expect(attribution).toContain('OpenStreetMap')
		})
	})

	describe('DTLA Polygon Boundary', () => {
		it('renders polygon boundary', () => {
			render(<MapView {...defaultProps} />)
			expect(screen.getByTestId('polygon')).toBeInTheDocument()
		})

		it('has correct polygon positions', () => {
			render(<MapView {...defaultProps} />)
			const polygon = screen.getByTestId('polygon')
			const positions = polygon.getAttribute('data-positions')
			expect(positions).toBeTruthy()
			expect(positions).toContain('34.055')
			expect(positions).toContain('-118.275')
		})
	})

	describe('Robot Markers', () => {
		it('renders no robot markers when robots array is empty', () => {
			render(<MapView {...defaultProps} robots={[]} />)
			expect(screen.queryByTestId(/robot-marker-/)).not.toBeInTheDocument()
		})

		it('renders single robot marker', () => {
			const robots: [number, number][] = [[34.05, -118.25]]
			render(<MapView {...defaultProps} robots={robots} />)
			expect(screen.getByTestId('robot-marker-1')).toBeInTheDocument()
		})

		it('renders multiple robot markers', () => {
			const robots: [number, number][] = [
				[34.05, -118.25],
				[34.03, -118.26],
				[34.04, -118.24],
			]
			render(<MapView {...defaultProps} robots={robots} />)
			
			expect(screen.getByTestId('robot-marker-1')).toBeInTheDocument()
			expect(screen.getByTestId('robot-marker-2')).toBeInTheDocument()
			expect(screen.getByTestId('robot-marker-3')).toBeInTheDocument()
		})

		it('passes correct position to robot markers', () => {
			const robots: [number, number][] = [
				[34.05, -118.25],
				[34.03, -118.26],
			]
			render(<MapView {...defaultProps} robots={robots} />)
			
			const marker1 = screen.getByTestId('robot-marker-1')
			const marker2 = screen.getByTestId('robot-marker-2')
			
			expect(marker1).toHaveAttribute('data-position', JSON.stringify([34.05, -118.25]))
			expect(marker2).toHaveAttribute('data-position', JSON.stringify([34.03, -118.26]))
		})

		it('updates robot markers when robots prop changes', () => {
			const { rerender } = render(<MapView {...defaultProps} robots={[]} />)
			expect(screen.queryByTestId(/robot-marker-/)).not.toBeInTheDocument()

			const robots: [number, number][] = [[34.05, -118.25]]
			rerender(<MapView {...defaultProps} robots={robots} />)
			expect(screen.getByTestId('robot-marker-1')).toBeInTheDocument()
		})
	})

	describe('Loading State', () => {
		it('renders map when loading is false', () => {
			render(<MapView {...defaultProps} loading={false} />)
			expect(screen.getByTestId('map-container')).toBeInTheDocument()
		})

		it('renders map when loading is true', () => {
			render(<MapView {...defaultProps} loading={true} />)
			expect(screen.getByTestId('map-container')).toBeInTheDocument()
		})
	})

	describe('Accessibility', () => {
		it('has aria-label on map view container', () => {
			const { container } = render(<MapView {...defaultProps} />)
			const mapView = container.querySelector('.map-view')
			expect(mapView).toHaveAttribute('aria-label', 'Interactive map showing robot positions')
		})
	})

	describe('Memoization', () => {
		it('does not re-render when props remain the same', () => {
			const robots: [number, number][] = [[34.05, -118.25]]
			const { rerender } = render(<MapView {...defaultProps} robots={robots} />)
			const initialMarker = screen.getByTestId('robot-marker-1')

			// Re-render with same props
			rerender(<MapView {...defaultProps} robots={robots} />)
			const afterRerender = screen.getByTestId('robot-marker-1')

			// Component should be memoized (same instance)
			expect(afterRerender).toBe(initialMarker)
		})
	})
})
