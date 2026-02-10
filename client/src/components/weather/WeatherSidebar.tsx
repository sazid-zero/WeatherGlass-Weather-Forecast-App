import React, { useState, useEffect } from 'react';
import { Home, MapPin, TrendingUp, Settings, Sun, Moon, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ui/theme-provider';
import { useLocation } from 'wouter';
import { useLocationState } from '@/hooks/use-location-state';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useWeatherByCity, useWeatherByCoords } from '@/hooks/use-weather';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

interface WeatherSidebarProps {
  className?: string;
}

export function WeatherSidebar({ className = "" }: WeatherSidebarProps) {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const { locationState } = useLocationState();
  const { latitude, longitude } = useGeolocation();
  // Prefer selected location, else use current coords
  const { data: coordsWeatherData } = useWeatherByCoords(
    locationState.isCurrentLocation ? latitude : locationState.coordinates?.lat || null,
    locationState.isCurrentLocation ? longitude : locationState.coordinates?.lon || null
  );
  const { data: cityWeatherData } = useWeatherByCity(locationState.selectedLocation || '');
  const weatherData = locationState.selectedLocation ? cityWeatherData : coordsWeatherData;

  // Time state for live clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/', active: location === '/' },
    { icon: MapPin, label: 'Locations', path: '/locations', active: location === '/locations' },
    { icon: TrendingUp, label: 'Statistics', path: '/statistics', active: location === '/statistics' },
    { icon: Settings, label: 'Settings', path: '/settings', active: location === '/settings' },
  ];

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'ocean', 'sunset', 'forest', 'aurora'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex] as any);
  };

  return (
    <motion.aside 
      className={cn(
        // Mobile: fixed bottom, w-full, h-16, row, z-50
        "fixed bottom-0 left-0 w-full h-16 z-50 flex items-center justify-between px-0 bg-transparent pointer-events-none",
        // Desktop: fixed left, top, h-screen, w-20, column
        "md:fixed md:left-0 md:top-0 md:min-h-[100dvh] md:h-[100dvh] md:w-20 md:z-50",
        className
      )}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={cn(
        "glass-card bg-background/80 flex items-center justify-between w-full h-full px-6 rounded-t-[2rem] pointer-events-auto shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]",
        "md:flex md:m-2 md:w-auto md:h-full md:rounded-3xl md:flex-col md:py-6 md:space-y-6 md:justify-start md:!bg-transparent md:!bg-none md:!shadow-none md:!backdrop-blur-none md:!border-none md:px-2"
      )} >
        {/* Logo - Hidden on mobile, Visible on Desktop */}
        <motion.div 
          className="hidden md:flex w-12 h-12 weather-accent-gradient rounded-2xl items-center justify-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Cloud className="h-6 w-6 text-white" />
        </motion.div>
        
        {/* Navigation Items */}
        <nav className="flex flex-row justify-around w-full md:flex-col md:space-y-4 md:w-auto md:justify-start">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.path}>
                <motion.button
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                    item.active 
                      ? "bg-primary/20 text-primary" 
                      : "hover:bg-primary/20 text-muted-foreground hover:text-primary"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.button>
              </Link>
            );
          })}
           {/* Theme Toggle - Mobile only (added to nav) */}
           <motion.button 
            onClick={toggleTheme}
            className={cn(
              "md:hidden w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
              "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sun className="h-5 w-5" />
          </motion.button>
        </nav>
        
        {/* Live Weather Mini Summary - Hidden on mobile */}
        <div className="hidden md:flex flex-col items-center justify-end flex-1 w-full pb-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[4.5rem] h-30 mb-2 flex flex-col items-center justify-center bg-primary/10 rounded-2xl shadow-none relative overflow-hidden"
            style={{ border: 'none' }}
          >
            {/* Weather Icon */}
            <div className="mb-2 w-full flex justify-center">
              {weatherData?.weatherMain?.toLowerCase().includes('rain') ? <span className="text-2xl">🌧️</span> :
                weatherData?.weatherMain?.toLowerCase().includes('snow') ? <span className="text-2xl">❄️</span> :
                weatherData?.weatherMain?.toLowerCase().includes('clear') ? <span className="text-2xl">☀️</span> :
                weatherData?.weatherMain?.toLowerCase().includes('cloud') ? <span className="text-2xl">☁️</span> :
                weatherData?.weatherMain?.toLowerCase().includes('thunder') ? <span className="text-2xl">⛈️</span> :
                <Cloud className="h-6 w-6 text-primary animate-bounce-slow" />}
            </div>
            {/* Temperature */}
            <span className="font-bold text-primary text-sm w-full text-center truncate mt-1">
              {weatherData?.temperature ? `${Math.round(weatherData.temperature)}°C` : '--'}
            </span>
            {/* Condition */}
            <span className="text-xs text-muted-foreground w-full text-center truncate mt-1">
              {weatherData?.weatherMain || '--'}
            </span>
            {/* City Name */}
            <span className="text-[11px] text-muted-foreground mt-2 w-full text-center truncate">
              {weatherData?.cityName || 'Current Location'}
            </span>
          </motion.div>
        </div>
        {/* Theme Toggle - Desktop */}
        <div className="hidden md:block mb-2">
          <motion.button 
            onClick={toggleTheme}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
              "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sun className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
}