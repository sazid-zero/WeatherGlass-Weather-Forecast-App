import { motion } from 'framer-motion';
import { Eye, Droplets } from 'lucide-react';
import { getWeatherIcon, getWeatherColor, formatTime } from '@/lib/weather-utils';
import type { WeatherData } from '@shared/schema';

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
  className?: string;
}

export function CurrentWeatherCard({ weatherData, className = "" }: CurrentWeatherCardProps) {
  const iconClass = getWeatherIcon(weatherData.weatherMain, weatherData.weatherIcon);
  const colorClass = getWeatherColor(weatherData.weatherMain);
  const currentTime = formatTime(new Date());

  return (
    <motion.div 
      className={`glass-card rounded-3xl p-8 h-full relative overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Weather Icon Animation Background */}
      <motion.div 
        className="absolute top-4 right-4 opacity-10"
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <i className={`${iconClass} text-6xl text-primary`}></i>
      </motion.div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Now</p>
            <p className="text-muted-foreground text-xs">{currentTime}</p>
          </div>
          <motion.div 
            className="text-4xl"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <i className={`${iconClass} ${colorClass}`}></i>
          </motion.div>
        </div>
        
        <div className="mb-4">
          <motion.div 
            className="text-6xl font-light text-foreground mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {Math.round(weatherData.temperature)}°
          </motion.div>
          <p className="text-foreground font-medium capitalize">{weatherData.weatherDescription}</p>
          <p className="text-muted-foreground text-sm mt-1">
            Feels like {Math.round(weatherData.feelsLike)}°
          </p>
        </div>
        
        {/* Additional Info */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center">
            <Eye className="text-primary h-5 w-5 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Visibility</p>
            <p className="text-sm font-semibold text-foreground">
              {Math.round(weatherData.visibility / 1000)} km
            </p>
          </div>
          <div className="text-center">
            <Droplets className="text-primary h-5 w-5 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="text-sm font-semibold text-foreground">{weatherData.humidity}%</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
