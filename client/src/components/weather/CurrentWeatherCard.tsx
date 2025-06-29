import { motion } from 'framer-motion';
import { Eye, Droplets } from 'lucide-react';
import { formatTime } from '@/lib/weather-utils';
import type { WeatherData } from '@shared/schema';
import { TemperatureDisplay, VisibilityDisplay } from './UnitsDisplay';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
  className?: string;
}

export function CurrentWeatherCard({ weatherData, className = "" }: CurrentWeatherCardProps) {
  const currentTime = formatTime(new Date());

  // Dynamic weather background animation based on weather condition
  const getWeatherAnimation = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return {
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(29, 78, 216, 0.4) 100%)',
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
            className="absolute w-2 h-2 rounded-full weather-particle-snow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(226, 232, 240, 0.6))',
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
            className="absolute w-1 h-1 rounded-full weather-particle-sun"
            style={{
              left: `${30 + Math.random() * 40}%`,
              top: `${20 + Math.random() * 30}%`,
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.8), rgba(245, 158, 11, 0.5))',
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
              background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.4), rgba(148, 163, 184, 0.2))',
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
      className={`glass-card rounded-3xl p-4 sm:p-6 md:p-8 h-full relative overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: weatherAnimation.background
      }}
    >
      {/* Animated Weather Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {weatherAnimation.particles}
      </div>

      {/* Floating Weather Elements */}
      <motion.div 
        className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-30 dark:opacity-20"
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
        <div className="text-4xl sm:text-6xl md:text-8xl drop-shadow-lg">
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
            className="text-3xl sm:text-4xl drop-shadow-md"
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
            className="text-4xl sm:text-5xl md:text-6xl font-light text-foreground mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
<TemperatureDisplay temperature={weatherData.temperature} />
          </motion.div>
          <p className="text-foreground font-medium capitalize text-sm sm:text-base">{weatherData.weatherDescription}</p>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
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

        {/* Nature decorative elements at bottom */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Grass/Ground base */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-400/20 via-green-300/10 to-transparent dark:from-green-600/20 dark:via-green-500/10"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          />
          
          {/* Animated grass blades */}
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={`grass-${i}`}
              className="absolute bottom-0 w-1 bg-gradient-to-t from-green-500/40 to-green-400/20 dark:from-green-400/30 dark:to-green-300/15"
              style={{
                left: `${8 + i * 7}%`,
                height: `${8 + Math.random() * 8}px`,
                borderRadius: '2px 2px 0 0',
              }}
              animate={{
                rotate: [0, Math.random() * 4 - 2, 0],
                scaleY: [1, 1.1, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Weather-specific nature elements */}
          {weatherData.weatherMain.toLowerCase().includes('clear') && (
            // Flying birds for clear weather
            Array.from({ length: 2 }, (_, i) => (
              <motion.div
                key={`bird-${i}`}
                className="absolute text-xs opacity-40 dark:opacity-30"
                style={{
                  left: `${30 + i * 40}%`,
                  bottom: `${20 + Math.random() * 10}px`,
                }}
                animate={{
                  x: [0, 60, 120],
                  y: [0, -5, -2, -8, 0],
                  opacity: [0, 0.4, 0.4, 0.4, 0],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 6,
                  ease: "easeInOut"
                }}
              >
                🕊️
              </motion.div>
            ))
          )}

          {weatherData.weatherMain.toLowerCase().includes('rain') && (
            // Puddle reflections for rainy weather
            Array.from({ length: 3 }, (_, i) => (
              <motion.div
                key={`puddle-${i}`}
                className="absolute rounded-full bg-blue-400/20 dark:bg-blue-500/15"
                style={{
                  left: `${15 + i * 25}%`,
                  bottom: '2px',
                  width: `${8 + Math.random() * 12}px`,
                  height: '3px',
                }}
                animate={{
                  scaleX: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2 + Math.random() * 1,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))
          )}

          {/* Floating petals/leaves for other conditions */}
          {!weatherData.weatherMain.toLowerCase().includes('rain') && 
           !weatherData.weatherMain.toLowerCase().includes('clear') && (
            Array.from({ length: 3 }, (_, i) => (
              <motion.div
                key={`leaf-${i}`}
                className="absolute w-2 h-1 rounded-full"
                style={{
                  left: `${20 + i * 30}%`,
                  bottom: `${12 + Math.random() * 8}px`,
                  background: weatherData.weatherMain.toLowerCase().includes('snow') ?
                    'radial-gradient(ellipse, rgba(255, 255, 255, 0.8), rgba(226, 232, 240, 0.4))' :
                    'radial-gradient(ellipse, rgba(34, 197, 94, 0.6), rgba(22, 163, 74, 0.3))',
                }}
                animate={{
                  y: [0, -8, 0],
                  x: [0, Math.random() * 4 - 2, 0],
                  rotate: [0, 360],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
              />
            ))
          )}

          {/* Subtle mountain silhouette for horizon */}
          <motion.div
            className="absolute bottom-6 left-0 right-0 h-6 opacity-20 dark:opacity-10"
            style={{
              background: 'linear-gradient(135deg, transparent 20%, rgba(100, 116, 139, 0.4) 40%, rgba(71, 85, 105, 0.3) 60%, transparent 80%)',
              clipPath: 'polygon(0% 100%, 15% 60%, 25% 70%, 40% 40%, 55% 65%, 70% 30%, 85% 55%, 100% 45%, 100% 100%)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: weatherData.weatherMain.toLowerCase().includes('clear') ? 0.3 : 0.15, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
