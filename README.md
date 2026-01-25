# Serve Robotics - Frontend Visualization

A modern, production-ready React application for real-time visualization of robot movements in Downtown Los Angeles (DTLA). Built with scalability, performance, accessibility, and best practices in mind.

## 🚀 Features

- **Interactive Map Visualization**: Real-time robot tracking on an interactive Leaflet map
- **Real-time Updates**: Auto-polling for live robot position updates
- **Manual Controls**: Move, reset, and configure robots through intuitive UI
- **Backend Integration**: Seamless API integration with the Node.js robot service
- **Smooth Animations**: Fluid robot marker transitions with CSS animations
- **Accessibility (A11Y)**: WCAG 2.1 compliant with ARIA labels and keyboard navigation
- **Error Handling**: Resilient error boundaries and user-friendly error messages
- **Performance Optimized**: Code splitting, lazy loading, and React memoization
- **Caching Strategy**: Intelligent API response caching for improved performance
- **Testing Suite**: Comprehensive Jest unit tests and Cypress E2E tests
- **CI/CD Pipeline**: Automated testing and deployment via GitHub Actions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Theme**: Modern dark UI optimized for extended viewing

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** 8.x or higher
- **Backend Service**: The robot-service backend must be running on port 4000

## 🛠️ Installation

1. **Clone the repository** (if not already done):

   ```bash
   cd serve-robotics-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment** (optional):
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The app will start on **http://localhost:3000** with hot module replacement (HMR).

### Production Build

```bash
npm run build
npm run preview
```

### With Backend

Ensure the backend is running first:

```bash
# Terminal 1 - Backend
cd ../serve-robotics-backend
npm start

# Terminal 2 - Frontend
cd serve-robotics-frontend
npm run dev
```

## 🧪 Testing

### Unit Tests (Jest)

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### E2E Tests (Cypress)

```bash
# Interactive mode
npm run test:e2e

# Headless mode
npm run test:e2e:headless
```

**Prerequisites for E2E**: Backend must be running on port 4000.

## 📁 Project Structure

```
serve-robotics-frontend/
├── src/
│   ├── components/          # React components
│   │   ├── MapView.jsx      # Map visualization
│   │   ├── RobotMarker.jsx  # Individual robot markers
│   │   ├── ControlPanel.jsx # User controls
│   │   ├── StatusBar.jsx    # Status information
│   │   └── ErrorBoundary.jsx # Error handling
│   ├── services/            # Business logic & API
│   │   ├── robotService.js  # API integration
│   │   └── logger.js        # Logging service
│   ├── tests/               # Test suites
│   │   ├── App.test.jsx     # App tests
│   │   └── robotService.test.js
│   ├── App.jsx              # Main application
│   ├── App.css              # App styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── cypress/                 # E2E tests
│   ├── e2e/
│   │   └── app.cy.js
│   └── support/
├── public/                  # Static assets
├── .github/workflows/       # CI/CD configuration
├── vite.config.js          # Vite configuration
├── jest.config.js          # Jest configuration
├── cypress.config.js       # Cypress configuration
└── package.json
```

## 🏗️ Architecture

### Component Hierarchy

```
App
├── ErrorBoundary
├── MapView
│   ├── MapContainer (Leaflet)
│   ├── TileLayer
│   ├── Polygon (DTLA boundary)
│   └── RobotMarker[] (for each robot)
├── ControlPanel
│   ├── Manual Controls
│   ├── Auto-Movement Controls
│   └── UI Settings
└── StatusBar
```

### Data Flow

1. **App Component** manages global state (robots, loading, error)
2. **API Service** handles backend communication with caching
3. **Logger Service** provides centralized logging
4. **Components** receive data via props and trigger actions via callbacks
5. **Auto-refresh** polling updates robots every N seconds

### State Management

- **useState**: Local component state
- **useCallback**: Memoized callbacks to prevent re-renders
- **useMemo**: Memoized values for performance
- **React.memo**: Component memoization for expensive renders

### API Integration

All API calls go through `robotService.js`:

- **Caching**: 2-second TTL to reduce server load
- **Error Handling**: Automatic retry logic and user-friendly errors
- **Timeout**: 10-second request timeout
- **Proxy**: Vite dev server proxies `/api` to `http://localhost:4000`

## 🎨 Styling Approach

- **CSS Modules**: Scoped component styles
- **Global Styles**: Theme variables and resets
- **Dark Theme**: Default dark color scheme
- **Responsive**: Mobile-first design with media queries
- **Accessibility**: High contrast mode support, reduced motion

## ♿ Accessibility (A11Y)

- **ARIA Labels**: Comprehensive labeling for screen readers
- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Space)
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Live Regions**: aria-live for dynamic content updates
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Reduced Motion**: Respects `prefers-reduced-motion`

## 🚀 Performance Optimizations

1. **Code Splitting**: Vendor chunks separated (React, Leaflet)
2. **Lazy Loading**: Components loaded on demand
3. **React.memo**: Prevents unnecessary re-renders
4. **useMemo/useCallback**: Memoizes expensive computations
5. **API Caching**: Reduces redundant network requests
6. **Image Optimization**: Efficient icon loading
7. **Bundle Size**: Tree-shaking and minification

## 📊 Monitoring & Logging

### Logger Service

- **Log Levels**: ERROR, WARN, INFO, DEBUG
- **In-Memory Storage**: Last 100 log entries
- **Console Output**: Color-coded console logs
- **Production Ready**: Structured for monitoring services (Sentry, LogRocket)

### Error Boundary

- **Graceful Degradation**: Catches React errors without crashing
- **User-Friendly UI**: Clear error messages and recovery options
- **Error Reporting**: Ready for error tracking service integration

## 🔄 CI/CD Pipeline

GitHub Actions workflow includes:

1. **Linting**: ESLint code quality checks
2. **Unit Tests**: Jest with coverage reporting
3. **E2E Tests**: Cypress integration tests
4. **Build**: Production build verification
5. **Deploy**: Automated deployment to hosting (configurable)

### Running Locally

```bash
# Lint
npm run lint

# Test
npm test

# Build
npm run build
```

## 🌍 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

### Netlify

```bash
npm run build
# Deploy the `dist` folder
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
```

### Environment Variables

For production deployment, set:

```bash
VITE_API_URL=https://your-backend-api.com
```

## 🔧 Configuration

### Vite Config

- **Dev Server**: Port 3000, API proxy to port 4000
- **Build**: Code splitting, chunk optimization
- **Performance**: Tree-shaking, minification

### Environment Files

- `.env.example`: Template for local development
- `.env.production`: Production configuration
- `.env`: Local overrides (git-ignored)

## 📝 API Documentation

### Endpoints Used

| Method | Endpoint          | Description                 |
| ------ | ----------------- | --------------------------- |
| GET    | `/api/robots`     | Get all robot positions     |
| POST   | `/api/move`       | Move all robots             |
| POST   | `/api/reset`      | Reset robot positions       |
| POST   | `/api/start-auto` | Start backend auto-movement |
| POST   | `/api/stop-auto`  | Stop backend auto-movement  |

### Request/Response Examples

#### Get Robots

```javascript
GET /api/robots

Response:
{
  "robots": [
    [34.0412, -118.2501],
    [34.0325, -118.2389]
  ]
}
```

#### Move Robots

```javascript
POST /api/move
Body: { "meters": 10 }

Response:
{
  "robots": [...]
}
```

## 🐛 Troubleshooting

### Common Issues

**Map not loading**:

- Check that Leaflet CSS is imported
- Verify internet connection for tile layers

**API errors**:

- Ensure backend is running on port 4000
- Check browser console for CORS errors
- Verify proxy configuration in `vite.config.js`

**Tests failing**:

- Clear Jest cache: `npx jest --clearCache`
- Ensure backend is running for E2E tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

### Code Standards

- Follow ESLint rules
- Write tests for new features
- Maintain accessibility standards
- Document complex logic

## 📄 License

ISC

## 🙏 Acknowledgments

- **React** - UI framework
- **Vite** - Build tool
- **Leaflet** - Map library
- **React Leaflet** - React bindings for Leaflet
- **Jest** - Testing framework
- **Cypress** - E2E testing
- **Axios** - HTTP client

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for Serve Robotics**
