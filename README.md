# Setlist Builder + Sync

A comprehensive web application for musicians and bands to create, manage, and collaborate on performance setlists.

## Features

- **Setlist Management**: Create, edit, and organize setlists for different performances
- **Song Library**: Maintain a library of songs with details like key, tempo, and duration
- **Drag-and-Drop Reordering**: Easily rearrange songs in your setlist
- **Real-time Collaboration**: Invite band members to collaborate on setlists
- **Performance Mode**: Optimized view for live performances with auto-scrolling lyrics/chords
- **Export Options**: Export setlists to various formats (PDF, CSV, text)
- **Cross-Device Sync**: Access your setlists on any device

## Documentation

- [Project Plan Document](https://docs.google.com/document/d/1cymYHM7dOHTfv16ACmBg3zRKRGs-RODT2hcL95VHmaU/edit) - Detailed project documentation and architecture
- [Development Tracking Sheet](https://docs.google.com/spreadsheets/d/1iYLy_sdZXm4fFAWaDT-x6fvQe5ySIASkJR2PT0RLP30/edit) - Project development progress

## Technology Stack

### Frontend
- React.js with TypeScript
- Material UI and Tailwind CSS
- Redux Toolkit for state management
- Socket.io client for real-time updates
- Formik and Yup for form handling
- React Beautiful DnD for drag-and-drop functionality

### Backend
- Node.js with Express.js
- Prisma ORM
- PostgreSQL database
- JWT authentication
- Socket.io for real-time communication
- Redis for caching and pub/sub messaging

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- Redis (optional, for advanced caching)

### Backend Setup
1. Clone the repository
   ```
   git clone https://github.com/dxaginfo/setlist-builder-sync-2025-06-21.git
   cd setlist-builder-sync-2025-06-21
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/setlist_builder_db"
   JWT_SECRET="your_jwt_secret"
   REFRESH_TOKEN_SECRET="your_refresh_token_secret"
   PORT=5000
   FRONTEND_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

4. Run Prisma migrations to set up the database
   ```
   npx prisma migrate dev
   ```

5. Start the backend server
   ```
   npm run dev
   ```

### Frontend Setup
1. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

2. Create a `.env` file in the frontend directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

3. Start the frontend development server
   ```
   npm start
   ```

4. Access the application at `http://localhost:3000`

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── src/
│   │   ├── middleware/       # Middleware functions
│   │   ├── routes/           # API route handlers
│   │   ├── socket/           # Socket.io event handlers
│   │   └── index.js          # Express server setup
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/       # Reusable React components
    │   ├── layouts/          # Page layout components
    │   ├── pages/            # Page components
    │   ├── store/            # Redux store setup
    │   ├── services/         # API service functions
    │   ├── utils/            # Utility functions
    │   └── App.tsx           # Main application component
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token

### Setlists
- `GET /api/setlists` - Get all setlists for the current user
- `POST /api/setlists` - Create a new setlist
- `GET /api/setlists/:id` - Get a setlist by ID
- `PUT /api/setlists/:id` - Update a setlist
- `DELETE /api/setlists/:id` - Delete a setlist

### Songs in Setlists
- `POST /api/setlists/:id/songs` - Add a song to a setlist
- `PUT /api/setlists/:id/songs/:songId` - Update a song in a setlist
- `DELETE /api/setlists/:id/songs/:songId` - Remove a song from a setlist
- `PUT /api/setlists/:id/songs/reorder` - Reorder songs in a setlist

### Songs
- `GET /api/songs` - Get all songs for the current user
- `POST /api/songs` - Create a new song
- `GET /api/songs/:id` - Get a song by ID
- `PUT /api/songs/:id` - Update a song
- `DELETE /api/songs/:id` - Delete a song

### Collaborators
- `POST /api/setlists/:id/collaborators` - Add a collaborator
- `PUT /api/setlists/:id/collaborators/:userId` - Update collaborator permissions
- `DELETE /api/setlists/:id/collaborators/:userId` - Remove a collaborator

## Deployment

### Backend
1. Set up environment variables for production
2. Build the backend (if using TypeScript)
3. Deploy to a Node.js hosting service (AWS, Heroku, etc.)

### Frontend
1. Build the React application
   ```
   cd frontend
   npm run build
   ```
2. Deploy the build folder to a static hosting service (Netlify, Vercel, AWS S3, etc.)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For more information or support, refer to the project documentation or open an issue on GitHub.