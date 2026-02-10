import { useState, useEffect } from 'react';
import { useSettings } from './use-settings';

export interface SavedLocation {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  favorite: boolean;
  lastAccessed: Date;
  addedAt: Date;
}

const LOCATION_HISTORY_KEY = 'weather-location-history';

export function useLocationHistory() {
  const { settings } = useSettings();
  const [locations, setLocations] = useState<SavedLocation[]>([]);

  useEffect(() => {
    if (settings.weather.saveLocationHistory) {
      try {
        const stored = localStorage.getItem(LOCATION_HISTORY_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Convert date strings back to Date objects
          const processedLocations = parsed.map((loc: any) => ({
            ...loc,
            lastAccessed: new Date(loc.lastAccessed),
            addedAt: new Date(loc.addedAt),
          }));
          setLocations(processedLocations);
        }
      } catch (error) {
        console.warn('Failed to load location history:', error);
      }
    }
  }, [settings.weather.saveLocationHistory]);

  const saveLocation = (name: string, country: string, coordinates: { lat: number; lon: number }) => {
    if (!settings.weather.saveLocationHistory) return;

    const existingIndex = locations.findIndex(loc => 
      loc.name.toLowerCase() === name.toLowerCase() && loc.country === country
    );

    if (existingIndex >= 0) {
      // Update existing location's last accessed time
      const updatedLocations = [...locations];
      updatedLocations[existingIndex] = {
        ...updatedLocations[existingIndex],
        lastAccessed: new Date(),
      };
      setLocations(updatedLocations);
      localStorage.setItem(LOCATION_HISTORY_KEY, JSON.stringify(updatedLocations));
    } else {
      // Add new location
      const newLocation: SavedLocation = {
        id: Date.now().toString(),
        name,
        country,
        coordinates,
        favorite: false,
        lastAccessed: new Date(),
        addedAt: new Date(),
      };
      
      const updatedLocations = [newLocation, ...locations.slice(0, 49)]; // Keep max 50 locations
      setLocations(updatedLocations);
      localStorage.setItem(LOCATION_HISTORY_KEY, JSON.stringify(updatedLocations));
    }
  };

  const toggleFavorite = (id: string, country: string, p0: { lat: number; lon: number; }) => {
    const updatedLocations = locations.map(loc =>
      loc.id === id ? { ...loc, favorite: !loc.favorite } : loc
    );
    setLocations(updatedLocations);
    localStorage.setItem(LOCATION_HISTORY_KEY, JSON.stringify(updatedLocations));
  };

  const removeLocation = (id: string) => {
    const updatedLocations = locations.filter(loc => loc.id !== id);
    setLocations(updatedLocations);
    localStorage.setItem(LOCATION_HISTORY_KEY, JSON.stringify(updatedLocations));
  };

  const clearHistory = () => {
    setLocations([]);
    localStorage.removeItem(LOCATION_HISTORY_KEY);
  };

  const getFavorites = () => locations.filter(loc => loc.favorite);
  const getRecent = (limit = 10) => locations
    .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())
    .slice(0, limit);

  return {
    locations,
    saveLocation,
    toggleFavorite,
    removeLocation,
    clearHistory,
    getFavorites,
    getRecent,
  };
}