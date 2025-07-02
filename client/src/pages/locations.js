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
function LocationWeatherCard(_a) {
    var location = _a.location, onToggleFavorite = _a.onToggleFavorite, onRemove = _a.onRemove, onLocationSelect = _a.onLocationSelect;
    var _b = useWeatherByCity(location.name), weatherData = _b.data, isLoading = _b.isLoading;
    return (_jsxs(motion.div, { className: "glass-card rounded-2xl p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, whileHover: { y: -2 }, onClick: function () { return onLocationSelect(location.name); }, children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(MapPin, { className: "h-5 w-5 text-primary" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-foreground", children: location.name }), _jsx("p", { className: "text-sm text-muted-foreground", children: location.country })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: function (e) {
                                    e.stopPropagation();
                                    onToggleFavorite(location.id);
                                }, className: "p-2 hover:bg-yellow-500/20", children: _jsx(Star, { className: "h-4 w-4 ".concat(location.favorite ? 'text-yellow-500 fill-current' : 'text-muted-foreground') }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: function (e) {
                                    e.stopPropagation();
                                    onRemove(location.id);
                                }, className: "p-2 hover:bg-red-500/20", children: _jsx(Trash2, { className: "h-4 w-4 text-red-500" }) })] })] }), isLoading ? (_jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-20" }), _jsx(Skeleton, { className: "h-8 w-16" })] })) : weatherData ? (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-2xl font-bold text-foreground", children: [Math.round(weatherData.temperature), "\u00B0C"] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-sm text-muted-foreground capitalize", children: weatherData.weatherDescription }), _jsxs("div", { className: "text-xs text-muted-foreground", children: ["Feels like ", Math.round(weatherData.feelsLike), "\u00B0C"] })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Droplets, { className: "h-3 w-3 text-blue-500" }), _jsxs("span", { className: "text-muted-foreground", children: [weatherData.humidity, "%"] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Wind, { className: "h-3 w-3 text-green-500" }), _jsxs("span", { className: "text-muted-foreground", children: [Math.round(weatherData.windSpeed), " m/s"] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Eye, { className: "h-3 w-3 text-purple-500" }), _jsxs("span", { className: "text-muted-foreground", children: [Math.round(weatherData.visibility / 1000), " km"] })] })] })] })) : (_jsx("div", { className: "text-sm text-muted-foreground", children: "Weather data unavailable" }))] }));
}
export default function LocationsPage() {
    var _this = this;
    var settings = useSettings().settings;
    var _a = useGeolocation(), latitude = _a.latitude, longitude = _a.longitude;
    var setSelectedLocation = useLocationState().setSelectedLocation;
    var _b = useLocation(), setLocation = _b[1];
    var t = useTranslation(settings.weather.language).t;
    var _c = useLocationHistory(), locations = _c.locations, saveLocation = _c.saveLocation, toggleFavorite = _c.toggleFavorite, removeLocation = _c.removeLocation, getFavorites = _c.getFavorites, getRecent = _c.getRecent;
    var handleAddLocation = function (city) { return __awaiter(_this, void 0, void 0, function () {
        var response, weatherData, error_1;
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
                    weatherData = _a.sent();
                    saveLocation(city, weatherData.country || 'Unknown', {
                        lat: weatherData.latitude,
                        lon: weatherData.longitude
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
    }); };
    var handleLocationSelect = function (locationName) {
        // Set the selected location in global state
        setSelectedLocation(locationName);
        // Navigate to home page
        setLocation('/');
    };
    var favorites = getFavorites();
    var recentLocations = getRecent(10).filter(function (loc) { return !loc.favorite; });
    return (_jsx("div", { className: "min-h-screen weather-gradient-bg", children: _jsxs("div", { className: "ml-24 p-6", children: [_jsx(motion.header, { className: "mb-8", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-foreground mb-2", children: t('myLocations') }), _jsx("p", { className: "text-muted-foreground", children: t('manageLocations') })] }), _jsx(SearchBar, { onCitySearch: handleAddLocation })] }) }), _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-8", children: [_jsxs(motion.section, { className: "glass-card rounded-3xl p-6", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5 }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Star, { className: "h-6 w-6 text-yellow-500" }), _jsx("h2", { className: "text-xl font-semibold text-foreground", children: t('favorites') })] }), _jsx("div", { className: "grid gap-4", children: favorites.length > 0 ? (favorites.map(function (location, index) { return (_jsx(LocationWeatherCard, { location: location, onToggleFavorite: toggleFavorite, onRemove: removeLocation, onLocationSelect: handleLocationSelect }, location.id)); })) : (_jsxs("div", { className: "text-center text-muted-foreground py-8", children: [_jsx(Star, { className: "h-12 w-12 mx-auto mb-3 text-muted-foreground/50" }), _jsx("p", { children: t('noFavoriteLocations') }), _jsx("p", { className: "text-sm", children: t('addFirstFavorite') })] })) })] }), _jsxs(motion.section, { className: "glass-card rounded-3xl p-6", initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5, delay: 0.2 }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(MapPin, { className: "h-6 w-6 text-primary" }), _jsx("h2", { className: "text-xl font-semibold text-foreground", children: t('recentLocations') })] }), _jsx("div", { className: "grid gap-4", children: recentLocations.length > 0 ? (recentLocations.map(function (location, index) { return (_jsx(LocationWeatherCard, { location: location, onToggleFavorite: toggleFavorite, onRemove: removeLocation, onLocationSelect: handleLocationSelect }, location.id)); })) : (_jsxs("div", { className: "text-center text-muted-foreground py-8", children: [_jsx(MapPin, { className: "h-12 w-12 mx-auto mb-3 text-muted-foreground/50" }), _jsx("p", { children: t('noRecentLocations') }), _jsx("p", { className: "text-sm", children: t('recentSearchedCities') })] })) })] })] })] }) }));
}
