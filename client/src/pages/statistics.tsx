import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Activity, Calendar, MapPin, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { useWeatherStatistics } from '@/hooks/use-weather-statistics';
import { useLocationHistory } from '@/hooks/use-location-history';
import { useSettings } from '@/hooks/use-settings';
import { SearchBar } from '@/components/weather/SearchBar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n';

export default function StatisticsPage() {
  const { getFavorites, getRecent } = useLocationHistory();
  const { settings } = useSettings();
  const { t } = useTranslation(settings.weather.language);
  const [selectedCity, setSelectedCity] = useState<string>('');
  
  // Get available cities from location history
  const favoriteLocations = getFavorites();
  const recentLocations = getRecent(5);
  const allLocations = [...favoriteLocations, ...recentLocations.filter(loc => !favoriteLocations.find(fav => fav.id === loc.id))];
  
  // Default to first available city
  const defaultCity = allLocations.length > 0 ? allLocations[0].name : 'London';
  const currentCity = selectedCity || defaultCity;
  
  const { data: statsData, isLoading, error } = useWeatherStatistics(currentCity);

  const handleCitySearch = (city: string) => {
    setSelectedCity(city);
  };

  return (
    <div className="min-h-screen weather-gradient-bg">
      <div className="ml-16 sm:ml-20 p-4 sm:p-6">
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{t('statistics')}</h1>
              <p className="text-muted-foreground">Detailed analytics and trends for {currentCity}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {allLocations.length > 0 && (
                <Select value={currentCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {allLocations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {location.name}, {location.country}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <SearchBar onCitySearch={handleCitySearch} />
            </div>
          </div>
        </motion.header>

        {/* Key Statistics */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="glass-card rounded-3xl p-6">
                <Skeleton className="h-6 w-6 mb-4" />
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-32 mb-3" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="glass-card rounded-3xl p-8 mb-8 text-center">
            <p className="text-muted-foreground">Failed to load weather statistics for {currentCity}</p>
            <p className="text-sm text-muted-foreground mt-2">Please try a different city or check your connection</p>
          </div>
        ) : statsData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <motion.div
              className="glass-card rounded-3xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <Thermometer className="h-6 w-6 text-primary" />
                <div className={`flex items-center text-sm ${
                  statsData.temperature.trend === 'up' ? 'text-green-500' : 
                  statsData.temperature.trend === 'down' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    statsData.temperature.trend === 'down' ? 'rotate-180' : 
                    statsData.temperature.trend === 'stable' ? 'rotate-90' : ''
                  }`} />
                  {statsData.temperature.current - statsData.temperature.average > 0 ? '+' : ''}
                  {(statsData.temperature.current - statsData.temperature.average).toFixed(1)}°
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-2xl font-bold text-foreground">{statsData.temperature.current}°C</div>
                <div className="text-sm text-muted-foreground">Average Temperature</div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Min: {statsData.temperature.min}° | Max: {statsData.temperature.max}°
              </div>
            </motion.div>

            <motion.div
              className="glass-card rounded-3xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <Droplets className="h-6 w-6 text-blue-500" />
                <div className={`flex items-center text-sm ${
                  statsData.humidity.trend === 'up' ? 'text-green-500' : 
                  statsData.humidity.trend === 'down' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    statsData.humidity.trend === 'down' ? 'rotate-180' : 
                    statsData.humidity.trend === 'stable' ? 'rotate-90' : ''
                  }`} />
                  {statsData.humidity.current - statsData.humidity.average > 0 ? '+' : ''}
                  {(statsData.humidity.current - statsData.humidity.average).toFixed(0)}%
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-2xl font-bold text-foreground">{statsData.humidity.current}%</div>
                <div className="text-sm text-muted-foreground">Humidity Level</div>
              </div>
            </motion.div>

            <motion.div
              className="glass-card rounded-3xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <Wind className="h-6 w-6 text-green-500" />
                <div className={`flex items-center text-sm ${
                  statsData.wind.trend === 'up' ? 'text-green-500' : 
                  statsData.wind.trend === 'down' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    statsData.wind.trend === 'down' ? 'rotate-180' : 
                    statsData.wind.trend === 'stable' ? 'rotate-90' : ''
                  }`} />
                  {statsData.wind.current - statsData.wind.average > 0 ? '+' : ''}
                  {(statsData.wind.current - statsData.wind.average).toFixed(1)}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-2xl font-bold text-foreground">{statsData.wind.current} m/s</div>
                <div className="text-sm text-muted-foreground">Wind Speed</div>
              </div>
            </motion.div>

            <motion.div
              className="glass-card rounded-3xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <Calendar className="h-6 w-6 text-purple-500" />
                <div className="text-sm text-muted-foreground">7 days</div>
              </div>
              
              <div className="mb-3">
                <div className="text-2xl font-bold text-foreground">{statsData.conditions.rainy}</div>
                <div className="text-sm text-muted-foreground">Rainy Days</div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Sunny: {statsData.conditions.sunny} | Cloudy: {statsData.conditions.cloudy}
              </div>
            </motion.div>
          </div>
        ) : null}

        {/* Weekly Chart */}
        {statsData && (
          <motion.section
            className="glass-card rounded-3xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">Weekly Overview</h2>
            
            {statsData.weeklyData.length > 0 ? (
              <div className="grid grid-cols-7 gap-4">
                {statsData.weeklyData.map((day, index) => (
                  <motion.div
                    key={day.day}
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  >
                    <div className="text-sm text-muted-foreground mb-2">{day.day}</div>
                    
                    {/* Temperature Bar */}
                    <div className="bg-primary/20 rounded-lg p-3 mb-2">
                      <div className="text-lg font-bold text-foreground">{day.temp}°</div>
                      <div className="text-xs text-muted-foreground">Temp</div>
                    </div>
                    
                    {/* Humidity Bar */}
                    <div className="bg-blue-500/20 rounded-lg p-2 mb-2">
                      <div className="text-sm font-semibold text-foreground">{day.humidity}%</div>
                      <div className="text-xs text-muted-foreground">Humidity</div>
                    </div>
                    
                    {/* Wind Bar */}
                    <div className="bg-green-500/20 rounded-lg p-2">
                      <div className="text-sm font-semibold text-foreground">{day.wind}</div>
                      <div className="text-xs text-muted-foreground">Wind</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p>No weekly forecast data available</p>
              </div>
            )}
          </motion.section>
        )}

        {/* Additional Stats */}
        {statsData && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <motion.section
              className="glass-card rounded-3xl p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Temperature Trends</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Highest this week</span>
                  <span className="font-semibold text-foreground">{statsData.temperature.max}°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Lowest this week</span>
                  <span className="font-semibold text-foreground">{statsData.temperature.min}°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average</span>
                  <span className="font-semibold text-foreground">{statsData.temperature.average}°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current</span>
                  <span className="font-semibold text-primary">{statsData.temperature.current}°C</span>
                </div>
              </div>
            </motion.section>

            <motion.section
              className="glass-card rounded-3xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Weather Patterns</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sunny days</span>
                  <span className="font-semibold text-green-500">{statsData.conditions.sunny} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cloudy days</span>
                  <span className="font-semibold text-yellow-500">{statsData.conditions.cloudy} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Rainy days</span>
                  <span className="font-semibold text-blue-500">{statsData.conditions.rainy} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Stormy days</span>
                  <span className="font-semibold text-purple-500">{statsData.conditions.stormy} days</span>
                </div>
              </div>
            </motion.section>
          </div>
        )}
      </div>
    </div>
  );
}