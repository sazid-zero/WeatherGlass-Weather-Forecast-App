# Weather App - Full Stack Application

## Overview

This is a modern weather application built with React frontend and Express backend, featuring real-time weather data, 7-day forecasts, and a beautiful glassmorphism UI design. The application integrates with the OpenWeatherMap API to provide current weather conditions and forecasts for any city worldwide.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/UI components with Radix UI primitives
- **Styling**: Tailwind CSS with custom weather-themed design system
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Theme**: Light/dark mode support with system preference detection

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based session store
- **Development**: Vite for development server and HMR

### Build System
- **Frontend Build**: Vite with React plugin
- **Backend Build**: esbuild for optimized server bundle
- **Development**: Hot module replacement and runtime error overlay
- **Type Checking**: TypeScript with strict mode enabled

## Key Components

### Weather Data Management
- Real-time weather data fetching from OpenWeatherMap API
- 7-day forecast with hourly breakdowns
- Geolocation support for automatic weather detection
- City search functionality with debounced API calls
- Data persistence with PostgreSQL storage

### User Interface Components
- **WeatherSidebar**: Navigation with theme toggle and app shortcuts
- **SearchBar**: City search with real-time suggestions
- **CurrentWeatherCard**: Main weather display with animated backgrounds
- **WeatherStatsGrid**: Detailed weather metrics (UV index, wind, humidity, etc.)
- **ForecastSection**: 7-day and hourly forecast displays

### Data Storage Schema
- **weatherData**: Current weather conditions with location, temperature, humidity, wind, and atmospheric data
- **forecastData**: Future weather predictions with temperature ranges and conditions
- Both tables include automated timestamps and comprehensive weather metrics

## Data Flow

1. **User Location Detection**: App attempts to get user's geolocation on initial load
2. **Weather Data Fetching**: Backend queries OpenWeatherMap API based on coordinates or city name
3. **Data Processing**: Weather data is validated, transformed, and stored in PostgreSQL
4. **Frontend Updates**: React Query manages data fetching, caching, and automatic updates
5. **UI Rendering**: Components receive weather data and render with smooth animations

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **framer-motion**: Animation library for smooth transitions
- **react-hook-form**: Form handling with validation

### UI and Styling
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe CSS class variants
- **lucide-react**: Modern icon library

### Backend and Database
- **drizzle-orm**: Type-safe SQL query builder
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **express**: Web application framework
- **zod**: Runtime type validation

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **esbuild**: JavaScript bundler for production

## Deployment Strategy

### Development Environment
- Vite development server with HMR for frontend
- tsx for running TypeScript server with hot reload
- Automatic Replit integration with runtime error overlay
- Database migrations managed through Drizzle Kit

### Production Build
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: esbuild creates single server bundle in `dist/index.js`
- Static assets served from Express with fallback to React app
- Environment variables for API keys and database connections

### Database Management
- Schema definitions in `shared/schema.ts` using Drizzle ORM
- Migration files generated in `./migrations` directory
- Push-based schema updates with `db:push` command
- Connection pooling and serverless optimization

## Changelog

```
Changelog:
- June 29, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```