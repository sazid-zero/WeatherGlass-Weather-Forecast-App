import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationHistory } from '@/hooks/use-location-history';

interface SearchBarProps {
  onCitySearch: (city: string) => void;
  className?: string;
  placeholder?: string;
}

export function SearchBar({ onCitySearch, className = "", placeholder = "Search for cities..." }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { getRecent } = useLocationHistory();

  const popularCities = [
    'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore', 'Los Angeles',
    'Berlin', 'Rome', 'Barcelona', 'Amsterdam', 'Vienna', 'Prague', 'Mumbai', 'Delhi'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSearch = (city?: string) => {
    const searchCity = city || searchTerm.trim();
    if (searchCity) {
      onCitySearch(searchCity);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setIsOpen(true);
    
    if (value.trim()) {
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const recentLocations = getRecent(3);

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <motion.form 
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-1 flex items-center space-x-3 w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Search className="text-muted-foreground ml-4 h-4 w-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="bg-transparent outline-none flex-1 p-3 text-foreground placeholder:text-muted-foreground"
        />
      </motion.form>

      <AnimatePresence>
        {isOpen && (suggestions.length > 0 || recentLocations.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl border border-white/20 dark:border-white/10 backdrop-blur-sm z-50 max-h-64 overflow-y-auto"
          >
            {searchTerm && suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-muted-foreground px-2 py-1 font-medium">Suggestions</div>
                {suggestions.map((city, index) => (
                  <motion.button
                    key={city}
                    onClick={() => handleSearch(city)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{city}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {!searchTerm && recentLocations.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-muted-foreground px-2 py-1 font-medium">Recent Searches</div>
                {recentLocations.map((location, index) => (
                  <motion.button
                    key={location.id}
                    onClick={() => handleSearch(location.name)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-foreground">{location.name}</div>
                      <div className="text-xs text-muted-foreground">{location.country}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {!searchTerm && recentLocations.length === 0 && (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Start typing to search for cities
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
