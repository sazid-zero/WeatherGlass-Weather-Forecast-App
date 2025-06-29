import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WeatherSidebar } from '@/components/weather/WeatherSidebar';
import { SearchBar } from '@/components/weather/SearchBar';
import { CurrentWeatherCard } from '@/components/weather/CurrentWeatherCard';
import { WeatherStatsGrid } from '@/components/weather/WeatherStatsGrid';
import { ForecastSection } from '@/components/weather/ForecastSection';
import { useWeatherByCity, useWeatherByCoords, useForecast } from '@/hooks/use-weather';
import { useGeolocation } from '@/hooks/use-geolocation';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [useDemoData, setUseDemoData] = useState(false);
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();
  
  // Weather queries
  const { data: weatherByCity, error: cityError, isLoading: cityLoading } = useWeatherByCity(selectedCity);
  const { data: weatherByCoords, error: coordsError, isLoading: coordsLoading } = useWeatherByCoords(latitude, longitude);
  const { data: forecastData, error: forecastError, isLoading: forecastApiLoading } = useForecast(
    selectedCity || (weatherByCoords?.cityName || '')
  );

  // Demo data for showcasing glassmorphism effects
  const demoWeatherData = {
    id: 1,
    cityName: 'New York',
    country: 'US',
    latitude: 40.7128,
    longitude: -74.0060,
    temperature: 22.5,
    feelsLike: 25.2,
    humidity: 65,
    pressure: 1013,
    windSpeed: 8.5,
    windDirection: 225,
    visibility: 10000,
    uvIndex: 6.2,
    weatherMain: 'Clear',
    weatherDescription: 'clear sky',
    weatherIcon: '01d',
    sunrise: new Date(Date.now() - 2 * 60 * 60 * 1000),
    sunset: new Date(Date.now() + 8 * 60 * 60 * 1000),
    airQuality: 2,
    createdAt: new Date(),
  };

  const demoForecastData = Array.from({ length: 35 }, (_, i) => ({
    id: i + 1,
    cityName: 'New York',
    date: new Date(Date.now() + i * 3 * 60 * 60 * 1000),
    temperature: 22 + Math.sin(i * 0.3) * 8,
    tempMin: 18 + Math.sin(i * 0.3) * 6,
    tempMax: 26 + Math.sin(i * 0.3) * 8,
    humidity: 60 + Math.sin(i * 0.2) * 20,
    windSpeed: 5 + Math.sin(i * 0.1) * 5,
    weatherMain: ['Clear', 'Clouds', 'Rain'][i % 3],
    weatherDescription: ['clear sky', 'few clouds', 'light rain'][i % 3],
    weatherIcon: ['01d', '02d', '10d'][i % 3],
    precipitationChance: Math.abs(Math.sin(i * 0.4)) * 80,
    createdAt: new Date(),
  }));

  // Check if API errors suggest we should use demo data
  const apiUnavailable = (cityError || coordsError) && 
    ((cityError as any)?.message?.includes('401') || (coordsError as any)?.message?.includes('401'));

  // Determine which weather data to use
  const weatherData = useDemoData || apiUnavailable ? demoWeatherData : (selectedCity ? weatherByCity : weatherByCoords);
  const currentForecast = useDemoData || apiUnavailable ? demoForecastData : forecastData;
  const currentCity = weatherData?.cityName || '';
  const weatherLoading = useDemoData || apiUnavailable ? false : (selectedCity ? cityLoading : coordsLoading);
  const weatherError = useDemoData || apiUnavailable ? null : (selectedCity ? cityError : coordsError);
  const currentForecastLoading = useDemoData || apiUnavailable ? false : forecastApiLoading;

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
                {(useDemoData || apiUnavailable) && (
                  <span className="ml-2 text-primary text-sm font-medium">Demo Mode</span>
                )}
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
            {currentForecastLoading ? (
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
            ) : (!useDemoData && !apiUnavailable && forecastError) ? (
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
            ) : currentForecast && currentForecast.length > 0 ? (
              <ForecastSection forecastData={currentForecast} />
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
