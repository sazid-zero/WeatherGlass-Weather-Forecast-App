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
- Real-time weather data fetching from OpenWeatherMap API with proper error handling
- 7-day forecast with hourly breakdowns and detailed statistics
- Geolocation support for automatic weather detection via coordinates API
- City search functionality with comprehensive error handling and JSON validation
- Data persistence with in-memory storage for fast access
- Weather statistics API with trend analysis and historical data

### User Interface Components
- **WeatherSidebar**: Navigation with theme toggle and app shortcuts
- **SearchBar**: City search with real-time suggestions
- **CurrentWeatherCard**: Main weather display with animated backgrounds
- **WeatherStatsGrid**: Detailed weather metrics (UV index, wind, humidity, etc.)
- **ForecastSection**: 7-day and hourly forecast displays

### Internationalization System
- **Language Support**: English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Chinese, Bengali (Bangla), Arabic
- **Translation Management**: Centralized translation system in `client/src/lib/i18n.ts`
- **Dynamic Language Switching**: Real-time interface language updates via settings
- **Fallback System**: Automatic fallback to English for missing translations
- **Localized Content**: Weather conditions, UI labels, messages, and settings descriptions
- **RTL Support**: Prepared for Arabic right-to-left text direction

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

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **esbuild**: JavaScript bundler for production