import { useState, useEffect } from 'react';
import { AppSettings, appSettingsSchema } from '@shared/settings';

const SETTINGS_STORAGE_KEY = 'weather-app-settings';

const defaultSettings: AppSettings = {
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
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert lastUpdated string back to Date
        if (parsed.lastUpdated) {
          parsed.lastUpdated = new Date(parsed.lastUpdated);
        }
        return appSettingsSchema.parse(parsed);
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
    return defaultSettings;
  });

  const updateSettings = (updates: Partial<AppSettings>) => {
    const newSettings = {
      ...settings,
      ...updates,
      lastUpdated: new Date(),
    };
    
    try {
      const validated = appSettingsSchema.parse(newSettings);
      setSettings(validated);
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(validated));
    } catch (error) {
      console.error('Invalid settings update:', error);
    }
  };

  const updateWeatherSettings = (weatherUpdates: Partial<AppSettings['weather']>) => {
    updateSettings({
      weather: { ...settings.weather, ...weatherUpdates }
    });
  };

  const updateNotificationSettings = (notificationUpdates: Partial<AppSettings['notifications']>) => {
    updateSettings({
      notifications: { ...settings.notifications, ...notificationUpdates }
    });
  };

  const updatePrivacySettings = (privacyUpdates: Partial<AppSettings['privacy']>) => {
    updateSettings({
      privacy: { ...settings.privacy, ...privacyUpdates }
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  };

  return {
    settings,
    updateSettings,
    updateWeatherSettings,
    updateNotificationSettings,
    updatePrivacySettings,
    resetSettings,
  };
}