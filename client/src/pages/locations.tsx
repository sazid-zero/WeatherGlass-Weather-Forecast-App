import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Trash2, Star } from 'lucide-react';
import { SearchBar } from '@/components/weather/SearchBar';

export default function LocationsPage() {
  const [savedLocations, setSavedLocations] = useState([
    { id: 1, name: 'New York', country: 'US', favorite: true },
    { id: 2, name: 'London', country: 'UK', favorite: false },
    { id: 3, name: 'Tokyo', country: 'JP', favorite: false },
    { id: 4, name: 'Paris', country: 'FR', favorite: true },
  ]);

  const handleAddLocation = (city: string) => {
    const newLocation = {
      id: Date.now(),
      name: city,
      country: 'Unknown',
      favorite: false,
    };
    setSavedLocations([...savedLocations, newLocation]);
  };

  const toggleFavorite = (id: number) => {
    setSavedLocations(locations =>
      locations.map(loc =>
        loc.id === id ? { ...loc, favorite: !loc.favorite } : loc
      )
    );
  };

  const removeLocation = (id: number) => {
    setSavedLocations(locations => locations.filter(loc => loc.id !== id));
  };

  const favorites = savedLocations.filter(loc => loc.favorite);
  const others = savedLocations.filter(loc => !loc.favorite);

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
            
            <div className="space-y-4">
              {favorites.length > 0 ? (
                favorites.map((location, index) => (
                  <motion.div
                    key={location.id}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{location.name}</p>
                        <p className="text-sm text-muted-foreground">{location.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(location.id)}
                        className="p-2 rounded-lg hover:bg-yellow-500/20 transition-colors"
                      >
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </button>
                      <button
                        onClick={() => removeLocation(location.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No favorite locations yet</p>
              )}
            </div>
          </motion.section>

          {/* All Locations */}
          <motion.section
            className="glass-card rounded-3xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">All Locations</h2>
            </div>
            
            <div className="space-y-4">
              {others.map((location, index) => (
                <motion.div
                  key={location.id}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{location.name}</p>
                      <p className="text-sm text-muted-foreground">{location.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(location.id)}
                      className="p-2 rounded-lg hover:bg-yellow-500/20 transition-colors"
                    >
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => removeLocation(location.id)}
                      className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}