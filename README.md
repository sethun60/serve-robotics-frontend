# Serve Robotics Frontend

A React app to visualize and control robots in Downtown LA. Shows robot positions on a map and lets you move them around.

## What it does

- Shows robots on an interactive map (using Leaflet)
- Auto-refreshes every few seconds to show live positions
- Control panel to move robots, reset positions, etc.
- Talks to the backend API for all robot operations
- Has some basic caching so we're not hammering the API constantly

## Setup

You'll need Node.js 18+ and the backend running on port 4000.

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`

## Running with the backend

```bash
# Terminal 1
cd ../serve-robotics-backend
npm start

# Terminal 2
cd serve-robotics-frontend
npm run dev
```

## Testing

```bash
npm test                    # Unit tests
npm run test:e2e           # E2E tests (needs backend running)
```

## Project structure

```
src/
├── components/          # React components
│   ├── MapView.jsx      # Main map with Leaflet
│   ├── RobotMarker.jsx  # Individual robot markers
│   ├── ControlPanel.jsx # Control buttons
│   └── StatusBar.jsx    # Shows robot count, last update
├── services/
│   ├── robotService.js  # API calls to backend
│   └── logger.js        # Simple logging utility
├── tests/               # Jest and Cypress tests
├── App.jsx              # Main component
└── main.jsx             # Entry point
```

## How it works

The app polls the backend every 5 seconds (configurable) to get robot positions. You can also manually trigger updates or move robots through the control panel.

API calls go through `robotService.js` which handles:
- Caching responses for 2 seconds
- Error handling
- Request timeouts

The map uses Leaflet and shows a polygon boundary for DTLA.

## Building for production

```bash
npm run build
npm run preview
```

The build outputs to `dist/`. You can deploy this to Vercel, Netlify, or anywhere that serves static files.

## Environment variables

Create a `.env` file if you need to override the API URL:

```
VITE_API_URL=http://your-backend-url
```
