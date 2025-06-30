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
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnReconnect: 'always', // Only refetch on reconnect if needed
  });
}

export function useWeatherByCoords(lat: number | null, lon: number | null) {
  return useQuery<WeatherData>({
    queryKey: ['/api/weather/coords', lat, lon],
    queryFn: async () => {
      const response = await fetch(`/api/weather/coords?lat=${lat}&lon=${lon}`);
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
    enabled: !!(lat && lon),
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnReconnect: 'always', // Only refetch on reconnect if needed
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
    staleTime: 30 * 60 * 1000, // 30 minutes - forecast data stays fresh longer
    gcTime: 60 * 60 * 1000, // 1 hour - keep forecast in cache longer
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnReconnect: 'always', // Only refetch on reconnect if needed
  });
}