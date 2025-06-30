// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  weatherData;
  forecastData;
  currentWeatherId;
  currentForecastId;
  constructor() {
    this.weatherData = /* @__PURE__ */ new Map();
    this.forecastData = /* @__PURE__ */ new Map();
    this.currentWeatherId = 1;
    this.currentForecastId = 1;
  }
  async getWeatherData(cityName) {
    return this.weatherData.get(cityName.toLowerCase());
  }
  async createWeatherData(insertData) {
    const id = this.currentWeatherId++;
    const data = {
      ...insertData,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.weatherData.set(insertData.cityName.toLowerCase(), data);
    return data;
  }
  async getForecastData(cityName) {
    return this.forecastData.get(cityName.toLowerCase()) || [];
  }
  async createForecastData(insertData) {
    const id = this.currentForecastId++;
    const data = {
      ...insertData,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    const cityKey = insertData.cityName.toLowerCase();
    const existing = this.forecastData.get(cityKey) || [];
    existing.push(data);
    this.forecastData.set(cityKey, existing);
    return data;
  }
  async deleteForecastData(cityName) {
    this.forecastData.delete(cityName.toLowerCase());
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { z } from "zod";
var insertWeatherDataSchema = z.object({
  cityName: z.string(),
  country: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  temperature: z.number(),
  feelsLike: z.number(),
  humidity: z.number(),
  pressure: z.number(),
  windSpeed: z.number(),
  windDirection: z.number(),
  visibility: z.number(),
  uvIndex: z.number(),
  weatherMain: z.string(),
  weatherDescription: z.string(),
  weatherIcon: z.string(),
  sunrise: z.date(),
  sunset: z.date(),
  airQuality: z.number().nullable()
});
var insertForecastDataSchema = z.object({
  cityName: z.string(),
  date: z.date(),
  temperature: z.number(),
  tempMin: z.number(),
  tempMax: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  weatherMain: z.string(),
  weatherDescription: z.string(),
  weatherIcon: z.string(),
  precipitationChance: z.number()
});

// server/routes.ts
var OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "db491620c4afabe70deb77af3b145cbd";
async function registerRoutes(app2) {
  app2.get("/api/weather/coords", async (req, res) => {
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
      let uvIndex = 0;
      try {
        const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`;
        const uvResponse = await fetch(uvUrl);
        if (uvResponse.ok) {
          const uvData = await uvResponse.json();
          uvIndex = uvData.value;
        }
      } catch (error) {
        console.warn("Failed to fetch UV index:", error);
      }
      let airQuality = null;
      try {
        const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`;
        const airResponse = await fetch(airUrl);
        if (airResponse.ok) {
          const airData = await airResponse.json();
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
        sunrise: new Date(weatherApiData.sys.sunrise * 1e3),
        sunset: new Date(weatherApiData.sys.sunset * 1e3),
        airQuality
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
  app2.get("/api/weather/:city", async (req, res) => {
    try {
      const { city } = req.params;
      if (!OPENWEATHER_API_KEY) {
        return res.status(500).json({
          error: "Weather API key not configured. Please add OPENWEATHER_API_KEY to environment variables."
        });
      }
      let weatherData = await storage.getWeatherData(city);
      if (!weatherData || (/* @__PURE__ */ new Date()).getTime() - new Date(weatherData.createdAt).getTime() > 10 * 60 * 1e3) {
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
        } catch (parseError) {
          console.error("Failed to parse weather API response:", parseError);
          return res.status(500).json({ error: "Invalid response from weather service" });
        }
        let uvIndex = 0;
        try {
          const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${weatherApiData.coord.lat}&lon=${weatherApiData.coord.lon}&appid=${OPENWEATHER_API_KEY}`;
          const uvResponse = await fetch(uvUrl);
          if (uvResponse.ok) {
            const uvData = await uvResponse.json();
            uvIndex = uvData.value;
          }
        } catch (error) {
          console.warn("Failed to fetch UV index:", error);
        }
        let airQuality = null;
        try {
          const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherApiData.coord.lat}&lon=${weatherApiData.coord.lon}&appid=${OPENWEATHER_API_KEY}`;
          const airResponse = await fetch(airUrl);
          if (airResponse.ok) {
            const airData = await airResponse.json();
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
          sunrise: new Date(weatherApiData.sys.sunrise * 1e3),
          sunset: new Date(weatherApiData.sys.sunset * 1e3),
          airQuality
        };
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
  app2.get("/api/forecast/:city", async (req, res) => {
    try {
      const { city } = req.params;
      if (!OPENWEATHER_API_KEY) {
        return res.status(500).json({
          error: "Weather API key not configured. Please add OPENWEATHER_API_KEY to environment variables."
        });
      }
      let forecastData = await storage.getForecastData(city);
      if (!forecastData.length || (/* @__PURE__ */ new Date()).getTime() - new Date(forecastData[0].createdAt).getTime() > 30 * 60 * 1e3) {
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
        } catch (parseError) {
          console.error("Failed to parse forecast API response:", parseError);
          return res.status(500).json({ error: "Invalid response from forecast service" });
        }
        await storage.deleteForecastData(city);
        const forecastInserts = forecastApiData.list.map((item) => ({
          cityName: forecastApiData.city.name,
          date: new Date(item.dt * 1e3),
          temperature: item.main.temp,
          tempMin: item.main.temp_min,
          tempMax: item.main.temp_max,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          weatherMain: item.weather[0].main,
          weatherDescription: item.weather[0].description,
          weatherIcon: item.weather[0].icon,
          precipitationChance: Math.round(item.pop * 100)
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
  app2.get("/api/weather/statistics/:city", async (req, res) => {
    try {
      const { city } = req.params;
      if (!OPENWEATHER_API_KEY) {
        return res.status(500).json({
          error: "Weather API key not configured. Please add OPENWEATHER_API_KEY to environment variables."
        });
      }
      let weatherData = await storage.getWeatherData(city);
      if (!weatherData) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
          if (weatherResponse.status === 404) {
            return res.status(404).json({ error: "City not found" });
          }
          throw new Error(`Weather API error: ${weatherResponse.status}`);
        }
        const weatherApiData = await weatherResponse.json();
        let uvIndex = 0;
        try {
          const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${weatherApiData.coord.lat}&lon=${weatherApiData.coord.lon}&appid=${OPENWEATHER_API_KEY}`;
          const uvResponse = await fetch(uvUrl);
          if (uvResponse.ok) {
            const uvData = await uvResponse.json();
            uvIndex = uvData.value;
          }
        } catch (error) {
          console.warn("Failed to fetch UV index:", error);
        }
        let airQuality = null;
        try {
          const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherApiData.coord.lat}&lon=${weatherApiData.coord.lon}&appid=${OPENWEATHER_API_KEY}`;
          const airResponse = await fetch(airUrl);
          if (airResponse.ok) {
            const airData = await airResponse.json();
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
          sunrise: new Date(weatherApiData.sys.sunrise * 1e3),
          sunset: new Date(weatherApiData.sys.sunset * 1e3),
          airQuality
        };
        const validatedData = insertWeatherDataSchema.parse(weatherInsert);
        weatherData = await storage.createWeatherData(validatedData);
      }
      const forecastData = await storage.getForecastData(city);
      const temps = [weatherData.temperature, ...forecastData.map((f) => f.temperature)];
      const humidities = [weatherData.humidity, ...forecastData.map((f) => f.humidity)];
      const winds = [weatherData.windSpeed, ...forecastData.map((f) => f.windSpeed)];
      const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
      const avgHumidity = humidities.reduce((sum, hum) => sum + hum, 0) / humidities.length;
      const avgWind = winds.reduce((sum, wind) => sum + wind, 0) / winds.length;
      const tempTrend = forecastData.length > 0 ? forecastData[forecastData.length - 1].temperature > weatherData.temperature ? "up" : "down" : "stable";
      const humidityTrend = forecastData.length > 0 ? forecastData[forecastData.length - 1].humidity > weatherData.humidity ? "up" : "down" : "stable";
      const windTrend = forecastData.length > 0 ? forecastData[forecastData.length - 1].windSpeed > weatherData.windSpeed ? "up" : "down" : "stable";
      const allConditions = [weatherData.weatherMain, ...forecastData.map((f) => f.weatherMain)];
      const conditions = {
        sunny: allConditions.filter((c) => c.toLowerCase().includes("clear") || c.toLowerCase().includes("sun")).length,
        cloudy: allConditions.filter((c) => c.toLowerCase().includes("cloud")).length,
        rainy: allConditions.filter((c) => c.toLowerCase().includes("rain")).length,
        stormy: allConditions.filter((c) => c.toLowerCase().includes("storm") || c.toLowerCase().includes("thunder")).length
      };
      const weeklyData = [];
      const today = /* @__PURE__ */ new Date();
      for (let i = 0; i < 7; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        const dayForecasts = forecastData.filter((f) => {
          const forecastDate = new Date(f.date);
          return forecastDate.toDateString() === targetDate.toDateString();
        });
        if (dayForecasts.length > 0) {
          const avgTemp2 = dayForecasts.reduce((sum, f) => sum + f.temperature, 0) / dayForecasts.length;
          const avgHumidity2 = dayForecasts.reduce((sum, f) => sum + f.humidity, 0) / dayForecasts.length;
          const avgWind2 = dayForecasts.reduce((sum, f) => sum + f.windSpeed, 0) / dayForecasts.length;
          const conditions2 = dayForecasts.map((f) => f.weatherMain);
          const mostCommonCondition = conditions2.sort(
            (a, b) => conditions2.filter((v) => v === a).length - conditions2.filter((v) => v === b).length
          ).pop() || "Clear";
          weeklyData.push({
            day: targetDate.toLocaleDateString("en", { weekday: "short" }),
            temp: Math.round(avgTemp2),
            humidity: Math.round(avgHumidity2),
            wind: Math.round(avgWind2),
            condition: mostCommonCondition
          });
        } else if (i === 0) {
          weeklyData.push({
            day: targetDate.toLocaleDateString("en", { weekday: "short" }),
            temp: Math.round(weatherData.temperature),
            humidity: weatherData.humidity,
            wind: Math.round(weatherData.windSpeed),
            condition: weatherData.weatherMain
          });
        }
      }
      const statistics = {
        temperature: {
          current: Math.round(weatherData.temperature),
          average: Math.round(avgTemp),
          min: Math.round(Math.min(...temps)),
          max: Math.round(Math.max(...temps)),
          trend: tempTrend
        },
        humidity: {
          current: weatherData.humidity,
          average: Math.round(avgHumidity),
          trend: humidityTrend
        },
        wind: {
          current: Math.round(weatherData.windSpeed),
          average: Math.round(avgWind),
          trend: windTrend
        },
        conditions,
        weeklyData
      };
      res.json(statistics);
    } catch (error) {
      console.error("Statistics API error:", error);
      res.status(500).json({ error: "Failed to fetch weather statistics" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname2 = path2.dirname(__filename);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    host: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        log(`Vite error: ${msg}`, "vite");
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.get("*", async (req, res, next) => {
    const url = req.originalUrl;
    log(`Processing request: ${url}`, "vite");
    try {
      const templatePath = path2.resolve(process.cwd(), "client", "index.html");
      log(`Checking template path: ${templatePath}`, "vite");
      if (!fs.existsSync(templatePath)) {
        log(`Could not find client template at: ${templatePath}`, "vite");
        return res.status(404).send("Could not find client template");
      }
      let template = await fs.promises.readFile(templatePath, "utf-8");
      log(`Found template at: ${templatePath}`, "vite");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      log(`Error processing ${url}: ${errorMessage}`, "vite");
      res.status(500).send(`Error processing request: ${errorMessage}`);
    }
  });
}
function serveStatic(app2) {
  const staticPath = path2.join(process.cwd(), "dist");
  log(`Checking static path: ${staticPath}`, "express");
  if (!fs.existsSync(staticPath)) {
    log(`Could not find dist directory at: ${staticPath}`, "express");
    return app2.use((req, res) => {
      res.status(404).send("Dist directory not found. Run `npm run build` first.");
    });
  }
  app2.use(express.static(staticPath));
  app2.get("*", (_req, res) => {
    const indexPath = path2.join(staticPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(path2.resolve(indexPath));
    } else {
      res.status(404).send("Index file not found");
    }
  });
}

// server/index.ts
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(cors());
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptime: process.uptime()
  });
});
app.get("/debug", (req, res) => {
  res.json({
    message: "Server is running",
    environment: process.env.NODE_ENV,
    cwd: process.cwd(),
    __dirname
  });
});
(async () => {
  console.log("Starting server...");
  const server = await registerRoutes(app);
  console.log("Routes registered");
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    log(`Error: ${message} (Status: ${status})`, "express");
    res.status(status).json({ message });
  });
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3e3;
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
  server.listen(port, host, () => {
    log(`serving on http://${host}:${port}`);
  });
})();
