import { motion } from 'framer-motion';
import { Eye, Droplets } from 'lucide-react';
import { formatTime } from '@/lib/weather-utils';
import type { WeatherData } from '@shared/schema';
import { TemperatureDisplay, VisibilityDisplay } from './UnitsDisplay';
import { WeatherIcon } from './WeatherIcon';
import { useTheme } from '@/components/ui/theme-provider';
import { useState, useEffect } from 'react';

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
  className?: string;
}

export function CurrentWeatherCard({ weatherData, className = "" }: CurrentWeatherCardProps) {
  const currentTime = formatTime(new Date());
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      if (theme === 'light') {
        setIsDarkMode(false);
      } else if (theme === 'system') {
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } else {
        // All other themes (dark, ocean, sunset, forest, aurora) are considered dark themes
        setIsDarkMode(true);
      }
    };

    checkDarkMode();
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', checkDarkMode);
      return () => mediaQuery.removeEventListener('change', checkDarkMode);
    }
  }, [theme]);

  // Dynamic weather background animation based on weather condition
  const getWeatherAnimation = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return {
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(51, 65, 85, 0.2) 50%, rgba(71, 85, 105, 0.1) 100%)'
          : 'linear-gradient(135deg, rgba(203, 213, 225, 0.5) 0%, rgba(226, 232, 240, 0.4) 50%, rgba(241, 245, 249, 0.3) 100%)',
        particles: Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={`rain-${i}`}
            className="absolute w-0.5 h-8 rounded-full weather-particle-rain"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.95), rgba(29, 78, 216, 0.8))',
            }}
            animate={{
              y: [0, 400],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 1,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear"
            }}
          />
        ))
      };
    }
    
    if (lowerCondition.includes('snow')) {
      return {
        background: 'linear-gradient(135deg, rgba(226, 232, 240, 0.3) 0%, rgba(148, 163, 184, 0.4) 100%)',
        particles: Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={`snow-${i}`}
            className="absolute w-3 h-3 rounded-full weather-particle-snow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.95), rgba(226, 232, 240, 0.8))',
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.8), 0 0 12px rgba(226, 232, 240, 0.6)',
              filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.9))',
            }}
            animate={{
              y: [0, 400],
              x: [0, Math.random() * 20 - 10],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))
      };
    }
    
    if (lowerCondition.includes('clear') || lowerCondition.includes('sun')) {
      return {
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.4) 100%)',
        particles: Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={`sun-${i}`}
            className="absolute w-2 h-2 rounded-full weather-particle-sun"
            style={{
              left: `${30 + Math.random() * 40}%`,
              top: `${20 + Math.random() * 30}%`,
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.95), rgba(245, 158, 11, 0.8))',
              boxShadow: '0 0 8px rgba(251, 191, 36, 0.6), 0 0 16px rgba(245, 158, 11, 0.4)',
              filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))',
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut"
            }}
          />
        ))
      };
    }
    
    if (lowerCondition.includes('cloud')) {
      return {
        background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.3) 0%, rgba(100, 116, 139, 0.4) 100%)',
        particles: Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={`cloud-${i}`}
            className="absolute rounded-full weather-particle-cloud"
            style={{
              width: `${20 + Math.random() * 40}px`,
              height: `${12 + Math.random() * 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${10 + Math.random() * 40}%`,
              background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.9), rgba(203, 213, 225, 0.7))',
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(148, 163, 184, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.4)',
              filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 15px rgba(148, 163, 184, 0.5))',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
            animate={{
              x: [-50, window.innerWidth || 400],
              opacity: [0, 0.8, 0.8, 0]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear"
            }}
          />
        ))
      };
    }
    
    // Default for other conditions
    return {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.4) 100%)',
      particles: []
    };
  };

  const weatherAnimation = getWeatherAnimation(weatherData.weatherMain);

  return (
    <motion.div 
      className={`glass-card rounded-3xl p-8 h-full relative overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25), 0 10px 30px rgba(0, 0, 0, 0.15)"
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        background: weatherAnimation.background,
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1), 0 4px 15px rgba(0, 0, 0, 0.05)"
      }}
    >
      {/* Animated Weather Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {weatherAnimation.particles}
      </div>

      {/* Floating Weather Elements */}
      <motion.div 
        className="absolute top-6 right-6 opacity-20"
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1],
          y: [0, -5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="text-8xl">
          {weatherData.weatherMain.toLowerCase().includes('rain') ? '🌧️' :
           weatherData.weatherMain.toLowerCase().includes('snow') ? '❄️' :
           weatherData.weatherMain.toLowerCase().includes('clear') ? '☀️' :
           weatherData.weatherMain.toLowerCase().includes('cloud') ? '☁️' :
           weatherData.weatherMain.toLowerCase().includes('thunder') ? '⛈️' :
           '🌤️'}
        </div>
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
            {weatherData.weatherMain === 'Clear' ? '☀️' : 
             weatherData.weatherMain === 'Clouds' ? '☁️' : 
             weatherData.weatherMain === 'Rain' ? '🌧️' : 
             weatherData.weatherMain === 'Snow' ? '❄️' : 
             weatherData.weatherMain === 'Thunderstorm' ? '⛈️' : '☁️'}
          </motion.div>
        </div>
        
        <div className="mb-4">
          <motion.div 
            className="text-6xl font-light text-foreground mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
<TemperatureDisplay temperature={weatherData.temperature} />
          </motion.div>
          <p className="text-foreground font-medium capitalize">{weatherData.weatherDescription}</p>
          <p className="text-muted-foreground text-sm mt-1">
Feels like <TemperatureDisplay temperature={weatherData.feelsLike} />
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
<VisibilityDisplay visibility={weatherData.visibility} />
            </p>
          </div>
          <div className="text-center">
            <Droplets className="text-primary h-5 w-5 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="text-sm font-semibold text-foreground">{weatherData.humidity}%</p>
          </div>
        </motion.div>

        {/* Nature elements at the very bottom */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Ground base */}
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-green-700/30 via-green-600/20 to-transparent dark:from-green-800/20 dark:via-green-700/10" />
          
          {/* Realistic grass blades using SVG */}
          {Array.from({ length: 20 }, (_, i) => {
            const height = 12 + Math.random() * 8;
            const windStrength = 2 + Math.random() * 3;
            return (
              <motion.div
                key={`grass-${i}`}
                className="absolute bottom-0"
                style={{
                  left: `${5 + (i * 4.5)}%`,
                  transformOrigin: 'bottom center',
                }}
                animate={{
                  rotate: [0, windStrength, -windStrength * 0.5, windStrength * 0.7, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              >
                <svg width="3" height={height} viewBox={`0 0 3 ${height}`} className="overflow-visible">
                  <path
                    d={`M1.5 ${height} Q1.5 ${height * 0.7} 1.2 ${height * 0.4} Q1.5 ${height * 0.2} 1.5 0`}
                    fill="none"
                    stroke="rgba(34, 197, 94, 0.7)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="dark:stroke-green-400/60"
                  />
                </svg>
              </motion.div>
            );
          })}

          {/* Small flower plants */}
          {Array.from({ length: 3 }, (_, i) => {
            const positions = [20, 50, 75];
            const flowerColors = ['#f59e0b', '#ec4899', '#8b5cf6'];
            return (
              <motion.div
                key={`flower-${i}`}
                className="absolute bottom-0"
                style={{
                  left: `${positions[i]}%`,
                  transformOrigin: 'bottom center',
                }}
                animate={{
                  rotate: [0, 3, -2, 3, 0],
                  y: [0, -1, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
              >
                <svg width="12" height="18" viewBox="0 0 12 18" className="overflow-visible">
                  {/* Stem */}
                  <path
                    d="M6 18 Q6 12 5.8 8 Q6 4 6 0"
                    fill="none"
                    stroke="rgba(34, 197, 94, 0.8)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="dark:stroke-green-400/70"
                  />
                  {/* Flower petals */}
                  <circle cx="6" cy="2" r="1.5" fill={flowerColors[i]} opacity="0.8" />
                  <circle cx="4" cy="3" r="1" fill={flowerColors[i]} opacity="0.6" />
                  <circle cx="8" cy="3" r="1" fill={flowerColors[i]} opacity="0.6" />
                  <circle cx="5" cy="1" r="0.8" fill={flowerColors[i]} opacity="0.7" />
                  <circle cx="7" cy="1" r="0.8" fill={flowerColors[i]} opacity="0.7" />
                  {/* Center */}
                  <circle cx="6" cy="2" r="0.5" fill="#fbbf24" opacity="0.9" />
                  {/* Small leaves */}
                  <ellipse cx="4.5" cy="8" rx="1.5" ry="0.8" fill="rgba(34, 197, 94, 0.6)" 
                    transform="rotate(-30 4.5 8)" className="dark:fill-green-400/50" />
                  <ellipse cx="7.5" cy="10" rx="1.5" ry="0.8" fill="rgba(34, 197, 94, 0.6)" 
                    transform="rotate(30 7.5 10)" className="dark:fill-green-400/50" />
                </svg>
              </motion.div>
            );
          })}

          {/* Small wildflower buds */}
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={`bud-${i}`}
              className="absolute bottom-0"
              style={{
                left: `${15 + (i * 15)}%`,
                transformOrigin: 'bottom center',
              }}
              animate={{
                rotate: [0, 2, -1, 2, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut"
              }}
            >
              <svg width="6" height="12" viewBox="0 0 6 12">
                {/* Small stem */}
                <path
                  d="M3 12 Q3 8 3 4"
                  fill="none"
                  stroke="rgba(34, 197, 94, 0.7)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  className="dark:stroke-green-400/60"
                />
                {/* Small bud */}
                <circle cx="3" cy="4" r="1.5" fill="rgba(236, 72, 153, 0.6)" className="dark:fill-pink-400/50" />
              </svg>
            </motion.div>
          ))}

          {/* Floating seeds/pollen in wind */}
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={`seed-${i}`}
              className="absolute w-1 h-1 rounded-full bg-yellow-400/60 dark:bg-yellow-300/40"
              style={{
                left: `${30 + (i * 20)}%`,
                bottom: `${8 + Math.random() * 4}px`,
              }}
              animate={{
                x: [0, 15, 30, 45],
                y: [0, -3, -1, -5, 0],
                opacity: [0, 0.8, 0.6, 0.4, 0],
              }}
              transition={{
                duration: 6 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
