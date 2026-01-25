import { useState } from 'react'
import './ControlPanel.css'

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
  loading
}) {
  const [moveMeters, setMoveMeters] = useState(10)
  const [resetCount, setResetCount] = useState(20)
  const [autoMeters, setAutoMeters] = useState(1)
  const [autoInterval, setAutoInterval] = useState(60000)

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
              max="100"
              value={moveMeters}
              onChange={(e) => setMoveMeters(Number(e.target.value))}
              disabled={loading}
              aria-describedby="move-meters-hint"
            />
          </label>
          <small id="move-meters-hint" className="hint">
            Distance robots will move
          </small>
          <button
            onClick={() => onMove(moveMeters)}
            disabled={loading}
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
              max="100"
              value={resetCount}
              onChange={(e) => setResetCount(Number(e.target.value))}
              disabled={loading}
              aria-describedby="reset-count-hint"
            />
          </label>
          <small id="reset-count-hint" className="hint">
            Number of robots to spawn
          </small>
          <button
            onClick={() => onReset(resetCount)}
            disabled={loading}
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
              max="50"
              value={autoMeters}
              onChange={(e) => setAutoMeters(Number(e.target.value))}
              disabled={loading}
            />
          </label>
          
          <label htmlFor="auto-interval">
            Interval (ms)
            <input
              id="auto-interval"
              type="number"
              min="1000"
              max="300000"
              step="1000"
              value={autoInterval}
              onChange={(e) => setAutoInterval(Number(e.target.value))}
              disabled={loading}
            />
          </label>
          <small className="hint">
            {(autoInterval / 1000).toFixed(0)} seconds between moves
          </small>
          
          <div className="button-group">
            <button
              onClick={() => onStartAuto(autoMeters, autoInterval)}
              disabled={loading}
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
                  value={refreshInterval}
                  onChange={(e) => onRefreshIntervalChange(Number(e.target.value))}
                />
              </label>
              <small className="hint">
                {(refreshInterval / 1000).toFixed(0)} seconds
              </small>
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
