import { render, screen } from '@testing-library/react'
import StatusBar from './StatusBar'

describe('StatusBar', () => {
	describe('Robot Count Display', () => {
		it('displays robot count', () => {
			render(<StatusBar robotCount={10} lastUpdate={null} autoRefresh={false} />)
			expect(screen.getByText('Robots:')).toBeInTheDocument()
			expect(screen.getByText('10')).toBeInTheDocument()
		})

		it('updates robot count when prop changes', () => {
			const { rerender } = render(
				<StatusBar robotCount={5} lastUpdate={null} autoRefresh={false} />
			)
			expect(screen.getByText('5')).toBeInTheDocument()

			rerender(<StatusBar robotCount={25} lastUpdate={null} autoRefresh={false} />)
			expect(screen.getByText('25')).toBeInTheDocument()
		})

		it('displays zero robot count', () => {
			render(<StatusBar robotCount={0} lastUpdate={null} autoRefresh={false} />)
			expect(screen.getByText('0')).toBeInTheDocument()
		})
	})

	describe('Last Update Display', () => {
		it('displays "Never" when lastUpdate is null', () => {
			render(<StatusBar robotCount={10} lastUpdate={null} autoRefresh={false} />)
			expect(screen.getByText('Last Update:')).toBeInTheDocument()
			expect(screen.getByText('Never')).toBeInTheDocument()
		})

		it('displays formatted time when lastUpdate is provided', () => {
			const testDate = new Date('2026-01-25T14:30:45')
			render(<StatusBar robotCount={10} lastUpdate={testDate} autoRefresh={false} />)
			
			const formattedTime = testDate.toLocaleTimeString()
			expect(screen.getByText(formattedTime)).toBeInTheDocument()
		})

		it('updates time when lastUpdate changes', () => {
			const date1 = new Date('2026-01-25T14:30:00')
			const date2 = new Date('2026-01-25T15:45:00')
			
			const { rerender } = render(
				<StatusBar robotCount={10} lastUpdate={date1} autoRefresh={false} />
			)
			expect(screen.getByText(date1.toLocaleTimeString())).toBeInTheDocument()

			rerender(<StatusBar robotCount={10} lastUpdate={date2} autoRefresh={false} />)
			expect(screen.getByText(date2.toLocaleTimeString())).toBeInTheDocument()
		})

		it('changes from "Never" to time when lastUpdate is set', () => {
			const { rerender } = render(
				<StatusBar robotCount={10} lastUpdate={null} autoRefresh={false} />
			)
			expect(screen.getByText('Never')).toBeInTheDocument()

			const testDate = new Date('2026-01-25T14:30:00')
			rerender(<StatusBar robotCount={10} lastUpdate={testDate} autoRefresh={false} />)
			expect(screen.queryByText('Never')).not.toBeInTheDocument()
			expect(screen.getByText(testDate.toLocaleTimeString())).toBeInTheDocument()
		})
	})

	describe('Auto-refresh Indicator', () => {
		it('displays "Off" when autoRefresh is false', () => {
			render(<StatusBar robotCount={10} lastUpdate={null} autoRefresh={false} />)
			expect(screen.getByText('Auto-refresh:')).toBeInTheDocument()
			expect(screen.getByText('○ Off')).toBeInTheDocument()
		})

		it('displays "On" when autoRefresh is true', () => {
			render(<StatusBar robotCount={10} lastUpdate={null} autoRefresh={true} />)
			expect(screen.getByText('● On')).toBeInTheDocument()
		})

		it('has active class when autoRefresh is true', () => {
			render(<StatusBar robotCount={10} lastUpdate={null} autoRefresh={true} />)
			const indicator = screen.getByText('● On')
			expect(indicator).toHaveClass('active')
		})

		it('has inactive class when autoRefresh is false', () => {
			render(<StatusBar robotCount={10} lastUpdate={null} autoRefresh={false} />)
			const indicator = screen.getByText('○ Off')
			expect(indicator).toHaveClass('inactive')
		})

		it('toggles indicator when autoRefresh changes', () => {
			const { rerender } = render(
				<StatusBar robotCount={10} lastUpdate={null} autoRefresh={false} />
			)
			expect(screen.getByText('○ Off')).toBeInTheDocument()

			rerender(<StatusBar robotCount={10} lastUpdate={null} autoRefresh={true} />)
			expect(screen.getByText('● On')).toBeInTheDocument()
		})

		it('has correct aria-label when autoRefresh is enabled', () => {
			render(<StatusBar robotCount={10} lastUpdate={null} autoRefresh={true} />)
			const indicator = screen.getByLabelText('Auto-refresh enabled')
			expect(indicator).toBeInTheDocument()
		})

		it('has correct aria-label when autoRefresh is disabled', () => {
			render(<StatusBar robotCount={10} lastUpdate={null} autoRefresh={false} />)
			const indicator = screen.getByLabelText('Auto-refresh disabled')
			expect(indicator).toBeInTheDocument()
		})
	})

	describe('Accessibility', () => {
		it('has contentinfo role', () => {
			const { container } = render(
				<StatusBar robotCount={10} lastUpdate={null} autoRefresh={false} />
			)
			const footer = container.querySelector('footer')
			expect(footer).toHaveAttribute('role', 'contentinfo')
		})

		it('has aria-label for status bar', () => {
			const { container } = render(
				<StatusBar robotCount={10} lastUpdate={null} autoRefresh={false} />
			)
			const footer = container.querySelector('footer')
			expect(footer).toHaveAttribute('aria-label', 'Application status')
		})

		it('has live region for robot count', () => {
			render(<StatusBar robotCount={10} lastUpdate={null} autoRefresh={false} />)
			const robotCountValue = screen.getByText('10')
			expect(robotCountValue).toHaveAttribute('aria-live', 'polite')
		})

		it('has live region for last update', () => {
			const testDate = new Date('2026-01-25T14:30:00')
			render(<StatusBar robotCount={10} lastUpdate={testDate} autoRefresh={false} />)
			const lastUpdateValue = screen.getByText(testDate.toLocaleTimeString())
			expect(lastUpdateValue).toHaveAttribute('aria-live', 'polite')
		})
	})

	describe('Integration', () => {
		it('displays all three status items together', () => {
			const testDate = new Date('2026-01-25T14:30:00')
			render(<StatusBar robotCount={15} lastUpdate={testDate} autoRefresh={true} />)
			
			expect(screen.getByText('15')).toBeInTheDocument()
			expect(screen.getByText(testDate.toLocaleTimeString())).toBeInTheDocument()
			expect(screen.getByText('● On')).toBeInTheDocument()
		})
	})
})
