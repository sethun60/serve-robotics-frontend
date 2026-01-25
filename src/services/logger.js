const LOG_LEVELS = {
	ERROR: 0,
	WARN: 1,
	INFO: 2,
	DEBUG: 3,
};

class Logger {
	constructor() {
		this.level = import.meta.env.PROD ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;
		this.logs = [];
		this.maxLogs = 100;
	}

	log(level, message, ...args) {
		if (level > this.level) return;

		const timestamp = new Date().toISOString();
		const logEntry = { timestamp, level, message, args };

		// Store in memory
		this.logs.push(logEntry);
		if (this.logs.length > this.maxLogs) {
			this.logs.shift();
		}

		// Console output
		const prefix = `[${timestamp}]`;
		switch (level) {
			case LOG_LEVELS.ERROR:
				console.error(prefix, message, ...args);
				break;
			case LOG_LEVELS.WARN:
				console.warn(prefix, message, ...args);
				break;
			case LOG_LEVELS.INFO:
				console.info(prefix, message, ...args);
				break;
			case LOG_LEVELS.DEBUG:
				console.debug(prefix, message, ...args);
				break;
		}

		// In production, you could send errors to a monitoring service
		if (level === LOG_LEVELS.ERROR && import.meta.env.PROD) {
			// TODO: Send to monitoring service (e.g., Sentry, LogRocket)
			// this.sendToMonitoring(logEntry)
		}
	}

	error(message, ...args) {
		this.log(LOG_LEVELS.ERROR, message, ...args);
	}

	warn(message, ...args) {
		this.log(LOG_LEVELS.WARN, message, ...args);
	}

	info(message, ...args) {
		this.log(LOG_LEVELS.INFO, message, ...args);
	}

	debug(message, ...args) {
		this.log(LOG_LEVELS.DEBUG, message, ...args);
	}

	getLogs() {
		return [...this.logs];
	}

	clearLogs() {
		this.logs = [];
	}
}

export const logger = new Logger();
