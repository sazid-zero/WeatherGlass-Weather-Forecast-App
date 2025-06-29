import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WeatherSidebar } from '@/components/weather/WeatherSidebar';
import { SearchBar } from '@/components/weather/SearchBar';
import { CurrentWeatherCard } from '@/components/weather/CurrentWeatherCard';
import { WeatherStatsGrid } from '@/components/weather/WeatherStatsGrid';
import { ForecastSection } from '@/components/weather/ForecastSection';
import { WeatherCharts } from '@/components/weather/WeatherCharts';
import { useWeatherByCity, useWeatherByCoords, useForecast } from '@/hooks/use-weather';
import { useGeolocation } from '@/hooks/use-geolocation';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();
  
  // Weather queries
  const { data: weatherByCity, error: cityError, isLoading: cityLoading } = useWeatherByCity(selectedCity);
  const { data: weatherByCoords, error: coordsError, isLoading: coordsLoading } = useWeatherByCoords(latitude, longitude);
  const { data: forecastData, error: forecastError, isLoading: forecastLoading } = useForecast(
    selectedCity || (weatherByCoords?.cityName || '')
  );

  // Determine which weather data to use
  const weatherData = selectedCity ? weatherByCity : weatherByCoords;
  const currentCity = weatherData?.cityName || '';
  const weatherLoading = selectedCity ? cityLoading : coordsLoading;
  const weatherError = selectedCity ? cityError : coordsError;

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
      <div className="min-h-screen weather-gradient-bg flex items-center justify-center">
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

  return (
    <div className="min-h-screen weather-gradient-bg">
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

      <WeatherSidebar />

      {/* Main Content */}
      <main className="ml-24 p-6">
        {/* Header */}
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Today's Weather</h1>
              <p className="text-muted-foreground">
                {currentCity ? `${currentCity}, ${weatherData?.country || ''}` : 'Select a location'}
              </p>
            </div>
            
            <SearchBar onCitySearch={handleCitySearch} />
          </div>
        </motion.header>

        {/* Loading State */}
        {(weatherLoading || geoLoading) && (
          <motion.div 
            className="flex items-center justify-center min-h-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="glass-card rounded-3xl p-8 flex items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-lg font-medium text-foreground">Loading weather data...</span>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {weatherError && !weatherLoading && (
          <motion.div 
            className="glass-card rounded-3xl p-8 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Error Loading Weather Data</h2>
                <p className="text-muted-foreground mt-1">
                  {weatherError instanceof Error ? weatherError.message : 'Unable to fetch weather information'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Weather Content */}
        {weatherData && !weatherLoading && (
          <>
            {/* Main Weather Display */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <CurrentWeatherCard weatherData={weatherData} className="lg:col-span-1" />
              <WeatherStatsGrid weatherData={weatherData} className="lg:col-span-2" />
            </section>

            {/* Forecast Section */}
            {forecastLoading ? (
              <motion.div 
                className="flex items-center justify-center min-h-[200px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="glass-card rounded-3xl p-6 flex items-center gap-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="font-medium text-foreground">Loading forecast...</span>
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
      </main>
    </div>
  );
}
