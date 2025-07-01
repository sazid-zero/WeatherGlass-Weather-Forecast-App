import { jsxs as _jsxs } from "react/jsx-runtime";
import { useSettings } from '@/hooks/use-settings';
import { convertTemperature, convertSpeed, getTemperatureUnit, getSpeedUnit } from '@shared/settings';
export function TemperatureDisplay({ temperature, className = "" }) {
    const { settings } = useSettings();
    const convertedTemp = convertTemperature(temperature, 'metric', settings.weather.units);
    const unit = getTemperatureUnit(settings.weather.units);
    return (_jsxs("span", { className: className, children: [Math.round(convertedTemp), unit] }));
}
export function SpeedDisplay({ speed, className = "" }) {
    const { settings } = useSettings();
    const convertedSpeed = convertSpeed(speed, 'metric', settings.weather.units === 'imperial' ? 'imperial' : 'metric');
    const unit = getSpeedUnit(settings.weather.units === 'imperial' ? 'imperial' : 'metric');
    return (_jsxs("span", { className: className, children: [Math.round(convertedSpeed), " ", unit] }));
}
export function PressureDisplay({ pressure, className = "" }) {
    const { settings } = useSettings();
    // Convert hPa to different units based on preference
    let convertedPressure = pressure;
    let unit = 'hPa';
    if (settings.weather.units === 'imperial') {
        convertedPressure = pressure * 0.02953; // hPa to inHg
        unit = 'inHg';
    }
    return (_jsxs("span", { className: className, children: [convertedPressure.toFixed(settings.weather.units === 'imperial' ? 2 : 0), " ", unit] }));
}
export function VisibilityDisplay({ visibility, className = "" }) {
    const { settings } = useSettings();
    // Convert meters to different units
    let convertedVisibility = visibility / 1000; // meters to kilometers
    let unit = 'km';
    if (settings.weather.units === 'imperial') {
        convertedVisibility = visibility * 0.000621371; // meters to miles
        unit = 'mi';
    }
    return (_jsxs("span", { className: className, children: [convertedVisibility.toFixed(1), " ", unit] }));
}
