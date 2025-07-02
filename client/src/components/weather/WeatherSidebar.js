import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Home, MapPin, TrendingUp, Settings, Sun, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ui/theme-provider';
import { useLocation } from 'wouter';
import { useLocationState } from '@/hooks/use-location-state';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useWeatherByCity, useWeatherByCoords } from '@/hooks/use-weather';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
export function WeatherSidebar(_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var _j = _a.className, className = _j === void 0 ? "" : _j;
    var _k = useTheme(), theme = _k.theme, setTheme = _k.setTheme;
    var location = useLocation()[0];
    var locationState = useLocationState().locationState;
    var _l = useGeolocation(), latitude = _l.latitude, longitude = _l.longitude;
    // Prefer selected location, else use current coords
    var coordsWeatherData = useWeatherByCoords(locationState.isCurrentLocation ? latitude : ((_b = locationState.coordinates) === null || _b === void 0 ? void 0 : _b.lat) || null, locationState.isCurrentLocation ? longitude : ((_c = locationState.coordinates) === null || _c === void 0 ? void 0 : _c.lon) || null).data;
    var cityWeatherData = useWeatherByCity(locationState.selectedLocation || '').data;
    var weatherData = locationState.selectedLocation ? cityWeatherData : coordsWeatherData;
    // Time state for live clock
    var _m = useState(new Date()), now = _m[0], setNow = _m[1];
    useEffect(function () {
        var timer = setInterval(function () { return setNow(new Date()); }, 1000);
        return function () { return clearInterval(timer); };
    }, []);
    var navigationItems = [
        { icon: Home, label: 'Home', path: '/', active: location === '/' },
        { icon: MapPin, label: 'Locations', path: '/locations', active: location === '/locations' },
        { icon: TrendingUp, label: 'Statistics', path: '/statistics', active: location === '/statistics' },
        { icon: Settings, label: 'Settings', path: '/settings', active: location === '/settings' },
    ];
    var toggleTheme = function () {
        var themes = ['light', 'dark', 'ocean', 'sunset', 'forest', 'aurora'];
        var currentIndex = themes.indexOf(theme);
        var nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };
    return (_jsx(motion.aside, { className: cn("fixed left-0 top-0 min-h-[100dvh] h-[100dvh] w-20 z-50", className), initial: { x: -100 }, animate: { x: 0 }, transition: { duration: 0.5 }, children: _jsxs("div", { className: "glass-card h-full m-2 rounded-3xl flex flex-col items-center py-6 space-y-6", children: [_jsx(motion.div, { className: "w-12 h-12 weather-accent-gradient rounded-2xl flex items-center justify-center shadow-lg", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Cloud, { className: "h-6 w-6 text-white" }) }), _jsx("nav", { className: "flex flex-col space-y-4", children: navigationItems.map(function (item, index) {
                        var Icon = item.icon;
                        return (_jsx(Link, { href: item.path, children: _jsx(motion.button, { className: cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300", item.active
                                    ? "bg-primary/20 text-primary"
                                    : "hover:bg-primary/20 text-muted-foreground hover:text-primary"), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: index * 0.1 }, children: _jsx(Icon, { className: "h-5 w-5" }) }) }, item.label));
                    }) }), _jsx("div", { className: "flex flex-col items-center justify-end flex-1 w-full pb-4", children: _jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: "w-full max-w-[4.5rem] h-30 mb-2 flex flex-col items-center justify-center bg-primary/10 rounded-2xl shadow-none relative overflow-hidden", style: { border: 'none' }, children: [_jsx("div", { className: "mb-2 w-full flex justify-center", children: ((_d = weatherData === null || weatherData === void 0 ? void 0 : weatherData.weatherMain) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes('rain')) ? _jsx("span", { className: "text-2xl", children: "\uD83C\uDF27\uFE0F" }) :
                                    ((_e = weatherData === null || weatherData === void 0 ? void 0 : weatherData.weatherMain) === null || _e === void 0 ? void 0 : _e.toLowerCase().includes('snow')) ? _jsx("span", { className: "text-2xl", children: "\u2744\uFE0F" }) :
                                        ((_f = weatherData === null || weatherData === void 0 ? void 0 : weatherData.weatherMain) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes('clear')) ? _jsx("span", { className: "text-2xl", children: "\u2600\uFE0F" }) :
                                            ((_g = weatherData === null || weatherData === void 0 ? void 0 : weatherData.weatherMain) === null || _g === void 0 ? void 0 : _g.toLowerCase().includes('cloud')) ? _jsx("span", { className: "text-2xl", children: "\u2601\uFE0F" }) :
                                                ((_h = weatherData === null || weatherData === void 0 ? void 0 : weatherData.weatherMain) === null || _h === void 0 ? void 0 : _h.toLowerCase().includes('thunder')) ? _jsx("span", { className: "text-2xl", children: "\u26C8\uFE0F" }) :
                                                    _jsx(Cloud, { className: "h-6 w-6 text-primary animate-bounce-slow" }) }), _jsx("span", { className: "font-bold text-primary text-sm w-full text-center truncate mt-1", children: (weatherData === null || weatherData === void 0 ? void 0 : weatherData.temperature) ? "".concat(Math.round(weatherData.temperature), "\u00B0C") : '--' }), _jsx("span", { className: "text-xs text-muted-foreground w-full text-center truncate mt-1", children: (weatherData === null || weatherData === void 0 ? void 0 : weatherData.weatherMain) || '--' }), _jsx("span", { className: "text-[11px] text-muted-foreground mt-2 w-full text-center truncate", children: (weatherData === null || weatherData === void 0 ? void 0 : weatherData.cityName) || 'Current Location' })] }) }), _jsx("div", { className: "mb-2", children: _jsx(motion.button, { onClick: toggleTheme, className: cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300", "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Sun, { className: "h-5 w-5" }) }) })] }) }));
}
