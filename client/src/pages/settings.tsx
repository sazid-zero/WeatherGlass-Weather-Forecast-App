import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Palette, Bell, Globe, Shield, Moon, Sun, Droplets, Waves, TreePine, Zap, RotateCcw } from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';
import { useSettings } from '@/hooks/use-settings';
import { SettingsToggle } from '@/components/settings/SettingsToggle';
import { SettingsSelect } from '@/components/settings/SettingsSelect';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation, type Language } from '@/lib/i18n';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { settings, updateWeatherSettings, updateNotificationSettings, updatePrivacySettings, resetSettings } = useSettings();
  const { toast } = useToast();
  const { t } = useTranslation((settings?.weather?.language as Language) || 'en');

  const themeOptions = [
    { 
      id: 'light', 
      name: 'Light', 
      icon: Sun, 
      description: 'Clean and bright interface',
      gradient: 'from-blue-50 to-indigo-100'
    },
    { 
      id: 'dark', 
      name: 'Dark', 
      icon: Moon, 
      description: 'Easy on the eyes',
      gradient: 'from-gray-900 to-blue-900'
    },
    { 
      id: 'ocean', 
      name: 'Ocean', 
      icon: Waves, 
      description: 'Deep blue oceanic vibes',
      gradient: 'from-blue-900 to-cyan-900'
    },
    { 
      id: 'sunset', 
      name: 'Sunset', 
      icon: Sun, 
      description: 'Warm orange and pink tones',
      gradient: 'from-orange-900 to-pink-900'
    },
    { 
      id: 'forest', 
      name: 'Forest', 
      icon: TreePine, 
      description: 'Deep greens and earth tones',
      gradient: 'from-green-900 to-emerald-900'
    },
    { 
      id: 'aurora', 
      name: 'Aurora', 
      icon: Zap, 
      description: 'Purple and cyan northern lights',
      gradient: 'from-purple-900 to-cyan-900'
    }
  ];

  const unitOptions = [
    { value: 'metric', label: 'Celsius (°C)' },
    { value: 'imperial', label: 'Fahrenheit (°F)' },
    { value: 'kelvin', label: 'Kelvin (K)' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'ru', label: 'Русский' },
    { value: 'ja', label: '日本語' },
    { value: 'zh', label: '中文' },
    { value: 'bn', label: 'বাংলা' },
    { value: 'ar', label: 'العربية' }
  ];

  const handleResetSettings = () => {
    resetSettings();
    toast({
      title: t('settingsPage.resetSettings'),
      description: t('messages.settingsReset'),
    });
  };

  return (
    <div className="p-6">
      <motion.header 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{t('settingsPage.title')}</h1>
        </div>
        <p className="text-muted-foreground">{t('settingsPage.subtitle')}</p>
      </motion.header>

      {/* Theme Selection */}
      <motion.section
        className="glass-card rounded-3xl p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Palette className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Choose Theme</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themeOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = theme === option.id;
            
            return (
              <motion.button
                key={option.id}
                onClick={() => setTheme(option.id as any)}
                className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                    : 'hover:scale-[1.02] hover:shadow-lg'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: isSelected ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-60`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-6 w-6 ${option.id === 'light' ? 'text-gray-800' : 'text-white'}`} />
                    {isSelected && (
                      <motion.div
                        className="w-3 h-3 bg-primary rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      />
                    )}
                  </div>
                  <h3 className={`font-semibold mb-1 ${option.id === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    {option.name}
                  </h3>
                  <p className={`text-sm ${option.id === 'light' ? 'text-gray-600' : 'text-white/80'}`}>
                    {option.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Weather & Appearance Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.section
          className="glass-card rounded-3xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Palette className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{t('settingsPage.weatherDisplay')}</h3>
          </div>
          
          <div className="space-y-2">
            <SettingsSelect
              id="units"
              label={t('settingsPage.temperatureUnits')}
              description={t('settingsPage.temperatureDesc')}
              value={settings?.weather?.units || 'metric'}
              onValueChange={(value) => updateWeatherSettings({ units: value as any })}
              options={unitOptions}
            />
            
            <SettingsSelect
              id="language"
              label={t('settingsPage.language')}
              description={t('settingsPage.languageDesc')}
              value={settings?.weather?.language || 'en'}
              onValueChange={(value) => updateWeatherSettings({ language: value as any })}
              options={languageOptions}
            />
          </div>
        </motion.section>

        <motion.section
          className="glass-card rounded-3xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{t('settingsPage.location')}</h3>
          </div>
          
          <div className="space-y-2">
            <SettingsToggle
              id="auto-location"
              label={t('settingsPage.autoLocation')}
              description={t('settingsPage.autoLocationDesc')}
              checked={settings.weather.autoLocation}
              onCheckedChange={(checked) => updateWeatherSettings({ autoLocation: checked })}
            />
            
            <SettingsToggle
              id="save-history"
              label="Save Location History"
              description="Remember recently searched locations"
              checked={settings.weather.saveLocationHistory}
              onCheckedChange={(checked) => updateWeatherSettings({ saveLocationHistory: checked })}
            />
          </div>
        </motion.section>
      </div>

      {/* Notifications & Privacy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.section
          className="glass-card rounded-3xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          </div>
          
          <div className="space-y-2">
            <SettingsToggle
              id="weather-alerts"
              label="Weather Alerts"
              description="Get notified about severe weather conditions"
              checked={settings.notifications.weatherAlerts}
              onCheckedChange={(checked) => updateNotificationSettings({ weatherAlerts: checked })}
            />
            
            <SettingsToggle
              id="daily-forecast"
              label="Daily Forecast"
              description="Receive daily weather summaries"
              checked={settings.notifications.dailyForecast}
              onCheckedChange={(checked) => updateNotificationSettings({ dailyForecast: checked })}
            />
            
            <SettingsToggle
              id="location-based"
              label="Location-based Alerts"
              description="Get weather updates for your current location"
              checked={settings.notifications.locationUpdates}
              onCheckedChange={(checked) => updateNotificationSettings({ locationUpdates: checked })}
            />
          </div>
        </motion.section>

        <motion.section
          className="glass-card rounded-3xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Privacy & Data</h3>
          </div>
          
          <div className="space-y-2">
            <SettingsToggle
              id="data-collection"
              label="Data Collection"
              description="Allow collection of usage data to improve features"
              checked={settings.privacy.dataCollection}
              onCheckedChange={(checked) => updatePrivacySettings({ dataCollection: checked })}
            />
            
            <SettingsToggle
              id="location-sharing"
              label="Location Sharing"
              description="Share location data for personalized weather features"
              checked={settings.privacy.locationSharing}
              onCheckedChange={(checked) => updatePrivacySettings({ locationSharing: checked })}
            />
            
            <SettingsToggle
              id="analytics"
              label="Analytics"
              description="Help improve the app by sharing anonymous usage statistics"
              checked={settings.privacy.analytics}
              onCheckedChange={(checked) => updatePrivacySettings({ analytics: checked })}
            />
          </div>
        </motion.section>
      </div>

      {/* Reset Settings */}
      <motion.section
        className="glass-card rounded-3xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Reset Settings</h3>
            <p className="text-muted-foreground">Restore all settings to their default values</p>
          </div>
          <Button
            variant="outline"
            onClick={handleResetSettings}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All
          </Button>
        </div>
      </motion.section>
    </div>
  );
}