export function getWeatherIcon(weatherMain, icon) {
    var iconMap = {
        'Clear': 'fas fa-sun',
        'Clouds': 'fas fa-cloud',
        'Rain': 'fas fa-cloud-rain',
        'Drizzle': 'fas fa-cloud-rain',
        'Thunderstorm': 'fas fa-bolt',
        'Snow': 'fas fa-snowflake',
        'Mist': 'fas fa-smog',
        'Smoke': 'fas fa-smog',
        'Haze': 'fas fa-smog',
        'Dust': 'fas fa-smog',
        'Fog': 'fas fa-smog',
        'Sand': 'fas fa-smog',
        'Ash': 'fas fa-smog',
        'Squall': 'fas fa-wind',
        'Tornado': 'fas fa-wind',
    };
    return iconMap[weatherMain] || 'fas fa-cloud';
}
export function getWeatherColor(weatherMain) {
    var colorMap = {
        'Clear': 'text-yellow-500',
        'Clouds': 'text-gray-500',
        'Rain': 'text-blue-500',
        'Drizzle': 'text-blue-400',
        'Thunderstorm': 'text-purple-500',
        'Snow': 'text-blue-200',
        'Mist': 'text-gray-400',
        'Smoke': 'text-gray-600',
        'Haze': 'text-gray-400',
        'Dust': 'text-orange-400',
        'Fog': 'text-gray-400',
        'Sand': 'text-orange-300',
        'Ash': 'text-gray-600',
        'Squall': 'text-gray-600',
        'Tornado': 'text-gray-700',
    };
    return colorMap[weatherMain] || 'text-blue-500';
}
export function getUVIndexLevel(uvIndex) {
    if (uvIndex <= 2)
        return { level: 'Low', color: 'text-green-500' };
    if (uvIndex <= 5)
        return { level: 'Moderate', color: 'text-yellow-500' };
    if (uvIndex <= 7)
        return { level: 'High', color: 'text-orange-500' };
    if (uvIndex <= 10)
        return { level: 'Very High', color: 'text-red-500' };
    return { level: 'Extreme', color: 'text-purple-500' };
}
export function getAirQualityLevel(aqi) {
    if (aqi === 1)
        return { level: 'Good', color: 'text-green-500' };
    if (aqi === 2)
        return { level: 'Fair', color: 'text-yellow-500' };
    if (aqi === 3)
        return { level: 'Moderate', color: 'text-orange-500' };
    if (aqi === 4)
        return { level: 'Poor', color: 'text-red-500' };
    if (aqi === 5)
        return { level: 'Very Poor', color: 'text-purple-500' };
    return { level: 'Unknown', color: 'text-gray-500' };
}
export function getWindDirection(degrees) {
    var directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    var index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}
export function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}
export function formatDate(date) {
    var today = new Date();
    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}
