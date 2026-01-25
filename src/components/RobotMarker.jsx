import { Marker, Popup } from 'react-leaflet'
import { memo, useMemo } from 'react'
import L from 'leaflet'

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom robot icon
const createRobotIcon = (robotId) => {
  return L.divIcon({
    className: 'robot-marker',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background-color: #646cff;
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 12px;
        color: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
      ">
        🤖
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  })
}

const RobotMarker = memo(({ position, robotId }) => {
  const icon = useMemo(() => createRobotIcon(robotId), [robotId])
  
  // Validate position
  if (!position || !Array.isArray(position) || position.length !== 2) {
    return null
  }

  const [lat, lng] = position

  return (
    <Marker
      position={[lat, lng]}
      icon={icon}
      aria-label={`Robot ${robotId} at latitude ${lat.toFixed(4)}, longitude ${lng.toFixed(4)}`}
    >
      <Popup>
        <div style={{ minWidth: '150px' }}>
          <strong>Robot #{robotId}</strong>
          <br />
          <small>
            Lat: {lat.toFixed(6)}
            <br />
            Lng: {lng.toFixed(6)}
          </small>
        </div>
      </Popup>
    </Marker>
  )
})

RobotMarker.displayName = 'RobotMarker'

export default RobotMarker
