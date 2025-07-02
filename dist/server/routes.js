import { createServer } from "http";
import { storage } from "./storage";
import { insertWeatherDataSchema, insertForecastDataSchema } from "@shared/schema";
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "db491620c4afabe70deb77af3b145cbd";
export async function registerRoutes(app) {
    // Get weather by coordinates (must come before /:city route)
    app.get("/api/weather/coords", async (req, res) => {
        try {
            const lat = req.query.lat;
            const lon = req.query.lon;
            console.log("Coordinates request:", { lat, lon });
            if (!lat || !lon) {
                return res.status(400).json({ error: "Missing coordinates" });
            }
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lon);
            if (isNaN(latitude) || isNaN(longitude)) {
                return res.status(400).json({ error: "Invalid coordinates" });
            }
            if (!OPENWEATHER_API_KEY) {
                return res.status(500).json({
                    error: "Weather API key not configured. Please add OPENWEATHER_API_KEY to environment variables."
                });
            }
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
            console.log("Fetching weather from:", weatherUrl);
            const weatherResponse = await fetch(weatherUrl);
            if (!weatherResponse.ok) {
                const errorText = await weatherResponse.text();
                console.error("OpenWeather API error:", weatherResponse.status, errorText);
                if (weatherResponse.status === 404) {
                    return res.status(404).json({ error: "Location not found" });
                }
                throw new Error(`Weather API error: ${weatherResponse.status}`);
            }
            const weatherApiData = await weatherResponse.json();
            // Get UV Index
            let uvIndex = 0;
            try {
                const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`;
                const uvResponse = await fetch(uvUrl);
                if (uvResponse.ok) {
                    const uvData = await uvResponse.json();
                    uvIndex = uvData.value;
                }
            }
            catch (error) {
                console.warn("Failed to fetch UV index:", error);
            }
            // Get Air Quality
            let airQuality = null;
            try {
                const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`;
                const airResponse = await fetch(airUrl);
                if (airResponse.ok) {
                    const airData = await airResponse.json();
                    airQuality = airData.list[0]?.main.aqi || null;
                }
            }
            catch (error) {
                console.warn("Failed to fetch air quality:", error);
            }
            const weatherInsert = {
                cityName: weatherApiData.name,
                country: weatherApiData.sys.country,
                latitude: weatherApiData.coord.lat,
                longitude: weatherApiData.coord.lon,
                temperature: weatherApiData.main.temp,
                feelsLike: weatherApiData.main.feels_like,
                humidity: weatherApiData.main.humidity,
                pressure: weatherApiData.main.pressure,
                windSpeed: weatherApiData.wind.speed,
                windDirection: weatherApiData.wind.deg || 0,
                visibility: weatherApiData.visibility,
                uvIndex,
                weatherMain: weatherApiData.weather[0].main,
                weatherDescription: weatherApiData.weather[0].description,
                weatherIcon: weatherApiData.weather[0].icon,
                sunrise: new Date(weatherApiData.sys.sunrise * 1000),
                sunset: new Date(weatherApiData.sys.sunset * 1000),
                airQuality,
            };
            const validatedData = insertWeatherDataSchema.parse(weatherInsert);
            const weatherData = await storage.createWeatherData(validatedData);
            res.json(weatherData);
        }
        catch (error) {
            console.error("Weather coords API error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Failed to fetch weather data"
            });
        }
    });
    // Get current weather by city name
    app.get("/api/weather/:city", async (req, res) => {
        try {
            const { city } = req.params;
            if (!OPENWEATHER_API_KEY) {
                return res.status(500).json({
                    error: "Weather API key not configured. Please add OPENWEATHER_API_KEY to environment variables."
                });
            }
            // Try to get from storage first
            let weatherData = await storage.getWeatherData(city);
            // If not found or data is older than 10 minutes, fetch fresh data
            if (!weatherData || (new Date().getTime() - new Date(weatherData.createdAt).getTime()) > 10 * 60 * 1000) {
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
                const weatherResponse = await fetch(weatherUrl);
                if (!weatherResponse.ok) {
                    const errorText = await weatherResponse.text();
                    console.error("OpenWeather API error:", weatherResponse.status, errorText);
                    if (weatherResponse.status === 404) {
                        return res.status(404).json({ error: "City not found" });
                    }
                    if (weatherResponse.status === 401) {
                        return res.status(500).json({ error: "Invalid API key" });
                    }
                    throw new Error(`Weather API error: ${weatherResponse.status}`);
                }
                let weatherApiData;
                try {
                    weatherApiData = await weatherResponse.json();
                }
                catch (parseError) {
                    console.error("Failed to parse weather API response:", parseError);
                    return res.status(500).json({ error: "Invalid response from weather service" });
                }
                // Get UV Index
                let uvIndex = 0;
                try {
                    const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${weatherApiData.coord.lat}&lon=${weatherApiData.coord.lon}&appid=${OPENWEATHER_API_KEY}`;
                    const uvResponse = await fetch(uvUrl);
                    if (uvResponse.ok) {
                        const uvData = await uvResponse.json();
                        uvIndex = uvData.value;
                    }
                }
                catch (error) {
                    console.warn("Failed to fetch UV index:", error);
                }
                // Get Air Quality
                let airQuality = null;
                try {
                    const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherApiData.coord.lat}&lon=${weatherApiData.coord.lon}&appid=${OPENWEATHER_API_KEY}`;
                    const airResponse = await fetch(airUrl);
                    if (airResponse.ok) {
                        const airData = await airResponse.json();
                        airQuality = airData.list[0]?.main.aqi || null;
                    }
                }
                catch (error) {
                    console.warn("Failed to fetch air quality:", error);
                }
                const weatherInsert = {
                    cityName: weatherApiData.name,
                    country: weatherApiData.sys.country,
                    latitude: weatherApiData.coord.lat,
                    longitude: weatherApiData.coord.lon,
                    temperature: weatherApiData.main.temp,
                    feelsLike: weatherApiData.main.feels_like,
                    humidity: weatherApiData.main.humidity,
                    pressure: weatherApiData.main.pressure,
                    windSpeed: weatherApiData.wind.speed,
                    windDirection: weatherApiData.wind.deg || 0,
                    visibility: weatherApiData.visibility,
                    uvIndex,
                    weatherMain: weatherApiData.weather[0].main,
                    weatherDescription: weatherApiData.weather[0].description,
                    weatherIcon: weatherApiData.weather[0].icon,
                    sunrise: new Date(weatherApiData.sys.sunrise * 1000),
                    sunset: new Date(weatherApiData.sys.sunset * 1000),
                    airQuality,
                };
                // Validate and store
                const validatedData = insertWeatherDataSchema.parse(weatherInsert);
                weatherData = await storage.createWeatherData(validatedData);
            }
            res.json(weatherData);
        }
        catch (error) {
            console.error("Weather API error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Failed to fetch weather data"
            });
        }
    });
    // Get forecast data
    app.get("/api/forecast/:city", async (req, res) => {
        try {
            const { city } = req.params;
            if (!OPENWEATHER_API_KEY) {
                return res.status(500).json({
                    error: "Weather API key not configured. Please add OPENWEATHER_API_KEY to environment variables."
                });
            }
            // Try to get from storage first
            let forecastData = await storage.getForecastData(city);
            // If not found or data is older than 30 minutes, fetch fresh data
            if (!forecastData.length || (new Date().getTime() - new Date(forecastData[0].createdAt).getTime()) > 30 * 60 * 1000) {
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
                const forecastResponse = await fetch(forecastUrl);
                if (!forecastResponse.ok) {
                    const errorText = await forecastResponse.text();
                    console.error("Forecast API error:", forecastResponse.status, errorText);
                    if (forecastResponse.status === 404) {
                        return res.status(404).json({ error: "City not found" });
                    }
                    if (forecastResponse.status === 401) {
                        return res.status(500).json({ error: "Invalid API key" });
                    }
                    throw new Error(`Forecast API error: ${forecastResponse.status}`);
                }
                let forecastApiData;
                try {
                    forecastApiData = await forecastResponse.json();
                }
                catch (parseError) {
                    console.error("Failed to parse forecast API response:", parseError);
                    return res.status(500).json({ error: "Invalid response from forecast service" });
                }
                // Clear old forecast data
                await storage.deleteForecastData(city);
                // Store new forecast data
                const forecastInserts = forecastApiData.list.map(item => ({
                    cityName: forecastApiData.city.name,
                    date: new Date(item.dt * 1000),
                    temperature: item.main.temp,
                    tempMin: item.main.temp_min,
                    tempMax: item.main.temp_max,
                    humidity: item.main.humidity,
                    windSpeed: item.wind.speed,
                    weatherMain: item.weather[0].main,
                    weatherDescription: item.weather[0].description,
                    weatherIcon: item.weather[0].icon,
                    precipitationChance: Math.round(item.pop * 100),
                }));
                forecastData = [];
                for (const forecastInsert of forecastInserts) {
                    const validatedData = insertForecastDataSchema.parse(forecastInsert);
                    const stored = await storage.createForecastData(validatedData);
                    forecastData.push(stored);
                }
            }
            res.json(forecastData);
        }
        catch (error) {
            console.error("Forecast API error:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "Failed to fetch forecast data"
            });
        }
    });
    // Get weather statistics by coordinates
    app.get("/api/weather/statistics/coords", async (req, res) => {
        try {
            const lat = req.query.lat;
            const lon = req.query.lon;
            if (!lat || !lon) {
                return res.status(400).json({ error: "Missing coordinates" });
            }
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lon);
            if (isNaN(latitude) || isNaN(longitude)) {
                return res.status(400).json({ error: "Invalid coordinates" });
            }
            if (!OPENWEATHER_API_KEY) {
                return res.status(500).json({ error: "Weather API key not configured. Please add OPENWEATHER_API_KEY to environment variables." });
            }
            // Fetch current weather data by coordinates
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
            const weatherResponse = await fetch(weatherUrl);
            if (!weatherResponse.ok) {
                if (weatherResponse.status === 404) {
                    return res.status(404).json({ error: "Location not found" });
                }
                throw new Error(`Weather API error: ${weatherResponse.status}`);
            }
            const weatherApiData = await weatherResponse.json();
            // Get UV Index
            let uvIndex = 0;
            try {
                const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${weatherApiData.coord.lat}&lon=${weatherApiData.coord.lon}&appid=${OPENWEATHER_API_KEY}`;
                const uvResponse = await fetch(uvUrl);
                if (uvResponse.ok) {
                    const uvData = await uvResponse.json();
                    uvIndex = uvData.value;
                }
            }
            catch (error) {
                console.warn("Failed to fetch UV index:", error);
            }
            // Get Air Quality
            let airQuality = null;
            try {
                const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherApiData.coord.lat}&lon=${weatherApiData.coord.lon}&appid=${OPENWEATHER_API_KEY}`;
                const airResponse = await fetch(airUrl);
                if (airResponse.ok) {
                    const airData = await airResponse.json();
                    airQuality = airData.list[0]?.main.aqi || null;
                }
            }
            catch (error) {
                console.warn("Failed to fetch air quality:", error);
            }
            // Compose weather data object (not saved to DB for coords)
            const weatherData = {
                cityName: weatherApiData.name,
                country: weatherApiData.sys.country,
                latitude: weatherApiData.coord.lat,
                longitude: weatherApiData.coord.lon,
                temperature: weatherApiData.main.temp,
                feelsLike: weatherApiData.main.feels_like,
                humidity: weatherApiData.main.humidity,
                pressure: weatherApiData.main.pressure,
                windSpeed: weatherApiData.wind.speed,
                windDirection: weatherApiData.wind.deg || 0,
                visibility: weatherApiData.visibility,
                uvIndex,
                weatherMain: weatherApiData.weather[0].main,
                weatherDescription: weatherApiData.weather[0].description,
                weatherIcon: weatherApiData.weather[0].icon,
                sunrise: new Date(weatherApiData.sys.sunrise * 1000),
                sunset: new Date(weatherApiData.sys.sunset * 1000),
                airQuality,
            };
            // Fetch forecast data for trend analysis (by coordinates)
            // Use OpenWeatherMap 5-day/3-hour forecast API
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
            const forecastResponse = await fetch(forecastUrl);
            let forecastData = [];
            if (forecastResponse.ok) {
                const forecastApiData = await forecastResponse.json();
                forecastData = forecastApiData.list.map((item) => ({
                    date: new Date(item.dt * 1000),
                    temperature: item.main.temp,
                    humidity: item.main.humidity,
                    windSpeed: item.wind.speed,
                    weatherMain: item.weather[0].main,
                }));
            }
            // Calculate statistics (same as city endpoint)
            const temps = [weatherData.temperature, ...forecastData.map(f => f.temperature)];
            const humidities = [weatherData.humidity, ...forecastData.map(f => f.humidity)];
            const winds = [weatherData.windSpeed, ...forecastData.map(f => f.windSpeed)];
            const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
            const avgHumidity = humidities.reduce((sum, hum) => sum + hum, 0) / humidities.length;
            const avgWind = winds.reduce((sum, wind) => sum + wind, 0) / winds.length;
            // Determine trends
            const tempTrend = forecastData.length > 0
                ? (forecastData[forecastData.length - 1].temperature > weatherData.temperature ? 'up' : 'down')
                : 'stable';
            const humidityTrend = forecastData.length > 0
                ? (forecastData[forecastData.length - 1].humidity > weatherData.humidity ? 'up' : 'down')
                : 'stable';
            const windTrend = forecastData.length > 0
                ? (forecastData[forecastData.length - 1].windSpeed > weatherData.windSpeed ? 'up' : 'down')
                : 'stable';
            // Count weather conditions
            const allConditions = [weatherData.weatherMain, ...forecastData.map(f => f.weatherMain)];
            const conditions = {
                sunny: allConditions.filter(c => c.toLowerCase().includes('clear') || c.toLowerCase().includes('sun')).length,
                cloudy: allConditions.filter(c => c.toLowerCase().includes('cloud')).length,
                rainy: allConditions.filter(c => c.toLowerCase().includes('rain')).length,
                stormy: allConditions.filter(c => c.toLowerCase().includes('storm') || c.toLowerCase().includes('thunder')).length,
            };
            // Generate weekly data from forecast - group by day and take daily averages
            const weeklyData = [];
            const today = new Date();
            for (let i = 0; i < 7; i++) {
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + i);
                // Filter forecast data for this specific day
                const dayForecasts = forecastData.filter(f => {
                    const forecastDate = new Date(f.date);
                    return forecastDate.toDateString() === targetDate.toDateString();
                });
                if (dayForecasts.length > 0) {
                    // Calculate daily averages
                    const avgTemp = dayForecasts.reduce((sum, f) => sum + f.temperature, 0) / dayForecasts.length;
                    const avgHumidity = dayForecasts.reduce((sum, f) => sum + f.humidity, 0) / dayForecasts.length;
                    const avgWind = dayForecasts.reduce((sum, f) => sum + f.windSpeed, 0) / dayForecasts.length;
                    // Use the most common condition for the day
                    const conditions = dayForecasts.map(f => f.weatherMain);
                    const mostCommonCondition = conditions.sort((a, b) => conditions.filter(v => v === a).length - conditions.filter(v => v === b).length).pop() || 'Clear';
                    weeklyData.push({
                        day: targetDate.toLocaleDateString('en', { weekday: 'short' }),
                        temp: Math.round(avgTemp),
                        humidity: Math.round(avgHumidity),
                        wind: Math.round(avgWind),
                        condition: mostCommonCondition,
                    });
                }
                else if (i === 0) {
                    // For today, use current weather data if no forecast available
                    weeklyData.push({
                        day: targetDate.toLocaleDateString('en', { weekday: 'short' }),
                        temp: Math.round(weatherData.temperature),
                        humidity: weatherData.humidity,
                        wind: Math.round(weatherData.windSpeed),
                        condition: weatherData.weatherMain,
                    });
                }
            }
            const statistics = {
                temperature: {
                    current: Math.round(weatherData.temperature),
                    average: Math.round(avgTemp),
                    min: Math.round(Math.min(...temps)),
                    max: Math.round(Math.max(...temps)),
                    trend: tempTrend,
                },
                humidity: {
                    current: weatherData.humidity,
                    average: Math.round(avgHumidity),
                    trend: humidityTrend,
                },
                wind: {
                    current: Math.round(weatherData.windSpeed),
                    average: Math.round(avgWind),
                    trend: windTrend,
                },
                conditions,
                weeklyData,
            };
            res.json(statistics);
        }
        catch (error) {
            console.error('Statistics API error (coords):', error);
            res.status(500).json({ error: "Failed to fetch weather statistics by coordinates" });
        }
    });
    // Get weather statistics for a city
    app.get("/api/weather/statistics/:city", async (req, res) => {
        try {
            const { city } = req.params;
            if (!OPENWEATHER_API_KEY) {
                return res.status(500).json({
                    error: "Weather API key not configured. Please add OPENWEATHER_API_KEY to environment variables."
                });
            }
            // Get current weather data, fetch if not available
            let weatherData = await storage.getWeatherData(city);
            if (!weatherData) {
                // Fetch fresh weather data
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
                const weatherResponse = await fetch(weatherUrl);
                if (!weatherResponse.ok) {
                    if (weatherResponse.status === 404) {
                        return res.status(404).json({ error: "City not found" });
                    }
                    throw new Error(`Weather API error: ${weatherResponse.status}`);
                }
                const weatherApiData = await weatherResponse.json();
                // Get UV Index
                let uvIndex = 0;
                try {
                    const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${weatherApiData.coord.lat}&lon=${weatherApiData.coord.lon}&appid=${OPENWEATHER_API_KEY}`;
                    const uvResponse = await fetch(uvUrl);
                    if (uvResponse.ok) {
                        const uvData = await uvResponse.json();
                        uvIndex = uvData.value;
                    }
                }
                catch (error) {
                    console.warn("Failed to fetch UV index:", error);
                }
                // Get Air Quality
                let airQuality = null;
                try {
                    const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherApiData.coord.lat}&lon=${weatherApiData.coord.lon}&appid=${OPENWEATHER_API_KEY}`;
                    const airResponse = await fetch(airUrl);
                    if (airResponse.ok) {
                        const airData = await airResponse.json();
                        airQuality = airData.list[0]?.main.aqi || null;
                    }
                }
                catch (error) {
                    console.warn("Failed to fetch air quality:", error);
                }
                const weatherInsert = {
                    cityName: weatherApiData.name,
                    country: weatherApiData.sys.country,
                    latitude: weatherApiData.coord.lat,
                    longitude: weatherApiData.coord.lon,
                    temperature: weatherApiData.main.temp,
                    feelsLike: weatherApiData.main.feels_like,
                    humidity: weatherApiData.main.humidity,
                    pressure: weatherApiData.main.pressure,
                    windSpeed: weatherApiData.wind.speed,
                    windDirection: weatherApiData.wind.deg || 0,
                    visibility: weatherApiData.visibility,
                    uvIndex,
                    weatherMain: weatherApiData.weather[0].main,
                    weatherDescription: weatherApiData.weather[0].description,
                    weatherIcon: weatherApiData.weather[0].icon,
                    sunrise: new Date(weatherApiData.sys.sunrise * 1000),
                    sunset: new Date(weatherApiData.sys.sunset * 1000),
                    airQuality,
                };
                const validatedData = insertWeatherDataSchema.parse(weatherInsert);
                weatherData = await storage.createWeatherData(validatedData);
            }
            // Get forecast data for trend analysis
            const forecastData = await storage.getForecastData(city);
            // Calculate statistics
            const temps = [weatherData.temperature, ...forecastData.map(f => f.temperature)];
            const humidities = [weatherData.humidity, ...forecastData.map(f => f.humidity)];
            const winds = [weatherData.windSpeed, ...forecastData.map(f => f.windSpeed)];
            const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
            const avgHumidity = humidities.reduce((sum, hum) => sum + hum, 0) / humidities.length;
            const avgWind = winds.reduce((sum, wind) => sum + wind, 0) / winds.length;
            // Determine trends
            const tempTrend = forecastData.length > 0
                ? (forecastData[forecastData.length - 1].temperature > weatherData.temperature ? 'up' : 'down')
                : 'stable';
            const humidityTrend = forecastData.length > 0
                ? (forecastData[forecastData.length - 1].humidity > weatherData.humidity ? 'up' : 'down')
                : 'stable';
            const windTrend = forecastData.length > 0
                ? (forecastData[forecastData.length - 1].windSpeed > weatherData.windSpeed ? 'up' : 'down')
                : 'stable';
            // Count weather conditions
            const allConditions = [weatherData.weatherMain, ...forecastData.map(f => f.weatherMain)];
            const conditions = {
                sunny: allConditions.filter(c => c.toLowerCase().includes('clear') || c.toLowerCase().includes('sun')).length,
                cloudy: allConditions.filter(c => c.toLowerCase().includes('cloud')).length,
                rainy: allConditions.filter(c => c.toLowerCase().includes('rain')).length,
                stormy: allConditions.filter(c => c.toLowerCase().includes('storm') || c.toLowerCase().includes('thunder')).length,
            };
            // Generate weekly data from forecast - group by day and take daily averages
            const weeklyData = [];
            const today = new Date();
            for (let i = 0; i < 7; i++) {
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + i);
                // Filter forecast data for this specific day
                const dayForecasts = forecastData.filter(f => {
                    const forecastDate = new Date(f.date);
                    return forecastDate.toDateString() === targetDate.toDateString();
                });
                if (dayForecasts.length > 0) {
                    // Calculate daily averages
                    const avgTemp = dayForecasts.reduce((sum, f) => sum + f.temperature, 0) / dayForecasts.length;
                    const avgHumidity = dayForecasts.reduce((sum, f) => sum + f.humidity, 0) / dayForecasts.length;
                    const avgWind = dayForecasts.reduce((sum, f) => sum + f.windSpeed, 0) / dayForecasts.length;
                    // Use the most common condition for the day
                    const conditions = dayForecasts.map(f => f.weatherMain);
                    const mostCommonCondition = conditions.sort((a, b) => conditions.filter(v => v === a).length - conditions.filter(v => v === b).length).pop() || 'Clear';
                    weeklyData.push({
                        day: targetDate.toLocaleDateString('en', { weekday: 'short' }),
                        temp: Math.round(avgTemp),
                        humidity: Math.round(avgHumidity),
                        wind: Math.round(avgWind),
                        condition: mostCommonCondition,
                    });
                }
                else if (i === 0) {
                    // For today, use current weather data if no forecast available
                    weeklyData.push({
                        day: targetDate.toLocaleDateString('en', { weekday: 'short' }),
                        temp: Math.round(weatherData.temperature),
                        humidity: weatherData.humidity,
                        wind: Math.round(weatherData.windSpeed),
                        condition: weatherData.weatherMain,
                    });
                }
            }
            const statistics = {
                temperature: {
                    current: Math.round(weatherData.temperature),
                    average: Math.round(avgTemp),
                    min: Math.round(Math.min(...temps)),
                    max: Math.round(Math.max(...temps)),
                    trend: tempTrend,
                },
                humidity: {
                    current: weatherData.humidity,
                    average: Math.round(avgHumidity),
                    trend: humidityTrend,
                },
                wind: {
                    current: Math.round(weatherData.windSpeed),
                    average: Math.round(avgWind),
                    trend: windTrend,
                },
                conditions,
                weeklyData,
            };
            res.json(statistics);
        }
        catch (error) {
            console.error('Statistics API error:', error);
            res.status(500).json({ error: "Failed to fetch weather statistics" });
        }
    });
    const httpServer = createServer(app);
    return httpServer;
}
