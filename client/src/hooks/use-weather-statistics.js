import { useQuery } from '@tanstack/react-query';
// Accepts either a city name or coordinates
export function useWeatherStatistics(cityOrCoords) {
    let queryKey;
    let url;
    if (typeof cityOrCoords === 'string' && cityOrCoords) {
        queryKey = ['/api/weather/statistics', cityOrCoords];
        url = `/api/weather/statistics/${encodeURIComponent(cityOrCoords)}`;
    }
    else if (cityOrCoords && typeof cityOrCoords === 'object' && 'lat' in cityOrCoords && 'lon' in cityOrCoords) {
        queryKey = ['/api/weather/statistics/coords', cityOrCoords.lat, cityOrCoords.lon];
        url = `/api/weather/statistics/coords?lat=${cityOrCoords.lat}&lon=${cityOrCoords.lon}`;
    }
    else {
        queryKey = ['/api/weather/statistics', 'none'];
        url = '';
    }
    return useQuery({
        queryKey,
        queryFn: async () => {
            if (!url)
                throw new Error('No location provided');
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    // Try to parse error message from backend
                    let errorMsg = 'Failed to fetch weather statistics';
                    try {
                        const errJson = await response.json();
                        errorMsg = errJson.error || errorMsg;
                    }
                    catch { }
                    throw new Error(errorMsg);
                }
                return response.json();
            }
            catch (err) {
                // Log error for debugging
                console.error('Weather statistics fetch error:', err);
                throw err;
            }
        },
        enabled: !!url,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
}
