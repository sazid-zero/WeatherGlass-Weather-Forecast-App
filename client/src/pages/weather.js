var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    var _this = this;
    var _a, _b;
    var _c = useLocationState(), locationState = _c.locationState, setSelectedLocation = _c.setSelectedLocation, setCurrentLocation = _c.setCurrentLocation, refreshLocation = _c.refreshLocation;
    var _d = useGeolocation(), latitude = _d.latitude, longitude = _d.longitude, geoError = _d.error, geoLoading = _d.loading;
    var _e = useLocationHistory(), locations = _e.locations, saveLocation = _e.saveLocation, toggleFavorite = _e.toggleFavorite;
    var settings = useSettings().settings;
    var t = useTranslation(settings.weather.language).t;
    // Initial setup for current location if no location is selected
    useEffect(function () {
        if (latitude && longitude && locationState.isCurrentLocation && !locationState.coordinates) {
            setCurrentLocation({ lat: latitude, lon: longitude });
        }
    }, [latitude, longitude]);
    // Fetch weather data based on location state
    var _f = useWeatherByCoords(locationState.isCurrentLocation ? latitude : ((_a = locationState.coordinates) === null || _a === void 0 ? void 0 : _a.lat) || null, locationState.isCurrentLocation ? longitude : ((_b = locationState.coordinates) === null || _b === void 0 ? void 0 : _b.lon) || null), coordsWeatherData = _f.data, coordsLoading = _f.isLoading, coordsError = _f.error, coordsFetching = _f.isFetching, coordsUpdatedAt = _f.dataUpdatedAt;
    var _g = useWeatherByCity(locationState.selectedLocation || ''), cityWeatherData = _g.data, cityLoading = _g.isLoading, cityError = _g.error, cityFetching = _g.isFetching, cityUpdatedAt = _g.dataUpdatedAt;
    var _h = useForecast(locationState.selectedLocation || (coordsWeatherData === null || coordsWeatherData === void 0 ? void 0 : coordsWeatherData.cityName) || ''), forecastData = _h.data, forecastLoading = _h.isLoading, forecastError = _h.error;
    // Determine which weather data to use
    var weatherData = locationState.selectedLocation ? cityWeatherData : coordsWeatherData;
    var isLoading = locationState.selectedLocation ? cityLoading : coordsLoading;
    var isFetching = locationState.selectedLocation ? cityFetching : coordsFetching;
    var lastWeatherData = locationState.selectedLocation ? cityWeatherData : coordsWeatherData;
    // Handle city search
    var handleCitySearch = function (city) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            setSelectedLocation(city);
            // Save to recent locations after a short delay to let the data load
            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var response, weatherData_1, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, fetch("/api/weather/".concat(encodeURIComponent(city)))];
                        case 1:
                            response = _a.sent();
                            if (!response.ok) return [3 /*break*/, 3];
                            return [4 /*yield*/, response.json()];
                        case 2:
                            weatherData_1 = _a.sent();
                            saveLocation(city, weatherData_1.country || 'Unknown', {
                                lat: weatherData_1.latitude,
                                lon: weatherData_1.longitude
                            });
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            console.error('Failed to save location:', error_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); }, 1000);
            return [2 /*return*/];
        });
    }); };
    // Handle current location button
    var handleCurrentLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            }, function (error) {
                console.error('Geolocation error:', error);
            });
        }
    };
    // Handle refresh button - force refetch data
    var handleRefresh = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    if (!locationState.selectedLocation) return [3 /*break*/, 3];
                    return [4 /*yield*/, queryClient.invalidateQueries({
                            queryKey: ['/api/weather', locationState.selectedLocation]
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, queryClient.invalidateQueries({
                            queryKey: ['/api/forecast', locationState.selectedLocation]
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 3:
                    if (!(latitude && longitude)) return [3 /*break*/, 6];
                    return [4 /*yield*/, queryClient.invalidateQueries({
                            queryKey: ['/api/weather/coords', latitude, longitude]
                        })];
                case 4:
                    _a.sent();
                    if (!(coordsWeatherData === null || coordsWeatherData === void 0 ? void 0 : coordsWeatherData.cityName)) return [3 /*break*/, 6];
                    return [4 /*yield*/, queryClient.invalidateQueries({
                            queryKey: ['/api/forecast', coordsWeatherData.cityName]
                        })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    // Also refresh location state
                    refreshLocation();
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error('Failed to refresh weather data:', error_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // Handle favorite toggle
    var handleToggleFavorite = function () {
        if (weatherData) {
            var existingLocation = locations.find(function (loc) {
                return loc.name.toLowerCase() === weatherData.cityName.toLowerCase();
            });
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
                setTimeout(function () {
                    var newLocation = locations.find(function (loc) {
                        return loc.name.toLowerCase() === weatherData.cityName.toLowerCase();
                    });
                    if (newLocation) {
                        toggleFavorite(newLocation.id);
                    }
                }, 100);
            }
        }
    };
    // Check if current location is favorite
    var isCurrentLocationFavorite = weatherData ?
        locations.some(function (loc) {
            return loc.name.toLowerCase() === weatherData.cityName.toLowerCase() && loc.favorite;
        }) : false;
    // Background gradient effect elements
    var gradientElements = [
        { color: 'bg-primary/20', size: 'w-72 h-72', position: 'top-10 -left-4', delay: 0 },
        { color: 'bg-purple-500/20', size: 'w-72 h-72', position: 'top-1/3 -right-4', delay: 2 },
        { color: 'bg-yellow-500/20', size: 'w-72 h-72', position: '-bottom-8 left-20', delay: 4 },
    ];
    if (!geoLoading && geoError && !locationState.selectedLocation) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs(motion.div, { className: "glass-card rounded-3xl p-8 max-w-md mx-4", initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx(AlertCircle, { className: "h-8 w-8 text-red-500" }), _jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Location Access Required" })] }), _jsx("p", { className: "text-muted-foreground mb-6", children: "Please enable location access or search for a city to view weather information." }), _jsx(SearchBar, { onCitySearch: handleCitySearch, className: "w-full" })] }) }));
    }
    var content = (_jsxs(_Fragment, { children: [_jsx(motion.header, { className: "ml-20 mb-8", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold text-foreground mb-2", children: "Weather Dashboard" }), _jsx("p", { className: "text-muted-foreground", children: weatherData ? "Current weather in ".concat(weatherData.cityName) : 'Real-time weather information' })] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(motion.div, { whileHover: {
                                                scale: 1.05,
                                                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                                            }, whileTap: { scale: 0.95 }, transition: { duration: 0.2 }, children: _jsxs(Button, { variant: "outline", size: "sm", onClick: handleToggleFavorite, className: "flex items-center gap-2 glass-card border-0 transition-all duration-200 hover:bg-yellow-500/20", disabled: !weatherData, children: [_jsx(Star, { className: "h-4 w-4 transition-all duration-300 ".concat(isCurrentLocationFavorite
                                                            ? 'text-yellow-500 fill-current'
                                                            : 'text-muted-foreground hover:text-yellow-400') }), "Favorite"] }) }), _jsx(motion.div, { whileHover: {
                                                scale: 1.05,
                                                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                                            }, whileTap: { scale: 0.95 }, transition: { duration: 0.2 }, children: _jsxs(Button, { variant: "outline", size: "sm", onClick: handleRefresh, className: "flex items-center gap-2 glass-card border-0 transition-all duration-200", disabled: isLoading, children: [_jsx(RefreshCw, { className: "h-4 w-4 ".concat(isLoading ? 'animate-spin' : '') }), "Refresh"] }) }), _jsx(motion.div, { whileHover: {
                                                scale: 1.05,
                                                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                                            }, whileTap: { scale: 0.95 }, transition: { duration: 0.2 }, children: _jsxs(Button, { variant: "outline", size: "sm", onClick: handleCurrentLocation, className: "flex items-center gap-2 glass-card border-0 transition-all duration-200", disabled: geoLoading, children: [_jsx(MapPin, { className: "h-4 w-4" }), "Current Location"] }) })] }), _jsx(SearchBar, { onCitySearch: handleCitySearch, className: "lg:w-80" })] })] }) }), isFetching && lastWeatherData && (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "opacity-60 pointer-events-none select-none", children: _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 ml-20", children: [_jsx(CurrentWeatherCard, { weatherData: lastWeatherData, className: "h-full" }), _jsx(WeatherStatsGrid, { weatherData: lastWeatherData })] }) }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center z-10", children: _jsx(motion.div, { className: "w-10 h-10 border-4 border-primary border-t-transparent rounded-full bg-background/80", animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: "linear" } }) })] })), (locationState.selectedLocation ? cityError : coordsError) && !lastWeatherData && (_jsx(motion.div, { className: "glass-card rounded-3xl p-6 mb-6 ml-24 shadow-xl shadow-black/10", initial: { opacity: 0 }, animate: { opacity: 1 }, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(AlertCircle, { className: "h-6 w-6 text-red-500" }), _jsx("span", { className: "text-foreground", children: "Unable to load weather data. Please try again." })] }) })), weatherData && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 ml-20", children: [_jsx(motion.div, { className: "xl:col-span-1", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6 }, children: _jsx(CurrentWeatherCard, { weatherData: weatherData, className: "h-full" }) }), _jsx(motion.div, { className: "xl:col-span-2", initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.2 }, children: _jsx(WeatherStatsGrid, { weatherData: weatherData }) })] }), forecastLoading && !forecastData ? (_jsx(motion.div, { className: "glass-card rounded-3xl p-6 ml-20 shadow-xl shadow-black/10", initial: { opacity: 0 }, animate: { opacity: 1 }, children: _jsxs("div", { className: "flex items-center gap-3 ", children: [_jsx(motion.div, { className: "w-6 h-6 border-2 border-primary border-t-transparent rounded-full", animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: "linear" } }), _jsx("span", { className: "text-foreground", children: "Loading forecast data..." })] }) })) : forecastError && !forecastData ? (_jsx(motion.div, { className: "glass-card rounded-3xl p-6 ml-20 shadow-xl shadow-black/10", initial: { opacity: 0 }, animate: { opacity: 1 }, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(AlertCircle, { className: "h-6 w-6 text-red-500" }), _jsx("span", { className: "text-foreground", children: "Unable to load forecast data" })] }) })) : forecastData && forecastData.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(ForecastSection, { forecastData: forecastData }), _jsx("div", { className: "mt-8 ml-20", children: _jsx(WeatherCharts, { forecastData: forecastData }) })] })) : null] }))] }));
    return (_jsxs("div", { className: "p-6", children: [_jsx("div", { className: "fixed inset-0 overflow-hidden pointer-events-none", children: gradientElements.map(function (element, index) { return (_jsx(motion.div, { className: "absolute ".concat(element.size, " ").concat(element.color, " rounded-full mix-blend-multiply filter blur-xl opacity-70"), style: { animationDelay: "".concat(element.delay, "s") }, animate: {
                        y: [0, -10, 0],
                    }, transition: {
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: element.delay,
                    } }, index)); }) }), content] }));
}
