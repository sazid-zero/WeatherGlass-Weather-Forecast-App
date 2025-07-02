import { jsxs as _jsxs } from "react/jsx-runtime";
import { useSettings } from '@/hooks/use-settings';
import { convertTemperature, convertSpeed, getTemperatureUnit, getSpeedUnit } from '@shared/settings';
export function TemperatureDisplay(_a) {
    var temperature = _a.temperature, _b = _a.className, className = _b === void 0 ? "" : _b;
    var settings = useSettings().settings;
    var convertedTemp = convertTemperature(temperature, 'metric', settings.weather.units);
    var unit = getTemperatureUnit(settings.weather.units);
    return (_jsxs("span", { className: className, children: [Math.round(convertedTemp), unit] }));
}
export function SpeedDisplay(_a) {
    var speed = _a.speed, _b = _a.className, className = _b === void 0 ? "" : _b;
    var settings = useSettings().settings;
    var convertedSpeed = convertSpeed(speed, 'metric', settings.weather.units === 'imperial' ? 'imperial' : 'metric');
    var unit = getSpeedUnit(settings.weather.units === 'imperial' ? 'imperial' : 'metric');
    return (_jsxs("span", { className: className, children: [Math.round(convertedSpeed), " ", unit] }));
}
export function PressureDisplay(_a) {
    var pressure = _a.pressure, _b = _a.className, className = _b === void 0 ? "" : _b;
    var settings = useSettings().settings;
    // Convert hPa to different units based on preference
    var convertedPressure = pressure;
    var unit = 'hPa';
    if (settings.weather.units === 'imperial') {
        convertedPressure = pressure * 0.02953; // hPa to inHg
        unit = 'inHg';
    }
    return (_jsxs("span", { className: className, children: [convertedPressure.toFixed(settings.weather.units === 'imperial' ? 2 : 0), " ", unit] }));
}
export function VisibilityDisplay(_a) {
    var visibility = _a.visibility, _b = _a.className, className = _b === void 0 ? "" : _b;
    var settings = useSettings().settings;
    // Convert meters to different units
    var convertedVisibility = visibility / 1000; // meters to kilometers
    var unit = 'km';
    if (settings.weather.units === 'imperial') {
        convertedVisibility = visibility * 0.000621371; // meters to miles
        unit = 'mi';
    }
    return (_jsxs("span", { className: className, children: [convertedVisibility.toFixed(1), " ", unit] }));
}
