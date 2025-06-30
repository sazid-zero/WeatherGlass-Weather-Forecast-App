import { motion } from 'framer-motion';
import { Eye, Wind, Droplets, Thermometer, Sun, Gauge } from 'lucide-react';
import { SunriseIcon, SunsetIcon, WindIcon, VisibilityIcon } from './WeatherIcon';
import { getUVIndexLevel, getAirQualityLevel, getWindDirection } from '@/lib/weather-utils';
import type { WeatherData } from '@shared/schema';

interface WeatherStatsGridProps {
  weatherData: WeatherData;
  className?: string;
}

export function WeatherStatsGrid({ weatherData, className = "" }: WeatherStatsGridProps) {
  const uvIndexInfo = getUVIndexLevel(weatherData.uvIndex || 0);
  const airQualityInfo = getAirQualityLevel(weatherData.airQuality || 1);
  const windDirection = getWindDirection(weatherData.windDirection);

  const stats = [
    {
      id: 'feels-like',
      title: 'Feels Like',
      value: `${Math.round(weatherData.feelsLike)}°`,
      description: 'Perceived temperature',
      icon: Thermometer,
      color: 'from-orange-400/20 to-red-400/20',
      iconColor: 'text-orange-400'
    },
    {
      id: 'humidity',
      title: 'Humidity',
      value: `${weatherData.humidity}%`,
      description: 'Moisture in air',
      icon: Droplets,
      color: 'from-blue-400/20 to-cyan-400/20',
      iconColor: 'text-blue-400'
    },
    {
      id: 'wind',
      title: 'Wind Status',
      value: `${weatherData.windSpeed} m/s`,
      description: `${windDirection}`,
      icon: Wind,
      color: 'from-green-400/20 to-emerald-400/20',
      iconColor: 'text-green-400',
      customIcon: WindIcon
    },
    {
      id: 'uv-index',
      title: 'UV Index',
      value: (weatherData.uvIndex || 0).toFixed(1),
      description: uvIndexInfo.level,
      icon: Sun,
      color: 'from-yellow-400/20 to-orange-400/20',
      iconColor: uvIndexInfo.color
    },
    {
      id: 'visibility',
      title: 'Visibility',
      value: `${(weatherData.visibility / 1000).toFixed(1)} km`,
      description: 'Clear distance',
      icon: Eye,
      color: 'from-indigo-400/20 to-purple-400/20',
      iconColor: 'text-indigo-400',
      customIcon: VisibilityIcon
    },
    {
      id: 'air-quality',
      title: 'Air Quality',
      value: (weatherData.airQuality || 1).toString(),
      description: airQualityInfo.level,
      icon: Gauge,
      color: 'from-purple-400/20 to-pink-400/20',
      iconColor: airQualityInfo.color
    }
  ];

  const sunData = [
    {
      id: 'sunrise',
      title: 'Sunrise',
      value: new Date(weatherData.sunrise).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      description: 'Morning light',
      icon: SunriseIcon,
      color: 'from-yellow-300/20 to-orange-300/20',
      iconColor: 'text-yellow-500'
    },
    {
      id: 'sunset',
      title: 'Sunset',
      value: new Date(weatherData.sunset).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      description: 'Evening light',
      icon: SunsetIcon,
      color: 'from-orange-400/20 to-red-400/20',
      iconColor: 'text-orange-500'
    }
  ];

  return (
    <div className={`weather-stats-grid ${className}`}>
      {/* Main weather stats */}
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          className={`glass-card-hover rounded-3xl p-6 bg-gradient-to-br  ${stat.color}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {stat.customIcon ? (
                <stat.customIcon className={`w-6 h-6 ${stat.iconColor}`} />
              ) : (
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              )}
              <h3 className="font-semibold text-foreground">{stat.title}</h3>
            </div>
          </div>
          
          <div className="space-y-2">
            <motion.p 
              className="text-3xl font-bold text-foreground"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            >
              {stat.value}
            </motion.p>
            <p className="text-sm text-muted-foreground">{stat.description}</p>
          </div>

          {/* Progress indicator for certain stats */}
          {stat.id === 'humidity' && (
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div 
                  className="bg-blue-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${weatherData.humidity}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                />
              </div>
            </div>
          )}

          {stat.id === 'uv-index' && (
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div 
                  className={`h-2 rounded-full ${
                    (weatherData.uvIndex || 0) <= 2 ? 'bg-green-400' :
                    (weatherData.uvIndex || 0) <= 5 ? 'bg-yellow-400' :
                    (weatherData.uvIndex || 0) <= 7 ? 'bg-orange-400' :
                    (weatherData.uvIndex || 0) <= 10 ? 'bg-red-400' :
                    'bg-purple-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((weatherData.uvIndex || 0) / 12) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                />
              </div>
            </div>
          )}
        </motion.div>
      ))}

      {/* Sun data in a combined card */}
      <motion.div
        className="glass-card-hover rounded-3xl p-6 bg-gradient-to-br from-amber-400/20 to-orange-400/20 md:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="font-semibold text-foreground mb-6 flex items-center space-x-2">
          <Sun className="w-5 h-5 text-yellow-500" />
          <span>Sun & Moon</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          {sunData.map((sun, index) => (
            <div key={sun.id} className="text-center">
              <motion.div 
                className="flex justify-center mb-3"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 + index * 0.1 }}
              >
                <sun.icon className={`w-8 h-8 ${sun.iconColor}`} />
              </motion.div>
              <motion.p 
                className="text-2xl font-bold text-foreground mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              >
                {sun.value}
              </motion.p>
              <p className="text-sm text-muted-foreground">{sun.title}</p>
            </div>
          ))}
        </div>

        {/* Day length calculation */}
        <motion.div 
          className="mt-6 pt-4 border-t border-white/20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <p className="text-sm text-muted-foreground mb-1">Day Length</p>
          <p className="font-semibold">
            {(() => {
              const sunrise = new Date(weatherData.sunrise);
              const sunset = new Date(weatherData.sunset);
              const dayLength = sunset.getTime() - sunrise.getTime();
              const hours = Math.floor(dayLength / (1000 * 60 * 60));
              const minutes = Math.floor((dayLength % (1000 * 60 * 60)) / (1000 * 60));
              return `${hours}h ${minutes}m`;
            })()}
          </p>
        </motion.div>
      </motion.div>

      {/* Atmospheric pressure card */}
      <motion.div
        className="glass-card-hover rounded-3xl p-6 bg-gradient-to-br from-slate-400/20 to-gray-400/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Gauge className="w-6 h-6 text-slate-400" />
            <h3 className="font-semibold text-foreground">Pressure</h3>
          </div>
        </div>
        
        <div className="space-y-2">
          <motion.p 
            className="text-3xl font-bold text-foreground"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            {weatherData.pressure} hPa
          </motion.p>
          <p className="text-sm text-muted-foreground">
            {weatherData.pressure > 1013 ? 'High pressure' : 
             weatherData.pressure < 1009 ? 'Low pressure' : 
             'Normal pressure'}
          </p>
        </div>

        <div className="mt-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div 
              className={`h-2 rounded-full ${
                weatherData.pressure > 1020 ? 'bg-green-400' :
                weatherData.pressure > 1013 ? 'bg-blue-400' :
                weatherData.pressure > 1009 ? 'bg-yellow-400' :
                'bg-red-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(((weatherData.pressure - 980) / 60) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 1.4 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}