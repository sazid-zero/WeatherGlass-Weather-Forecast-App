import { motion } from 'framer-motion';
import { Wind, Sun, ArrowUp, ArrowDown, Leaf } from 'lucide-react';
import { 
  getWindDirection, 
  getUVIndexLevel, 
  getAirQualityLevel, 
  formatTime 
} from '@/lib/weather-utils';
import type { WeatherData } from '@shared/schema';
import { SpeedDisplay, PressureDisplay } from './UnitsDisplay';
import { SunriseIcon, SunsetIcon, WindIcon } from './WeatherIcon';

interface WeatherStatsGridProps {
  weatherData: WeatherData;
  className?: string;
}

export function WeatherStatsGrid({ weatherData, className = "" }: WeatherStatsGridProps) {
  const windDir = getWindDirection(weatherData.windDirection);
  const uvLevel = getUVIndexLevel(weatherData.uvIndex);
  const airQuality = weatherData.airQuality ? getAirQualityLevel(weatherData.airQuality) : null;
  const sunriseTime = formatTime(new Date(weatherData.sunrise));
  const sunsetTime = formatTime(new Date(weatherData.sunset));

  const statsData = [
    {
      title: "Wind Status",
      value: <SpeedDisplay speed={weatherData.windSpeed} />,
      icon: () => <WindIcon windSpeed={weatherData.windSpeed} className="h-6 w-6" />,
      iconBg: "text-blue-500",
      detail: windDir,
      bgIcon: "fas fa-wind"
    },
    {
      title: "UV Index",
      value: weatherData.uvIndex.toFixed(1),
      icon: Sun,
      iconBg: "text-yellow-500",
      detail: uvLevel.level,
      detailColor: uvLevel.color,
      bgIcon: "fas fa-sun",
      progress: Math.min(weatherData.uvIndex * 10, 100)
    },
    {
      title: "Sunrise & Sunset",
      value: null,
      icon: Sun,
      iconBg: "text-yellow-500",
      detail: null,
      bgIcon: "fas fa-sun",
      sunrise: sunriseTime,
      sunset: sunsetTime,
      customContent: true
    },
    {
      title: "Air Quality",
      value: weatherData.airQuality || "N/A",
      icon: Leaf,
      iconBg: "text-green-500",
      detail: airQuality?.level || "Unknown",
      detailColor: airQuality?.color || "text-muted-foreground",
      bgIcon: "fas fa-leaf"
    }
  ];

  return (
    <div className={`grid grid-cols-2 gap-6 ${className}`}>
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          className="glass-card rounded-3xl p-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Background Icon */}
          <motion.div 
            className="absolute top-4 right-4 opacity-10"
            animate={{ 
              rotate: [0, 10, -10, 0],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <i className={`${stat.bgIcon} text-4xl text-primary`}></i>
          </motion.div>
          
          <div className="relative z-10">
            <p className="text-muted-foreground text-sm font-medium mb-4">{stat.title}</p>
            
            {stat.title === "Sunrise & Sunset" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ArrowUp className="text-yellow-500 h-4 w-4" />
                    <span className="text-sm text-muted-foreground">Sunrise</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{stat.sunrise}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ArrowDown className="text-yellow-500 h-4 w-4" />
                    <span className="text-sm text-muted-foreground">Sunset</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{stat.sunset}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="text-3xl font-light text-foreground mb-3">
                  {stat.value}
                </div>
                
                {stat.progress !== undefined && (
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <motion.div 
                      className="bg-gradient-to-r from-green-400 to-red-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                )}
                
                {stat.title === "Wind Status" ? (
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center"
                      animate={{ rotate: weatherData.windDirection }}
                      transition={{ duration: 0.5 }}
                    >
                      <i className="fas fa-location-arrow text-primary text-xs"></i>
                    </motion.div>
                    <span className="text-sm text-muted-foreground">{stat.detail}</span>
                  </div>
                ) : stat.title === "Air Quality" && weatherData.airQuality ? (
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      weatherData.airQuality === 1 ? 'bg-green-400' :
                      weatherData.airQuality === 2 ? 'bg-yellow-400' :
                      weatherData.airQuality === 3 ? 'bg-orange-400' :
                      weatherData.airQuality === 4 ? 'bg-red-400' :
                      'bg-purple-400'
                    }`}></div>
                    <span className={`text-sm ${stat.detailColor}`}>{stat.detail}</span>
                  </div>
                ) : (
                  <span className={`text-sm ${stat.detailColor || 'text-muted-foreground'}`}>
                    {stat.detail}
                  </span>
                )}
              </>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
