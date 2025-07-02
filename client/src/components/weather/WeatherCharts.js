import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Droplets, Wind } from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';
function getConditionColor(condition) {
    switch (condition.toLowerCase()) {
        case 'clear': return '#fbbf24';
        case 'clouds': return '#94a3b8';
        case 'rain': return '#3b82f6';
        case 'snow': return '#e5e7eb';
        case 'thunderstorm': return '#8b5cf6';
        case 'drizzle': return '#06b6d4';
        case 'mist':
        case 'fog': return '#6b7280';
        default: return '#64748b';
    }
}
export function WeatherCharts(_a) {
    var forecastData = _a.forecastData;
    var theme = useTheme().theme;
    var isLightTheme = theme === 'light';
    // Theme-aware colors
    var axisColor = isLightTheme ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)';
    var gridColor = isLightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
    var tooltipBg = isLightTheme ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)';
    var tooltipBorder = isLightTheme ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';
    if (!forecastData || forecastData.length === 0) {
        return (_jsx(motion.div, { className: "glass-card rounded-3xl p-8", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDCCA" }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: "Weather Analytics" }), _jsx("p", { className: "text-muted-foreground", children: "Charts will appear when forecast data is available" })] }) }));
    }
    // Prepare data for charts
    var chartData = forecastData.slice(0, 24).map(function (forecast) { return ({
        time: new Date(forecast.date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true
        }),
        fullDate: new Date(forecast.date),
        temperature: Math.round(forecast.temperature),
        tempMax: Math.round(forecast.tempMax),
        tempMin: Math.round(forecast.tempMin),
        humidity: forecast.humidity,
        windSpeed: Math.round(forecast.windSpeed * 10) / 10,
        precipitation: forecast.precipitationChance
    }); });
    // Weather condition distribution
    var conditionData = forecastData.reduce(function (acc, forecast) {
        var condition = forecast.weatherMain;
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});
    var pieData = Object.entries(conditionData).map(function (_a) {
        var name = _a[0], value = _a[1];
        return ({
            name: name,
            value: value,
            color: getConditionColor(name)
        });
    });
    // Calculate trends
    var tempTrend = chartData.length > 1 ?
        chartData[chartData.length - 1].temperature - chartData[0].temperature : 0;
    var humidityTrend = chartData.length > 1 ?
        chartData[chartData.length - 1].humidity - chartData[0].humidity : 0;
    return (_jsxs(motion.div, { className: "space-y-8", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-3xl font-bold", children: "Weather Analytics" }), _jsx("div", { className: "flex items-center space-x-4 text-sm", children: _jsxs("div", { className: "flex items-center space-x-2", children: [tempTrend > 0 ? (_jsx(TrendingUp, { className: "w-4 h-4 text-green-400" })) : (_jsx(TrendingDown, { className: "w-4 h-4 text-red-400" })), _jsxs("span", { className: "text-muted-foreground", children: ["Temperature ", tempTrend > 0 ? 'rising' : 'falling'] })] }) })] }), _jsxs(motion.div, { className: "glass-card-hover rounded-3xl p-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.1 }, whileHover: { scale: 1.01 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-xl font-semibold", children: "24-Hour Temperature Trend" }), _jsxs("div", { className: "flex items-center space-x-4 text-sm text-muted-foreground", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-blue-400" }), _jsx("span", { children: "Temperature" })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-red-400" }), _jsx("span", { children: "Max" })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-cyan-400" }), _jsx("span", { children: "Min" })] })] })] }), _jsx(ResponsiveContainer, { width: "100%", height: 350, children: _jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: gridColor }), _jsx(XAxis, { dataKey: "time", stroke: axisColor, fontSize: 12 }), _jsx(YAxis, { stroke: axisColor, fontSize: 12, domain: ['dataMin - 2', 'dataMax + 2'] }), _jsx(Tooltip, { contentStyle: {
                                        backgroundColor: tooltipBg,
                                        border: "1px solid ".concat(tooltipBorder),
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(12px)',
                                        color: isLightTheme ? '#000' : '#fff'
                                    } }), _jsx(Line, { type: "monotone", dataKey: "temperature", stroke: "#3b82f6", strokeWidth: 3, dot: { fill: '#3b82f6', strokeWidth: 2, r: 5 }, activeDot: { r: 7, stroke: '#3b82f6', strokeWidth: 2 } }), _jsx(Line, { type: "monotone", dataKey: "tempMax", stroke: "#ef4444", strokeWidth: 2, strokeDasharray: "5 5", dot: false }), _jsx(Line, { type: "monotone", dataKey: "tempMin", stroke: "#06b6d4", strokeWidth: 2, strokeDasharray: "5 5", dot: false })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(motion.div, { className: "glass-card-hover rounded-3xl p-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.2 }, whileHover: { scale: 1.01 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h3", { className: "text-xl font-semibold flex items-center space-x-2", children: [_jsx(Droplets, { className: "w-5 h-5 text-blue-400" }), _jsx("span", { children: "Humidity & Rain" })] }), _jsxs("div", { className: "flex items-center space-x-2 text-sm", children: [humidityTrend > 0 ? (_jsx(TrendingUp, { className: "w-4 h-4 text-blue-400" })) : (_jsx(TrendingDown, { className: "w-4 h-4 text-blue-400" })), _jsxs("span", { className: "text-muted-foreground", children: [Math.abs(humidityTrend), "% change"] })] })] }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: gridColor }), _jsx(XAxis, { dataKey: "time", stroke: axisColor, fontSize: 12 }), _jsx(YAxis, { stroke: axisColor, fontSize: 12 }), _jsx(Tooltip, { contentStyle: {
                                                backgroundColor: tooltipBg,
                                                border: "1px solid ".concat(tooltipBorder),
                                                borderRadius: '12px',
                                                color: isLightTheme ? '#000' : '#fff'
                                            } }), _jsx(Bar, { dataKey: "humidity", fill: "#06b6d4", name: "Humidity %", radius: [4, 4, 0, 0] }), _jsx(Bar, { dataKey: "precipitation", fill: "#8b5cf6", name: "Rain Chance %", radius: [4, 4, 0, 0] })] }) })] }), _jsxs(motion.div, { className: "glass-card-hover rounded-3xl p-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.3 }, whileHover: { scale: 1.01 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h3", { className: "text-xl font-semibold flex items-center space-x-2", children: [_jsx(Wind, { className: "w-5 h-5 text-green-400" }), _jsx("span", { children: "Wind Speed" })] }), _jsx("span", { className: "text-sm text-muted-foreground", children: "m/s" })] }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: gridColor }), _jsx(XAxis, { dataKey: "time", stroke: axisColor, fontSize: 12 }), _jsx(YAxis, { stroke: axisColor, fontSize: 12 }), _jsx(Tooltip, { contentStyle: {
                                                backgroundColor: tooltipBg,
                                                border: "1px solid ".concat(tooltipBorder),
                                                borderRadius: '12px',
                                                color: isLightTheme ? '#000' : '#fff'
                                            } }), _jsx(Line, { type: "monotone", dataKey: "windSpeed", stroke: "#10b981", strokeWidth: 3, dot: { fill: '#10b981', strokeWidth: 2, r: 4 }, activeDot: { r: 6, stroke: '#10b981', strokeWidth: 2 } })] }) })] })] }), _jsxs(motion.div, { className: "glass-card-hover rounded-3xl p-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.4 }, whileHover: { scale: 1.01 }, children: [_jsx("h3", { className: "text-xl font-semibold mb-6", children: "Weather Conditions Distribution" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: pieData, cx: "50%", cy: "50%", outerRadius: 100, innerRadius: 40, fill: "#8884d8", dataKey: "value", label: function (_a) {
                                                var name = _a.name, percent = _a.percent;
                                                return "".concat(name, " ").concat((percent * 100).toFixed(0), "%");
                                            }, labelLine: false, children: pieData.map(function (entry, index) { return (_jsx(Cell, { fill: entry.color }, "cell-".concat(index))); }) }), _jsx(Tooltip, { contentStyle: {
                                                backgroundColor: 'rgba(0,0,0,0.8)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '12px'
                                            } })] }) }), _jsx("div", { className: "space-y-4", children: pieData.map(function (item, index) { return (_jsxs(motion.div, { className: "flex items-center justify-between p-3 rounded-xl bg-white/5", initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.4, delay: 0.5 + index * 0.1 }, children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-4 h-4 rounded-full", style: { backgroundColor: item.color } }), _jsx("span", { className: "font-medium", children: item.name })] }), _jsxs("div", { className: "text-right", children: [_jsx("span", { className: "font-bold", children: item.value }), _jsx("span", { className: "text-muted-foreground text-sm ml-1", children: "hours" })] })] }, item.name)); }) })] })] })] }));
}
