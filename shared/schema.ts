import { pgTable, text, serial, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  cityName: text("city_name").notNull(),
  country: text("country").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  temperature: real("temperature").notNull(),
  feelsLike: real("feels_like").notNull(),
  humidity: integer("humidity").notNull(),
  pressure: integer("pressure").notNull(),
  windSpeed: real("wind_speed").notNull(),
  windDirection: integer("wind_direction").notNull(),
  visibility: integer("visibility").notNull(),
  uvIndex: real("uv_index").notNull(),
  weatherMain: text("weather_main").notNull(),
  weatherDescription: text("weather_description").notNull(),
  weatherIcon: text("weather_icon").notNull(),
  sunrise: timestamp("sunrise").notNull(),
  sunset: timestamp("sunset").notNull(),
  airQuality: integer("air_quality"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const forecastData = pgTable("forecast_data", {
  id: serial("id").primaryKey(),
  cityName: text("city_name").notNull(),
  date: timestamp("date").notNull(),
  temperature: real("temperature").notNull(),
  tempMin: real("temp_min").notNull(),
  tempMax: real("temp_max").notNull(),
  humidity: integer("humidity").notNull(),
  windSpeed: real("wind_speed").notNull(),
  weatherMain: text("weather_main").notNull(),
  weatherDescription: text("weather_description").notNull(),
  weatherIcon: text("weather_icon").notNull(),
  precipitationChance: integer("precipitation_chance").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
  createdAt: true,
});

export const insertForecastDataSchema = createInsertSchema(forecastData).omit({
  id: true,
  createdAt: true,
});

export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type ForecastData = typeof forecastData.$inferSelect;
export type InsertForecastData = z.infer<typeof insertForecastDataSchema>;
