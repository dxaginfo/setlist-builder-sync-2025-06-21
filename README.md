# Setlist Builder + Sync

A modern web application for musicians to create, manage, and sync setlists across devices and with band members.

## 🎵 Overview

Setlist Builder + Sync helps musicians and bands organize their performance setlists with features like drag-and-drop reordering, automatic duration calculations, collaborative editing, and cross-device synchronization.

## ✨ Key Features

- **Setlist Management**: Create, edit, and organize setlists with drag-and-drop functionality
- **Song Library**: Build and maintain a comprehensive library of your songs with metadata
- **Real-time Sync**: Seamless synchronization across devices with offline support
- **Collaboration**: Share setlists with band members and manage permissions
- **Performance Mode**: Easy-to-use interface for live performances with auto-scroll lyrics/chords
- **Export Options**: Export setlists in various formats (PDF, CSV, plain text)

## 🛠️ Technology Stack

### Frontend
- React.js with TypeScript
- Material UI and Tailwind CSS
- Redux Toolkit for state management
- Socket.io client for real-time updates
- Progressive Web App (PWA) capabilities

### Backend
- Node.js with Express.js
- RESTful API with OpenAPI documentation
- JWT authentication
- Socket.io for real-time communication

### Database
- PostgreSQL with Prisma ORM
- Redis for caching and performance

### DevOps
- Docker containerization
- GitHub Actions for CI/CD
- AWS deployment (Elastic Beanstalk, S3, CloudFront)

## 📋 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v13 or higher)
- Redis

### Installation

1. Clone the repository
```bash
git clone https://github.com/dxaginfo/setlist-builder-sync-2025-06-21.git
cd setlist-builder-sync-2025-06-21
```

2. Install dependencies for the backend
```bash
cd backend
npm install
```

3. Install dependencies for the frontend
```bash
cd ../frontend
npm install
```

4. Set up environment variables
   - Create `.env` files in both backend and frontend directories based on the provided `.env.example` templates

5. Initialize the database
```bash
cd ../backend
npx prisma migrate dev
```

6. Start the development servers
```bash
# In the backend directory
npm run dev

# In the frontend directory (in a new terminal)
npm start
```

7. Access the application at `http://localhost:3000`

## 🗂️ Project Structure

```
setlist-builder-sync/
├── backend/               # Node.js Express backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── socket/        # Socket.io handlers
│   │   └── utils/         # Utility functions
│   ├── prisma/            # Prisma schema and migrations
│   └── tests/             # Backend tests
├── frontend/              # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Page layout components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service integrations
│   │   ├── store/         # Redux store
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   └── tests/             # Frontend tests
├── docker/                # Docker configuration files
├── docs/                  # Documentation
└── scripts/               # Utility scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

Project Link: [https://github.com/dxaginfo/setlist-builder-sync-2025-06-21](https://github.com/dxaginfo/setlist-builder-sync-2025-06-21)