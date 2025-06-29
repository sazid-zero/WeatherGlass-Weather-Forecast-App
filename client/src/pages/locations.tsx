import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Trash2, Star, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { useLocation } from 'wouter';
import { SearchBar } from '@/components/weather/SearchBar';
import { useLocationHistory } from '@/hooks/use-location-history';
import { useLocationState } from '@/hooks/use-location-state';
import { useWeatherByCity } from '@/hooks/use-weather';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useSettings } from '@/hooks/use-settings';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getWeatherIcon, getWeatherColor } from '@/lib/weather-utils';

interface LocationWeatherCardProps {
  location: any;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
  onLocationSelect: (locationName: string) => void;
}

function LocationWeatherCard({ location, onToggleFavorite, onRemove, onLocationSelect }: LocationWeatherCardProps) {
  const { data: weatherData, isLoading } = useWeatherByCity(location.name);

  return (
    <motion.div
      className="glass-card rounded-2xl p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onLocationSelect(location.name)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">{location.name}</h3>
            <p className="text-sm text-muted-foreground">{location.country}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(location.id)}
            className="p-2 hover:bg-yellow-500/20"
          >
            <Star className={`h-4 w-4 ${location.favorite ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(location.id)}
            className="p-2 hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      ) : weatherData ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(weatherData.temperature)}°C
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground capitalize">
                {weatherData.weatherDescription}
              </div>
              <div className="text-xs text-muted-foreground">
                Feels like {Math.round(weatherData.feelsLike)}°C
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Droplets className="h-3 w-3 text-blue-500" />
              <span className="text-muted-foreground">{weatherData.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="h-3 w-3 text-green-500" />
              <span className="text-muted-foreground">{Math.round(weatherData.windSpeed)} m/s</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-purple-500" />
              <span className="text-muted-foreground">{Math.round(weatherData.visibility / 1000)} km</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">Weather data unavailable</div>
      )}
    </motion.div>
  );
}

export default function LocationsPage() {
  const { settings } = useSettings();
  const { latitude, longitude } = useGeolocation();
  const { setSelectedLocation } = useLocationState();
  const [, setLocation] = useLocation();
  const { 
    locations, 
    saveLocation, 
    toggleFavorite, 
    removeLocation, 
    getFavorites, 
    getRecent 
  } = useLocationHistory();

  const handleAddLocation = async (city: string) => {
    // Fetch weather data to get coordinates
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
  };

  const handleLocationSelect = (locationName: string) => {
    // Set the selected location in global state
    setSelectedLocation(locationName);
    // Navigate to home page
    setLocation('/');
  };

  const favorites = getFavorites();
  const recentLocations = getRecent(10).filter(loc => !loc.favorite);

  return (
    <div className="min-h-screen weather-gradient-bg">
      <div className="ml-24 p-6">
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Locations</h1>
              <p className="text-muted-foreground">Manage your saved weather locations</p>
            </div>
            
            <SearchBar onCitySearch={handleAddLocation} />
          </div>
        </motion.header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Favorite Locations */}
          <motion.section
            className="glass-card rounded-3xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Star className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-foreground">Favorites</h2>
            </div>
            
            <div className="grid gap-4">
              {favorites.length > 0 ? (
                favorites.map((location, index) => (
                  <LocationWeatherCard
                    key={location.id}
                    location={location}
                    onToggleFavorite={toggleFavorite}
                    onRemove={removeLocation}
                    onLocationSelect={handleLocationSelect}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Star className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p>No favorite locations yet</p>
                  <p className="text-sm">Search for a city above to add your first favorite</p>
                </div>
              )}
            </div>
          </motion.section>

          {/* Recent Locations */}
          <motion.section
            className="glass-card rounded-3xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Recent Locations</h2>
            </div>
            
            <div className="grid gap-4">
              {recentLocations.length > 0 ? (
                recentLocations.map((location, index) => (
                  <LocationWeatherCard
                    key={location.id}
                    location={location}
                    onToggleFavorite={toggleFavorite}
                    onRemove={removeLocation}
                    onLocationSelect={handleLocationSelect}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p>No recent locations</p>
                  <p className="text-sm">Your recently searched cities will appear here</p>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}