import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Eye, Wind, Droplets, Thermometer, Sun, Gauge } from 'lucide-react';
import { SunriseIcon, SunsetIcon, WindIcon, VisibilityIcon } from './WeatherIcon';
import { getUVIndexLevel, getAirQualityLevel, getWindDirection } from '@/lib/weather-utils';
export function WeatherStatsGrid({ weatherData, className = "" }) {
    const uvIndexInfo = getUVIndexLevel(weatherData.uvIndex || 0);
    const airQualityInfo = getAirQualityLevel(weatherData.airQuality || 1);
    const windDirection = getWindDirection(weatherData.windDirection);
    const stats = [
        {
            id: 'feels-like',
            title: 'Feels Like',
            value: `${Math.round(weatherData.feelsLike)}°`,
            description: 'Perceived temperature',
            icon: Thermometer,
            color: 'from-orange-400/20 to-red-400/20',
            iconColor: 'text-orange-400'
        },
        {
            id: 'humidity',
            title: 'Humidity',
            value: `${weatherData.humidity}%`,
            description: 'Moisture in air',
            icon: Droplets,
            color: 'from-blue-400/20 to-cyan-400/20',
            iconColor: 'text-blue-400'
        },
        {
            id: 'wind',
            title: 'Wind Status',
            value: `${weatherData.windSpeed} m/s`,
            description: `${windDirection}`,
            icon: Wind,
            color: 'from-green-400/20 to-emerald-400/20',
            iconColor: 'text-green-400',
            customIcon: WindIcon
        },
        {
            id: 'uv-index',
            title: 'UV Index',
            value: (weatherData.uvIndex || 0).toFixed(1),
            description: uvIndexInfo.level,
            icon: Sun,
            color: 'from-yellow-400/20 to-orange-400/20',
            iconColor: uvIndexInfo.color
        },
        {
            id: 'visibility',
            title: 'Visibility',
            value: `${(weatherData.visibility / 1000).toFixed(1)} km`,
            description: 'Clear distance',
            icon: Eye,
            color: 'from-indigo-400/20 to-purple-400/20',
            iconColor: 'text-indigo-400',
            customIcon: VisibilityIcon
        },
        {
            id: 'air-quality',
            title: 'Air Quality',
            value: (weatherData.airQuality || 1).toString(),
            description: airQualityInfo.level,
            icon: Gauge,
            color: 'from-purple-400/20 to-pink-400/20',
            iconColor: airQualityInfo.color
        }
    ];
    const sunData = [
        {
            id: 'sunrise',
            title: 'Sunrise',
            value: new Date(weatherData.sunrise).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            description: 'Morning light',
            icon: SunriseIcon,
            color: 'from-yellow-300/20 to-orange-300/20',
            iconColor: 'text-yellow-500'
        },
        {
            id: 'sunset',
            title: 'Sunset',
            value: new Date(weatherData.sunset).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            description: 'Evening light',
            icon: SunsetIcon,
            color: 'from-orange-400/20 to-red-400/20',
            iconColor: 'text-orange-500'
        }
    ];
    // Responsive grid: 2 columns on mobile, 2 on sm, 3 on xl
    // Main stats cards span 2 columns on mobile, 1 on sm+
    return (_jsxs("div", { className: `weather-stats-grid grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`, children: [stats.map((stat, index) => (_jsxs(motion.div, { className: `glass-card-hover rounded-3xl p-6 bg-gradient-to-br  ${stat.color} col-span-2 sm:col-span-1`, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: index * 0.1 }, whileHover: { scale: 1.02 }, children: [_jsx("div", { className: "flex items-start justify-between mb-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [stat.customIcon ? (_jsx(stat.customIcon, { className: `w-6 h-6 ${stat.iconColor}` })) : (_jsx(stat.icon, { className: `w-6 h-6 ${stat.iconColor}` })), _jsx("h3", { className: "font-semibold text-foreground", children: stat.title })] }) }), _jsxs("div", { className: "space-y-2", children: [_jsx(motion.p, { className: "text-3xl font-bold text-foreground", initial: { scale: 0.5 }, animate: { scale: 1 }, transition: { duration: 0.5, delay: index * 0.1 + 0.3 }, children: stat.value }), _jsx("p", { className: "text-sm text-muted-foreground", children: stat.description })] }), stat.id === 'humidity' && (_jsx("div", { className: "mt-4", children: _jsx("div", { className: "w-full bg-white/20 rounded-full h-2", children: _jsx(motion.div, { className: "bg-blue-400 h-2 rounded-full", initial: { width: 0 }, animate: { width: `${weatherData.humidity}%` }, transition: { duration: 1, delay: index * 0.1 + 0.5 } }) }) })), stat.id === 'uv-index' && (_jsx("div", { className: "mt-4", children: _jsx("div", { className: "w-full bg-white/20 rounded-full h-2", children: _jsx(motion.div, { className: `h-2 rounded-full ${(weatherData.uvIndex || 0) <= 2 ? 'bg-green-400' :
                                    (weatherData.uvIndex || 0) <= 5 ? 'bg-yellow-400' :
                                        (weatherData.uvIndex || 0) <= 7 ? 'bg-orange-400' :
                                            (weatherData.uvIndex || 0) <= 10 ? 'bg-red-400' :
                                                'bg-purple-400'}`, initial: { width: 0 }, animate: { width: `${Math.min(((weatherData.uvIndex || 0) / 12) * 100, 100)}%` }, transition: { duration: 1, delay: index * 0.1 + 0.5 } }) }) }))] }, stat.id))), _jsxs(motion.div, { className: "glass-card-hover rounded-3xl p-6 bg-gradient-to-br from-amber-400/20 to-orange-400/20 md:col-span-2 col-span-2", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.8 }, whileHover: { scale: 1.02 }, children: [_jsxs("h3", { className: "font-semibold text-foreground mb-6 flex items-center space-x-2", children: [_jsx(Sun, { className: "w-5 h-5 text-yellow-500" }), _jsx("span", { children: "Sun & Moon" })] }), _jsx("div", { className: "grid grid-cols-2 gap-6", children: sunData.map((sun, index) => (_jsxs("div", { className: "text-center", children: [_jsx(motion.div, { className: "flex justify-center mb-3", initial: { rotate: -180, opacity: 0 }, animate: { rotate: 0, opacity: 1 }, transition: { duration: 0.8, delay: 0.9 + index * 0.1 }, children: _jsx(sun.icon, { className: `w-8 h-8 ${sun.iconColor}` }) }), _jsx(motion.p, { className: "text-2xl font-bold text-foreground mb-1", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, delay: 1 + index * 0.1 }, children: sun.value }), _jsx("p", { className: "text-sm text-muted-foreground", children: sun.title })] }, sun.id))) }), _jsxs(motion.div, { className: "mt-6 pt-4 border-t border-white/20 text-center", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, delay: 1.3 }, children: [_jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Day Length" }), _jsx("p", { className: "font-semibold", children: (() => {
                                    const sunrise = new Date(weatherData.sunrise);
                                    const sunset = new Date(weatherData.sunset);
                                    const dayLength = sunset.getTime() - sunrise.getTime();
                                    const hours = Math.floor(dayLength / (1000 * 60 * 60));
                                    const minutes = Math.floor((dayLength % (1000 * 60 * 60)) / (1000 * 60));
                                    return `${hours}h ${minutes}m`;
                                })() })] })] }), _jsxs(motion.div, { className: "glass-card-hover rounded-3xl p-6 bg-gradient-to-br from-slate-400/20 to-gray-400/20 col-span-2 sm:col-span-1", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 1.0 }, whileHover: { scale: 1.02 }, children: [_jsx("div", { className: "flex items-start justify-between mb-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Gauge, { className: "w-6 h-6 text-slate-400" }), _jsx("h3", { className: "font-semibold text-foreground", children: "Pressure" })] }) }), _jsxs("div", { className: "space-y-2", children: [_jsxs(motion.p, { className: "text-3xl font-bold text-foreground", initial: { scale: 0.5 }, animate: { scale: 1 }, transition: { duration: 0.5, delay: 1.1 }, children: [weatherData.pressure, " hPa"] }), _jsx("p", { className: "text-sm text-muted-foreground", children: weatherData.pressure > 1013 ? 'High pressure' :
                                    weatherData.pressure < 1009 ? 'Low pressure' :
                                        'Normal pressure' })] }), _jsx("div", { className: "mt-4", children: _jsx("div", { className: "w-full bg-white/20 rounded-full h-2", children: _jsx(motion.div, { className: `h-2 rounded-full ${weatherData.pressure > 1020 ? 'bg-green-400' :
                                    weatherData.pressure > 1013 ? 'bg-blue-400' :
                                        weatherData.pressure > 1009 ? 'bg-yellow-400' :
                                            'bg-red-400'}`, initial: { width: 0 }, animate: { width: `${Math.min(((weatherData.pressure - 980) / 60) * 100, 100)}%` }, transition: { duration: 1, delay: 1.4 } }) }) })] })] }));
}
