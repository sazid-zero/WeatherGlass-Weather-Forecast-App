// @ts-ignore
import { type WeatherData, type ForecastData, type InsertWeatherData, type InsertForecastData } from "../shared/schema.js";

export interface IStorage {
  getWeatherData(cityName: string): Promise<WeatherData | undefined>;
  createWeatherData(data: InsertWeatherData): Promise<WeatherData>;
  getForecastData(cityName: string): Promise<ForecastData[]>;
  createForecastData(data: InsertForecastData): Promise<ForecastData>;
  deleteForecastData(cityName: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private weatherData: Map<string, WeatherData>;
  private forecastData: Map<string, ForecastData[]>;
  private currentWeatherId: number;
  private currentForecastId: number;

  constructor() {
    this.weatherData = new Map();
    this.forecastData = new Map();
    this.currentWeatherId = 1;
    this.currentForecastId = 1;
  }

  async getWeatherData(cityName: string): Promise<WeatherData | undefined> {
    return this.weatherData.get(cityName.toLowerCase());
  }

  async createWeatherData(insertData: InsertWeatherData): Promise<WeatherData> {
    const id = this.currentWeatherId++;
    const data: WeatherData = { 
      ...insertData, 
      id, 
      createdAt: new Date()
    };
    this.weatherData.set(insertData.cityName.toLowerCase(), data);
    return data;
  }

  async getForecastData(cityName: string): Promise<ForecastData[]> {
    return this.forecastData.get(cityName.toLowerCase()) || [];
  }

  async createForecastData(insertData: InsertForecastData): Promise<ForecastData> {
    const id = this.currentForecastId++;
    const data: ForecastData = { 
      ...insertData, 
      id, 
      createdAt: new Date()
    };
    
    const cityKey = insertData.cityName.toLowerCase();
    const existing = this.forecastData.get(cityKey) || [];
    existing.push(data);
    this.forecastData.set(cityKey, existing);
    
    return data;
  }

  async deleteForecastData(cityName: string): Promise<void> {
    this.forecastData.delete(cityName.toLowerCase());
  }
}

export const storage = new MemStorage();
