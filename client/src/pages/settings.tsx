import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Palette, Bell, Globe, Shield, Moon, Sun, Droplets, Waves, TreePine, Zap } from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

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

  const settingsSections = [
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { label: 'Theme', description: 'Choose your preferred color theme' },
        { label: 'Units', description: 'Temperature and measurement units' },
        { label: 'Language', description: 'Interface language' }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Weather Alerts', description: 'Severe weather notifications' },
        { label: 'Daily Forecast', description: 'Daily weather summary' },
        { label: 'Location Updates', description: 'Location-based alerts' }
      ]
    },
    {
      title: 'Location',
      icon: Globe,
      items: [
        { label: 'Auto-detect Location', description: 'Use GPS for current location' },
        { label: 'Default Location', description: 'Set your home location' },
        { label: 'Location History', description: 'Save recent locations' }
      ]
    },
    {
      title: 'Privacy',
      icon: Shield,
      items: [
        { label: 'Data Collection', description: 'Control data usage' },
        { label: 'Location Sharing', description: 'Manage location privacy' },
        { label: 'Analytics', description: 'App usage analytics' }
      ]
    }
  ];

  return (
    <div className="min-h-screen weather-gradient-bg">
      <div className="ml-24 p-6">
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          </div>
          <p className="text-muted-foreground">Customize your weather app experience</p>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                      <Icon className="h-6 w-6 text-white" />
                      {isSelected && (
                        <motion.div
                          className="w-3 h-3 bg-primary rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        />
                      )}
                    </div>
                    <h3 className="font-semibold text-white mb-1">{option.name}</h3>
                    <p className="text-sm text-white/80">{option.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {settingsSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon;
            
            return (
              <motion.section
                key={section.title}
                className="glass-card rounded-3xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + sectionIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <SectionIcon className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.label}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300 cursor-pointer"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
}