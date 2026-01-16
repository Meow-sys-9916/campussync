# CampusSync

A modern event management platform enabling students to discover, register for, and manage campus events with an intuitive interface and powerful event organizer tools.

## Features

- **Event Discovery**: Browse and search campus events with detailed information
- **Event Registration**: Seamlessly register for events and manage your event history
- **Event Management**: Create, edit, and manage your hosted events
- **User Profiles**: Customize your profile and track event attendance
- **Archive System**: Archive past events and registered events for record-keeping
- **Dark Glassmorphic UI**: Premium, modern design with smooth animations and glow effects

## Tech Stack

**Frontend:**
- Angular 20.3+ with standalone components
- TypeScript 5.9+
- SCSS with CSS custom properties
- Angular Material 20.2+
- RxJS 7.8+

**Backend:**
- Node.js with Express
- MongoDB (Event and User models)
- JWT authentication
- Email service integration

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 20.3+

### Frontend Setup

```bash
cd frontend/campusync-frontend
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

### Backend Setup

```bash
cd backend/campussync-backend
npm install
npm start
```

The API will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

```bash
# Frontend
ng build --configuration production

# Backend
npm run build  # if available
```

## Project Structure

```
campussync/
├── frontend/
│   └── campusync-frontend/          # Angular frontend application
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/           # Guards, interceptors, services
│       │   │   ├── features/       # Feature modules
│       │   │   └── layout/         # Shared layout components
│       │   └── styles.css          # Global styles
│       └── package.json
└── backend/
    └── campussync-backend/         # Express API server
        ├── src/
        │   ├── api/                # API routes and controllers
        │   ├── models/             # Mongoose schemas
        │   └── services/           # Business logic
        └── package.json
```

## Configuration

Frontend environment configuration is available in `src/environments/`:
- `environment.ts` - Production
- `environment.development.ts` - Development

## License

Proprietary