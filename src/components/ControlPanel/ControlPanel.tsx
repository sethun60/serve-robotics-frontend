import { useState } from 'react'
import './ControlPanel.css'

interface ControlPanelProps {
	onMove: (meters: number) => void
	onReset: (count: number) => void
	onStartAuto: (meters: number, intervalMs: number) => void
	onStopAuto: () => void
	autoRefresh: boolean
	onAutoRefreshToggle: (enabled: boolean) => void
	refreshInterval: number
	onRefreshIntervalChange: (interval: number) => void
	robotCount: number
	loading: boolean
}

function ControlPanel({
	onMove,
	onReset,
	onStartAuto,
	onStopAuto,
	autoRefresh,
	onAutoRefreshToggle,
	refreshInterval,
	onRefreshIntervalChange,
	robotCount,
	loading,
}: ControlPanelProps) {
	const [moveMeters, setMoveMeters] = useState('10')
	const [resetCount, setResetCount] = useState('20')
	const [autoMeters, setAutoMeters] = useState('1')
	const [autoInterval, setAutoInterval] = useState('60000')
	const [refreshIntervalInput, setRefreshIntervalInput] = useState(String(refreshInterval))
	
	// Validation error states
	const [moveMetersError, setMoveMetersError] = useState('')
	const [resetCountError, setResetCountError] = useState('')
	const [autoMetersError, setAutoMetersError] = useState('')
	const [autoIntervalError, setAutoIntervalError] = useState('')
	const [refreshIntervalError, setRefreshIntervalError] = useState('')

	const handleResetCountChange = (value: string) => {
		setResetCount(value)
		const numValue = Number(value)
		if (value === '' || isNaN(numValue) || numValue < 1) {
			setResetCountError('Robot count must be at least 1')
		} else if (numValue > 25) {
			setResetCountError('Robot count cannot exceed 25')
		} else {
			setResetCountError('')
		}
	}

	const handleMoveMetersChange = (value: string) => {
		setMoveMeters(value)
		const numValue = Number(value)
		if (value === '' || isNaN(numValue) || numValue < 1) {
			setMoveMetersError('Move distance must be at least 1 meter')
		} else if (numValue > 1000) {
			setMoveMetersError('Move distance cannot exceed 1000 meters')
		} else {
			setMoveMetersError('')
		}
	}

	const handleAutoMetersChange = (value: string) => {
		setAutoMeters(value)
		const numValue = Number(value)
		if (value === '' || isNaN(numValue) || numValue < 1) {
			setAutoMetersError('Move distance must be at least 1 meter')
		} else if (numValue > 500) {
			setAutoMetersError('Move distance cannot exceed 500 meters')
		} else {
			setAutoMetersError('')
		}
	}

	const handleAutoIntervalChange = (value: string) => {
		setAutoInterval(value)
		const numValue = Number(value)
		if (value === '' || isNaN(numValue) || numValue < 1000) {
			setAutoIntervalError('Interval must be at least 1000ms (1 second)')
		} else if (numValue > 300000) {
			setAutoIntervalError('Interval cannot exceed 300000ms (5 minutes)')
		} else {
			setAutoIntervalError('')
		}
	}

	const handleRefreshIntervalChange = (value: string) => {
		setRefreshIntervalInput(value)
		const numValue = Number(value)
		if (value === '' || isNaN(numValue) || numValue < 1000) {
			setRefreshIntervalError('Refresh interval must be at least 1000ms (1 second)')
		} else if (numValue > 60000) {
			setRefreshIntervalError('Refresh interval cannot exceed 60000ms (1 minute)')
		} else {
			setRefreshIntervalError('')
			onRefreshIntervalChange(numValue)
		}
	}

	const hasAutoErrors = !!autoMetersError || !!autoIntervalError

  return (
    <div className="control-panel">
      <section className="control-section" aria-labelledby="manual-controls">
        <h2 id="manual-controls">Manual Controls</h2>
        
        <div className="control-group">
          <label htmlFor="move-meters">
            Move Distance (meters)
            <input
              id="move-meters"
              type="number"
              min="1"
              max="1000"
              value={moveMeters}
              onChange={(e) => handleMoveMetersChange(e.target.value)}
              disabled={loading}
              aria-describedby="move-meters-hint"
              className={moveMetersError ? 'error' : ''}
            />
          </label>
          {moveMetersError ? (
            <small className="error-message" role="alert">{moveMetersError}</small>
          ) : (
            <small id="move-meters-hint" className="hint">
              Distance robots will move (1-1000m)
            </small>
          )}
          <button
            onClick={() => onMove(Number(moveMeters))}
            disabled={loading || !!moveMetersError}
            aria-label={`Move all robots ${moveMeters} meters`}
          >
            Move Robots
          </button>
        </div>

        <div className="control-group">
          <label htmlFor="reset-count">
            Robot Count
            <input
              id="reset-count"
              type="number"
              min="1"
              max="25"
              value={resetCount}
              onChange={(e) => handleResetCountChange(e.target.value)}
              disabled={loading}
              aria-describedby="reset-count-hint"
              className={resetCountError ? 'error' : ''}
            />
          </label>
          {resetCountError ? (
            <small className="error-message" role="alert">{resetCountError}</small>
          ) : (
            <small id="reset-count-hint" className="hint">
              Number of robots to spawn (max 25)
            </small>
          )}
          <button
            onClick={() => onReset(Number(resetCount))}
            disabled={loading || !!resetCountError}
            className="reset-btn"
            aria-label={`Reset to ${resetCount} robots`}
          >
            Reset Robots
          </button>
        </div>
      </section>

      <section className="control-section" aria-labelledby="auto-controls">
        <h2 id="auto-controls">Backend Auto-Movement</h2>
        
        <div className="control-group">
          <label htmlFor="auto-meters">
            Move Distance (meters)
            <input
              id="auto-meters"
              type="number"
              min="1"
              max="500"
              value={autoMeters}
              onChange={(e) => handleAutoMetersChange(e.target.value)}
              disabled={loading}
              className={autoMetersError ? 'error' : ''}
            />
          </label>
          {autoMetersError && (
            <small className="error-message" role="alert">{autoMetersError}</small>
          )}
          
          <label htmlFor="auto-interval">
            Interval (ms)
            <input
              id="auto-interval"
              type="number"
              min="1000"
              max="300000"
              step="1000"
              value={autoInterval}
              onChange={(e) => handleAutoIntervalChange(e.target.value)}
              disabled={loading}
              className={autoIntervalError ? 'error' : ''}
            />
          </label>
          {autoIntervalError ? (
            <small className="error-message" role="alert">{autoIntervalError}</small>
          ) : (
            <small className="hint">
              {(Number(autoInterval) / 1000).toFixed(0)} seconds between moves
            </small>
          )}
          
          <div className="button-group">
            <button
              onClick={() => onStartAuto(Number(autoMeters), Number(autoInterval))}
              disabled={loading || hasAutoErrors}
              className="start-btn"
              aria-label="Start automatic robot movement"
            >
              Start Auto
            </button>
            <button
              onClick={onStopAuto}
              disabled={loading}
              className="stop-btn"
              aria-label="Stop automatic robot movement"
            >
              Stop Auto
            </button>
          </div>
        </div>
      </section>

      <section className="control-section" aria-labelledby="ui-settings">
        <h2 id="ui-settings">UI Settings</h2>
        
        <div className="control-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => onAutoRefreshToggle(e.target.checked)}
              aria-describedby="auto-refresh-hint"
            />
            <span>Auto-refresh Map</span>
          </label>
          <small id="auto-refresh-hint" className="hint">
            Automatically fetch latest positions
          </small>
          
          {autoRefresh && (
            <>
              <label htmlFor="refresh-interval">
                Refresh Interval (ms)
                <input
                  id="refresh-interval"
                  type="number"
                  min="1000"
                  max="60000"
                  step="1000"
                  value={refreshIntervalInput}
                  onChange={(e) => handleRefreshIntervalChange(e.target.value)}
                  className={refreshIntervalError ? 'error' : ''}
                />
              </label>
              {refreshIntervalError ? (
                <small className="error-message" role="alert">{refreshIntervalError}</small>
              ) : (
                <small className="hint">
                  {(refreshInterval / 1000).toFixed(0)} seconds
                </small>
              )}
            </>
          )}
        </div>
      </section>

      <div className="info-panel" role="status" aria-live="polite">
        <strong>Current Robots:</strong> {robotCount}
      </div>
    </div>
  )
}

export default ControlPanel
