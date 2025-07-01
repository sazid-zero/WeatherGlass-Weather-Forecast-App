import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
export function WeatherSidebar({ className = "" }) {
    const { theme, setTheme } = useTheme();
    const [location] = useLocation();
    const { locationState } = useLocationState();
    const { latitude, longitude } = useGeolocation();
    const { data: coordsWeatherData } = useWeatherByCoords(locationState.isCurrentLocation ? latitude : locationState.coordinates?.lat || null, locationState.isCurrentLocation ? longitude : locationState.coordinates?.lon || null);
    const { data: cityWeatherData } = useWeatherByCity(locationState.selectedLocation || '');
    const weatherData = locationState.selectedLocation ? cityWeatherData : coordsWeatherData;
    // Time state for live clock
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    const navigationItems = [
        { icon: Home, label: 'Home', path: '/', active: location === '/' },
        { icon: MapPin, label: 'Locations', path: '/locations', active: location === '/locations' },
        { icon: TrendingUp, label: 'Statistics', path: '/statistics', active: location === '/statistics' },
        { icon: Settings, label: 'Settings', path: '/settings', active: location === '/settings' },
    ];
    const toggleTheme = () => {
        const themes = ['light', 'dark', 'ocean', 'sunset', 'forest', 'aurora'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };
    // Mobile menu state
    const [menuOpen, setMenuOpen] = useState(false);
    // Hide sidebar on small screens, show menu button instead
    return (_jsxs(_Fragment, { children: [_jsx(motion.aside, { className: cn("fixed left-0 top-0 min-h-[100dvh] h-[100dvh] w-20 z-50 hidden sm:flex", className), initial: { x: -100 }, animate: { x: 0 }, transition: { duration: 0.5 }, children: _jsxs("div", { className: "glass-card h-full m-2 rounded-3xl flex flex-col items-center py-6 space-y-6", children: [_jsx(motion.div, { className: "w-12 h-12 weather-accent-gradient rounded-2xl flex items-center justify-center shadow-lg cursor-pointer", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setMenuOpen(true), children: _jsx(Cloud, { className: "h-6 w-6 text-white" }) }), _jsx("nav", { className: "flex flex-col space-y-4", children: navigationItems.map((item, index) => {
                                const Icon = item.icon;
                                return (_jsx(Link, { href: item.path, children: _jsx(motion.button, { className: cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300", item.active
                                            ? "bg-primary/20 text-primary"
                                            : "hover:bg-primary/20 text-muted-foreground hover:text-primary"), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: index * 0.1 }, children: _jsx(Icon, { className: "h-5 w-5" }) }) }, item.label));
                            }) }), _jsx("div", { className: "flex flex-col items-center justify-end flex-1 w-full pb-4", children: _jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: "w-full max-w-[4.5rem] h-30 mb-2 flex flex-col items-center justify-center bg-primary/10 rounded-2xl shadow-none relative overflow-hidden", style: { border: 'none' }, children: [_jsx("div", { className: "mb-2 w-full flex justify-center", children: weatherData?.weatherMain?.toLowerCase().includes('rain') ? _jsx("span", { className: "text-2xl", children: "\uD83C\uDF27\uFE0F" }) :
                                            weatherData?.weatherMain?.toLowerCase().includes('snow') ? _jsx("span", { className: "text-2xl", children: "\u2744\uFE0F" }) :
                                                weatherData?.weatherMain?.toLowerCase().includes('clear') ? _jsx("span", { className: "text-2xl", children: "\u2600\uFE0F" }) :
                                                    weatherData?.weatherMain?.toLowerCase().includes('cloud') ? _jsx("span", { className: "text-2xl", children: "\u2601\uFE0F" }) :
                                                        weatherData?.weatherMain?.toLowerCase().includes('thunder') ? _jsx("span", { className: "text-2xl", children: "\u26C8\uFE0F" }) :
                                                            _jsx(Cloud, { className: "h-6 w-6 text-primary animate-bounce-slow" }) }), _jsx("span", { className: "font-bold text-primary text-sm w-full text-center truncate mt-1", children: weatherData?.temperature ? `${Math.round(weatherData.temperature)}°C` : '--' }), _jsx("span", { className: "text-xs text-muted-foreground w-full text-center truncate mt-1", children: weatherData?.weatherMain || '--' }), _jsx("span", { className: "text-[11px] text-muted-foreground mt-2 w-full text-center truncate", children: weatherData?.cityName || 'Current Location' })] }) }), _jsx("div", { className: "mb-2", children: _jsx(motion.button, { onClick: toggleTheme, className: cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300", "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Sun, { className: "h-5 w-5" }) }) })] }) }), _jsx("div", { className: "fixed left-0 top-0 z-50 flex sm:hidden p-3", children: _jsx("button", { className: "w-12 h-12 weather-accent-gradient rounded-2xl flex items-center justify-center shadow-lg focus:outline-none", onClick: () => setMenuOpen(true), "aria-label": "Open menu", children: _jsx(Cloud, { className: "h-6 w-6 text-white" }) }) }), menuOpen && (_jsx("div", { className: "fixed inset-0 z-50 bg-black/40 flex sm:hidden", onClick: () => setMenuOpen(false), children: _jsxs(motion.div, { className: "bg-background w-64 h-full shadow-xl flex flex-col p-6", initial: { x: -300 }, animate: { x: 0 }, exit: { x: -300 }, transition: { duration: 0.3 }, onClick: e => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center mb-8", children: [_jsx(Cloud, { className: "h-7 w-7 text-primary mr-2" }), _jsx("span", { className: "font-bold text-lg", children: "WeatherGlass" })] }), _jsx("nav", { className: "flex flex-col gap-4", children: navigationItems.map((item) => {
                                const Icon = item.icon;
                                return (_jsx(Link, { href: item.path, children: _jsxs("button", { className: cn("flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200", item.active ? "bg-primary/10 text-primary" : "hover:bg-primary/10 text-muted-foreground hover:text-primary"), onClick: () => setMenuOpen(false), children: [_jsx(Icon, { className: "h-5 w-5" }), _jsx("span", { children: item.label })] }) }, item.label));
                            }) }), _jsx("div", { className: "flex-1" }), _jsx("div", { className: "mt-8", children: _jsxs("button", { onClick: toggleTheme, className: "w-full flex items-center gap-2 justify-center py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200", children: [_jsx(Sun, { className: "h-5 w-5" }), "Theme"] }) })] }) }))] }));
}
