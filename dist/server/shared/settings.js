import { z } from "zod";
// Settings schemas
export const weatherSettingsSchema = z.object({
    units: z.enum(["metric", "imperial", "kelvin"]).default("metric"),
    language: z.enum(["en", "es", "fr", "de", "it", "pt", "ru", "ja", "zh", "bn", "ar"]).default("en"),
    autoLocation: z.boolean().default(true),
    defaultLocation: z.string().optional(),
    saveLocationHistory: z.boolean().default(true),
});
export const notificationSettingsSchema = z.object({
    weatherAlerts: z.boolean().default(true),
    dailyForecast: z.boolean().default(false),
    locationUpdates: z.boolean().default(true),
    pushNotifications: z.boolean().default(false),
});
export const privacySettingsSchema = z.object({
    dataCollection: z.boolean().default(true),
    locationSharing: z.boolean().default(true),
    analytics: z.boolean().default(true),
    crashReporting: z.boolean().default(true),
});
export const appSettingsSchema = z.object({
    theme: z.enum(["light", "dark", "system", "ocean", "sunset", "forest", "aurora"]).default("system"),
    weather: weatherSettingsSchema,
    notifications: notificationSettingsSchema,
    privacy: privacySettingsSchema,
    lastUpdated: z.date().default(() => new Date()),
});
// Units conversion helpers
export const convertTemperature = (temp, from, to) => {
    if (from === to)
        return temp;
    // Convert to Celsius first
    let celsius = temp;
    if (from === "imperial")
        celsius = (temp - 32) * 5 / 9;
    if (from === "kelvin")
        celsius = temp - 273.15;
    // Convert from Celsius to target
    if (to === "imperial")
        return celsius * 9 / 5 + 32;
    if (to === "kelvin")
        return celsius + 273.15;
    return celsius;
};
export const convertSpeed = (speed, from, to) => {
    if (from === to)
        return speed;
    if (from === "metric" && to === "imperial")
        return speed * 2.237; // m/s to mph
    if (from === "imperial" && to === "metric")
        return speed / 2.237; // mph to m/s
    return speed;
};
export const getTemperatureUnit = (units) => {
    switch (units) {
        case "metric": return "°C";
        case "imperial": return "°F";
        case "kelvin": return "K";
    }
};
export const getSpeedUnit = (units) => {
    return units === "metric" ? "m/s" : "mph";
};
