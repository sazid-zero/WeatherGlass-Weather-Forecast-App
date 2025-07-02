import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/weather-utils';
export function ForecastSection(_a) {
    var forecastData = _a.forecastData, _b = _a.className, className = _b === void 0 ? "" : _b;
    if (!forecastData || forecastData.length === 0) {
        return (_jsx(motion.div, { className: "glass-card rounded-3xl p-6 ".concat(className), initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.3 }, children: _jsx("div", { className: "flex items-center justify-center p-8", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDCCA" }), _jsx("p", { className: "text-muted-foreground", children: "Loading forecast data..." })] }) }) }));
    }
    // Group forecast data by day
    var dailyForecasts = forecastData.reduce(function (acc, forecast) {
        var date = new Date(forecast.date).toDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(forecast);
        return acc;
    }, {});
    var dailyAverages = Object.entries(dailyForecasts).map(function (_a) {
        var date = _a[0], forecasts = _a[1];
        var avgTemp = forecasts.reduce(function (sum, f) { return sum + f.temperature; }, 0) / forecasts.length;
        var maxTemp = Math.max.apply(Math, forecasts.map(function (f) { return f.tempMax; }));
        var minTemp = Math.min.apply(Math, forecasts.map(function (f) { return f.tempMin; }));
        var mainWeather = forecasts[0].weatherMain;
        return {
            date: new Date(date),
            avgTemp: Math.round(avgTemp),
            maxTemp: Math.round(maxTemp),
            minTemp: Math.round(minTemp),
            weatherMain: mainWeather,
            humidity: Math.round(forecasts.reduce(function (sum, f) { return sum + f.humidity; }, 0) / forecasts.length)
        };
    }).slice(0, 7); // Show 7 days
    var getWeatherEmoji = function (weather) {
        switch (weather) {
            case 'Clear': return '☀️';
            case 'Clouds': return '☁️';
            case 'Rain': return '🌧️';
            case 'Snow': return '❄️';
            case 'Thunderstorm': return '⛈️';
            default: return '☁️';
        }
    };
    return (_jsxs(motion.div, { className: "glass-card rounded-3xl p-6 ml-20 ".concat(className), initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.3 }, children: [_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-2xl font-bold mb-2", children: "7-Day Forecast" }), _jsx("p", { className: "text-muted-foreground", children: "Extended weather outlook" })] }), _jsx("div", { className: "space-y-4", children: dailyAverages.map(function (day, index) { return (_jsxs(motion.div, { className: "glass-card-hover rounded-2xl p-4 flex items-center justify-between", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.4, delay: index * 0.1 }, children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(motion.div, { className: "text-3xl weather-icon-bounce", style: { animationDelay: "".concat(index * 0.2, "s") }, children: getWeatherEmoji(day.weatherMain) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: index === 0 ? 'Today' :
                                                index === 1 ? 'Tomorrow' :
                                                    formatDate(day.date) }), _jsx("p", { className: "text-sm text-muted-foreground capitalize", children: day.weatherMain })] })] }), _jsxs("div", { className: "flex items-center space-x-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Humidity" }), _jsxs("p", { className: "font-semibold", children: [day.humidity, "%"] })] }), _jsx("div", { className: "text-right", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("span", { className: "text-2xl font-bold", children: [day.maxTemp, "\u00B0"] }), _jsxs("span", { className: "text-lg text-muted-foreground", children: [day.minTemp, "\u00B0"] })] }) })] })] }, day.date.toISOString())); }) }), forecastData.length > 0 && (_jsxs(motion.div, { className: "mt-8 pt-6 border-t border-white/20", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay: 0.8 }, children: [_jsx("h4", { className: "text-lg font-semibold mb-4", children: "Today's Hourly Forecast" }), _jsx("div", { className: "flex space-x-4 overflow-x-auto pb-4", children: forecastData.slice(0, 8).map(function (forecast, index) { return (_jsxs(motion.div, { className: "glass-card-hover rounded-xl p-3 min-w-[100px] text-center", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: index * 0.05 }, children: [_jsx("p", { className: "text-xs text-muted-foreground mb-2", children: new Date(forecast.date).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        hour12: true
                                    }) }), _jsx("div", { className: "text-2xl mb-2", children: getWeatherEmoji(forecast.weatherMain) }), _jsxs("p", { className: "font-semibold", children: [Math.round(forecast.temperature), "\u00B0"] }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [forecast.precipitationChance, "%"] })] }, forecast.id)); }) })] }))] }));
}
