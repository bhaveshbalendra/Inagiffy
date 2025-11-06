# AI Learning Map Generator - Backend

A Node.js/Express backend API for generating AI-powered interactive learning maps using Google Gemini AI. This backend handles API requests, integrates with Google Gemini, and manages learning map data in MongoDB.

## Features

- 🤖 **Google Gemini AI Integration**: Generate structured learning maps using Google's Generative AI
- 🗄️ **MongoDB Database**: Store and retrieve learning maps
- 🔒 **Security**: Helmet, CORS, and HPP middleware for security
- 📝 **Request Validation**: Zod-based request validation
- 🛡️ **Error Handling**: Comprehensive error handling with custom error codes
- 📊 **Logging**: Centralized logging with different log levels
- ⚡ **Rate Limiting**: Configurable rate limiting (optional)
- 🔄 **Graceful Shutdown**: Proper cleanup on server shutdown

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 5
- **Language**: TypeScript 5.9
- **Database**: MongoDB with Mongoose
- **AI Integration**: Google Generative AI SDK (`@google/genai`)
- **Validation**: Zod
- **Security**: Helmet, CORS, HPP
- **Rate Limiting**: express-rate-limit

## Prerequisites

- Node.js 20+ and npm
- MongoDB database (local or cloud)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=8000
LOG_LEVEL=debug

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173

# API Configuration
BASE_PATH=/api/v1

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/learning-maps

# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro
```

3. Start the development server:

```bash
npm run dev
```

The server will be available at `http://localhost:8000`

## Environment Variables

| Variable          | Description                             | Default                 | Required |
| ----------------- | --------------------------------------- | ----------------------- | -------- |
| `NODE_ENV`        | Environment mode                        | `development`           | No       |
| `PORT`            | Server port                             | `8000`                  | No       |
| `LOG_LEVEL`       | Logger level (debug, info, warn, error) | `info`                  | No       |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated)  | `http://localhost:5173` | No       |
| `BASE_PATH`       | API base path                           | `/api/v1`               | No       |
| `MONGODB_URI`     | MongoDB connection string               | -                       | **Yes**  |
| `GEMINI_API_KEY`  | Google Gemini API key                   | -                       | **Yes**  |
| `GEMINI_MODEL`    | Gemini model to use                     | `gemini-pro`            | No       |

## Available Scripts

- `npm run dev` - Start development server with hot reload (ts-node-dev)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (requires build first)
- `npm test` - Run tests (not configured yet)

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── cors.config.ts   # CORS configuration
│   │   ├── env.config.ts    # Environment configuration
│   │   └── http.config.ts   # HTTP status codes
│   ├── controllers/         # Request handlers
│   │   └── mapController.ts
│   ├── enum/                # Enumerations
│   │   └── error-code.enum.ts
│   ├── interfaces/           # TypeScript interfaces
│   │   └── database.interface.ts
│   ├── middlewares/          # Express middlewares
│   │   └── error.middleware.ts
│   ├── models/               # Mongoose models
│   │   └── LearningMap.ts
│   ├── routes/               # API routes
│   │   └── mapRoutes.ts
│   ├── services/             # Business logic
│   │   ├── geminiService.ts  # Google Gemini integration
│   │   └── mapService.ts     # Learning map operations
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   ├── connectDB.ts      # MongoDB connection
│   │   ├── error.util.ts     # Error utilities
│   │   ├── get-env.ts        # Environment variable helper
│   │   ├── logger.ts         # Logger utility
│   │   └── rateLimiter.util.ts
│   ├── app.ts                # Express app configuration
│   └── server.ts              # Server entry point
├── dist/                      # Compiled JavaScript (generated)
├── package.json
└── tsconfig.json
```

## API Endpoints

### Health Check

- **GET** `/` - Health check endpoint

### Learning Maps

- **POST** `/api/v1/map/generate` - Generate a new learning map

  **Request Body:**

  ```json
  {
    "topic": "Machine Learning",
    "level": "Beginner"
  }
  ```

  **Response:**

  ```json
  {
    "success": true,
    "data": {
      "topic": "Machine Learning",
      "level": "Beginner",
      "branches": [...]
    }
  }
  ```

- **GET** `/api/v1/map/:id` - Get a learning map by ID

  **Response:**

  ```json
  {
    "success": true,
    "data": {
      "topic": "Machine Learning",
      "level": "Beginner",
      "branches": [...]
    }
  }
  ```

## Error Handling

The backend uses a centralized error handling system:

- **Custom Error Codes**: Standardized error codes in `ErrorCodeEnum`
- **AppError Class**: Custom error class with status codes
- **Error Middleware**: Global error handler that formats responses
- **Error Types**:
  - Validation errors (400)
  - Not found errors (404)
  - External service errors (502, 503, 504)
  - Rate limiting errors (429)
  - Internal server errors (500)

## Services

### Gemini Service

Handles integration with Google Gemini API:

- Generates structured learning maps based on topic and level
- Handles API errors (quota, network, timeout)
- Parses and validates Gemini responses
- Maps errors to appropriate error codes

### Map Service

Business logic for learning maps:

- Generates learning maps using Gemini service
- Saves maps to MongoDB
- Retrieves maps from database
- Handles database errors

## Database

### Learning Map Model

```typescript
{
  topic: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  branches: MainBranch[];
  createdAt?: Date;
}
```

## Security

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **HPP**: Protects against HTTP Parameter Pollution
- **Rate Limiting**: Optional rate limiting (commented out by default)

## Logging

Centralized logging utility with different levels:

- `logger.debug()` - Debug messages (development)
- `logger.info()` - Informational messages
- `logger.warn()` - Warning messages
- `logger.error()` - Error messages

Log level is controlled by `LOG_LEVEL` environment variable.

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Consistent error handling patterns
- Type-safe environment variables

### Adding New Endpoints

1. Create controller in `src/controllers/`
2. Create route in `src/routes/`
3. Add route to `src/app.ts`
4. Add validation schema (if needed)
5. Handle errors using `AppError`

### Adding New Services

1. Create service in `src/services/`
2. Use logger for debugging
3. Handle errors and throw `AppError`
4. Export service functions

## Building for Production

1. Build TypeScript:

```bash
npm run build
```

2. Start production server:

```bash
npm start
```

The compiled JavaScript will be in the `dist/` directory.

## Troubleshooting

### MongoDB Connection Issues

- Verify `MONGODB_URI` is correct
- Ensure MongoDB is running
- Check network connectivity
- Verify database credentials

### Gemini API Issues

- Verify `GEMINI_API_KEY` is set correctly
- Check API quota limits
- Verify network connectivity
- Check API key permissions

### Port Already in Use

- Change `PORT` in `.env` file
- Kill process using the port: `lsof -ti:8000 | xargs kill` (macOS/Linux)

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`
- Verify all dependencies are installed
