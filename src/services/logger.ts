enum LogLevel {
	ERROR = 0,
	WARN = 1,
	INFO = 2,
	DEBUG = 3,
}

interface LogEntry {
	timestamp: string
	level: LogLevel
	message: string
	args: unknown[]
}

class Logger {
	private level: LogLevel
	private logs: LogEntry[]
	private readonly maxLogs: number

	constructor() {
		this.level = import.meta.env.PROD ? LogLevel.INFO : LogLevel.DEBUG
		this.logs = []
		this.maxLogs = 100
	}

	log(level: LogLevel, message: string, ...args: unknown[]): void {
		if (level > this.level) return

		const timestamp = new Date().toISOString()
		const logEntry: LogEntry = { timestamp, level, message, args }

		// Store in memory
		this.logs.push(logEntry)
		if (this.logs.length > this.maxLogs) {
			this.logs.shift()
		}

		// Console output
		const prefix = `[${timestamp}]`
		switch (level) {
			case LogLevel.ERROR:
				console.error(prefix, message, ...args)
				break
			case LogLevel.WARN:
				console.warn(prefix, message, ...args)
				break
			case LogLevel.INFO:
				console.info(prefix, message, ...args)
				break
			case LogLevel.DEBUG:
				console.debug(prefix, message, ...args)
				break
		}

		// In production, you could send errors to a monitoring service
		if (level === LogLevel.ERROR && import.meta.env.PROD) {
			// TODO: Send to monitoring service (e.g., Sentry, LogRocket)
			// this.sendToMonitoring(logEntry)
		}
	}

	error(message: string, ...args: unknown[]): void {
		this.log(LogLevel.ERROR, message, ...args)
	}

	warn(message: string, ...args: unknown[]): void {
		this.log(LogLevel.WARN, message, ...args)
	}

	info(message: string, ...args: unknown[]): void {
		this.log(LogLevel.INFO, message, ...args)
	}

	debug(message: string, ...args: unknown[]): void {
		this.log(LogLevel.DEBUG, message, ...args)
	}

	getLogs(): LogEntry[] {
		return [...this.logs]
	}

	clearLogs(): void {
		this.logs = []
	}
}

export const logger = new Logger()
