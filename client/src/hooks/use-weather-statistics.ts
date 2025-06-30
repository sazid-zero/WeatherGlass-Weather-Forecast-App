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

export function useWeatherStatistics(city: string) {
  return useQuery({
    queryKey: ['/api/weather/statistics', city],
    queryFn: async (): Promise<WeatherStats> => {
      const response = await fetch(`/api/weather/statistics/${encodeURIComponent(city)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather statistics');
      }
      return response.json();
    },
    enabled: !!city,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}