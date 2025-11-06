# AI Learning Map Generator - Frontend

A modern React application for generating and visualizing interactive learning maps powered by Google Gemini AI. This frontend provides an intuitive interface for users to create structured learning roadmaps for any topic.

## Features

- 🎯 **AI-Powered Learning Maps**: Generate structured learning maps using Google Gemini AI
- 📊 **Interactive Visualization**: Visualize learning maps with ReactFlow
- 🎨 **Modern UI**: Built with ShadCN UI components and Tailwind CSS
- 🔄 **Real-time Updates**: RTK Query for efficient API state management
- ✅ **Form Validation**: Zod-based validation with user-friendly error messages
- 🛡️ **Error Handling**: Comprehensive error handling with retry logic
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎭 **Loading States**: Smooth loading indicators and user feedback

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **State Management**: Redux Toolkit (RTK Query)
- **UI Components**: ShadCN UI (Radix UI primitives)
- **Styling**: Tailwind CSS 4
- **Visualization**: ReactFlow
- **Validation**: Zod
- **Icons**: Lucide React

## Prerequisites

- Node.js 20+ and npm
- Backend API server running (see backend README)
- Google Gemini API key (configured in backend)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api/v1

# Logger Configuration (optional)
VITE_LOG_LEVEL=debug
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

| Variable         | Description                             | Default                        | Required |
| ---------------- | --------------------------------------- | ------------------------------ | -------- |
| `VITE_API_URL`   | Backend API base URL                    | `http://localhost:8000/api/v1` | No       |
| `VITE_LOG_LEVEL` | Logger level (debug, info, warn, error) | `info`                         | No       |

**Note**: All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser.

## Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # ShadCN UI components
│   │   ├── MapGenerator.tsx
│   │   ├── LearningMapVisualization.tsx
│   │   ├── ErrorDisplay.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ConfigProvider.tsx
│   ├── config/             # Configuration files
│   │   ├── env.config.ts   # Environment configuration
│   │   └── appConfig.ts    # App configuration
│   ├── hooks/              # Custom React hooks
│   │   ├── useLearningMapForm.ts
│   │   ├── useMapGeneration.ts
│   │   └── useMapExport.ts
│   ├── store/               # Redux store
│   │   ├── api/            # RTK Query API slices
│   │   ├── slices/         # Redux slices
│   │   └── store.ts
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   │   ├── logger.ts       # Logger utility
│   │   ├── get-env.ts      # Environment variable helper
│   │   ├── errorHandler.ts # Error handling utilities
│   │   └── validation.ts  # Validation utilities
│   ├── validations/         # Zod validation schemas
│   ├── lib/                 # Library utilities
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
└── package.json
```

## Key Components

### MapGenerator

Main component for generating learning maps. Handles form input, validation, and map generation.

### LearningMapVisualization

Interactive visualization component using ReactFlow to display learning maps as nodes and edges.

### ErrorDisplay

Reusable error display component for showing errors in a user-friendly way.

### ErrorBoundary

React error boundary for catching and handling runtime errors gracefully.

### ConfigProvider

Validates application configuration before rendering the app.

## Utilities

### Logger

Centralized logging utility with different log levels:

- `logger.debug()` - Debug messages (development only)
- `logger.info()` - Informational messages
- `logger.warn()` - Warning messages
- `logger.error()` - Error messages

### Error Handler

Comprehensive error handling utilities:

- Normalizes errors to a consistent format
- Handles network, API, and validation errors
- Provides retry logic for transient failures
- Maps errors to user-friendly messages

### Environment Configuration

Centralized environment variable management:

- Type-safe environment variable access
- Default values for optional variables
- Validation on application startup

## API Integration

The frontend communicates with the backend API through RTK Query:

- **POST** `/api/v1/map/generate` - Generate a new learning map
- **GET** `/api/v1/map/:id` - Retrieve a saved learning map

All API calls include:

- Automatic retry logic for transient failures
- Centralized error handling
- Loading state management
- Request/response caching

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier (if configured) for code formatting

### Adding New Components

1. Create component in `src/components/`
2. Use ShadCN UI components from `src/components/ui/`
3. Follow existing component patterns
4. Add TypeScript types

### Adding New API Endpoints

1. Add endpoint to `src/store/api/learningMapApi.ts`
2. Use RTK Query mutations/queries
3. Handle errors using error handler utilities

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory, optimized and ready for deployment.

## Troubleshooting

### API Connection Issues

- Verify `VITE_API_URL` is correct
- Ensure backend server is running
- Check CORS configuration in backend

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`
- Verify all environment variables are set

### Runtime Errors

- Check browser console for detailed error messages
- Verify logger is working: check console for log messages
- Review error boundary for caught errors

## License

ISC
