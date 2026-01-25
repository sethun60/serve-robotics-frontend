import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock logger to avoid import.meta issues
jest.mock('../services/logger', () => ({
	logger: {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		debug: jest.fn(),
	}
}))

import App from '../App'

// Mock the robot service before importing
jest.mock('../services/robotService', () => ({
  robotService: {
    getRobots: jest.fn(),
    moveRobots: jest.fn(),
    resetRobots: jest.fn(),
    startAutoMove: jest.fn(),
    stopAutoMove: jest.fn(),
    clearCache: jest.fn(),
  }
}))

// Mock Leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Polygon: () => <div data-testid="polygon" />,
  Marker: ({ children }: { children: React.ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>,
  useMap: () => ({
    fitBounds: jest.fn(),
  }),
}))

import { robotService } from '../services/robotService'

const mockRobotService = robotService as jest.Mocked<typeof robotService>

describe('App', () => {
  const mockRobots = {
    robots: [
      [34.0412, -118.2501],
      [34.0325, -118.2389],
    ] as [number, number][],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockRobotService.getRobots.mockResolvedValue(mockRobots)
  })

  it('renders the app header', async () => {
    render(<App />)
    expect(screen.getByText('Serve Robotics - DTLA Visualization')).toBeInTheDocument()
    
    // Wait for initial data fetch to complete
    await waitFor(() => {
      expect(mockRobotService.getRobots).toHaveBeenCalled()
    })
  })

  it('fetches and displays robots on mount', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(mockRobotService.getRobots).toHaveBeenCalled()
    })
  })

  it('handles move robots action', async () => {
    const user = userEvent.setup()
    mockRobotService.moveRobots.mockResolvedValue(mockRobots)
    
    render(<App />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(mockRobotService.getRobots).toHaveBeenCalled()
    })
    
    const moveButton = screen.getByText('Move Robots')
    await user.click(moveButton)
    
    // Wait for the move action to complete and state to update
    await waitFor(() => {
      expect(mockRobotService.moveRobots).toHaveBeenCalled()
    })
    
    // Give extra time for all state updates to settle
    await waitFor(() => {
      expect(mockRobotService.moveRobots).toHaveBeenCalledTimes(1)
    })
  })

  it('handles reset robots action', async () => {
    const user = userEvent.setup()
    mockRobotService.resetRobots.mockResolvedValue(mockRobots)
    
    render(<App />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(mockRobotService.getRobots).toHaveBeenCalled()
    })
    
    const resetButton = screen.getByText('Reset Robots')
    await user.click(resetButton)
    
    // Wait for the reset action to complete and state to update
    await waitFor(() => {
      expect(mockRobotService.resetRobots).toHaveBeenCalled()
    })
    
    // Give extra time for all state updates to settle
    await waitFor(() => {
      expect(mockRobotService.resetRobots).toHaveBeenCalledTimes(1)
    })
  })

  it('displays error message when API fails', async () => {
    mockRobotService.getRobots.mockRejectedValue(new Error('Network error'))
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })

  it('toggles auto-refresh', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(mockRobotService.getRobots).toHaveBeenCalled()
    })
    
    const checkbox = screen.getByLabelText(/auto-refresh map/i)
    expect(checkbox).toBeChecked()
    
    await user.click(checkbox)
    
    await waitFor(() => {
      expect(checkbox).not.toBeChecked()
    })
  })
})
