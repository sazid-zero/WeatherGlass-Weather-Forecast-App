var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, Eye, Wind, Sunrise, Sunset, Moon } from 'lucide-react';
var iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
};
export function WeatherIcon(_a) {
    var weatherMain = _a.weatherMain, weatherIcon = _a.weatherIcon, _b = _a.size, size = _b === void 0 ? 'md' : _b, _c = _a.animated, animated = _c === void 0 ? true : _c, _d = _a.className, className = _d === void 0 ? '' : _d;
    var isNight = weatherIcon && weatherIcon.includes('n');
    var getIcon = function () {
        if (!weatherMain || !weatherIcon)
            return Cloud;
        var mainWeather = weatherMain.toLowerCase();
        if (mainWeather.includes('clear')) {
            return isNight ? Moon : Sun;
        }
        if (mainWeather.includes('cloud')) {
            return Cloud;
        }
        if (mainWeather.includes('rain')) {
            return CloudRain;
        }
        if (mainWeather.includes('drizzle')) {
            return CloudDrizzle;
        }
        if (mainWeather.includes('thunderstorm') || mainWeather.includes('storm')) {
            return CloudLightning;
        }
        if (mainWeather.includes('snow')) {
            return CloudSnow;
        }
        if (mainWeather.includes('mist') || mainWeather.includes('fog') || mainWeather.includes('haze')) {
            return CloudFog;
        }
        // Default based on icon code
        var iconCode = weatherIcon.substring(0, 2);
        switch (iconCode) {
            case '01': return isNight ? Moon : Sun;
            case '02':
            case '03':
            case '04': return Cloud;
            case '09': return CloudDrizzle;
            case '10': return CloudRain;
            case '11': return CloudLightning;
            case '13': return CloudSnow;
            case '50': return CloudFog;
            default: return Cloud;
        }
    };
    var IconComponent = getIcon();
    var getColor = function () {
        var mainWeather = weatherMain.toLowerCase();
        if (mainWeather.includes('clear')) {
            return isNight ? 'text-blue-300' : 'text-yellow-500';
        }
        if (mainWeather.includes('cloud')) {
            return 'text-gray-400';
        }
        if (mainWeather.includes('rain') || mainWeather.includes('drizzle')) {
            return 'text-blue-500';
        }
        if (mainWeather.includes('thunderstorm')) {
            return 'text-purple-500';
        }
        if (mainWeather.includes('snow')) {
            return 'text-blue-200';
        }
        if (mainWeather.includes('mist') || mainWeather.includes('fog')) {
            return 'text-gray-300';
        }
        return isNight ? 'text-blue-300' : 'text-yellow-500';
    };
    var animations = animated ? {
        animate: {
            rotate: weatherMain.toLowerCase().includes('clear') ? [0, 5, -5, 0] : 0,
            scale: [1, 1.05, 1],
        },
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    } : {};
    return (_jsx(motion.div, __assign({ className: "".concat(iconSizes[size], " ").concat(getColor(), " ").concat(className) }, animations, { children: _jsx(IconComponent, { className: "w-full h-full" }) })));
}
// Specialized weather icons for specific use cases
export function SunriseIcon(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    return (_jsx(motion.div, { className: "text-orange-400 ".concat(className), animate: { y: [0, -2, 0] }, transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }, children: _jsx(Sunrise, { className: "w-full h-full" }) }));
}
export function SunsetIcon(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    return (_jsx(motion.div, { className: "text-orange-500 ".concat(className), animate: { y: [0, 2, 0] }, transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }, children: _jsx(Sunset, { className: "w-full h-full" }) }));
}
export function WindIcon(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.windSpeed, windSpeed = _c === void 0 ? 0 : _c;
    var intensity = windSpeed > 10 ? 'fast' : windSpeed > 5 ? 'medium' : 'slow';
    var animations = {
        fast: { x: [-2, 2, -2], transition: { duration: 0.5, repeat: Infinity } },
        medium: { x: [-1, 1, -1], transition: { duration: 1, repeat: Infinity } },
        slow: { x: [-0.5, 0.5, -0.5], transition: { duration: 2, repeat: Infinity } }
    };
    return (_jsx(motion.div, { className: "text-blue-400 ".concat(className), animate: animations[intensity], children: _jsx(Wind, { className: "w-full h-full" }) }));
}
export function VisibilityIcon(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    return (_jsx(motion.div, { className: "text-cyan-400 ".concat(className), animate: { opacity: [0.7, 1, 0.7] }, transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }, children: _jsx(Eye, { className: "w-full h-full" }) }));
}
