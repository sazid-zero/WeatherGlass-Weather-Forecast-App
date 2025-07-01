import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useLocationState } from '@/hooks/use-location-state';
import { useWeatherByCity, useWeatherByCoords, useForecast } from '@/hooks/use-weather';
import { useLocationHistory } from '@/hooks/use-location-history';
import { useSettings } from '@/hooks/use-settings';
import { SearchBar } from '@/components/weather/SearchBar';
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
    const { data: coordsWeatherData, isLoading: coordsLoading, error: coordsError, isFetching: coordsFetching, dataUpdatedAt: coordsUpdatedAt } = useWeatherByCoords(locationState.isCurrentLocation ? latitude : locationState.coordinates?.lat || null, locationState.isCurrentLocation ? longitude : locationState.coordinates?.lon || null);
    const { data: cityWeatherData, isLoading: cityLoading, error: cityError, isFetching: cityFetching, dataUpdatedAt: cityUpdatedAt } = useWeatherByCity(locationState.selectedLocation || '');
    const { data: forecastData, isLoading: forecastLoading, error: forecastError } = useForecast(locationState.selectedLocation || coordsWeatherData?.cityName || '');
    // Determine which weather data to use
    const weatherData = locationState.selectedLocation ? cityWeatherData : coordsWeatherData;
    const isLoading = locationState.selectedLocation ? cityLoading : coordsLoading;
    const isFetching = locationState.selectedLocation ? cityFetching : coordsFetching;
    const lastWeatherData = locationState.selectedLocation ? cityWeatherData : coordsWeatherData;
    // Handle city search
    const handleCitySearch = async (city) => {
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
            }
            catch (error) {
                console.error('Failed to save location:', error);
            }
        }, 1000);
    };
    // Handle current location button
    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            }, (error) => {
                console.error('Geolocation error:', error);
            });
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
            }
            else if (latitude && longitude) {
                await queryClient.invalidateQueries({
                    queryKey: ['/api/weather/coords', latitude, longitude]
                });
                if (coordsWeatherData?.cityName) {
                    await queryClient.invalidateQueries({
                        queryKey: ['/api/forecast', coordsWeatherData.cityName]
                    });
                }
            }
            // Also refresh location state
            refreshLocation();
        }
        catch (error) {
            console.error('Failed to refresh weather data:', error);
        }
    };
    // Handle favorite toggle
    const handleToggleFavorite = () => {
        if (weatherData) {
            const existingLocation = locations.find((loc) => loc.name.toLowerCase() === weatherData.cityName.toLowerCase());
            if (existingLocation) {
                toggleFavorite(existingLocation.id);
            }
            else {
                // Add to favorites if not already in history - first save, then toggle to favorite
                saveLocation(weatherData.cityName, weatherData.country || 'Unknown', {
                    lat: weatherData.latitude,
                    lon: weatherData.longitude
                });
                // Find the newly added location and toggle it to favorite
                setTimeout(() => {
                    const newLocation = locations.find((loc) => loc.name.toLowerCase() === weatherData.cityName.toLowerCase());
                    if (newLocation) {
                        toggleFavorite(newLocation.id);
                    }
                }, 100);
            }
        }
    };
    // Check if current location is favorite
    const isCurrentLocationFavorite = weatherData ?
        locations.some((loc) => loc.name.toLowerCase() === weatherData.cityName.toLowerCase() && loc.favorite) : false;
    // Background gradient effect elements
    const gradientElements = [
        { color: 'bg-primary/20', size: 'w-72 h-72', position: 'top-10 -left-4', delay: 0 },
        { color: 'bg-purple-500/20', size: 'w-72 h-72', position: 'top-1/3 -right-4', delay: 2 },
        { color: 'bg-yellow-500/20', size: 'w-72 h-72', position: '-bottom-8 left-20', delay: 4 },
    ];
    if (!geoLoading && geoError && !locationState.selectedLocation) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs(motion.div, { className: "glass-card rounded-3xl p-8 max-w-md mx-4", initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx(AlertCircle, { className: "h-8 w-8 text-red-500" }), _jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Location Access Required" })] }), _jsx("p", { className: "text-muted-foreground mb-6", children: "Please enable location access or search for a city to view weather information." }), _jsx(SearchBar, { onCitySearch: handleCitySearch, className: "w-full" })] }) }));
    }
    const content = (_jsxs(_Fragment, { children: [_jsx(motion.header, { className: "sm:ml-20 mb-8", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold text-foreground mb-2", children: "Weather Dashboard" }), _jsx("p", { className: "text-muted-foreground", children: weatherData ? `Current weather in ${weatherData.cityName}` : 'Real-time weather information' })] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(motion.div, { whileHover: {
                                                scale: 1.05,
                                                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                                            }, whileTap: { scale: 0.95 }, transition: { duration: 0.2 }, children: _jsxs(Button, { variant: "outline", size: "sm", onClick: handleToggleFavorite, className: "flex items-center gap-2 glass-card border-0 transition-all duration-200 hover:bg-yellow-500/20", disabled: !weatherData, children: [_jsx(Star, { className: `h-4 w-4 transition-all duration-300 ${isCurrentLocationFavorite
                                                            ? 'text-yellow-500 fill-current'
                                                            : 'text-muted-foreground hover:text-yellow-400'}` }), "Favorite"] }) }), _jsx(motion.div, { whileHover: {
                                                scale: 1.05,
                                                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                                            }, whileTap: { scale: 0.95 }, transition: { duration: 0.2 }, children: _jsxs(Button, { variant: "outline", size: "sm", onClick: handleRefresh, className: "flex items-center gap-2 glass-card border-0 transition-all duration-200", disabled: isLoading, children: [_jsx(RefreshCw, { className: `h-4 w-4 ${isLoading ? 'animate-spin' : ''}` }), "Refresh"] }) }), _jsx(motion.div, { whileHover: {
                                                scale: 1.05,
                                                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                                            }, whileTap: { scale: 0.95 }, transition: { duration: 0.2 }, children: _jsxs(Button, { variant: "outline", size: "sm", onClick: handleCurrentLocation, className: "flex items-center gap-2 glass-card border-0 transition-all duration-200", disabled: geoLoading, children: [_jsx(MapPin, { className: "h-4 w-4" }), "Current Location"] }) })] }), _jsx(SearchBar, { onCitySearch: handleCitySearch, className: "lg:w-80" })] })] }) }), isFetching && lastWeatherData && (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "opacity-60 pointer-events-none select-none", children: _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 sm:ml-20", children: [_jsx(CurrentWeatherCard, { weatherData: lastWeatherData, className: "h-full col-span-2 sm:col-span-1" }), _jsx(WeatherStatsGrid, { weatherData: lastWeatherData })] }) }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center z-10", children: _jsx(motion.div, { className: "w-10 h-10 border-4 border-primary border-t-transparent rounded-full bg-background/80", animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: "linear" } }) })] })), (locationState.selectedLocation ? cityError : coordsError) && !lastWeatherData && (_jsx(motion.div, { className: "glass-card rounded-3xl p-6 mb-6 sm:ml-24 shadow-xl shadow-black/10", initial: { opacity: 0 }, animate: { opacity: 1 }, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(AlertCircle, { className: "h-6 w-6 text-red-500" }), _jsx("span", { className: "text-foreground", children: "Unable to load weather data. Please try again." })] }) })), weatherData && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 sm:ml-20", children: [_jsx(motion.div, { className: "col-span-2 sm:col-span-1 xl:col-span-1", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6 }, children: _jsx(CurrentWeatherCard, { weatherData: weatherData, className: "h-full" }) }), _jsx(motion.div, { className: "col-span-2 sm:col-span-1 xl:col-span-2", initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.2 }, children: _jsx(WeatherStatsGrid, { weatherData: weatherData }) })] }), forecastLoading && !forecastData ? (_jsx(motion.div, { className: "glass-card rounded-3xl p-6 sm:ml-20 shadow-xl shadow-black/10", initial: { opacity: 0 }, animate: { opacity: 1 }, children: _jsxs("div", { className: "flex items-center gap-3 ", children: [_jsx(motion.div, { className: "w-6 h-6 border-2 border-primary border-t-transparent rounded-full", animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: "linear" } }), _jsx("span", { className: "text-foreground", children: "Loading forecast data..." })] }) })) : forecastError && !forecastData ? (_jsx(motion.div, { className: "glass-card rounded-3xl p-6 sm:ml-20 shadow-xl shadow-black/10", initial: { opacity: 0 }, animate: { opacity: 1 }, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(AlertCircle, { className: "h-6 w-6 text-red-500" }), _jsx("span", { className: "text-foreground", children: "Unable to load forecast data" })] }) })) : forecastData && forecastData.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(ForecastSection, { forecastData: forecastData }), _jsx("div", { className: "mt-8 sm:ml-20", children: _jsx(WeatherCharts, { forecastData: forecastData }) })] })) : null] }))] }));
    return (_jsxs("div", { className: "p-6", children: [_jsx("div", { className: "fixed inset-0 overflow-hidden pointer-events-none", children: gradientElements.map((element, index) => (_jsx(motion.div, { className: `absolute ${element.size} ${element.color} rounded-full mix-blend-multiply filter blur-xl opacity-70`, style: { animationDelay: `${element.delay}s` }, animate: {
                        y: [0, -10, 0],
                    }, transition: {
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: element.delay,
                    } }, index))) }), content] }));
}
