import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ControlPanel from './ControlPanel'

describe('ControlPanel', () => {
	const defaultProps = {
		onMove: jest.fn(),
		onReset: jest.fn(),
		onStartAuto: jest.fn(),
		onStopAuto: jest.fn(),
		autoRefresh: false,
		onAutoRefreshToggle: jest.fn(),
		refreshInterval: 5000,
		onRefreshIntervalChange: jest.fn(),
		robotCount: 10,
		loading: false,
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('Manual Controls', () => {
		it('renders manual controls section', () => {
			render(<ControlPanel {...defaultProps} />)
			expect(screen.getByText('Manual Controls')).toBeInTheDocument()
		})

		it('renders move distance input with default value', () => {
			render(<ControlPanel {...defaultProps} />)
			const input = document.querySelector('#move-meters') as HTMLInputElement
			expect(input).toHaveValue(10)
		})

		it('updates move distance when input changes', async () => {
			const user = userEvent.setup()
			render(<ControlPanel {...defaultProps} />)
			const input = document.querySelector('#move-meters') as HTMLInputElement
			
			await user.clear(input)
			await user.type(input, '25')
			
			expect(input).toHaveValue(25)
		})

		it('calls onMove with correct distance when Move Robots button is clicked', async () => {
			const user = userEvent.setup()
			const onMove = jest.fn()
			render(<ControlPanel {...defaultProps} onMove={onMove} />)
			
			const input = document.querySelector('#move-meters') as HTMLInputElement
			await user.clear(input)
			await user.type(input, '15')
			
			const button = screen.getByRole('button', { name: /Move all robots 15 meters/i })
			await user.click(button)
			
			expect(onMove).toHaveBeenCalledWith(15)
		})

		it('renders reset count input with default value', () => {
			render(<ControlPanel {...defaultProps} />)
			const input = screen.getByLabelText(/Robot Count/i)
			expect(input).toHaveValue(20)
		})

		it('updates reset count when input changes', async () => {
			const user = userEvent.setup()
			render(<ControlPanel {...defaultProps} />)
			const input = screen.getByLabelText(/Robot Count/i)
			
			await user.clear(input)
			await user.type(input, '30')
			
			expect(input).toHaveValue(30)
		})

		it('calls onReset with correct count when Reset Robots button is clicked', async () => {
			const user = userEvent.setup()
			const onReset = jest.fn()
			render(<ControlPanel {...defaultProps} onReset={onReset} />)
			
			const input = screen.getByLabelText(/Robot Count/i)
			await user.clear(input)
			await user.type(input, '35')
			
			const button = screen.getByRole('button', { name: /Reset to 35 robots/i })
			await user.click(button)
			
			expect(onReset).toHaveBeenCalledWith(35)
		})

		it('disables manual controls when loading', () => {
			render(<ControlPanel {...defaultProps} loading={true} />)
			
			const moveInput = document.querySelector('#move-meters') as HTMLInputElement
			const resetInput = screen.getByLabelText(/Robot Count/i)
			const moveButton = screen.getByRole('button', { name: /Move all robots/i })
			const resetButton = screen.getByRole('button', { name: /Reset to/i })
			
			expect(moveInput).toBeDisabled()
			expect(resetInput).toBeDisabled()
			expect(moveButton).toBeDisabled()
			expect(resetButton).toBeDisabled()
		})
	})

	describe('Auto-Move Controls', () => {
		it('renders auto-move section', () => {
			render(<ControlPanel {...defaultProps} />)
			expect(screen.getByText('Backend Auto-Movement')).toBeInTheDocument()
		})

		it('renders auto-move distance input with default value', () => {
			render(<ControlPanel {...defaultProps} />)
			const input = document.querySelector('#auto-meters') as HTMLInputElement
			expect(input).toHaveValue(1)
		})

		it('renders auto-move interval input with default value', () => {
			render(<ControlPanel {...defaultProps} />)
			const input = screen.getByLabelText(/Interval \(ms\)/i)
			expect(input).toHaveValue(60000)
		})

		it('calls onStartAuto with correct parameters when Start Auto is clicked', async () => {
			const user = userEvent.setup()
			const onStartAuto = jest.fn()
			render(<ControlPanel {...defaultProps} onStartAuto={onStartAuto} />)
			
			const distanceInput = document.querySelector('#auto-meters') as HTMLInputElement
			await user.clear(distanceInput)
			await user.type(distanceInput, '2')
			
			const intervalInput = screen.getByLabelText(/Interval \(ms\)/i)
			await user.clear(intervalInput)
			await user.type(intervalInput, '30000')
			
			const button = screen.getByRole('button', { name: /Start automatic robot movement/i })
			await user.click(button)
			
			expect(onStartAuto).toHaveBeenCalledWith(2, 30000)
		})

		it('calls onStopAuto when Stop Auto is clicked', async () => {
			const user = userEvent.setup()
			const onStopAuto = jest.fn()
			render(<ControlPanel {...defaultProps} onStopAuto={onStopAuto} />)
			
			const button = screen.getByRole('button', { name: /Stop automatic robot movement/i })
			await user.click(button)
			
			expect(onStopAuto).toHaveBeenCalled()
		})

		it('disables auto-move controls when loading', () => {
			render(<ControlPanel {...defaultProps} loading={true} />)
			
			const distanceInput = document.querySelector('#auto-meters') as HTMLInputElement
			const intervalInput = screen.getByLabelText(/Interval \(ms\)/i)
			const startButton = screen.getByRole('button', { name: /Start automatic robot movement/i })
			const stopButton = screen.getByRole('button', { name: /Stop automatic robot movement/i })
			
			expect(distanceInput).toBeDisabled()
			expect(intervalInput).toBeDisabled()
			expect(startButton).toBeDisabled()
			expect(stopButton).toBeDisabled()
		})
	})

	describe('Refresh Settings', () => {
		it('renders refresh settings section', () => {
			render(<ControlPanel {...defaultProps} />)
			expect(screen.getByText('UI Settings')).toBeInTheDocument()
		})

		it('renders auto-refresh checkbox unchecked by default', () => {
			render(<ControlPanel {...defaultProps} autoRefresh={false} />)
			const checkbox = screen.getByRole('checkbox', { name: /Auto-refresh Map/i })
			expect(checkbox).not.toBeChecked()
		})

		it('renders auto-refresh checkbox checked when autoRefresh is true', () => {
			render(<ControlPanel {...defaultProps} autoRefresh={true} />)
			const checkbox = screen.getByRole('checkbox', { name: /Auto-refresh Map/i })
			expect(checkbox).toBeChecked()
		})

		it('calls onAutoRefreshToggle when checkbox is clicked', async () => {
			const user = userEvent.setup()
			const onAutoRefreshToggle = jest.fn()
			render(<ControlPanel {...defaultProps} onAutoRefreshToggle={onAutoRefreshToggle} />)
			
			const checkbox = screen.getByRole('checkbox', { name: /Auto-refresh Map/i })
			await user.click(checkbox)
			
			expect(onAutoRefreshToggle).toHaveBeenCalledWith(true)
		})

		it('shows refresh interval input when autoRefresh is true', () => {
			render(<ControlPanel {...defaultProps} autoRefresh={true} refreshInterval={3000} />)
			const input = screen.getByLabelText(/Refresh Interval \(ms\)/i)
			expect(input).toHaveValue(3000)
		})

		it('hides refresh interval input when autoRefresh is false', () => {
			render(<ControlPanel {...defaultProps} autoRefresh={false} />)
			const input = screen.queryByLabelText(/Refresh Interval \(ms\)/i)
			expect(input).not.toBeInTheDocument()
		})

		it('calls onRefreshIntervalChange when interval input changes', async () => {
			const user = userEvent.setup()
			const onRefreshIntervalChange = jest.fn()
			const { container } = render(<ControlPanel {...defaultProps} autoRefresh={true} refreshInterval={3000} onRefreshIntervalChange={onRefreshIntervalChange} />)
			
			const input = container.querySelector('#refresh-interval') as HTMLInputElement
			
			// Simulate user changing the value by clicking and typing
			await user.click(input)
			await user.keyboard('{Backspace}{Backspace}{Backspace}{Backspace}8000')
			
			// Verify the function was called
			expect(onRefreshIntervalChange).toHaveBeenCalled()
		})

		it('does not disable checkbox when loading', () => {
			render(<ControlPanel {...defaultProps} loading={true} />)
			
			const checkbox = screen.getByRole('checkbox', { name: /Auto-refresh Map/i })
			expect(checkbox).not.toBeDisabled()
		})
	})

	describe('Robot Count Display', () => {
		it('displays correct robot count', () => {
			render(<ControlPanel {...defaultProps} robotCount={25} />)
			expect(screen.getByText(/Current Robots:/)).toBeInTheDocument()
			expect(screen.getByText('25')).toBeInTheDocument()
		})

		it('updates robot count when prop changes', () => {
			const { rerender } = render(<ControlPanel {...defaultProps} robotCount={10} />)
			expect(screen.getByText('10')).toBeInTheDocument()
			
			rerender(<ControlPanel {...defaultProps} robotCount={50} />)
			expect(screen.getByText('50')).toBeInTheDocument()
		})
	})
})
