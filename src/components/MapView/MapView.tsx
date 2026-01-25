import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet'
import { memo, useEffect } from 'react'
import RobotMarker from '../RobotMarker/RobotMarker'
import 'leaflet/dist/leaflet.css'
import './MapView.css'

type Position = [number, number]
type LatLngTuple = [number, number]

interface MapViewProps {
	robots: Position[]
	center: LatLngTuple
	loading: boolean
}

// DTLA polygon boundary (same as backend)
const DTLA_POLYGON: LatLngTuple[] = [
	[34.055, -118.275],
	[34.055, -118.225],
	[34.02, -118.225],
	[34.02, -118.275],
]

// Component to fit map to bounds
function MapBounds() {
	const map = useMap()

	useEffect(() => {
		map.fitBounds(DTLA_POLYGON)
	}, [map])

	return null
}

const MapView = memo<MapViewProps>(({ robots, center, loading }) => {
	return (
		<div className="map-view" aria-label="Interactive map showing robot positions">
			<MapContainer
				center={center}
				zoom={13}
				scrollWheelZoom={true}
				className="leaflet-container"
				aria-label="Map of Downtown Los Angeles"
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{/* DTLA Boundary Polygon */}
				<Polygon
					positions={DTLA_POLYGON}
					pathOptions={{
						color: '#646cff',
						weight: 3,
						opacity: 0.8,
						fillOpacity: 0.1,
					}}
				/>

				{/* Robot Markers */}
				{robots.map((position, index) => (
					<RobotMarker key={`robot-${index}`} position={position} robotId={index + 1} />
				))}

				<MapBounds />
			</MapContainer>

			{loading && (
				<div className="loading-overlay" aria-live="polite" aria-busy="true">
					<div className="spinner" role="status">
						<span className="sr-only">Loading robots...</span>
					</div>
				</div>
			)}

			{!loading && robots.length === 0 && (
				<div className="no-robots-message" role="status">
					<p>No robots found. Try resetting to add robots.</p>
				</div>
			)}
		</div>
	)
})

MapView.displayName = 'MapView'

export default MapView
