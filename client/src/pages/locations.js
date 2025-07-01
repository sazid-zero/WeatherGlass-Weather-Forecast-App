import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { MapPin, Trash2, Star, Droplets, Wind, Eye } from 'lucide-react';
import { useLocation } from 'wouter';
import { SearchBar } from '@/components/weather/SearchBar';
import { useLocationHistory } from '@/hooks/use-location-history';
import { useLocationState } from '@/hooks/use-location-state';
import { useWeatherByCity } from '@/hooks/use-weather';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useSettings } from '@/hooks/use-settings';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n';
function LocationWeatherCard({ location, onToggleFavorite, onRemove, onLocationSelect }) {
    const { data: weatherData, isLoading } = useWeatherByCity(location.name);
    return (_jsxs(motion.div, { className: "glass-card rounded-2xl p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, whileHover: { y: -2 }, onClick: () => onLocationSelect(location.name), children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(MapPin, { className: "h-5 w-5 text-primary" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-foreground", children: location.name }), _jsx("p", { className: "text-sm text-muted-foreground", children: location.country })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                    e.stopPropagation();
                                    onToggleFavorite(location.id);
                                }, className: "p-2 hover:bg-yellow-500/20", children: _jsx(Star, { className: `h-4 w-4 ${location.favorite ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}` }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                    e.stopPropagation();
                                    onRemove(location.id);
                                }, className: "p-2 hover:bg-red-500/20", children: _jsx(Trash2, { className: "h-4 w-4 text-red-500" }) })] })] }), isLoading ? (_jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-20" }), _jsx(Skeleton, { className: "h-8 w-16" })] })) : weatherData ? (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-2xl font-bold text-foreground", children: [Math.round(weatherData.temperature), "\u00B0C"] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-sm text-muted-foreground capitalize", children: weatherData.weatherDescription }), _jsxs("div", { className: "text-xs text-muted-foreground", children: ["Feels like ", Math.round(weatherData.feelsLike), "\u00B0C"] })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Droplets, { className: "h-3 w-3 text-blue-500" }), _jsxs("span", { className: "text-muted-foreground", children: [weatherData.humidity, "%"] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Wind, { className: "h-3 w-3 text-green-500" }), _jsxs("span", { className: "text-muted-foreground", children: [Math.round(weatherData.windSpeed), " m/s"] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Eye, { className: "h-3 w-3 text-purple-500" }), _jsxs("span", { className: "text-muted-foreground", children: [Math.round(weatherData.visibility / 1000), " km"] })] })] })] })) : (_jsx("div", { className: "text-sm text-muted-foreground", children: "Weather data unavailable" }))] }));
}
export default function LocationsPage() {
    const { settings } = useSettings();
    const { latitude, longitude } = useGeolocation();
    const { setSelectedLocation } = useLocationState();
    const [, setLocation] = useLocation();
    const { t } = useTranslation(settings.weather.language);
    const { locations, saveLocation, toggleFavorite, removeLocation, getFavorites, getRecent } = useLocationHistory();
    const handleAddLocation = async (city) => {
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
        }
        catch (error) {
            console.error('Failed to save location:', error);
        }
    };
    const handleLocationSelect = (locationName) => {
        // Set the selected location in global state
        setSelectedLocation(locationName);
        // Navigate to home page
        setLocation('/');
    };
    const favorites = getFavorites();
    const recentLocations = getRecent(10).filter(loc => !loc.favorite);
    return (_jsx("div", { className: "min-h-screen weather-gradient-bg", children: _jsxs("div", { className: "ml-24 p-6", children: [_jsx(motion.header, { className: "mb-8", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-foreground mb-2", children: t('myLocations') }), _jsx("p", { className: "text-muted-foreground", children: t('manageLocations') })] }), _jsx(SearchBar, { onCitySearch: handleAddLocation })] }) }), _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-8", children: [_jsxs(motion.section, { className: "glass-card rounded-3xl p-6", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5 }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Star, { className: "h-6 w-6 text-yellow-500" }), _jsx("h2", { className: "text-xl font-semibold text-foreground", children: t('favorites') })] }), _jsx("div", { className: "grid gap-4", children: favorites.length > 0 ? (favorites.map((location, index) => (_jsx(LocationWeatherCard, { location: location, onToggleFavorite: toggleFavorite, onRemove: removeLocation, onLocationSelect: handleLocationSelect }, location.id)))) : (_jsxs("div", { className: "text-center text-muted-foreground py-8", children: [_jsx(Star, { className: "h-12 w-12 mx-auto mb-3 text-muted-foreground/50" }), _jsx("p", { children: t('noFavoriteLocations') }), _jsx("p", { className: "text-sm", children: t('addFirstFavorite') })] })) })] }), _jsxs(motion.section, { className: "glass-card rounded-3xl p-6", initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5, delay: 0.2 }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(MapPin, { className: "h-6 w-6 text-primary" }), _jsx("h2", { className: "text-xl font-semibold text-foreground", children: t('recentLocations') })] }), _jsx("div", { className: "grid gap-4", children: recentLocations.length > 0 ? (recentLocations.map((location, index) => (_jsx(LocationWeatherCard, { location: location, onToggleFavorite: toggleFavorite, onRemove: removeLocation, onLocationSelect: handleLocationSelect }, location.id)))) : (_jsxs("div", { className: "text-center text-muted-foreground py-8", children: [_jsx(MapPin, { className: "h-12 w-12 mx-auto mb-3 text-muted-foreground/50" }), _jsx("p", { children: t('noRecentLocations') }), _jsx("p", { className: "text-sm", children: t('recentSearchedCities') })] })) })] })] })] }) }));
}
