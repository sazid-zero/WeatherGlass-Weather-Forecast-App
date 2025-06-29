import { useQuery } from '@tanstack/react-query';
import type { WeatherData, ForecastData } from '@shared/schema';

export function useWeatherByCity(city: string) {
  return useQuery<WeatherData>({
    queryKey: ['/api/weather', city],
    enabled: !!city,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useWeatherByCoords(lat: number | null, lon: number | null) {
  return useQuery<WeatherData>({
    queryKey: ['/api/weather/coords', lat, lon],
    enabled: !!(lat && lon),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useForecast(city: string) {
  return useQuery<ForecastData[]>({
    queryKey: ['/api/forecast', city],
    enabled: !!city,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}
