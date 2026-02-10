import { motion } from 'framer-motion';
import { Cloud, MapPin, BarChart3, Settings, Home, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useTheme } from '@/components/ui/theme-provider';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { path: '/', icon: Home, label: 'Weather' },
  { path: '/locations', icon: MapPin, label: 'Locations' },
  { path: '/statistics', icon: BarChart3, label: 'Statistics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex min-h-screen weather-gradient-bg ">
      {/* Navigation (Sidebar on Desktop, Bottom Bar on Mobile) */}
      <motion.nav
        className="fixed z-50 glass-card bg-background/80 backdrop-blur-md border-white/20 flex items-center transition-all duration-300
                   bottom-0 left-0 right-0 h-16 w-full flex-row justify-around rounded-t-3xl border-t
                   md:left-0 md:top-0 md:h-full md:w-20 md:flex-col md:justify-start md:rounded-none md:border-r md:border-t-0 md:py-6"
        initial={isMobile ? { y: 80, opacity: 0 } : { x: -80, opacity: 0 }}
        animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="hidden md:block mb-8 p-3 rounded-2xl bg-primary/20 backdrop-blur-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Cloud className="w-6 h-6 text-primary" />
        </motion.div>

        {/* Navigation Items */}
        <div className="flex-1 flex flex-row w-full justify-around items-center md:flex-col md:space-y-4 md:w-auto md:justify-start md:mt-8">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location === item.path;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={item.path}>
                  <motion.div
                    className={`relative p-3 rounded-2xl flex items-center justify-center transition-all duration-300 group cursor-pointer ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                        : 'hover:bg-white/20 text-muted-foreground hover:text-foreground'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                    
                    {/* Tooltip */}
                    <motion.div
                      className="absolute left-full ml-4 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50"
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full w-0 h-0 border-r-4 border-r-black/80 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Theme Toggle */}
        <motion.div
          className="md:mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <motion.button
            onClick={toggleTheme}
            className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 text-foreground transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'light' ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 mb-16 md:mb-0 md:ml-20 overflow-hidden relative min-h-screen">
        {children}
      </main>
    </div>
  );
}