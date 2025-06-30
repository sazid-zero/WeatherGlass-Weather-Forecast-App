import { Home, MapPin, TrendingUp, Settings, Sun, Moon, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ui/theme-provider';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

interface WeatherSidebarProps {
  className?: string;
}

export function WeatherSidebar({ className = "" }: WeatherSidebarProps) {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/', active: location === '/' },
    { icon: MapPin, label: 'Locations', path: '/locations', active: location === '/locations' },
    { icon: TrendingUp, label: 'Statistics', path: '/statistics', active: location === '/statistics' },
    { icon: Settings, label: 'Settings', path: '/settings', active: location === '/settings' },
  ];

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'ocean', 'sunset', 'forest', 'aurora'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex] as any);
  };

  return (
    <motion.aside 
      className={cn("fixed left-0 top-0 min-h-svh w-20 z-50", className)}
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
          <Cloud className="h-6 w-6 text-white" />
        </motion.div>
        
        {/* Navigation Items */}
        <nav className="flex flex-col space-y-4">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.path}>
                <motion.button
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
              </Link>
            );
          })}
        </nav>
        
        {/* Theme Toggle */}
        <div className="mt-auto">
          <motion.button 
            onClick={toggleTheme}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
              "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sun className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
}
