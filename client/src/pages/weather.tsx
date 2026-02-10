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
import { queryClient } from '@/lib/queryClient';

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
  const { data: coordsWeatherData, isLoading: coordsLoading, error: coordsError, isFetching: coordsFetching, dataUpdatedAt: coordsUpdatedAt } = useWeatherByCoords(
    locationState.isCurrentLocation ? latitude : locationState.coordinates?.lat || null, 
    locationState.isCurrentLocation ? longitude : locationState.coordinates?.lon || null
  );

  const { data: cityWeatherData, isLoading: cityLoading, error: cityError, isFetching: cityFetching, dataUpdatedAt: cityUpdatedAt } = useWeatherByCity(
    locationState.selectedLocation || ''
  );

  const { data: forecastData, isLoading: forecastLoading, error: forecastError } = useForecast(
    locationState.selectedLocation || coordsWeatherData?.cityName || ''
  );

  // Determine which weather data to use
  const weatherData = locationState.selectedLocation ? cityWeatherData : coordsWeatherData;
  const isLoading = locationState.selectedLocation ? cityLoading : coordsLoading;
  const isFetching = locationState.selectedLocation ? cityFetching : coordsFetching;
  const lastWeatherData = locationState.selectedLocation ? cityWeatherData : coordsWeatherData;

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

  // Handle refresh button - force refetch data
  const handleRefresh = async () => {
    try {
      // Invalidate and refetch current weather data
      if (locationState.selectedLocation) {
        await queryClient.invalidateQueries({ 
          queryKey: ['/api/weather', locationState.selectedLocation] 
        });
        await queryClient.invalidateQueries({ 
          queryKey: ['/api/forecast', locationState.selectedLocation] 
        });
      } else if (latitude && longitude) {
        await queryClient.invalidateQueries({ 
          queryKey: ['/api/weather/coords', latitude, longitude] 
        });
        await queryClient.invalidateQueries({ 
          queryKey: ['/api/forecast/coords', latitude, longitude] 
        });
      }
      refreshLocation();
    } catch (error) {
      console.error('Error refreshing weather data:', error);
    }
  };

  // Handle favorite toggle
  const handleToggleFavorite = () => {
    if (weatherData) {
      toggleFavorite(weatherData.cityName, weatherData.country, {
        lat: weatherData.latitude,
        lon: weatherData.longitude
      });
    }
  };

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
        className=" ml-0 mb-6 mt-2 md:mt-0 px-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 md:mb-2 truncate">Weather Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground truncate">
              {weatherData ? `Current weather in ${weatherData.cityName}` : 'Real-time weather information'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {/* Favorite Button */}
              <motion.div
                className="flex-shrink-0"
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
                  className="flex items-center gap-2 glass-card border-0 transition-all duration-200 hover:bg-yellow-500/20 text-xs md:text-sm h-9 md:h-10"
                  disabled={!weatherData}
                >
                  <Star 
                    className={`h-3 w-3 md:h-4 md:w-4 transition-all duration-300 ${
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
                 className="flex-shrink-0"
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
                  className="flex items-center gap-2 glass-card border-0 transition-all duration-200 text-xs md:text-sm h-9 md:h-10"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </motion.div>

              {/* Current Location Button */}
              <motion.div
                 className="flex-shrink-0"
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
                  className="flex items-center gap-2 glass-card border-0 transition-all duration-200 text-xs md:text-sm h-9 md:h-10"
                  disabled={geoLoading}
                >
                  <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                  Current Location
                </Button>
              </motion.div>
            </div>

            <div className="w-full sm:w-auto sm:min-w-[200px] lg:w-80">
                <SearchBar onCitySearch={handleCitySearch} className="w-full" />
            </div>
          </div>
        </div>
      </motion.header>


      {/* Loading State - Show last known data with overlay spinner if fetching */}
      {isFetching && lastWeatherData && (
        <div className="relative">
          {/* Weather Content - Show last known data */}
          <div className="opacity-60 pointer-events-none select-none">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mb-8 md:ml-0 ml-0 place-items-stretch">
              <CurrentWeatherCard weatherData={lastWeatherData} className="h-full w-full max-w-full overflow-hidden" />
              <WeatherStatsGrid weatherData={lastWeatherData} className="col-span-1 xl:col-span-2 w-full max-w-full overflow-hidden" />
            </div>
          </div>
          {/* Overlay spinner */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div 
              className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full bg-background/80"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      )}

      {/* Error State */}
      {(locationState.selectedLocation ? cityError : coordsError) && !lastWeatherData && (
        <motion.div 
          className="glass-card rounded-3xl p-6 mb-6 md:ml-0 ml-0 shadow-xl shadow-black/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <span className="text-foreground">Unable to load weather data. Please try again.</span>
          </div>
        </motion.div>
      )}

      {/* Weather Content - Show immediately if cached data exists */}
      {weatherData && (
        <>
          {/* Main Weather Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 md:ml-0 ml-0 place-items-stretch">
            {/* Current Weather Card */}
            <motion.div
              className="xl:col-span-1 w-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <CurrentWeatherCard 
                weatherData={weatherData} 
                className="h-full w-full max-w-full" 
              />
            </motion.div>

            {/* Weather Stats Grid */}
            <motion.div
              className="xl:col-span-2 w-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <WeatherStatsGrid weatherData={weatherData} className="w-full max-w-full" />
            </motion.div>
          </div>

         {/* Forecast Section */}
          {forecastLoading && !forecastData ? (
          <motion.div 
            className="glass-card rounded-3xl p-6 shadow-xl shadow-black/10"
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
          ) : forecastError && !forecastData ? (
            <motion.div 
              className="glass-card rounded-3xl p-6 shadow-xl shadow-black/10"
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
              <div className="mt-8">
                <WeatherCharts forecastData={forecastData} />
              </div>
            </>
          ) : null}
        </>
      )}
    </>
  );

  return (
    <div className="p-3 pb-24 md:p-6 md:pb-6 w-full min-w-0 overflow-x-hidden">
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