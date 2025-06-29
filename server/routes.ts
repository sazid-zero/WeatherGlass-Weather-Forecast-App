import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWeatherDataSchema, insertForecastDataSchema } from "@shared/schema";
import { z } from "zod";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY || "";

interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
}

interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    pop: number;
  }>;
  city: {
    name: string;
    country: string;
  };
}

interface UVIndexResponse {
  value: number;
}

interface AirQualityResponse {
  list: Array<{
    main: {
      aqi: number;
    };
  }>;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
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
          if (weatherResponse.status === 404) {
            return res.status(404).json({ error: "City not found" });
          }
          throw new Error(`Weather API error: ${weatherResponse.status}`);
        }
        
        const weatherApiData: OpenWeatherResponse = await weatherResponse.json();
        
        // Get UV Index
        let uvIndex = 0;
        try {
          const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${weatherApiData.coord.lat}&lon=${weatherApiData.coord.lon}&appid=${OPENWEATHER_API_KEY}`;
          const uvResponse = await fetch(uvUrl);
          if (uvResponse.ok) {
            const uvData: UVIndexResponse = await uvResponse.json();
            uvIndex = uvData.value;
          }
        } catch (error) {
          console.warn("Failed to fetch UV index:", error);
        }
        
        // Get Air Quality
        let airQuality = null;
        try {
          const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherApiData.coord.lat}&lon=${weatherApiData.coord.lon}&appid=${OPENWEATHER_API_KEY}`;
          const airResponse = await fetch(airUrl);
          if (airResponse.ok) {
            const airData: AirQualityResponse = await airResponse.json();
            airQuality = airData.list[0]?.main.aqi || null;
          }
        } catch (error) {
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
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch weather data" 
      });
    }
  });

  // Get weather by coordinates
  app.get("/api/weather/coords/:lat/:lon", async (req, res) => {
    try {
      const { lat, lon } = req.params;
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
      
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`);
      }
      
      const weatherApiData: OpenWeatherResponse = await weatherResponse.json();
      
      // Get UV Index
      let uvIndex = 0;
      try {
        const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`;
        const uvResponse = await fetch(uvUrl);
        if (uvResponse.ok) {
          const uvData: UVIndexResponse = await uvResponse.json();
          uvIndex = uvData.value;
        }
      } catch (error) {
        console.warn("Failed to fetch UV index:", error);
      }
      
      // Get Air Quality
      let airQuality = null;
      try {
        const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`;
        const airResponse = await fetch(airUrl);
        if (airResponse.ok) {
          const airData: AirQualityResponse = await airResponse.json();
          airQuality = airData.list[0]?.main.aqi || null;
        }
      } catch (error) {
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
    } catch (error) {
      console.error("Weather coords API error:", error);
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
          if (forecastResponse.status === 404) {
            return res.status(404).json({ error: "City not found" });
          }
          throw new Error(`Forecast API error: ${forecastResponse.status}`);
        }
        
        const forecastApiData: OpenWeatherForecastResponse = await forecastResponse.json();
        
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
    } catch (error) {
      console.error("Forecast API error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch forecast data" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
