# AI Learning Map Generator

A full-stack web application for generating AI-powered interactive learning maps. This application uses Google Gemini AI to create structured, hierarchical learning roadmaps for any topic, helping users visualize and plan their learning journey.

## 🎯 Features

- **AI-Powered Generation**: Uses Google Gemini AI to generate structured learning maps
- **Interactive Visualization**: Visualize learning maps with interactive nodes and connections
- **Multiple Learning Levels**: Support for Beginner, Intermediate, and Advanced levels
- **Resource Recommendations**: Each subtopic includes curated learning resources (articles, videos, books)
- **Modern UI**: Built with React, TypeScript, and ShadCN UI components
- **RESTful API**: Express.js backend with MongoDB for data persistence
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

This is a monorepo containing:

- **Frontend**: React + TypeScript + Vite application
- **Backend**: Node.js + Express + TypeScript API server

```
Inagiffy/
├── frontend/          # React frontend application
├── backend/           # Express.js backend API
└── README.md          # This file
```

## 💡 Approach & Trade-offs

### Architectural Approach

This project follows a **separation of concerns** architecture with clear boundaries between frontend and backend:

- **Monorepo Structure**: Both frontend and backend are in a single repository for easier development and maintenance, but can be deployed independently
- **RESTful API**: Simple REST endpoints for communication between frontend and backend
- **Type Safety**: TypeScript used throughout for type safety and better developer experience
- **Centralized Error Handling**: Consistent error handling patterns on both frontend and backend
- **Service Layer Pattern**: Business logic separated into service layers (Gemini service, Map service)

### Key Design Decisions

1. **RTK Query for API Calls**: Chose RTK Query over plain fetch/axios for automatic caching, retry logic, and state management integration

   - **Trade-off**: Adds Redux dependency but provides better developer experience and built-in features

2. **MongoDB for Data Persistence**: Used MongoDB for flexible schema and easy integration with Node.js

   - **Trade-off**: NoSQL provides flexibility but lacks relational data integrity guarantees

3. **Google Gemini AI SDK**: Direct SDK integration instead of REST API calls

   - **Trade-off**: Better type safety and error handling, but requires SDK dependency

4. **ShadCN UI Components**: Used ShadCN UI for consistent, accessible components

   - **Trade-off**: Copy-paste component approach means more code in repo but full control and customization

5. **Centralized Logging**: Custom logger utility instead of external logging service

   - **Trade-off**: Simpler setup but less features than dedicated logging services (e.g., Winston, Pino)

6. **Environment Configuration**: Centralized env config with validation

   - **Trade-off**: Extra abstraction layer but provides type safety and validation

7. **Zod for Validation**: Used Zod for both frontend and backend validation

   - **Trade-off**: Single validation library reduces bundle size but requires learning one library

8. **No Authentication (Current)**: Authentication not implemented in initial version

   - **Trade-off**: Faster development but limits user-specific features and data persistence

9. **Error Code Enum**: Standardized error codes for consistent error handling

   - **Trade-off**: More upfront work but better error handling and debugging

10. **ReactFlow for Visualization**: Used ReactFlow for interactive map visualization
    - **Trade-off**: Specialized library adds bundle size but provides rich visualization features

### Performance Considerations

- **Frontend Bundle Size**: ReactFlow and Redux add to bundle size (~587KB minified)
  - **Mitigation**: Could implement code splitting for visualization component
- **API Response Time**: Gemini API calls can be slow (2-5 seconds)
  - **Mitigation**: Loading states and retry logic implemented
- **Database Queries**: Simple queries without optimization
  - **Future**: Could add indexing and query optimization if needed

### Scalability Considerations

- **Current**: Single server, single database instance
- **Future**: Could scale horizontally with load balancers, database replication, and caching layers
- **Rate Limiting**: Currently disabled but infrastructure in place for easy enablement

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- MongoDB (local or cloud instance)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository** (if applicable)

2. **Set up the backend:**

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
NODE_ENV=development
PORT=8000
LOG_LEVEL=debug
ALLOWED_ORIGINS=http://localhost:5173
BASE_PATH=/api/v1
MONGODB_URI=mongodb://localhost:27017/learning-maps
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro
```

3. **Set up the frontend:**

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_LOG_LEVEL=debug
```

### Running the Application

1. **Start MongoDB** (if running locally)

2. **Start the backend server:**

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:8000`

3. **Start the frontend development server:**

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

4. **Open your browser** and navigate to `http://localhost:5173`

## 📚 Project Structure

### Backend

- **Express.js API** with TypeScript
- **MongoDB** for data persistence
- **Google Gemini AI** integration
- **Zod** for request validation
- **Centralized error handling**

See [backend/README.md](./backend/README.md) for detailed backend documentation.

### Frontend

- **React 19** with TypeScript
- **Vite** for fast development
- **Redux Toolkit** for state management
- **RTK Query** for API calls
- **ReactFlow** for visualization
- **ShadCN UI** components
- **Tailwind CSS** for styling

See [frontend/README.md](./frontend/README.md) for detailed frontend documentation.

## 🔧 Technology Stack

### Backend

- Node.js 20+
- Express.js 5
- TypeScript 5.9
- MongoDB + Mongoose
- Google Generative AI SDK
- Zod
- Helmet, CORS, HPP

### Frontend

- React 19
- TypeScript 5.9
- Vite 7
- Redux Toolkit
- RTK Query
- ReactFlow
- ShadCN UI
- Tailwind CSS 4
- Zod

## 📖 Usage

1. **Enter a topic** in the input field (e.g., "Machine Learning", "Web Development")
2. **Select a learning level** (Beginner, Intermediate, or Advanced)
3. **Click "Generate Learning Map"**
4. **View the interactive map** with branches, subtopics, and resources
5. **Explore the visualization** by zooming, panning, and clicking nodes
6. **Export the map** as JSON if needed

## 🔌 API Endpoints

### Generate Learning Map

**POST** `/api/v1/map/generate`

```json
{
  "topic": "Machine Learning",
  "level": "Beginner"
}
```

### Get Learning Map by ID

**GET** `/api/v1/map/:id`

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev  # Start with hot reload
npm run build  # Build for production
npm start  # Start production server
```

### Frontend Development

```bash
cd frontend
npm run dev  # Start development server
npm run build  # Build for production
npm run preview  # Preview production build
```

## 📝 Environment Variables

### Backend (.env)

See [backend/README.md](./backend/README.md) for complete list.

**Required:**

- `MONGODB_URI`
- `GEMINI_API_KEY`

### Frontend (.env)

See [frontend/README.md](./frontend/README.md) for complete list.

**Optional:**

- `VITE_API_URL` (defaults to `http://localhost:8000/api/v1`)
- `VITE_LOG_LEVEL` (defaults to `info`)

## 🧪 Testing

Testing setup is not yet configured. Future plans include:

- Unit tests for services and utilities
- Integration tests for API endpoints
- E2E tests for frontend components

## 🚢 Deployment

### Backend

1. Build the TypeScript code:

```bash
cd backend
npm run build
```

2. Set production environment variables
3. Start the server:

```bash
npm start
```

### Frontend

1. Build for production:

```bash
cd frontend
npm run build
```

2. Deploy the `dist/` directory to your hosting service
3. Configure environment variables on your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for the AI capabilities
- [ShadCN UI](https://ui.shadcn.com/) for the UI components
- [ReactFlow](https://reactflow.dev/) for the visualization library

## 📞 Support

For issues and questions:

1. Check the [backend README](./backend/README.md) for backend-specific issues
2. Check the [frontend README](./frontend/README.md) for frontend-specific issues
3. Review the troubleshooting sections in both READMEs

## 🗺️ Roadmap

- [ ] User authentication and saved maps
- [ ] Custom learning map editing
- [ ] Progress tracking
- [ ] Social sharing
- [ ] Export to PDF
- [ ] Multiple language support
- [ ] Advanced filtering and search
