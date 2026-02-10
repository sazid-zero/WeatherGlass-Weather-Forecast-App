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
import { useTranslation } from '@/lib/i18n';

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
      className="glass-card rounded-2xl p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onLocationSelect(location.name)}
    >
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <MapPin className="h-5 w-5 text-primary shrink-0" />
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{location.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{location.country}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(location.id);
            }}
            className="h-8 w-8 p-0 hover:bg-yellow-500/20"
          >
            <Star className={`h-4 w-4 ${location.favorite ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(location.id);
            }}
            className="h-8 w-8 p-0 hover:bg-red-500/20"
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
              {Math.round(weatherData.temperature)}C
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground capitalize">
                {weatherData.weatherDescription}
              </div>
              <div className="text-xs text-muted-foreground">
                Feels like {Math.round(weatherData.feelsLike)}C
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1 min-w-0">
              <Droplets className="h-3 w-3 text-blue-500 shrink-0" />
              <span className="text-muted-foreground truncate">{weatherData.humidity}%</span>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <Wind className="h-3 w-3 text-green-500 shrink-0" />
              <span className="text-muted-foreground truncate">{Math.round(weatherData.windSpeed)} m/s</span>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <Eye className="h-3 w-3 text-purple-500 shrink-0" />
              <span className="text-muted-foreground truncate">{Math.round(weatherData.visibility / 1000)} km</span>
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
  const { t } = useTranslation(settings.weather.language);
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
      <div className="md:ml-24 ml-0 p-4 md:p-6 pb-24 md:pb-6">
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">{t('myLocations')}</h1>
              <p className="text-sm text-muted-foreground">{t('manageLocations')}</p>
            </div>
            
            <div className="w-full md:w-80">
               <SearchBar onCitySearch={handleAddLocation} />
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Favorite Locations */}
          <motion.section
            className="glass-card rounded-3xl p-4 md:p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Star className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-foreground">{t('favorites')}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-4">
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
                <div className="col-span-full text-center text-muted-foreground py-8">
                  <Star className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p>{t('noFavoriteLocations')}</p>
                  <p className="text-sm">{t('addFirstFavorite')}</p>
                </div>
              )}
            </div>
          </motion.section>

          {/* Recent Locations */}
          <motion.section
            className="glass-card rounded-3xl p-4 md:p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">{t('recentLocations')}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-4">
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
                <div className="col-span-full text-center text-muted-foreground py-8">
                  <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p>{t('noRecentLocations')}</p>
                  <p className="text-sm">{t('recentSearchedCities')}</p>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}