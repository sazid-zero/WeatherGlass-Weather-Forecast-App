import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CloudRain, Sun, Wind, Eye } from 'lucide-react';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useWeatherByCity, useWeatherByCoords, useForecast } from '@/hooks/use-weather';
import { SearchBar } from '@/components/weather/SearchBar';
import { WeatherSidebar } from '@/components/weather/WeatherSidebar';
import { CurrentWeatherCard } from '@/components/weather/CurrentWeatherCard';
import { WeatherStatsGrid } from '@/components/weather/WeatherStatsGrid';
import { ForecastSection } from '@/components/weather/ForecastSection';
import { WeatherCharts } from '@/components/weather/WeatherCharts';

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();

  // Fetch weather data based on coordinates or selected city
  const { data: coordsWeatherData, isLoading: coordsLoading, error: coordsError } = useWeatherByCoords(
    latitude, 
    longitude
  );
  
  const { data: cityWeatherData, isLoading: cityLoading, error: cityError } = useWeatherByCity(
    selectedCity
  );

  const { data: forecastData, isLoading: forecastLoading, error: forecastError } = useForecast(
    selectedCity || coordsWeatherData?.cityName || ''
  );

  // Determine which weather data to use
  const weatherData = selectedCity ? cityWeatherData : coordsWeatherData;
  const isLoading = selectedCity ? cityLoading : coordsLoading;
  const error = selectedCity ? cityError : coordsError;

  // Handle city search
  const handleCitySearch = (city: string) => {
    setSelectedCity(city);
  };

  // Background gradient effect elements
  const gradientElements = [
    { color: 'bg-primary/20', size: 'w-72 h-72', position: 'top-10 -left-4', delay: 0 },
    { color: 'bg-purple-500/20', size: 'w-72 h-72', position: 'top-1/3 -right-4', delay: 2 },
    { color: 'bg-yellow-500/20', size: 'w-72 h-72', position: '-bottom-8 left-20', delay: 4 },
  ];

  if (!geoLoading && geoError && !selectedCity) {
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
        className="mb-8"
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
          <SearchBar onCitySearch={handleCitySearch} className="lg:w-80" />
        </div>
      </motion.header>

      {/* Loading State */}
      {isLoading && (
        <motion.div 
          className="glass-card rounded-3xl p-6 mb-6"
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
          className="glass-card rounded-3xl p-6 mb-6"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Current Weather Card */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <CurrentWeatherCard weatherData={weatherData} className="h-full" />
            </motion.div>

            {/* Weather Stats Grid */}
            <motion.div
              className="lg:col-span-2"
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
              className="glass-card rounded-3xl p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-3">
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
              className="glass-card rounded-3xl p-6"
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
    <div className="p-4 sm:p-6 max-w-full overflow-x-hidden">
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

      <div className="max-w-7xl mx-auto">
        {content}
      </div>
    </div>
  );
}