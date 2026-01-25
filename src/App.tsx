import { useState, useEffect, useCallback } from 'react'
import MapView from './components/MapView/MapView'
import ControlPanel from './components/ControlPanel/ControlPanel'
import StatusBar from './components/StatusBar/StatusBar'
import { robotService } from './services/robotService'
import { logger } from './services/logger'
import './App.css'

type Position = [number, number]
type LatLngTuple = [number, number]

const MAP_CENTER: LatLngTuple = [34.0375, -118.25]

function App() {
	const [robots, setRobots] = useState<Position[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [autoRefresh, setAutoRefresh] = useState<boolean>(true)
	const [refreshInterval, setRefreshInterval] = useState<number>(5000) // 5 seconds
	const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

	// Fetch robots with error handling and caching
	const fetchRobots = useCallback(async (showLoading = true) => {
		try {
			if (showLoading) setLoading(true)
			setError(null)

			const data = await robotService.getRobots()
			setRobots(data.robots)
			setLastUpdate(new Date())
			logger.info(`Fetched ${data.robots.length} robots`)
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Failed to fetch robots'
			setError(errorMsg)
			logger.error('Error fetching robots:', err)
		} finally {
			setLoading(false)
		}
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchRobots()
  }, [fetchRobots])

  // Auto-refresh polling
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchRobots(false) // Don't show loading spinner for auto-refresh
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchRobots])

	// Move robots
	const handleMove = useCallback(async (meters: number) => {
		try {
			const data = await robotService.moveRobots(meters)
			setRobots(data.robots)
			setLastUpdate(new Date())
			logger.info(`Moved robots ${meters} meters`)
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Failed to move robots'
			setError(errorMsg)
			logger.error('Error moving robots:', err)
		}
	}, [])

	// Reset robots
	const handleReset = useCallback(async (count: number) => {
		try {
			const data = await robotService.resetRobots(count)
			setRobots(data.robots)
			setLastUpdate(new Date())
			logger.info(`Reset to ${data.robots.length} robots`)
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Failed to reset robots'
			setError(errorMsg)
			logger.error('Error resetting robots:', err)
		}
	}, [])

	// Start auto-movement on backend
	const handleStartAuto = useCallback(async (meters: number, intervalMs: number) => {
		try {
			await robotService.startAutoMove(meters, intervalMs)
			logger.info(`Started auto-movement: ${meters}m every ${intervalMs}ms`)
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Failed to start auto-movement'
			setError(errorMsg)
			logger.error('Error starting auto-movement:', err)
		}
	}, [])

	// Stop auto-movement on backend
	const handleStopAuto = useCallback(async () => {
		try {
			await robotService.stopAutoMove()
			logger.info('Stopped auto-movement')
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Failed to stop auto-movement'
			setError(errorMsg)
			logger.error('Error stopping auto-movement:', err)
		}
	}, [])

  return (
    <div className="app" role="main">
      <header className="app-header">
        <h1>Serve Robotics - DTLA Visualization</h1>
        <p className="sr-only">
          Real-time visualization of robot movements in Downtown Los Angeles
        </p>
      </header>

      <div className="app-content">
        <aside className="sidebar" aria-label="Robot controls">
          <ControlPanel
            onMove={handleMove}
            onReset={handleReset}
            onStartAuto={handleStartAuto}
            onStopAuto={handleStopAuto}
            autoRefresh={autoRefresh}
            onAutoRefreshToggle={setAutoRefresh}
            refreshInterval={refreshInterval}
            onRefreshIntervalChange={setRefreshInterval}
            robotCount={robots.length}
            loading={loading}
          />
        </aside>

        <main className="map-container" aria-label="Robot map visualization">
          {error && (
            <div className="error-banner" role="alert" aria-live="polite">
              <strong>Error:</strong> {error}
              <button 
                onClick={() => setError(null)} 
                aria-label="Dismiss error"
                className="dismiss-btn"
              >
                ×
              </button>
            </div>
          )}
          
          <MapView 
            robots={robots} 
            center={MAP_CENTER} 
            loading={loading}
          />
        </main>
      </div>

      <StatusBar 
        robotCount={robots.length}
        lastUpdate={lastUpdate}
        autoRefresh={autoRefresh}
      />
    </div>
  )
}

export default App
