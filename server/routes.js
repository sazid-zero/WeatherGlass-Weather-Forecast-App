var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { createServer } from "http";
import { storage } from "./storage.js";
// @ts-ignore
import { insertWeatherDataSchema, insertForecastDataSchema } from "../shared/schema.js";
var OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "db491620c4afabe70deb77af3b145cbd";
export function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var httpServer;
        var _this = this;
        return __generator(this, function (_a) {
            // Get weather by coordinates (must come before /:city route)
            app.get("/api/weather/coords", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var lat, lon, latitude, longitude, weatherUrl, weatherResponse, errorText, weatherApiData, uvIndex, uvUrl, uvResponse, uvData, error_1, airQuality, airUrl, airResponse, airData, error_2, weatherInsert, validatedData, weatherData, error_3;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 18, , 19]);
                            lat = req.query.lat;
                            lon = req.query.lon;
                            console.log("Coordinates request:", { lat: lat, lon: lon });
                            if (!lat || !lon) {
                                return [2 /*return*/, res.status(400).json({ error: "Missing coordinates" })];
                            }
                            latitude = parseFloat(lat);
                            longitude = parseFloat(lon);
                            if (isNaN(latitude) || isNaN(longitude)) {
                                return [2 /*return*/, res.status(400).json({ error: "Invalid coordinates" })];
                            }
                            if (!OPENWEATHER_API_KEY) {
                                return [2 /*return*/, res.status(500).json({
                                        error: "Weather API key not configured. Please add OPENWEATHER_API_KEY to environment variables."
                                    })];
                            }
                            weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=".concat(latitude, "&lon=").concat(longitude, "&appid=").concat(OPENWEATHER_API_KEY, "&units=metric");
                            console.log("Fetching weather from:", weatherUrl);
                            return [4 /*yield*/, fetch(weatherUrl)];
                        case 1:
                            weatherResponse = _b.sent();
                            if (!!weatherResponse.ok) return [3 /*break*/, 3];
                            return [4 /*yield*/, weatherResponse.text()];
                        case 2:
                            errorText = _b.sent();
                            console.error("OpenWeather API error:", weatherResponse.status, errorText);
                            if (weatherResponse.status === 404) {
                                return [2 /*return*/, res.status(404).json({ error: "Location not found" })];
                            }
                            throw new Error("Weather API error: ".concat(weatherResponse.status));
                        case 3: return [4 /*yield*/, weatherResponse.json()];
                        case 4:
                            weatherApiData = _b.sent();
                            uvIndex = 0;
                            _b.label = 5;
                        case 5:
                            _b.trys.push([5, 9, , 10]);
                            uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=".concat(latitude, "&lon=").concat(longitude, "&appid=").concat(OPENWEATHER_API_KEY);
                            return [4 /*yield*/, fetch(uvUrl)];
                        case 6:
                            uvResponse = _b.sent();
                            if (!uvResponse.ok) return [3 /*break*/, 8];
                            return [4 /*yield*/, uvResponse.json()];
                        case 7:
                            uvData = _b.sent();
                            uvIndex = uvData.value;
                            _b.label = 8;
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            error_1 = _b.sent();
                            console.warn("Failed to fetch UV index:", error_1);
                            return [3 /*break*/, 10];
                        case 10:
                            airQuality = null;
                            _b.label = 11;
                        case 11:
                            _b.trys.push([11, 15, , 16]);
                            airUrl = "https://api.openweathermap.org/data/2.5/air_pollution?lat=".concat(latitude, "&lon=").concat(longitude, "&appid=").concat(OPENWEATHER_API_KEY);
                            return [4 /*yield*/, fetch(airUrl)];
                        case 12:
                            airResponse = _b.sent();
                            if (!airResponse.ok) return [3 /*break*/, 14];
                            return [4 /*yield*/, airResponse.json()];
                        case 13:
                            airData = _b.sent();
                            airQuality = ((_a = airData.list[0]) === null || _a === void 0 ? void 0 : _a.main.aqi) || null;
                            _b.label = 14;
                        case 14: return [3 /*break*/, 16];
                        case 15:
                            error_2 = _b.sent();
                            console.warn("Failed to fetch air quality:", error_2);
                            return [3 /*break*/, 16];
                        case 16:
                            weatherInsert = {
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
                                uvIndex: uvIndex,
                                weatherMain: weatherApiData.weather[0].main,
                                weatherDescription: weatherApiData.weather[0].description,
                                weatherIcon: weatherApiData.weather[0].icon,
                                sunrise: new Date(weatherApiData.sys.sunrise * 1000),
                                sunset: new Date(weatherApiData.sys.sunset * 1000),
                                airQuality: airQuality,
                            };
                            validatedData = insertWeatherDataSchema.parse(weatherInsert);
                            return [4 /*yield*/, storage.createWeatherData(validatedData)];
                        case 17:
                            weatherData = _b.sent();
                            res.json(weatherData);
                            return [3 /*break*/, 19];
                        case 18:
                            error_3 = _b.sent();
                            console.error("Weather coords API error:", error_3);
                            res.status(500).json({
                                error: error_3 instanceof Error ? error_3.message : "Failed to fetch weather data"
                            });
                            return [3 /*break*/, 19];
                        case 19: return [2 /*return*/];
                    }
                });
            }); });
            // Get current weather by city name
            app.get("/api/weather/:city", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var city, weatherData, weatherUrl, weatherResponse, errorText, weatherApiData, parseError_1, uvIndex, uvUrl, uvResponse, uvData, error_4, airQuality, airUrl, airResponse, airData, error_5, weatherInsert, validatedData, error_6;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 23, , 24]);
                            city = req.params.city;
                            if (!OPENWEATHER_API_KEY) {
                                return [2 /*return*/, res.status(500).json({
                                        error: "Weather API key not configured. Please add OPENWEATHER_API_KEY to environment variables."
                                    })];
                            }
                            return [4 /*yield*/, storage.getWeatherData(city)];
                        case 1:
                            weatherData = _b.sent();
                            if (!(!weatherData || (new Date().getTime() - new Date(weatherData.createdAt).getTime()) > 10 * 60 * 1000)) return [3 /*break*/, 22];
                            weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=".concat(encodeURIComponent(city), "&appid=").concat(OPENWEATHER_API_KEY, "&units=metric");
                            return [4 /*yield*/, fetch(weatherUrl)];
                        case 2:
                            weatherResponse = _b.sent();
                            if (!!weatherResponse.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, weatherResponse.text()];
                        case 3:
                            errorText = _b.sent();
                            console.error("OpenWeather API error:", weatherResponse.status, errorText);
                            if (weatherResponse.status === 404) {
                                return [2 /*return*/, res.status(404).json({ error: "City not found" })];
                            }
                            if (weatherResponse.status === 401) {
                                return [2 /*return*/, res.status(500).json({ error: "Invalid API key" })];
                            }
                            throw new Error("Weather API error: ".concat(weatherResponse.status));
                        case 4:
                            weatherApiData = void 0;
                            _b.label = 5;
                        case 5:
                            _b.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, weatherResponse.json()];
                        case 6:
                            weatherApiData = _b.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            parseError_1 = _b.sent();
                            console.error("Failed to parse weather API response:", parseError_1);
                            return [2 /*return*/, res.status(500).json({ error: "Invalid response from weather service" })];
                        case 8:
                            uvIndex = 0;
                            _b.label = 9;
                        case 9:
                            _b.trys.push([9, 13, , 14]);
                            uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=".concat(weatherApiData.coord.lat, "&lon=").concat(weatherApiData.coord.lon, "&appid=").concat(OPENWEATHER_API_KEY);
                            return [4 /*yield*/, fetch(uvUrl)];
                        case 10:
                            uvResponse = _b.sent();
                            if (!uvResponse.ok) return [3 /*break*/, 12];
                            return [4 /*yield*/, uvResponse.json()];
                        case 11:
                            uvData = _b.sent();
                            uvIndex = uvData.value;
                            _b.label = 12;
                        case 12: return [3 /*break*/, 14];
                        case 13:
                            error_4 = _b.sent();
                            console.warn("Failed to fetch UV index:", error_4);
                            return [3 /*break*/, 14];
                        case 14:
                            airQuality = null;
                            _b.label = 15;
                        case 15:
                            _b.trys.push([15, 19, , 20]);
                            airUrl = "https://api.openweathermap.org/data/2.5/air_pollution?lat=".concat(weatherApiData.coord.lat, "&lon=").concat(weatherApiData.coord.lon, "&appid=").concat(OPENWEATHER_API_KEY);
                            return [4 /*yield*/, fetch(airUrl)];
                        case 16:
                            airResponse = _b.sent();
                            if (!airResponse.ok) return [3 /*break*/, 18];
                            return [4 /*yield*/, airResponse.json()];
                        case 17:
                            airData = _b.sent();
                            airQuality = ((_a = airData.list[0]) === null || _a === void 0 ? void 0 : _a.main.aqi) || null;
                            _b.label = 18;
                        case 18: return [3 /*break*/, 20];
                        case 19:
                            error_5 = _b.sent();
                            console.warn("Failed to fetch air quality:", error_5);
                            return [3 /*break*/, 20];
                        case 20:
                            weatherInsert = {
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
                                uvIndex: uvIndex,
                                weatherMain: weatherApiData.weather[0].main,
                                weatherDescription: weatherApiData.weather[0].description,
                                weatherIcon: weatherApiData.weather[0].icon,
                                sunrise: new Date(weatherApiData.sys.sunrise * 1000),
                                sunset: new Date(weatherApiData.sys.sunset * 1000),
                                airQuality: airQuality,
                            };
                            validatedData = insertWeatherDataSchema.parse(weatherInsert);
                            return [4 /*yield*/, storage.createWeatherData(validatedData)];
                        case 21:
                            weatherData = _b.sent();
                            _b.label = 22;
                        case 22:
                            res.json(weatherData);
                            return [3 /*break*/, 24];
                        case 23:
                            error_6 = _b.sent();
                            console.error("Weather API error:", error_6);
                            res.status(500).json({
                                error: error_6 instanceof Error ? error_6.message : "Failed to fetch weather data"
                            });
                            return [3 /*break*/, 24];
                        case 24: return [2 /*return*/];
                    }
                });
            }); });
            // Get forecast data
            app.get("/api/forecast/:city", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var city, forecastData, forecastUrl, forecastResponse, errorText, forecastApiData_1, parseError_2, forecastInserts, _i, forecastInserts_1, forecastInsert, validatedData, stored, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 13, , 14]);
                            city = req.params.city;
                            if (!OPENWEATHER_API_KEY) {
                                return [2 /*return*/, res.status(500).json({
                                        error: "Weather API key not configured. Please add OPENWEATHER_API_KEY to environment variables."
                                    })];
                            }
                            return [4 /*yield*/, storage.getForecastData(city)];
                        case 1:
                            forecastData = _a.sent();
                            if (!(!forecastData.length || (new Date().getTime() - new Date(forecastData[0].createdAt).getTime()) > 30 * 60 * 1000)) return [3 /*break*/, 12];
                            forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=".concat(encodeURIComponent(city), "&appid=").concat(OPENWEATHER_API_KEY, "&units=metric");
                            return [4 /*yield*/, fetch(forecastUrl)];
                        case 2:
                            forecastResponse = _a.sent();
                            if (!!forecastResponse.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, forecastResponse.text()];
                        case 3:
                            errorText = _a.sent();
                            console.error("Forecast API error:", forecastResponse.status, errorText);
                            if (forecastResponse.status === 404) {
                                return [2 /*return*/, res.status(404).json({ error: "City not found" })];
                            }
                            if (forecastResponse.status === 401) {
                                return [2 /*return*/, res.status(500).json({ error: "Invalid API key" })];
                            }
                            throw new Error("Forecast API error: ".concat(forecastResponse.status));
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, forecastResponse.json()];
                        case 5:
                            forecastApiData_1 = _a.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            parseError_2 = _a.sent();
                            console.error("Failed to parse forecast API response:", parseError_2);
                            return [2 /*return*/, res.status(500).json({ error: "Invalid response from forecast service" })];
                        case 7: 
                        // Clear old forecast data
                        return [4 /*yield*/, storage.deleteForecastData(city)];
                        case 8:
                            // Clear old forecast data
                            _a.sent();
                            forecastInserts = forecastApiData_1.list.map(function (item) { return ({
                                cityName: forecastApiData_1.city.name,
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
                            }); });
                            forecastData = [];
                            _i = 0, forecastInserts_1 = forecastInserts;
                            _a.label = 9;
                        case 9:
                            if (!(_i < forecastInserts_1.length)) return [3 /*break*/, 12];
                            forecastInsert = forecastInserts_1[_i];
                            validatedData = insertForecastDataSchema.parse(forecastInsert);
                            return [4 /*yield*/, storage.createForecastData(validatedData)];
                        case 10:
                            stored = _a.sent();
                            forecastData.push(stored);
                            _a.label = 11;
                        case 11:
                            _i++;
                            return [3 /*break*/, 9];
                        case 12:
                            res.json(forecastData);
                            return [3 /*break*/, 14];
                        case 13:
                            error_7 = _a.sent();
                            console.error("Forecast API error:", error_7);
                            res.status(500).json({
                                error: error_7 instanceof Error ? error_7.message : "Failed to fetch forecast data"
                            });
                            return [3 /*break*/, 14];
                        case 14: return [2 /*return*/];
                    }
                });
            }); });
            // Get weather statistics by coordinates
            app.get("/api/weather/statistics/coords", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var lat, lon, latitude, longitude, weatherUrl, weatherResponse, weatherApiData, uvIndex, uvUrl, uvResponse, uvData, error_8, airQuality, airUrl, airResponse, airData, error_9, weatherData, forecastUrl, forecastResponse, forecastData, forecastApiData, temps, humidities, winds, avgTemp, avgHumidity, avgWind, tempTrend, humidityTrend, windTrend, allConditions, conditions, weeklyData, today, _loop_1, i, statistics, error_10;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 18, , 19]);
                            lat = req.query.lat;
                            lon = req.query.lon;
                            if (!lat || !lon) {
                                return [2 /*return*/, res.status(400).json({ error: "Missing coordinates" })];
                            }
                            latitude = parseFloat(lat);
                            longitude = parseFloat(lon);
                            if (isNaN(latitude) || isNaN(longitude)) {
                                return [2 /*return*/, res.status(400).json({ error: "Invalid coordinates" })];
                            }
                            if (!OPENWEATHER_API_KEY) {
                                return [2 /*return*/, res.status(500).json({ error: "Weather API key not configured. Please add OPENWEATHER_API_KEY to environment variables." })];
                            }
                            weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=".concat(latitude, "&lon=").concat(longitude, "&appid=").concat(OPENWEATHER_API_KEY, "&units=metric");
                            return [4 /*yield*/, fetch(weatherUrl)];
                        case 1:
                            weatherResponse = _b.sent();
                            if (!weatherResponse.ok) {
                                if (weatherResponse.status === 404) {
                                    return [2 /*return*/, res.status(404).json({ error: "Location not found" })];
                                }
                                throw new Error("Weather API error: ".concat(weatherResponse.status));
                            }
                            return [4 /*yield*/, weatherResponse.json()];
                        case 2:
                            weatherApiData = _b.sent();
                            uvIndex = 0;
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 7, , 8]);
                            uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=".concat(weatherApiData.coord.lat, "&lon=").concat(weatherApiData.coord.lon, "&appid=").concat(OPENWEATHER_API_KEY);
                            return [4 /*yield*/, fetch(uvUrl)];
                        case 4:
                            uvResponse = _b.sent();
                            if (!uvResponse.ok) return [3 /*break*/, 6];
                            return [4 /*yield*/, uvResponse.json()];
                        case 5:
                            uvData = _b.sent();
                            uvIndex = uvData.value;
                            _b.label = 6;
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            error_8 = _b.sent();
                            console.warn("Failed to fetch UV index:", error_8);
                            return [3 /*break*/, 8];
                        case 8:
                            airQuality = null;
                            _b.label = 9;
                        case 9:
                            _b.trys.push([9, 13, , 14]);
                            airUrl = "https://api.openweathermap.org/data/2.5/air_pollution?lat=".concat(weatherApiData.coord.lat, "&lon=").concat(weatherApiData.coord.lon, "&appid=").concat(OPENWEATHER_API_KEY);
                            return [4 /*yield*/, fetch(airUrl)];
                        case 10:
                            airResponse = _b.sent();
                            if (!airResponse.ok) return [3 /*break*/, 12];
                            return [4 /*yield*/, airResponse.json()];
                        case 11:
                            airData = _b.sent();
                            airQuality = ((_a = airData.list[0]) === null || _a === void 0 ? void 0 : _a.main.aqi) || null;
                            _b.label = 12;
                        case 12: return [3 /*break*/, 14];
                        case 13:
                            error_9 = _b.sent();
                            console.warn("Failed to fetch air quality:", error_9);
                            return [3 /*break*/, 14];
                        case 14:
                            weatherData = {
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
                                uvIndex: uvIndex,
                                weatherMain: weatherApiData.weather[0].main,
                                weatherDescription: weatherApiData.weather[0].description,
                                weatherIcon: weatherApiData.weather[0].icon,
                                sunrise: new Date(weatherApiData.sys.sunrise * 1000),
                                sunset: new Date(weatherApiData.sys.sunset * 1000),
                                airQuality: airQuality,
                            };
                            forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=".concat(latitude, "&lon=").concat(longitude, "&appid=").concat(OPENWEATHER_API_KEY, "&units=metric");
                            return [4 /*yield*/, fetch(forecastUrl)];
                        case 15:
                            forecastResponse = _b.sent();
                            forecastData = [];
                            if (!forecastResponse.ok) return [3 /*break*/, 17];
                            return [4 /*yield*/, forecastResponse.json()];
                        case 16:
                            forecastApiData = _b.sent();
                            forecastData = forecastApiData.list.map(function (item) { return ({
                                date: new Date(item.dt * 1000),
                                temperature: item.main.temp,
                                humidity: item.main.humidity,
                                windSpeed: item.wind.speed,
                                weatherMain: item.weather[0].main,
                            }); });
                            _b.label = 17;
                        case 17:
                            temps = __spreadArray([weatherData.temperature], forecastData.map(function (f) { return f.temperature; }), true);
                            humidities = __spreadArray([weatherData.humidity], forecastData.map(function (f) { return f.humidity; }), true);
                            winds = __spreadArray([weatherData.windSpeed], forecastData.map(function (f) { return f.windSpeed; }), true);
                            avgTemp = temps.reduce(function (sum, temp) { return sum + temp; }, 0) / temps.length;
                            avgHumidity = humidities.reduce(function (sum, hum) { return sum + hum; }, 0) / humidities.length;
                            avgWind = winds.reduce(function (sum, wind) { return sum + wind; }, 0) / winds.length;
                            tempTrend = forecastData.length > 0
                                ? (forecastData[forecastData.length - 1].temperature > weatherData.temperature ? 'up' : 'down')
                                : 'stable';
                            humidityTrend = forecastData.length > 0
                                ? (forecastData[forecastData.length - 1].humidity > weatherData.humidity ? 'up' : 'down')
                                : 'stable';
                            windTrend = forecastData.length > 0
                                ? (forecastData[forecastData.length - 1].windSpeed > weatherData.windSpeed ? 'up' : 'down')
                                : 'stable';
                            allConditions = __spreadArray([weatherData.weatherMain], forecastData.map(function (f) { return f.weatherMain; }), true);
                            conditions = {
                                sunny: allConditions.filter(function (c) { return c.toLowerCase().includes('clear') || c.toLowerCase().includes('sun'); }).length,
                                cloudy: allConditions.filter(function (c) { return c.toLowerCase().includes('cloud'); }).length,
                                rainy: allConditions.filter(function (c) { return c.toLowerCase().includes('rain'); }).length,
                                stormy: allConditions.filter(function (c) { return c.toLowerCase().includes('storm') || c.toLowerCase().includes('thunder'); }).length,
                            };
                            weeklyData = [];
                            today = new Date();
                            _loop_1 = function (i) {
                                var targetDate = new Date(today);
                                targetDate.setDate(today.getDate() + i);
                                // Filter forecast data for this specific day
                                var dayForecasts = forecastData.filter(function (f) {
                                    var forecastDate = new Date(f.date);
                                    return forecastDate.toDateString() === targetDate.toDateString();
                                });
                                if (dayForecasts.length > 0) {
                                    // Calculate daily averages
                                    var avgTemp_1 = dayForecasts.reduce(function (sum, f) { return sum + f.temperature; }, 0) / dayForecasts.length;
                                    var avgHumidity_1 = dayForecasts.reduce(function (sum, f) { return sum + f.humidity; }, 0) / dayForecasts.length;
                                    var avgWind_1 = dayForecasts.reduce(function (sum, f) { return sum + f.windSpeed; }, 0) / dayForecasts.length;
                                    // Use the most common condition for the day
                                    var conditions_1 = dayForecasts.map(function (f) { return f.weatherMain; });
                                    var mostCommonCondition = conditions_1.sort(function (a, b) {
                                        return conditions_1.filter(function (v) { return v === a; }).length - conditions_1.filter(function (v) { return v === b; }).length;
                                    }).pop() || 'Clear';
                                    weeklyData.push({
                                        day: targetDate.toLocaleDateString('en', { weekday: 'short' }),
                                        temp: Math.round(avgTemp_1),
                                        humidity: Math.round(avgHumidity_1),
                                        wind: Math.round(avgWind_1),
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
                            };
                            for (i = 0; i < 7; i++) {
                                _loop_1(i);
                            }
                            statistics = {
                                temperature: {
                                    current: Math.round(weatherData.temperature),
                                    average: Math.round(avgTemp),
                                    min: Math.round(Math.min.apply(Math, temps)),
                                    max: Math.round(Math.max.apply(Math, temps)),
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
                                conditions: conditions,
                                weeklyData: weeklyData,
                            };
                            res.json(statistics);
                            return [3 /*break*/, 19];
                        case 18:
                            error_10 = _b.sent();
                            console.error('Statistics API error (coords):', error_10);
                            res.status(500).json({ error: "Failed to fetch weather statistics by coordinates" });
                            return [3 /*break*/, 19];
                        case 19: return [2 /*return*/];
                    }
                });
            }); });
            // Get weather statistics for a city
            app.get("/api/weather/statistics/:city", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var city, weatherData, weatherUrl, weatherResponse, weatherApiData, uvIndex, uvUrl, uvResponse, uvData, error_11, airQuality, airUrl, airResponse, airData, error_12, weatherInsert, validatedData, forecastData, temps, humidities, winds, avgTemp, avgHumidity, avgWind, tempTrend, humidityTrend, windTrend, allConditions, conditions, weeklyData, today, _loop_2, i, statistics, error_13;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 19, , 20]);
                            city = req.params.city;
                            if (!OPENWEATHER_API_KEY) {
                                return [2 /*return*/, res.status(500).json({
                                        error: "Weather API key not configured. Please add OPENWEATHER_API_KEY to environment variables."
                                    })];
                            }
                            return [4 /*yield*/, storage.getWeatherData(city)];
                        case 1:
                            weatherData = _b.sent();
                            if (!!weatherData) return [3 /*break*/, 17];
                            weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=".concat(encodeURIComponent(city), "&appid=").concat(OPENWEATHER_API_KEY, "&units=metric");
                            return [4 /*yield*/, fetch(weatherUrl)];
                        case 2:
                            weatherResponse = _b.sent();
                            if (!weatherResponse.ok) {
                                if (weatherResponse.status === 404) {
                                    return [2 /*return*/, res.status(404).json({ error: "City not found" })];
                                }
                                throw new Error("Weather API error: ".concat(weatherResponse.status));
                            }
                            return [4 /*yield*/, weatherResponse.json()];
                        case 3:
                            weatherApiData = _b.sent();
                            uvIndex = 0;
                            _b.label = 4;
                        case 4:
                            _b.trys.push([4, 8, , 9]);
                            uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=".concat(weatherApiData.coord.lat, "&lon=").concat(weatherApiData.coord.lon, "&appid=").concat(OPENWEATHER_API_KEY);
                            return [4 /*yield*/, fetch(uvUrl)];
                        case 5:
                            uvResponse = _b.sent();
                            if (!uvResponse.ok) return [3 /*break*/, 7];
                            return [4 /*yield*/, uvResponse.json()];
                        case 6:
                            uvData = _b.sent();
                            uvIndex = uvData.value;
                            _b.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            error_11 = _b.sent();
                            console.warn("Failed to fetch UV index:", error_11);
                            return [3 /*break*/, 9];
                        case 9:
                            airQuality = null;
                            _b.label = 10;
                        case 10:
                            _b.trys.push([10, 14, , 15]);
                            airUrl = "https://api.openweathermap.org/data/2.5/air_pollution?lat=".concat(weatherApiData.coord.lat, "&lon=").concat(weatherApiData.coord.lon, "&appid=").concat(OPENWEATHER_API_KEY);
                            return [4 /*yield*/, fetch(airUrl)];
                        case 11:
                            airResponse = _b.sent();
                            if (!airResponse.ok) return [3 /*break*/, 13];
                            return [4 /*yield*/, airResponse.json()];
                        case 12:
                            airData = _b.sent();
                            airQuality = ((_a = airData.list[0]) === null || _a === void 0 ? void 0 : _a.main.aqi) || null;
                            _b.label = 13;
                        case 13: return [3 /*break*/, 15];
                        case 14:
                            error_12 = _b.sent();
                            console.warn("Failed to fetch air quality:", error_12);
                            return [3 /*break*/, 15];
                        case 15:
                            weatherInsert = {
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
                                uvIndex: uvIndex,
                                weatherMain: weatherApiData.weather[0].main,
                                weatherDescription: weatherApiData.weather[0].description,
                                weatherIcon: weatherApiData.weather[0].icon,
                                sunrise: new Date(weatherApiData.sys.sunrise * 1000),
                                sunset: new Date(weatherApiData.sys.sunset * 1000),
                                airQuality: airQuality,
                            };
                            validatedData = insertWeatherDataSchema.parse(weatherInsert);
                            return [4 /*yield*/, storage.createWeatherData(validatedData)];
                        case 16:
                            weatherData = _b.sent();
                            _b.label = 17;
                        case 17: return [4 /*yield*/, storage.getForecastData(city)];
                        case 18:
                            forecastData = _b.sent();
                            temps = __spreadArray([weatherData.temperature], forecastData.map(function (f) { return f.temperature; }), true);
                            humidities = __spreadArray([weatherData.humidity], forecastData.map(function (f) { return f.humidity; }), true);
                            winds = __spreadArray([weatherData.windSpeed], forecastData.map(function (f) { return f.windSpeed; }), true);
                            avgTemp = temps.reduce(function (sum, temp) { return sum + temp; }, 0) / temps.length;
                            avgHumidity = humidities.reduce(function (sum, hum) { return sum + hum; }, 0) / humidities.length;
                            avgWind = winds.reduce(function (sum, wind) { return sum + wind; }, 0) / winds.length;
                            tempTrend = forecastData.length > 0
                                ? (forecastData[forecastData.length - 1].temperature > weatherData.temperature ? 'up' : 'down')
                                : 'stable';
                            humidityTrend = forecastData.length > 0
                                ? (forecastData[forecastData.length - 1].humidity > weatherData.humidity ? 'up' : 'down')
                                : 'stable';
                            windTrend = forecastData.length > 0
                                ? (forecastData[forecastData.length - 1].windSpeed > weatherData.windSpeed ? 'up' : 'down')
                                : 'stable';
                            allConditions = __spreadArray([weatherData.weatherMain], forecastData.map(function (f) { return f.weatherMain; }), true);
                            conditions = {
                                sunny: allConditions.filter(function (c) { return c.toLowerCase().includes('clear') || c.toLowerCase().includes('sun'); }).length,
                                cloudy: allConditions.filter(function (c) { return c.toLowerCase().includes('cloud'); }).length,
                                rainy: allConditions.filter(function (c) { return c.toLowerCase().includes('rain'); }).length,
                                stormy: allConditions.filter(function (c) { return c.toLowerCase().includes('storm') || c.toLowerCase().includes('thunder'); }).length,
                            };
                            weeklyData = [];
                            today = new Date();
                            _loop_2 = function (i) {
                                var targetDate = new Date(today);
                                targetDate.setDate(today.getDate() + i);
                                // Filter forecast data for this specific day
                                var dayForecasts = forecastData.filter(function (f) {
                                    var forecastDate = new Date(f.date);
                                    return forecastDate.toDateString() === targetDate.toDateString();
                                });
                                if (dayForecasts.length > 0) {
                                    // Calculate daily averages
                                    var avgTemp_2 = dayForecasts.reduce(function (sum, f) { return sum + f.temperature; }, 0) / dayForecasts.length;
                                    var avgHumidity_2 = dayForecasts.reduce(function (sum, f) { return sum + f.humidity; }, 0) / dayForecasts.length;
                                    var avgWind_2 = dayForecasts.reduce(function (sum, f) { return sum + f.windSpeed; }, 0) / dayForecasts.length;
                                    // Use the most common condition for the day
                                    var conditions_2 = dayForecasts.map(function (f) { return f.weatherMain; });
                                    var mostCommonCondition = conditions_2.sort(function (a, b) {
                                        return conditions_2.filter(function (v) { return v === a; }).length - conditions_2.filter(function (v) { return v === b; }).length;
                                    }).pop() || 'Clear';
                                    weeklyData.push({
                                        day: targetDate.toLocaleDateString('en', { weekday: 'short' }),
                                        temp: Math.round(avgTemp_2),
                                        humidity: Math.round(avgHumidity_2),
                                        wind: Math.round(avgWind_2),
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
                            };
                            for (i = 0; i < 7; i++) {
                                _loop_2(i);
                            }
                            statistics = {
                                temperature: {
                                    current: Math.round(weatherData.temperature),
                                    average: Math.round(avgTemp),
                                    min: Math.round(Math.min.apply(Math, temps)),
                                    max: Math.round(Math.max.apply(Math, temps)),
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
                                conditions: conditions,
                                weeklyData: weeklyData,
                            };
                            res.json(statistics);
                            return [3 /*break*/, 20];
                        case 19:
                            error_13 = _b.sent();
                            console.error('Statistics API error:', error_13);
                            res.status(500).json({ error: "Failed to fetch weather statistics" });
                            return [3 /*break*/, 20];
                        case 20: return [2 /*return*/];
                    }
                });
            }); });
            httpServer = createServer(app);
            return [2 /*return*/, httpServer];
        });
    });
}
