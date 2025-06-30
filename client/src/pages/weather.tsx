import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CloudRain, Sun, Wind, Eye, RefreshCw, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useLocationState } from '@/hooks/use-location-state';
import { useWeatherByCity, useWeatherByCoords, useForecast } from '@/hooks/use-weather';
import { useLocationHistory } from '@/hooks/use-location-history';
import { useSettings } from '@/hooks/use-settings';
import { SearchBar } from '@/components/weather/SearchBar';
import { WeatherSidebar } from '@/components/weather/WeatherSidebar';
import { CurrentWeatherCard } from '@/components/weather/CurrentWeatherCard';
import { WeatherStatsGrid } from '@/components/weather/WeatherStatsGrid';
import { ForecastSection } from '@/components/weather/ForecastSection';
import { WeatherCharts } from '@/components/weather/WeatherCharts';
import { useTranslation } from '@/lib/i18n';

export default function WeatherPage() {
  const { locationState, setSelectedLocation, setCurrentLocation, refreshLocation } = useLocationState();
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();
  const { locations, saveLocation, toggleFavorite } = useLocationHistory();
  const { settings } = useSettings();
  const { t } = useTranslation(settings.weather.language);

  // Initial setup for current location if no location is selected
  useEffect(() => {
    if (latitude && longitude && locationState.isCurrentLocation && !locationState.coordinates) {
      setCurrentLocation({ lat: latitude, lon: longitude });
    }
  }, [latitude, longitude]);

  // Fetch weather data based on location state
  const { data: coordsWeatherData, isLoading: coordsLoading, error: coordsError } = useWeatherByCoords(
    locationState.isCurrentLocation ? latitude : locationState.coordinates?.lat || null, 
    locationState.isCurrentLocation ? longitude : locationState.coordinates?.lon || null
  );

  const { data: cityWeatherData, isLoading: cityLoading, error: cityError } = useWeatherByCity(
    locationState.selectedLocation || ''
  );

  const { data: forecastData, isLoading: forecastLoading, error: forecastError } = useForecast(
    locationState.selectedLocation || coordsWeatherData?.cityName || ''
  );

  // Determine which weather data to use
  const weatherData = locationState.selectedLocation ? cityWeatherData : coordsWeatherData;
  const isLoading = locationState.selectedLocation ? cityLoading : coordsLoading;
  const error = locationState.selectedLocation ? cityError : coordsError;

  // Handle city search
  const handleCitySearch = async (city: string) => {
    setSelectedLocation(city);

    // Save to recent locations after a short delay to let the data load
    setTimeout(async () => {
      try {
        const response = await fetch(`/api/weather/${encodeURIComponent(city)}`);
        if (response.ok) {
          const weatherData = await response.json();
          saveLocation(city, weatherData.country || 'Unknown', {
            lat: weatherData.latitude,
            lon: weatherData.longitude
          });
        }
      } catch (error) {
        console.error('Failed to save location:', error);
      }
    }, 1000);
  };

  // Handle current location button
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  // Handle refresh button
  const handleRefresh = () => {
    refreshLocation();
  };

  // Handle favorite toggle
  const handleToggleFavorite = () => {
    if (weatherData) {
      const existingLocation = locations.find((loc: any) => 
        loc.name.toLowerCase() === weatherData.cityName.toLowerCase()
      );

      if (existingLocation) {
        toggleFavorite(existingLocation.id);
      } else {
        // Add to favorites if not already in history - first save, then toggle to favorite
        saveLocation(weatherData.cityName, weatherData.country || 'Unknown', {
          lat: weatherData.latitude,
          lon: weatherData.longitude
        });

        // Find the newly added location and toggle it to favorite
        setTimeout(() => {
          const newLocation = locations.find((loc: any) => 
            loc.name.toLowerCase() === weatherData.cityName.toLowerCase()
          );
          if (newLocation) {
            toggleFavorite(newLocation.id);
          }
        }, 100);
      }
    }
  };

  // Check if current location is favorite
  const isCurrentLocationFavorite = weatherData ? 
    locations.some((loc: any) => 
      loc.name.toLowerCase() === weatherData.cityName.toLowerCase() && loc.favorite
    ) : false;

  // Background gradient effect elements
  const gradientElements = [
    { color: 'bg-primary/20', size: 'w-72 h-72', position: 'top-10 -left-4', delay: 0 },
    { color: 'bg-purple-500/20', size: 'w-72 h-72', position: 'top-1/3 -right-4', delay: 2 },
    { color: 'bg-yellow-500/20', size: 'w-72 h-72', position: '-bottom-8 left-20', delay: 4 },
  ];

  if (!geoLoading && geoError && !locationState.selectedLocation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div 
          className="glass-card rounded-3xl p-8 max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-foreground">Location Access Required</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Please enable location access or search for a city to view weather information.
          </p>
          <SearchBar onCitySearch={handleCitySearch} className="w-full" />
        </motion.div>
      </div>
    );
  }

  const content = (
    <>
      {/* Header */}
      <motion.header 
        className="ml-20 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Weather Dashboard</h1>
            <p className="text-muted-foreground">
              {weatherData ? `Current weather in ${weatherData.cityName}` : 'Real-time weather information'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Favorite Button */}
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleFavorite}
                  className="flex items-center gap-2 glass-card border-0 transition-all duration-200 hover:bg-yellow-500/20"
                  disabled={!weatherData}
                >
                  <Star 
                    className={`h-4 w-4 transition-all duration-300 ${
                      isCurrentLocationFavorite 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-muted-foreground hover:text-yellow-400'
                    }`} 
                  />
                  Favorite
                </Button>
              </motion.div>

              {/* Refresh Button */}
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="flex items-center gap-2 glass-card border-0 transition-all duration-200"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </motion.div>

              {/* Current Location Button */}
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCurrentLocation}
                  className="flex items-center gap-2 glass-card border-0 transition-all duration-200"
                  disabled={geoLoading}
                >
                  <MapPin className="h-4 w-4" />
                  Current Location
                </Button>
              </motion.div>
            </div>

            <SearchBar onCitySearch={handleCitySearch} className="lg:w-80" />
          </div>
        </div>
      </motion.header>

      {/* Loading State */}
      {isLoading && (
        <motion.div 
          className="glass-card rounded-3xl p-6 mb-6 ml-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-foreground">Loading weather data...</span>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div 
          className="glass-card rounded-3xl p-6 mb-6 ml-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <span className="text-foreground">Unable to load weather data. Please try again.</span>
          </div>
        </motion.div>
      )}

      {/* Weather Content */}
      {weatherData && (
        <>
          {/* Main Weather Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 ml-20">
            {/* Current Weather Card */}
            <motion.div
              className="xl:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <CurrentWeatherCard 
                weatherData={weatherData} 
                className="h-full" 
              />
            </motion.div>

            {/* Weather Stats Grid */}
            <motion.div
              className="xl:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <WeatherStatsGrid weatherData={weatherData} />
            </motion.div>
          </div>

          {/* Forecast Section */}
          {forecastLoading ? (
            <motion.div 
              className="glass-card rounded-3xl p-6 ml-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-3 ">
                <motion.div 
                  className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-foreground">Loading forecast data...</span>
              </div>
            </motion.div>
          ) : forecastError ? (
            <motion.div 
              className="glass-card rounded-3xl p-6 ml-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <span className="text-foreground">Unable to load forecast data</span>
              </div>
            </motion.div>
          ) : forecastData && forecastData.length > 0 ? (
            <>
              <ForecastSection forecastData={forecastData} />

              {/* Weather Charts */}
              <div className="mt-8 ml-20">
                <WeatherCharts forecastData={forecastData} />
              </div>
            </>
          ) : null}
        </>
      )}
    </>
  );

  return (
    <div className="p-6">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {gradientElements.map((element, index) => (
          <motion.div
            key={index}
            className={`absolute ${element.size} ${element.color} rounded-full mix-blend-multiply filter blur-xl opacity-70`}
            style={{ animationDelay: `${element.delay}s` }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: element.delay,
            }}
          />
        ))}
      </div>

      {content}
    </div>
  );
}