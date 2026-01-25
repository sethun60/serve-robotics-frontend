import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Create axios instance with defaults
const apiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Simple in-memory cache
const cache = {
	data: null,
	timestamp: null,
	ttl: 2000, // 2 seconds TTL
};

// Request interceptor for logging
apiClient.interceptors.request.use(
	(config) => {
		console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
		return config;
	},
	(error) => {
		console.error("[API] Request error:", error);
		return Promise.reject(error);
	},
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.code === "ECONNABORTED") {
			throw new Error("Request timeout - server not responding");
		}
		if (!error.response) {
			throw new Error("Network error - please check your connection");
		}
		if (error.response.status >= 500) {
			throw new Error("Server error - please try again later");
		}
		throw new Error(error.response.data?.message || "An error occurred");
	},
);

export const robotService = {
	// Get all robots (with caching)
	async getRobots(useCache = true) {
		const now = Date.now();

		// Return cached data if valid
		if (
			useCache &&
			cache.data &&
			cache.timestamp &&
			now - cache.timestamp < cache.ttl
		) {
			console.log("[API] Using cached robots data");
			return cache.data;
		}

		const response = await apiClient.get("/robots");

		// Update cache
		cache.data = response.data;
		cache.timestamp = now;

		return response.data;
	},

	// Move all robots
	async moveRobots(meters = 1) {
		// Invalidate cache
		cache.data = null;

		const response = await apiClient.post("/move", { meters });
		return response.data;
	},

	// Reset robots
	async resetRobots(count = 20) {
		// Invalidate cache
		cache.data = null;

		const response = await apiClient.post("/reset", { count });
		return response.data;
	},

	// Start auto-movement
	async startAutoMove(meters = 1, intervalMs = 60000) {
		const response = await apiClient.post("/start-auto", {
			meters,
			intervalMs,
		});
		return response.data;
	},

	// Stop auto-movement
	async stopAutoMove() {
		const response = await apiClient.post("/stop-auto");
		return response.data;
	},

	// Clear cache manually
	clearCache() {
		cache.data = null;
		cache.timestamp = null;
	},
};
