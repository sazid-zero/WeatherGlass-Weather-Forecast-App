import { useSettings } from '@/hooks/use-settings';
import { convertTemperature, convertSpeed, getTemperatureUnit, getSpeedUnit } from '@shared/settings';

interface UnitsDisplayProps {
  temperature?: number;
  speed?: number;
  className?: string;
}

export function TemperatureDisplay({ temperature, className = "" }: { temperature: number; className?: string }) {
  const { settings } = useSettings();
  
  const convertedTemp = convertTemperature(temperature, 'metric', settings.weather.units);
  const unit = getTemperatureUnit(settings.weather.units);
  
  return (
    <span className={className}>
      {Math.round(convertedTemp)}{unit}
    </span>
  );
}

export function SpeedDisplay({ speed, className = "" }: { speed: number; className?: string }) {
  const { settings } = useSettings();
  
  const convertedSpeed = convertSpeed(speed, 'metric', settings.weather.units === 'imperial' ? 'imperial' : 'metric');
  const unit = getSpeedUnit(settings.weather.units === 'imperial' ? 'imperial' : 'metric');
  
  return (
    <span className={className}>
      {Math.round(convertedSpeed)} {unit}
    </span>
  );
}

export function PressureDisplay({ pressure, className = "" }: { pressure: number; className?: string }) {
  const { settings } = useSettings();
  
  // Convert hPa to different units based on preference
  let convertedPressure = pressure;
  let unit = 'hPa';
  
  if (settings.weather.units === 'imperial') {
    convertedPressure = pressure * 0.02953; // hPa to inHg
    unit = 'inHg';
  }
  
  return (
    <span className={className}>
      {convertedPressure.toFixed(settings.weather.units === 'imperial' ? 2 : 0)} {unit}
    </span>
  );
}

export function VisibilityDisplay({ visibility, className = "" }: { visibility: number; className?: string }) {
  const { settings } = useSettings();
  
  // Convert meters to different units
  let convertedVisibility = visibility / 1000; // meters to kilometers
  let unit = 'km';
  
  if (settings.weather.units === 'imperial') {
    convertedVisibility = visibility * 0.000621371; // meters to miles
    unit = 'mi';
  }
  
  return (
    <span className={className}>
      {convertedVisibility.toFixed(1)} {unit}
    </span>
  );
}