// No local selectedCity state needed
import { useLocationState } from '@/hooks/use-location-state';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Activity, Calendar, MapPin, Thermometer, Droplets, Wind, Eye, Sun, Moon } from 'lucide-react';
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
  const { locationState, setSelectedLocation, setCurrentLocation } = useLocationState();

  // Get available cities from location history
  const favoriteLocations = getFavorites();
  const recentLocations = getRecent(5);
  const allLocations = [...favoriteLocations, ...recentLocations.filter(loc => !favoriteLocations.find(fav => fav.id === loc.id))];


  // Use coordinates if current location, else use selected city name
  let statsLocation: string | { lat: number; lon: number } | null = null;
  let displayLocation = 'London';
  if (locationState.isCurrentLocation && locationState.coordinates) {
    statsLocation = locationState.coordinates;
    displayLocation = 'Current Location';
  } else if (locationState.selectedLocation) {
    statsLocation = locationState.selectedLocation;
    displayLocation = locationState.selectedLocation;
  } else if (allLocations.length > 0) {
    statsLocation = allLocations[0].name;
    displayLocation = allLocations[0].name;
  } else {
    statsLocation = 'London';
    displayLocation = 'London';
  }

  const { data: statsData, isLoading, error } = useWeatherStatistics(statsLocation);

  // When user selects a city, update the global selected location (syncs with home)
  const handleCitySearch = (city: string) => {
    setSelectedLocation(city);
  };

  return (
    <div className="min-h-screen weather-gradient-bg">
      <div className="md:ml-24 ml-0 p-4 md:p-6 pb-24 md:pb-6">
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{t('statistics')}</h1>
              <p className="text-muted-foreground">Detailed analytics and trends for {displayLocation}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              {allLocations.length > 0 && (
                <Select value={displayLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full sm:w-48">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setCurrentLocation({
                          lat: position.coords.latitude,
                          lon: position.coords.longitude
                        });
                      },
                      (error) => {
                        // Optionally show a toast or alert
                        console.error('Geolocation error:', error);
                      }
                    );
                  }
                }}
                className="w-full sm:w-auto flex items-center gap-2 glass-card border-0 transition-all duration-200 justify-center"
              >
                <MapPin className="h-4 w-4" />
                Current Location
              </Button>
              <div className="w-full md:w-80">
                <SearchBar onCitySearch={handleCitySearch} />
              </div>
            </div>
          </div>
        </motion.header>

        {/* Key Statistics */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
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
            <p className="text-muted-foreground">Failed to load weather statistics for {displayLocation}</p>
            <p className="text-sm text-muted-foreground mt-2">Please try a different city or check your connection</p>
          </div>
        ) : statsData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
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
                  {(statsData.temperature.current - statsData.temperature.average).toFixed(1)}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-2xl font-bold text-foreground">{statsData.temperature.current}C</div>
                <div className="text-sm text-muted-foreground">Average Temperature</div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Min: {statsData.temperature.min} | Max: {statsData.temperature.max}
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
              <div className="flex overflow-x-auto pb-4 md:pb-0 gap-4 md:grid md:grid-cols-7 md:overflow-visible">
                {statsData.weeklyData.map((day, index) => (
                  <motion.div
                    key={day.day}
                    className="text-center min-w-[100px] md:min-w-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  >
                    <div className="text-sm text-muted-foreground mb-2">{day.day}</div>
                    
                    {/* Temperature Bar */}
                    <div className="bg-primary/20 rounded-lg p-3 mb-2">
                      <div className="text-lg font-bold text-foreground">{day.temp}</div>
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
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Activity className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Health & Safety</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4">
                  <div className="text-sm text-muted-foreground mb-2">UV Index</div>
                  <div className="text-2xl font-bold text-foreground mb-1">{statsData.health.uvIndex}</div>
                  <div className="text-xs text-muted-foreground">Moderate</div>
                </div>
                
                <div className="bg-white/5 rounded-2xl p-4">
                  <div className="text-sm text-muted-foreground mb-2">Air Quality</div>
                  <div className="text-2xl font-bold text-foreground mb-1">{statsData.health.airQuality}</div>
                  <div className="text-xs text-muted-foreground">Good</div>
                </div>
                
                <div className="bg-white/5 rounded-2xl p-4">
                  <div className="text-sm text-muted-foreground mb-2">Pollen Count</div>
                  <div className="text-2xl font-bold text-foreground mb-1">{statsData.health.pollenCount}</div>
                  <div className="text-xs text-muted-foreground">Low Risk</div>
                </div>
                
                <div className="bg-white/5 rounded-2xl p-4">
                  <div className="text-sm text-muted-foreground mb-2">Pressure</div>
                  <div className="text-2xl font-bold text-foreground mb-1">{statsData.health.pressure} hPa</div>
                  <div className="text-xs text-muted-foreground">Stable</div>
                </div>
              </div>
            </motion.section>

            <motion.section
              className="glass-card rounded-3xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Sun className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-foreground">Sun & Moon</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm">Sunrise</span>
                    </div>
                    <span className="font-semibold">{statsData.astronomy.sunrise}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="h-5 w-5 text-orange-500" />
                      <span className="text-sm">Sunset</span>
                    </div>
                    <span className="font-semibold">{statsData.astronomy.sunset}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="h-5 w-5 text-blue-300" />
                      <span className="text-sm">Moonrise</span>
                    </div>
                    <span className="font-semibold">{statsData.astronomy.moonrise}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="h-5 w-5 text-slate-400" />
                      <span className="text-sm">Moonset</span>
                    </div>
                    <span className="font-semibold">{statsData.astronomy.moonset}</span>
                  </div>
                </div>

                <div className="col-span-full pt-4 border-t border-white/10">
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Moon Phase</span>
                     <span className="font-semibold">{statsData.astronomy.moonPhase}</span>
                   </div>
                   <div className="w-full bg-secondary/30 h-2 rounded-full mt-2 overflow-hidden">
                     <div className="bg-blue-200 h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(191,219,254,0.5)]" />
                   </div>
                </div>
              </div>
            </motion.section>
          </div>
        )}
      </div>
    </div>
  );
}