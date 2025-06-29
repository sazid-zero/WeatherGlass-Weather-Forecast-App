import { Home, MapPin, TrendingUp, Settings, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ui/theme-provider';
import { cn } from '@/lib/utils';

interface WeatherSidebarProps {
  className?: string;
}

export function WeatherSidebar({ className = "" }: WeatherSidebarProps) {
  const { theme, setTheme } = useTheme();

  const navigationItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: MapPin, label: 'Locations', active: false },
    { icon: TrendingUp, label: 'Statistics', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <motion.aside 
      className={cn("fixed left-0 top-0 h-full w-20 z-50", className)}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card h-full m-2 rounded-3xl flex flex-col items-center py-6 space-y-6">
        {/* Logo */}
        <motion.div 
          className="w-12 h-12 weather-accent-gradient rounded-2xl flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-cloud-sun text-white text-xl"></i>
        </motion.div>
        
        {/* Navigation Items */}
        <nav className="flex flex-col space-y-4">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                  item.active 
                    ? "bg-primary/20 text-primary" 
                    : "hover:bg-primary/20 text-muted-foreground hover:text-primary"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Icon className="h-5 w-5" />
              </motion.button>
            );
          })}
        </nav>
        
        {/* Theme Toggle */}
        <div className="mt-auto">
          <motion.button 
            onClick={toggleTheme}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
              theme === 'light' 
                ? "bg-yellow-400/20 text-yellow-600 hover:bg-yellow-400 hover:text-white" 
                : "bg-purple-400/20 text-purple-400 hover:bg-purple-400 hover:text-white"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
}
