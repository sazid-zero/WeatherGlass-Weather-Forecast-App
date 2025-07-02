export class MemStorage {
    constructor() {
        this.weatherData = new Map();
        this.forecastData = new Map();
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
            createdAt: new Date()
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
            createdAt: new Date()
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
}
export const storage = new MemStorage();
