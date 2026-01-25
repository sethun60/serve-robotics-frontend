import './StatusBar.css'

function StatusBar({ robotCount, lastUpdate, autoRefresh }) {
  const formatTime = (date) => {
    if (!date) return 'Never'
    return date.toLocaleTimeString()
  }

  return (
    <footer className="status-bar" role="contentinfo" aria-label="Application status">
      <div className="status-item">
        <span className="status-label">Robots:</span>
        <span className="status-value" aria-live="polite">{robotCount}</span>
      </div>
      
      <div className="status-item">
        <span className="status-label">Last Update:</span>
        <span className="status-value" aria-live="polite">
          {formatTime(lastUpdate)}
        </span>
      </div>
      
      <div className="status-item">
        <span className="status-label">Auto-refresh:</span>
        <span 
          className={`status-indicator ${autoRefresh ? 'active' : 'inactive'}`}
          aria-label={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
        >
          {autoRefresh ? '● On' : '○ Off'}
        </span>
      </div>
    </footer>
  )
}

export default StatusBar
