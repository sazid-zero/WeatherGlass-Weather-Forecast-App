import { motion } from 'framer-motion';
import { Eye, Droplets, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/weather-utils';
import type { WeatherData } from '@shared/schema';
import { TemperatureDisplay, VisibilityDisplay } from './UnitsDisplay';
import { WeatherIcon } from './WeatherIcon';
import { useTheme } from '@/components/ui/theme-provider';
import { useState, useEffect } from 'react';

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
  className?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function CurrentWeatherCard({ weatherData, className = "", isFavorite = false, onToggleFavorite }: CurrentWeatherCardProps) {
  // Live time state
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
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
      className={`glass-card rounded-3xl pt-8 px-8 pb-0 relative overflow-visible flex flex-col ${className}`}
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
      
      <div className="flex-1 min-h-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Now</p>
            {/* Stunning Time/Date Display */}
            <motion.div
              className="flex flex-col items-start gap-0.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="block text-lg font-mono text-primary-foreground/90 tracking-widest drop-shadow animate-pulse">
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="block text-xs text-muted-foreground">
                {now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </motion.div>
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
            className="text-6xl font-extrabold text-foreground mb-2 drop-shadow-lg tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-block align-middle">
              <TemperatureDisplay temperature={weatherData.temperature} />
            </span>
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

      </div>

      {/* Nature elements at the very bottom - always flush with card bottom */}
      <motion.div 
        className="absolute left-0 right-0 bottom-0 w-full h-36 min-h-[8rem] max-h-[11rem] pointer-events-none overflow-visible z-20 flex items-end justify-stretch rounded-b-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{
          width: '100%',
          minHeight: '8rem',
          maxHeight: '11rem',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          height: 'auto',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
          {/* Hills with waterfall in the background, now flush and full width, starting with grass */}
          <motion.div
            className="absolute left-0 right-0 bottom-0 w-full h-full z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.7 }}
            style={{ pointerEvents: 'none', width: '100%', height: '100%', left: 0, right: 0, bottom: 0 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 800 140" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '100%' }}>
              {/* Main hills, flush with bottom and full width */}
              <path d="M0 140 Q80 80 180 140 T400 140 T620 140 T800 140 V140 H0 Z" fill="#4ade80" />
              <path d="M0 140 Q120 100 260 140 T520 140 T800 140 V140 H0 Z" fill="#22c55e" opacity="0.8" />
              {/* Water between hills (fills the gap) */}
              <path d="M180 140 Q290 120 400 140 Q510 120 620 140 Q510 135 400 138 Q290 135 180 140 Z" fill="#38bdf8" opacity="0.7" />
              {/* Waterfall */}
              <rect x="390" y="90" width="20" height="50" rx="8" fill="#38bdf8" opacity="0.7" />
              <rect x="395" y="110" width="10" height="30" rx="5" fill="#bae6fd" opacity="0.7" />
              {/* Some rocks at the base of waterfall */}
              <ellipse cx="400" cy="135" rx="18" ry="6" fill="#a3a3a3" opacity="0.7" />
              <ellipse cx="420" cy="138" rx="10" ry="4" fill="#737373" opacity="0.5" />
              <ellipse cx="380" cy="138" rx="10" ry="4" fill="#737373" opacity="0.5" />
            </svg>
          </motion.div>

          {/* Ground base */}
          <div className="absolute bottom-0 left-0 right-0 w-full h-10 bg-gradient-to-t from-green-700/40 via-green-600/20 to-transparent dark:from-green-800/30 dark:via-green-700/10" style={{zIndex:1, margin:0, padding:0, boxSizing:'border-box'}} />

          {/* Classic animated green grass blades (restored style, now full width and flush) */}
          {(() => {
            // Fixed set of heights for realism, not random per render
            const grassHeights = Array.from({ length: 90 }, (_, i) => 32 + (i % 3) * 12); // 32, 44, 56 px pattern
            return (
              <div className="absolute left-0 right-0 bottom-0 w-full h-20 flex items-end z-10" style={{ pointerEvents: 'none' }}>
                {grassHeights.map((height, i) => {
                  const bottomOffset = 10 + (i % 5); // 10 to 14 px, fixed pattern
                  return (
                    <motion.div
                      key={`grass-${i}`}
                      className="relative"
                      style={{
                        left: 0,
                        width: `${100/90}%`,
                        height: '100%',
                        display: 'inline-block',
                        transformOrigin: 'bottom center',
                        zIndex: 2,
                        bottom: `-${bottomOffset}px`,
                      }}
                      animate={{
                        rotate: [-7, 7, -7],
                      }}
                      transition={{
                        duration: 3.5 + (i % 7) * 0.2,
                        repeat: Infinity,
                        delay: (i % 9) * 0.15,
                        ease: "easeInOut"
                      }}
                    >
                      <svg width="4" height={height} viewBox={`0 0 4 ${height}`} className="overflow-visible">
                        <path
                          d={`M2 ${height} Q2 ${height * 0.7} 1.2 ${height * 0.4} Q2 ${height * 0.2} 2 0`}
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </motion.div>
                  );
                })}
              </div>
            );
          })()}

          {/* Dense, much taller, big flowers */}
          {(() => {
            // Fixed set of left positions for flowers, evenly spaced, no randomness
            const flowerCount = 28;
            const leftPositions = Array.from({ length: flowerCount }, (_, i) => 1 + i * (98 / (flowerCount - 1))); // 1% to 99% evenly spaced
            const flowerColors = ['#f59e0b', '#ec4899', '#8b5cf6', '#22d3ee', '#fbbf24', '#f87171'];
            return leftPositions.map((left, i) => {
              const color = flowerColors[i % flowerColors.length];
              // Alternate between small and tall flowers
              const flowerHeight = i % 2 === 0 ? 62 : 98;
              return (
                <motion.div
                  key={`flower-${i}`}
                  className="absolute bottom-0"
                  style={{
                    left: `${left}%`,
                    zIndex: 2,
                    transformOrigin: 'bottom center',
                  }}
                  animate={{
                    rotate: [-8, 8, -8],
                  }}
                  transition={{
                    duration: 4.5 + (i % 5) * 0.2,
                    repeat: Infinity,
                    delay: (i % 7) * 0.18,
                    ease: "easeInOut"
                  }}
                >
                  <svg width="32" height={flowerHeight} viewBox={`0 0 32 ${flowerHeight}`} className="overflow-visible">
                    {/* Stem */}
                    <path
                      d={`M16 ${flowerHeight} Q16 ${flowerHeight - 18} 15.5 ${flowerHeight - 28} Q16 ${flowerHeight - 44} 16 0`}
                      fill="none"
                      stroke="rgba(34, 197, 94, 1)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="dark:stroke-green-400"
                    />
                    {/* Flower petals - brighter */}
                    <circle cx="16" cy="5" r="5.2" fill={color} opacity="1" />
                    <circle cx="10" cy="11" r="3.2" fill={color} opacity="0.85" />
                    <circle cx="22" cy="11" r="3.2" fill={color} opacity="0.85" />
                    <circle cx="13" cy="2" r="2.5" fill={color} opacity="0.9" />
                    <circle cx="19" cy="2" r="2.5" fill={color} opacity="0.9" />
                    {/* Center - brighter yellow */}
                    <circle cx="16" cy="5" r="2.5" fill="#fde047" opacity="1" />
                    {/* Small leaves */}
                    <ellipse cx="12.5" cy={flowerHeight - 28} rx="3.5" ry="1.7" fill="rgba(34, 197, 94, 0.8)" 
                      transform={`rotate(-30 12.5 ${flowerHeight - 28})`} className="dark:fill-green-400/80" />
                    <ellipse cx="19.5" cy={flowerHeight - 22} rx="3.5" ry="1.7" fill="rgba(34, 197, 94, 0.8)" 
                      transform={`rotate(30 19.5 ${flowerHeight - 22})`} className="dark:fill-green-400/80" />
                  </svg>
                </motion.div>
              );
            });
          })()}

          {/* More wildflower buds (fixed positions, no randomness) */}
          {(() => {
            const budCount = 24;
            const leftPositions = Array.from({ length: budCount }, (_, i) => 3 + i * (93 / (budCount - 1))); // 3% to 96% evenly spaced
            return leftPositions.map((left, i) => (
              <motion.div
                key={`bud-${i}`}
                className="absolute bottom-0"
                style={{
                  left: `${left}%`,
                  zIndex: 2,
                  transformOrigin: 'bottom center',
                }}
                animate={{
                  rotate: [0, 2, -1, 2, 0],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 5 + (i % 7) * 0.3,
                  repeat: Infinity,
                  delay: (i % 8) * 0.22,
                  ease: "easeInOut"
                }}
              >
                <svg width="10" height="20" viewBox="0 0 10 20">
                  {/* Small stem */}
                  <path
                    d="M5 20 Q5 13 5 7"
                    fill="none"
                    stroke="rgba(34, 197, 94, 0.7)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="dark:stroke-green-400/60"
                  />
                  {/* Small bud */}
                  <circle cx="5" cy="7" r="2.5" fill="rgba(236, 72, 153, 0.6)" className="dark:fill-pink-400/50" />
                </svg>
              </motion.div>
            ));
          })()}

          {/* More floating seeds/pollen in wind */}
          {Array.from({ length: 18 }, (_, i) => (
            <motion.div
              key={`seed-${i}`}
              className="absolute w-2 h-2 rounded-full bg-yellow-400/60 dark:bg-yellow-300/40"
              style={{
                left: `${3 + (i * 5.2)}%`,
                bottom: `${16 + Math.random() * 18}px`,
                zIndex: 3
              }}
              animate={{
                x: [0, 30, 60, 90],
                y: [0, -8, -4, -14, 0],
                opacity: [0, 0.8, 0.6, 0.4, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Animated bees */}
          {Array.from({ length: 4 }, (_, i) => (
            <motion.img
              key={`bee-${i}`}
              src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f41d.png"
              alt="Bee"
              className="absolute w-7 h-7 select-none pointer-events-none"
              style={{
                left: `${15 + i * 18}%`,
                bottom: `${40 + (i % 2) * 18}px`,
                zIndex: 4
              }}
              animate={{
                x: [0, 10, 20, 0],
                y: [0, -10, 10, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.8, 1, 0.8, 1],
              }}
              transition={{
                duration: 7 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Animated ladybugs */}
          {Array.from({ length: 3 }, (_, i) => (
            <motion.img
              key={`ladybug-${i}`}
              src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f41e.png"
              alt="Ladybug"
              className="absolute w-6 h-6 select-none pointer-events-none"
              style={{
                left: `${8 + i * 30}%`,
                bottom: `12px`,
                zIndex: 4
              }}
              animate={{
                y: [0, -4, 0],
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 6 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Animated dragonflies */}
          {Array.from({ length: 2 }, (_, i) => (
            <motion.img
              key={`dragonfly-${i}`}
              src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f98e.png"
              alt="Dragonfly"
              className="absolute w-8 h-8 select-none pointer-events-none"
              style={{
                left: `${30 + i * 40}%`,
                bottom: `${60 + i * 20}px`,
                zIndex: 4
              }}
              animate={{
                x: [0, 20, 40, 0],
                y: [0, -10, 10, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.7, 1, 0.7, 1],
              }}
              transition={{
                duration: 12 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Weather effects: animated wind swirls (increased to 5, more variety) */}
          {Array.from({ length: 5 }, (_, i) => (
            <motion.svg
              key={`wind-${i}`}
              className="absolute select-none pointer-events-none"
              style={{
                left: `${10 + i * 18}%`,
                bottom: `${70 + (i % 3) * 28}px`,
                zIndex: 7
              }}
              width={i % 2 === 0 ? 60 : 80}
              height={i % 2 === 0 ? 24 : 32}
              viewBox={i % 2 === 0 ? "0 0 60 24" : "0 0 80 32"}
              animate={{
                x: [0, 30 + i * 10, 60 + i * 20, 0],
                opacity: [0.5, 1, 0.5, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut"
              }}
            >
              {i % 2 === 0 ? (
                <>
                  <path d="M5 12 Q20 2 35 12 T55 12" stroke="#bae6fd" strokeWidth="2.5" fill="none" opacity="0.7" />
                  <circle cx="55" cy="12" r="2.5" fill="#bae6fd" opacity="0.7" />
                </>
              ) : (
                <>
                  <path d="M10 16 Q30 4 50 16 T70 16" stroke="#bae6fd" strokeWidth="2.5" fill="none" opacity="0.6" />
                  <circle cx="70" cy="16" r="3" fill="#bae6fd" opacity="0.6" />
                </>
              )}
            </motion.svg>
          ))}

          {/* Weather effects: animated falling leaves */}
          {Array.from({ length: 4 }, (_, i) => (
            <motion.svg
              key={`leaf-${i}`}
              className="absolute select-none pointer-events-none"
              style={{
                left: `${10 + i * 20}%`,
                bottom: `${120 + i * 18}px`,
                zIndex: 7
              }}
              width="18" height="32" viewBox="0 0 18 32"
              animate={{
                y: [0, 30, 60, 0],
                rotate: [0, 20, -20, 0],
                opacity: [0.7, 1, 0.7, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            >
              <ellipse cx="9" cy="16" rx="8" ry="14" fill="#bef264" opacity="0.7" />
              <path d="M9 32 Q9 16 9 0" stroke="#65a30d" strokeWidth="1.5" fill="none" />
            </motion.svg>
          ))}

          {/* More black birds (same SVGs as other birds), flying even higher */}
          {(() => {
            // 6 birds: blue, red, green, pink, yellow, black
            const birdSvgs = [
              // Blue bird
              (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <ellipse cx="24" cy="32" rx="8" ry="6" fill="#60a5fa" />
                  <ellipse cx="32" cy="30" rx="4" ry="2.5" fill="#3b82f6" />
                  <ellipse cx="16" cy="30" rx="4" ry="2.5" fill="#3b82f6" />
                  <ellipse cx="24" cy="28" rx="2.5" ry="1.5" fill="#fbbf24" />
                  <ellipse cx="24" cy="32" rx="1.2" ry="1.2" fill="#fff" />
                  <ellipse cx="27" cy="34" rx="1.2" ry="0.7" fill="#fff" />
                  <ellipse cx="21" cy="34" rx="1.2" ry="0.7" fill="#fff" />
                  <ellipse cx="24" cy="36" rx="1.2" ry="0.7" fill="#fbbf24" />
                  <ellipse cx="24" cy="38" rx="0.7" ry="0.4" fill="#222" />
                  <ellipse cx="28" cy="32" rx="2.5" ry="1.2" fill="#60a5fa" />
                  <ellipse cx="20" cy="32" rx="2.5" ry="1.2" fill="#60a5fa" />
                  <ellipse cx="24" cy="26" rx="1.2" ry="0.7" fill="#fbbf24" />
                  <ellipse cx="24" cy="24" rx="0.5" ry="0.5" fill="#222" />
                </svg>
              ),
              // Red bird
              (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <ellipse cx="24" cy="32" rx="8" ry="6" fill="#f87171" />
                  <ellipse cx="32" cy="30" rx="4" ry="2.5" fill="#ef4444" />
                  <ellipse cx="16" cy="30" rx="4" ry="2.5" fill="#ef4444" />
                  <ellipse cx="24" cy="28" rx="2.5" ry="1.5" fill="#fde047" />
                  <ellipse cx="24" cy="32" rx="1.2" ry="1.2" fill="#fff" />
                  <ellipse cx="27" cy="34" rx="1.2" ry="0.7" fill="#fff" />
                  <ellipse cx="21" cy="34" rx="1.2" ry="0.7" fill="#fff" />
                  <ellipse cx="24" cy="36" rx="1.2" ry="0.7" fill="#fde047" />
                  <ellipse cx="24" cy="38" rx="0.7" ry="0.4" fill="#222" />
                  <ellipse cx="28" cy="32" rx="2.5" ry="1.2" fill="#f87171" />
                  <ellipse cx="20" cy="32" rx="2.5" ry="1.2" fill="#f87171" />
                  <ellipse cx="24" cy="26" rx="1.2" ry="0.7" fill="#fde047" />
                  <ellipse cx="24" cy="24" rx="0.5" ry="0.5" fill="#222" />
                </svg>
              ),
              // Green bird
              (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <ellipse cx="24" cy="32" rx="8" ry="6" fill="#4ade80" />
                  <ellipse cx="32" cy="30" rx="4" ry="2.5" fill="#22c55e" />
                  <ellipse cx="16" cy="30" rx="4" ry="2.5" fill="#22c55e" />
                  <ellipse cx="24" cy="28" rx="2.5" ry="1.5" fill="#fbbf24" />
                  <ellipse cx="24" cy="32" rx="1.2" ry="1.2" fill="#fff" />
                  <ellipse cx="27" cy="34" rx="1.2" ry="0.7" fill="#fff" />
                  <ellipse cx="21" cy="34" rx="1.2" ry="0.7" fill="#fff" />
                  <ellipse cx="24" cy="36" rx="1.2" ry="0.7" fill="#fbbf24" />
                  <ellipse cx="24" cy="38" rx="0.7" ry="0.4" fill="#222" />
                  <ellipse cx="28" cy="32" rx="2.5" ry="1.2" fill="#4ade80" />
                  <ellipse cx="20" cy="32" rx="2.5" ry="1.2" fill="#4ade80" />
                  <ellipse cx="24" cy="26" rx="1.2" ry="0.7" fill="#fbbf24" />
                  <ellipse cx="24" cy="24" rx="0.5" ry="0.5" fill="#222" />
                </svg>
              ),
              // Pink bird
              (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <ellipse cx="24" cy="32" rx="8" ry="6" fill="#f472b6" />
                  <ellipse cx="32" cy="30" rx="4" ry="2.5" fill="#ec4899" />
                  <ellipse cx="16" cy="30" rx="4" ry="2.5" fill="#ec4899" />
                  <ellipse cx="24" cy="28" rx="2.5" ry="1.5" fill="#fde047" />
                  <ellipse cx="24" cy="32" rx="1.2" ry="1.2" fill="#fff" />
                  <ellipse cx="27" cy="34" rx="1.2" ry="0.7" fill="#fff" />
                  <ellipse cx="21" cy="34" rx="1.2" ry="0.7" fill="#fff" />
                  <ellipse cx="24" cy="36" rx="1.2" ry="0.7" fill="#fde047" />
                  <ellipse cx="24" cy="38" rx="0.7" ry="0.4" fill="#222" />
                  <ellipse cx="28" cy="32" rx="2.5" ry="1.2" fill="#f472b6" />
                  <ellipse cx="20" cy="32" rx="2.5" ry="1.2" fill="#f472b6" />
                  <ellipse cx="24" cy="26" rx="1.2" ry="0.7" fill="#fde047" />
                  <ellipse cx="24" cy="24" rx="0.5" ry="0.5" fill="#222" />
                </svg>
              ),
              // Yellow bird
              (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <ellipse cx="24" cy="32" rx="8" ry="6" fill="#fde047" />
                  <ellipse cx="32" cy="30" rx="4" ry="2.5" fill="#fbbf24" />
                  <ellipse cx="16" cy="30" rx="4" ry="2.5" fill="#fbbf24" />
                  <ellipse cx="24" cy="28" rx="2.5" ry="1.5" fill="#f87171" />
                  <ellipse cx="24" cy="32" rx="1.2" ry="1.2" fill="#fff" />
                  <ellipse cx="27" cy="34" rx="1.2" ry="0.7" fill="#fff" />
                  <ellipse cx="21" cy="34" rx="1.2" ry="0.7" fill="#fff" />
                  <ellipse cx="24" cy="36" rx="1.2" ry="0.7" fill="#f87171" />
                  <ellipse cx="24" cy="38" rx="0.7" ry="0.4" fill="#222" />
                  <ellipse cx="28" cy="32" rx="2.5" ry="1.2" fill="#fde047" />
                  <ellipse cx="20" cy="32" rx="2.5" ry="1.2" fill="#fde047" />
                  <ellipse cx="24" cy="26" rx="1.2" ry="0.7" fill="#f87171" />
                  <ellipse cx="24" cy="24" rx="0.5" ry="0.5" fill="#222" />
                </svg>
              ),
              // Black bird
              (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <ellipse cx="24" cy="32" rx="8" ry="6" fill="#18181b" />
                  <ellipse cx="32" cy="30" rx="4" ry="2.5" fill="#18181b" />
                  <ellipse cx="16" cy="30" rx="4" ry="2.5" fill="#18181b" />
                  <ellipse cx="24" cy="28" rx="2.5" ry="1.5" fill="#444" />
                  <ellipse cx="24" cy="32" rx="1.2" ry="1.2" fill="#fff" />
                  <ellipse cx="27" cy="34" rx="1.2" ry="0.7" fill="#fff" />
                  <ellipse cx="21" cy="34" rx="1.2" ry="0.7" fill="#fff" />
                  <ellipse cx="24" cy="36" rx="1.2" ry="0.7" fill="#444" />
                  <ellipse cx="24" cy="38" rx="0.7" ry="0.4" fill="#111" />
                  <ellipse cx="28" cy="32" rx="2.5" ry="1.2" fill="#18181b" />
                  <ellipse cx="20" cy="32" rx="2.5" ry="1.2" fill="#18181b" />
                  <ellipse cx="24" cy="26" rx="1.2" ry="0.7" fill="#444" />
                  <ellipse cx="24" cy="24" rx="0.5" ry="0.5" fill="#111" />
                </svg>
              ),
            ];
            return birdSvgs.map((svg, i) => (
              <motion.div
                key={`bird-${i}`}
                className="absolute w-14 h-14 select-none pointer-events-none"
                style={{
                  left: `${5 + i * 15}%`,
                  bottom: `200px`,
                  zIndex: 8
                }}
                animate={{
                  x: [0, 40 + i * 30, 80 + i * 60, 120],
                  y: [0, -20, 10, 0],
                  opacity: [0.7, 1, 0.7, 1],
                }}
                transition={{
                  duration: 16 + Math.random() * 6,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
              >
                {svg}
              </motion.div>
            ));
          })()}

          {/* Multiple butterflies, each with a unique color overlay (now 4) */}
          {(() => {
            // 2 butterflies under the grass, 2 above the grass/flowers
            const butterflyPositions = [
              { left: '12%', bottom: '18px', zIndex: 4 }, // under
              { left: '32%', bottom: '26px', zIndex: 4 }, // under
              { left: '52%', bottom: '70px', zIndex: 12 }, // above
              { left: '72%', bottom: '90px', zIndex: 12 }, // above
            ];
            return butterflyPositions.map((pos, i) => (
              <motion.div
                key={`butterfly-${i}`}
                className="absolute w-7 h-7 select-none pointer-events-none"
                style={{
                  left: pos.left,
                  bottom: pos.bottom,
                  zIndex: pos.zIndex
                }}
                animate={{
                  x: [0, 20, 40, 60, 0],
                  y: [0, -18, -10, 0, 0],
                  rotate: [0, 10, -10, 0],
                  opacity: [1, 1, 1, 1, 1],
                }}
                transition={{
                  duration: 10 + Math.random() * 6,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: "easeInOut"
                }}
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f98b.png"
                  alt="Butterfly"
                  style={{
                    width: '100%',
                    height: '100%',
                    filter: 'none',
                    opacity: 1,
                  }}
                />
              </motion.div>
            ));
          })()}

          {/* Big, taller, beautiful tree at the right side */}
          <motion.div
            className="absolute bottom-0 right-0 z-10"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            style={{ width: 110, height: 220 }}
          >
            <svg width="110" height="220" viewBox="0 0 110 220" fill="none">
              {/* Trunk */}
              <rect x="48" y="120" width="14" height="90" rx="7" fill="#a16207" />
              <rect x="52" y="170" width="8" height="40" rx="4" fill="#854d0e" />
              {/* Main foliage */}
              <ellipse cx="55" cy="90" rx="50" ry="70" fill="#22c55e" />
              <ellipse cx="30" cy="120" rx="22" ry="32" fill="#16a34a" opacity="0.7" />
              <ellipse cx="80" cy="120" rx="22" ry="32" fill="#16a34a" opacity="0.7" />
              <ellipse cx="55" cy="50" rx="30" ry="24" fill="#4ade80" opacity="0.8" />
              {/* Highlights */}
              <ellipse cx="80" cy="80" rx="12" ry="8" fill="#bbf7d0" opacity="0.7" />
              <ellipse cx="35" cy="75" rx="10" ry="5" fill="#bbf7d0" opacity="0.5" />
              {/* Flowers on tree */}
              <circle cx="80" cy="120" r="4" fill="#fbbf24" />
              <circle cx="30" cy="130" r="3.5" fill="#f472b6" />
              <circle cx="70" cy="80" r="3" fill="#f87171" />
              <circle cx="50" cy="100" r="3" fill="#a3e635" />
              {/* Extra details: vines */}
              <path d="M60 120 Q70 140 60 160 Q50 180 60 200" stroke="#166534" strokeWidth="2" fill="none" opacity="0.3" />
              <path d="M50 120 Q40 140 50 160 Q60 180 50 200" stroke="#166534" strokeWidth="2" fill="none" opacity="0.3" />
            </svg>
          </motion.div>

          {/* Static mushroom at the left side as frog umbrella */}
          <div className="absolute bottom-0 left-0 z-10" style={{ width: 70, height: 90 }}>
            <svg width="70" height="90" viewBox="0 0 70 90" fill="none">
              {/* Mushroom cap */}
              <ellipse cx="35" cy="32" rx="32" ry="22" fill="#f87171" />
              <ellipse cx="35" cy="38" rx="28" ry="12" fill="#fbbf24" opacity="0.25" />
              {/* White spots */}
              <ellipse cx="25" cy="30" rx="5" ry="3" fill="#fff" />
              <ellipse cx="45" cy="36" rx="4" ry="2.5" fill="#fff" />
              <ellipse cx="35" cy="25" rx="3" ry="2" fill="#fff" />
              {/* Mushroom stem */}
              <rect x="28" y="38" width="14" height="40" rx="7" fill="#fde68a" />
              <ellipse cx="35" cy="78" rx="10" ry="6" fill="#fde68a" />
              {/* Shadow under cap */}
              <ellipse cx="35" cy="42" rx="18" ry="6" fill="#fbbf24" opacity="0.3" />
            </svg>
          </div>

          {/* Hills with waterfall in the background */}
          <motion.div
            className="absolute left-0 right-0 bottom-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.7 }}
            style={{ pointerEvents: 'none', width: '100%', bottom: 0 }}
          >
            <svg width="100%" height="200" viewBox="0 0 500 200" fill="none" style={{ width: '100%', height: 200, position: 'absolute', left: 0, bottom: 0 }}>
              {/* Main hill - now taller and full width, flush with card bottom */}
              <path d="M0 200 Q100 100 250 170 Q400 240 500 140 L500 200 Z" fill="#bbf7d0" />
              {/* Second hill - now taller and full width, flush with card bottom */}
              <path d="M0 200 Q150 160 300 190 Q450 220 500 170 L500 200 Z" fill="#4ade80" opacity="0.7" />
              {/* Waterfall */}
              <rect x="240" y="150" width="30" height="50" rx="12" fill="#38bdf8" opacity="0.7" />
              <rect x="250" y="160" width="10" height="40" rx="5" fill="#bae6fd" opacity="0.8" />
              <ellipse cx="250" cy="200" rx="22" ry="7" fill="#38bdf8" opacity="0.5" />
            </svg>
          </motion.div>

          {/* Animated frogs (3, spaced out on the grass) */}
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={`frog-${i}`}
              className="absolute select-none pointer-events-none"
              style={{
                left: `${18 + i * 28}%`,
                bottom: `10px`,
                zIndex: 6
              }}
              animate={{
                y: [0, -6, 0, -3, 0],
                scale: [1, 1.08, 1, 1.04, 1],
                rotate: [0, 2, -2, 0],
                opacity: [0.9, 1, 0.9, 1, 0.9],
              }}
              transition={{
                duration: 5 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            >
              {/* SVG frog */}
              <svg width="38" height="28" viewBox="0 0 38 28" fill="none">
                {/* Body */}
                <ellipse cx="19" cy="18" rx="13" ry="8" fill="#22c55e" />
                {/* Legs */}
                <ellipse cx="7" cy="25" rx="4" ry="2" fill="#15803d" />
                <ellipse cx="31" cy="25" rx="4" ry="2" fill="#15803d" />
                {/* Arms */}
                <ellipse cx="5" cy="18" rx="2" ry="1.2" fill="#16a34a" />
                <ellipse cx="33" cy="18" rx="2" ry="1.2" fill="#16a34a" />
                {/* Eyes */}
                <ellipse cx="12" cy="11" rx="3" ry="3" fill="#bbf7d0" />
                <ellipse cx="26" cy="11" rx="3" ry="3" fill="#bbf7d0" />
                <ellipse cx="12" cy="11" rx="1.1" ry="1.1" fill="#222" />
                <ellipse cx="26" cy="11" rx="1.1" ry="1.1" fill="#222" />
                {/* Smile */}
                <path d="M15 19 Q19 23 23 19" stroke="#166534" strokeWidth="1.2" fill="none" />
                {/* Cheeks */}
                <ellipse cx="14" cy="17" rx="1.1" ry="0.6" fill="#fbbf24" opacity="0.5" />
                <ellipse cx="24" cy="17" rx="1.1" ry="0.6" fill="#fbbf24" opacity="0.5" />
              </svg>
            </motion.div>
          ))}
        </motion.div>
    </motion.div>
  );
}