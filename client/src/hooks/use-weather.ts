import { useQuery } from '@tanstack/react-query';
import type { WeatherData, ForecastData } from '@shared/schema';

export function useWeatherByCity(city: string) {
  return useQuery<WeatherData>({
    queryKey: ['/api/weather', city],
    queryFn: async () => {
      const response = await fetch(`/api/weather/${encodeURIComponent(city)}`);
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to fetch weather data';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      return response.json();
    },
    enabled: !!city,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useWeatherByCoords(lat: number | null, lon: number | null) {
  return useQuery<WeatherData>({
    queryKey: ['/api/weather/coords', lat, lon],
    queryFn: () => fetch(`/api/weather/coords?lat=${lat}&lon=${lon}`).then(res => res.json()),
    enabled: !!(lat && lon),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useForecast(city: string) {
  return useQuery<ForecastData[]>({
    queryKey: ['/api/forecast', city],
    queryFn: async () => {
      const response = await fetch(`/api/forecast/${encodeURIComponent(city)}`);
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to fetch forecast data';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      return response.json();
    },
    enabled: !!city,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}
