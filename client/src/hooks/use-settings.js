var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { useState } from 'react';
import { appSettingsSchema } from '@shared/settings';
var SETTINGS_STORAGE_KEY = 'weather-app-settings';
var defaultSettings = {
    theme: 'system',
    weather: {
        units: 'metric',
        language: 'en',
        autoLocation: true,
        saveLocationHistory: true,
    },
    notifications: {
        weatherAlerts: true,
        dailyForecast: false,
        locationUpdates: true,
        pushNotifications: false,
    },
    privacy: {
        dataCollection: true,
        locationSharing: true,
        analytics: true,
        crashReporting: true,
    },
    lastUpdated: new Date(),
};
export function useSettings() {
    var _a = useState(function () {
        try {
            var stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
            if (stored) {
                var parsed = JSON.parse(stored);
                // Convert lastUpdated string back to Date
                if (parsed.lastUpdated) {
                    parsed.lastUpdated = new Date(parsed.lastUpdated);
                }
                return appSettingsSchema.parse(parsed);
            }
        }
        catch (error) {
            console.warn('Failed to load settings from localStorage:', error);
        }
        return defaultSettings;
    }), settings = _a[0], setSettings = _a[1];
    var updateSettings = function (updates) {
        var newSettings = __assign(__assign(__assign({}, settings), updates), { lastUpdated: new Date() });
        try {
            var validated = appSettingsSchema.parse(newSettings);
            setSettings(validated);
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(validated));
        }
        catch (error) {
            console.error('Invalid settings update:', error);
        }
    };
    var updateWeatherSettings = function (weatherUpdates) {
        try {
            updateSettings({
                weather: __assign(__assign({}, settings.weather), weatherUpdates)
            });
        }
        catch (error) {
            console.error('Failed to update weather settings:', error);
        }
    };
    var updateNotificationSettings = function (notificationUpdates) {
        updateSettings({
            notifications: __assign(__assign({}, settings.notifications), notificationUpdates)
        });
    };
    var updatePrivacySettings = function (privacyUpdates) {
        updateSettings({
            privacy: __assign(__assign({}, settings.privacy), privacyUpdates)
        });
    };
    var resetSettings = function () {
        setSettings(defaultSettings);
        localStorage.removeItem(SETTINGS_STORAGE_KEY);
    };
    return {
        settings: settings,
        updateSettings: updateSettings,
        updateWeatherSettings: updateWeatherSettings,
        updateNotificationSettings: updateNotificationSettings,
        updatePrivacySettings: updatePrivacySettings,
        resetSettings: resetSettings,
    };
}
