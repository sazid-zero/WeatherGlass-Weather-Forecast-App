import { z } from "zod";

export const insertWeatherDataSchema = z.object({
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
  airQuality: z.number().nullable(),
});

export const insertForecastDataSchema = z.object({
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
  precipitationChance: z.number(),
});

export type WeatherData = z.infer<typeof insertWeatherDataSchema> & {
  id: number;
  createdAt: Date;
};

export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;

export type ForecastData = z.infer<typeof insertForecastDataSchema> & {
  id: number;
  createdAt: Date;
};

export type InsertForecastData = z.infer<typeof insertForecastDataSchema>;