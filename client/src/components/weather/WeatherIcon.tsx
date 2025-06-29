import { motion } from 'framer-motion';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle,
  CloudFog,
  Eye,
  Wind,
  Sunrise,
  Sunset,
  Moon,
  CloudMoon
} from 'lucide-react';

interface WeatherIconProps {
  weatherMain: string;
  weatherIcon: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const iconSizes = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};

export function WeatherIcon({ 
  weatherMain, 
  weatherIcon, 
  size = 'md', 
  animated = true,
  className = '' 
}: WeatherIconProps) {
  const isNight = weatherIcon && weatherIcon.includes('n');
  
  const getIcon = () => {
    if (!weatherMain || !weatherIcon) return Cloud;
    
    const mainWeather = weatherMain.toLowerCase();
    
    if (mainWeather.includes('clear')) {
      return isNight ? Moon : Sun;
    }
    if (mainWeather.includes('cloud')) {
      return Cloud;
    }
    if (mainWeather.includes('rain')) {
      return CloudRain;
    }
    if (mainWeather.includes('drizzle')) {
      return CloudDrizzle;
    }
    if (mainWeather.includes('thunderstorm') || mainWeather.includes('storm')) {
      return CloudLightning;
    }
    if (mainWeather.includes('snow')) {
      return CloudSnow;
    }
    if (mainWeather.includes('mist') || mainWeather.includes('fog') || mainWeather.includes('haze')) {
      return CloudFog;
    }
    
    // Default based on icon code
    const iconCode = weatherIcon.substring(0, 2);
    switch (iconCode) {
      case '01': return isNight ? Moon : Sun;
      case '02': case '03': case '04': return Cloud;
      case '09': return CloudDrizzle;
      case '10': return CloudRain;
      case '11': return CloudLightning;
      case '13': return CloudSnow;
      case '50': return CloudFog;
      default: return Cloud;
    }
  };

  const IconComponent = getIcon();
  
  const getColor = () => {
    const mainWeather = weatherMain.toLowerCase();
    
    if (mainWeather.includes('clear')) {
      return isNight ? 'text-blue-300' : 'text-yellow-500';
    }
    if (mainWeather.includes('cloud')) {
      return 'text-gray-400';
    }
    if (mainWeather.includes('rain') || mainWeather.includes('drizzle')) {
      return 'text-blue-500';
    }
    if (mainWeather.includes('thunderstorm')) {
      return 'text-purple-500';
    }
    if (mainWeather.includes('snow')) {
      return 'text-blue-200';
    }
    if (mainWeather.includes('mist') || mainWeather.includes('fog')) {
      return 'text-gray-300';
    }
    
    return isNight ? 'text-blue-300' : 'text-yellow-500';
  };

  const animations = animated ? {
    animate: {
      rotate: weatherMain.toLowerCase().includes('clear') ? [0, 5, -5, 0] : 0,
      scale: [1, 1.05, 1],
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {};

  return (
    <motion.div
      className={`${iconSizes[size]} ${getColor()} ${className}`}
      {...animations}
    >
      <IconComponent className="w-full h-full" />
    </motion.div>
  );
}

// Specialized weather icons for specific use cases
export function SunriseIcon({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`text-orange-400 ${className}`}
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <Sunrise className="w-full h-full" />
    </motion.div>
  );
}

export function SunsetIcon({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`text-orange-500 ${className}`}
      animate={{ y: [0, 2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <Sunset className="w-full h-full" />
    </motion.div>
  );
}

export function WindIcon({ className = '', windSpeed = 0 }: { className?: string; windSpeed?: number }) {
  const intensity = windSpeed > 10 ? 'fast' : windSpeed > 5 ? 'medium' : 'slow';
  
  const animations = {
    fast: { x: [-2, 2, -2], transition: { duration: 0.5, repeat: Infinity } },
    medium: { x: [-1, 1, -1], transition: { duration: 1, repeat: Infinity } },
    slow: { x: [-0.5, 0.5, -0.5], transition: { duration: 2, repeat: Infinity } }
  };

  return (
    <motion.div
      className={`text-blue-400 ${className}`}
      animate={animations[intensity]}
    >
      <Wind className="w-full h-full" />
    </motion.div>
  );
}

export function VisibilityIcon({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`text-cyan-400 ${className}`}
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Eye className="w-full h-full" />
    </motion.div>
  );
}