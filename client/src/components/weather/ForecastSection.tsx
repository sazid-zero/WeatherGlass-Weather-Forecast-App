import { motion } from 'framer-motion';
import { getWeatherIcon, getWeatherColor, formatDate, formatTime } from '@/lib/weather-utils';
import type { ForecastData } from '@shared/schema';

interface ForecastSectionProps {
  forecastData: ForecastData[];
  className?: string;
}

export function ForecastSection({ forecastData, className = "" }: ForecastSectionProps) {
  // Group forecast data by day for daily forecast
  const dailyForecast = forecastData.reduce((acc, item) => {
    const date = new Date(item.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ForecastData[]>);

  // Get daily summary (first item of each day represents the day)
  const dailySummary = Object.entries(dailyForecast)
    .slice(0, 7)
    .map(([date, items]) => {
      const dayData = items[0];
      const maxTemp = Math.max(...items.map(item => item.tempMax));
      const minTemp = Math.min(...items.map(item => item.tempMin));
      return {
        ...dayData,
        date: new Date(date),
        tempMax: maxTemp,
        tempMin: minTemp,
      };
    });

  // Get today's hourly forecast (next 6 hours)
  const todayHourly = forecastData.slice(0, 6);

  return (
    <section className={`grid grid-cols-1 xl:grid-cols-2 gap-6 ${className}`}>
      {/* 7-Day Forecast */}
      <motion.div 
        className="glass-card rounded-3xl p-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">7-Day Forecast</h3>
          <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {dailySummary.map((day, index) => {
            const iconClass = getWeatherIcon(day.weatherMain, day.weatherIcon);
            const colorClass = getWeatherColor(day.weatherMain);
            const dayName = formatDate(day.date);
            
            return (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-4">
                  <i className={`${iconClass} ${colorClass} text-xl w-8`}></i>
                  <div>
                    <p className="font-medium text-foreground">{dayName}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {day.weatherDescription}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-foreground">
                    {Math.round(day.tempMax)}°
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {Math.round(day.tempMin)}°
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Hourly Forecast */}
      <motion.div 
        className="glass-card rounded-3xl p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold text-foreground mb-6">Today's Hourly Forecast</h3>
        
        <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
          {todayHourly.map((hour, index) => {
            const iconClass = getWeatherIcon(hour.weatherMain, hour.weatherIcon);
            const colorClass = getWeatherColor(hour.weatherMain);
            const time = formatTime(new Date(hour.date));
            
            return (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-muted-foreground w-12">
                    {time}
                  </span>
                  <i className={`${iconClass} ${colorClass} text-lg w-6`}></i>
                  <span className="text-sm text-muted-foreground">
                    {hour.precipitationChance}%
                  </span>
                </div>
                <span className="font-semibold text-foreground">
                  {Math.round(hour.temperature)}°
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
