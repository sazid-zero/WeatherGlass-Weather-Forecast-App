import { useQuery } from '@tanstack/react-query';
import { WeatherData, ForecastData } from '@shared/schema';

interface WeatherStats {
  temperature: {
    current: number;
    average: number;
    min: number;
    max: number;
    trend: 'up' | 'down' | 'stable';
  };
  humidity: {
    current: number;
    average: number;
    trend: 'up' | 'down' | 'stable';
  };
  wind: {
    current: number;
    average: number;
    trend: 'up' | 'down' | 'stable';
  };
  conditions: {
    sunny: number;
    cloudy: number;
    rainy: number;
    stormy: number;
  };
  weeklyData: Array<{
    day: string;
    temp: number;
    humidity: number;
    wind: number;
    condition: string;
  }>;
}

// Accepts either a city name or coordinates
export function useWeatherStatistics(cityOrCoords: string | { lat: number; lon: number } | null) {
  let queryKey;
  let url;
  if (typeof cityOrCoords === 'string' && cityOrCoords) {
    queryKey = ['/api/weather/statistics', cityOrCoords];
    url = `/api/weather/statistics/${encodeURIComponent(cityOrCoords)}`;
  } else if (cityOrCoords && typeof cityOrCoords === 'object' && 'lat' in cityOrCoords && 'lon' in cityOrCoords) {
    queryKey = ['/api/weather/statistics/coords', cityOrCoords.lat, cityOrCoords.lon];
    url = `/api/weather/statistics/coords?lat=${cityOrCoords.lat}&lon=${cityOrCoords.lon}`;
  } else {
    queryKey = ['/api/weather/statistics', 'none'];
    url = '';
  }
  return useQuery({
    queryKey,
    queryFn: async (): Promise<WeatherStats> => {
      if (!url) throw new Error('No location provided');
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather statistics');
      }
      return response.json();
    },
    enabled: !!url,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}