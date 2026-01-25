import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { robotService } from '../services/robotService'

// Mock the robot service
jest.mock('../services/robotService')

// Mock Leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Polygon: () => <div data-testid="polygon" />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  useMap: () => ({
    fitBounds: jest.fn(),
  }),
}))

describe('App', () => {
  const mockRobots = {
    robots: [
      [34.0412, -118.2501],
      [34.0325, -118.2389],
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    robotService.getRobots.mockResolvedValue(mockRobots)
  })

  it('renders the app header', async () => {
    render(<App />)
    expect(screen.getByText('Serve Robotics - DTLA Visualization')).toBeInTheDocument()
  })

  it('fetches and displays robots on mount', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(robotService.getRobots).toHaveBeenCalled()
    })
  })

  it('handles move robots action', async () => {
    const user = userEvent.setup()
    robotService.moveRobots.mockResolvedValue(mockRobots)
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/move all robots/i)).toBeInTheDocument()
    })
    
    const moveButton = screen.getByText('Move Robots')
    await user.click(moveButton)
    
    await waitFor(() => {
      expect(robotService.moveRobots).toHaveBeenCalled()
    })
  })

  it('handles reset robots action', async () => {
    const user = userEvent.setup()
    robotService.resetRobots.mockResolvedValue(mockRobots)
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Reset Robots')).toBeInTheDocument()
    })
    
    const resetButton = screen.getByText('Reset Robots')
    await user.click(resetButton)
    
    await waitFor(() => {
      expect(robotService.resetRobots).toHaveBeenCalled()
    })
  })

  it('displays error message when API fails', async () => {
    robotService.getRobots.mockRejectedValue(new Error('Network error'))
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })

  it('toggles auto-refresh', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/auto-refresh map/i)).toBeInTheDocument()
    })
    
    const checkbox = screen.getByLabelText(/auto-refresh map/i)
    expect(checkbox).toBeChecked()
    
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })
})
