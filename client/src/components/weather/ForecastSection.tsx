import { motion } from 'framer-motion';
import { formatDate } from '@/lib/weather-utils';
import type { ForecastData } from '@shared/schema';

interface ForecastSectionProps {
  forecastData: ForecastData[];
  className?: string;
}

export function ForecastSection({ forecastData, className = "" }: ForecastSectionProps) {
  if (!forecastData || forecastData.length === 0) {
    return (
      <motion.div 
        className={`glass-card rounded-3xl p-6 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-muted-foreground">Loading forecast data...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Group forecast data by day
  const dailyForecasts = forecastData.reduce((acc, forecast) => {
    const date = new Date(forecast.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(forecast);
    return acc;
  }, {} as Record<string, ForecastData[]>);

  const dailyAverages = Object.entries(dailyForecasts).map(([date, forecasts]) => {
    const avgTemp = forecasts.reduce((sum, f) => sum + f.temperature, 0) / forecasts.length;
    const maxTemp = Math.max(...forecasts.map(f => f.tempMax));
    const minTemp = Math.min(...forecasts.map(f => f.tempMin));
    const mainWeather = forecasts[0].weatherMain;
    
    return {
      date: new Date(date),
      avgTemp: Math.round(avgTemp),
      maxTemp: Math.round(maxTemp),
      minTemp: Math.round(minTemp),
      weatherMain: mainWeather,
      humidity: Math.round(forecasts.reduce((sum, f) => sum + f.humidity, 0) / forecasts.length)
    };
  }).slice(0, 7); // Show 7 days

  const getWeatherEmoji = (weather: string) => {
    switch (weather) {
      case 'Clear': return '☀️';
      case 'Clouds': return '☁️';
      case 'Rain': return '🌧️';
      case 'Snow': return '❄️';
      case 'Thunderstorm': return '⛈️';
      default: return '☁️';
    }
  };

  return (
    <motion.div 
      className={`glass-card rounded-3xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">7-Day Forecast</h3>
        <p className="text-muted-foreground">Extended weather outlook</p>
      </div>

      <div className="space-y-4">
        {dailyAverages.map((day, index) => (
          <motion.div
            key={day.date.toISOString()}
            className="glass-card-hover rounded-2xl p-4 flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <motion.div 
                className="text-3xl weather-icon-bounce"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {getWeatherEmoji(day.weatherMain)}
              </motion.div>
              <div>
                <p className="font-semibold">
                  {index === 0 ? 'Today' : 
                   index === 1 ? 'Tomorrow' : 
                   formatDate(day.date)}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {day.weatherMain}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="font-semibold">{day.humidity}%</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">{day.maxTemp}°</span>
                  <span className="text-lg text-muted-foreground">{day.minTemp}°</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hourly forecast for today */}
      {forecastData.length > 0 && (
        <motion.div 
          className="mt-8 pt-6 border-t border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h4 className="text-lg font-semibold mb-4">Today's Hourly Forecast</h4>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {forecastData.slice(0, 8).map((forecast, index) => (
              <motion.div
                key={forecast.id}
                className="glass-card-hover rounded-xl p-3 min-w-[100px] text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(forecast.date).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    hour12: true 
                  })}
                </p>
                <div className="text-2xl mb-2">
                  {getWeatherEmoji(forecast.weatherMain)}
                </div>
                <p className="font-semibold">{Math.round(forecast.temperature)}°</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {forecast.precipitationChance}%
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}