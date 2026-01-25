import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Type definitions
type Position = [number, number] // [lat, lng]

interface RobotsResponse {
	robots: Position[]
}

interface AutoMoveResponse {
	status: string
	meters?: number
	intervalMs?: number
}

interface Cache {
	data: RobotsResponse | null
	timestamp: number | null
	ttl: number
}

// Create axios instance with defaults
const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Simple in-memory cache
const cache: Cache = {
	data: null,
	timestamp: null,
	ttl: 2000, // 2 seconds TTL
}

// Request interceptor for logging
apiClient.interceptors.request.use(
	(config) => {
		console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
		return config
	},
	(error) => {
		console.error('[API] Request error:', error)
		return Promise.reject(error)
	}
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.code === 'ECONNABORTED') {
			throw new Error('Request timeout - server not responding')
		}
		if (!error.response) {
			throw new Error('Network error - please check your connection')
		}
		if (error.response.status >= 500) {
			throw new Error('Server error - please try again later')
		}
		throw new Error(error.response.data?.message || 'An error occurred')
	}
)

export const robotService = {
	// Get all robots (with caching)
	async getRobots(useCache = true): Promise<RobotsResponse> {
		const now = Date.now()

		// Return cached data if valid
		if (
			useCache &&
			cache.data &&
			cache.timestamp &&
			now - cache.timestamp < cache.ttl
		) {
			console.log('[API] Using cached robots data')
			return cache.data
		}

		const response = await apiClient.get<RobotsResponse>('/robots')

		// Update cache
		cache.data = response.data
		cache.timestamp = now

		return response.data
	},

	// Move all robots
	async moveRobots(meters = 1): Promise<RobotsResponse> {
		// Invalidate cache
		cache.data = null

		const response = await apiClient.post<RobotsResponse>('/move', { meters })
		return response.data
	},

	// Reset robots
	async resetRobots(count = 20): Promise<RobotsResponse> {
		// Invalidate cache
		cache.data = null

		const response = await apiClient.post<RobotsResponse>('/reset', { count })
		return response.data
	},

	// Start auto-movement
	async startAutoMove(meters = 1, intervalMs = 60000): Promise<AutoMoveResponse> {
		const response = await apiClient.post<AutoMoveResponse>('/start-auto', {
			meters,
			intervalMs,
		})
		return response.data
	},

	// Stop auto-movement
	async stopAutoMove(): Promise<AutoMoveResponse> {
		const response = await apiClient.post<AutoMoveResponse>('/stop-auto')
		return response.data
	},

	// Clear cache manually
	clearCache(): void {
		cache.data = null
		cache.timestamp = null
	},
}
