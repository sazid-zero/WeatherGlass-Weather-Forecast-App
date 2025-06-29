import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Activity, Calendar } from 'lucide-react';

export default function StatisticsPage() {
  const statsData = [
    {
      title: 'Weekly Average Temperature',
      value: '24°C',
      change: '+2.3°',
      trend: 'up',
      icon: TrendingUp,
      data: [20, 22, 25, 23, 26, 24, 22]
    },
    {
      title: 'Humidity Levels',
      value: '65%',
      change: '-5%',
      trend: 'down',
      icon: BarChart3,
      data: [70, 68, 65, 67, 62, 65, 63]
    },
    {
      title: 'Wind Speed',
      value: '12 km/h',
      change: '+1.2',
      trend: 'up',
      icon: Activity,
      data: [10, 11, 12, 13, 12, 11, 12]
    },
    {
      title: 'Rainy Days',
      value: '3 days',
      change: '-1',
      trend: 'down',
      icon: Calendar,
      data: [4, 3, 2, 5, 3, 2, 3]
    }
  ];

  const weeklyData = [
    { day: 'Mon', temp: 22, humidity: 65, wind: 10 },
    { day: 'Tue', temp: 25, humidity: 62, wind: 12 },
    { day: 'Wed', temp: 23, humidity: 68, wind: 8 },
    { day: 'Thu', temp: 26, humidity: 60, wind: 15 },
    { day: 'Fri', temp: 24, humidity: 65, wind: 11 },
    { day: 'Sat', temp: 22, humidity: 70, wind: 9 },
    { day: 'Sun', temp: 21, humidity: 72, wind: 7 }
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
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Weather Statistics</h1>
            <p className="text-muted-foreground">Detailed analytics and trends for your weather data</p>
          </div>
        </motion.header>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                className="glass-card rounded-3xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                  <div className={`flex items-center text-sm ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    <TrendingUp className={`h-4 w-4 mr-1 ${
                      stat.trend === 'down' ? 'rotate-180' : ''
                    }`} />
                    {stat.change}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                </div>
                
                {/* Mini chart */}
                <div className="flex items-end justify-between h-8 gap-1">
                  {stat.data.map((value, i) => (
                    <motion.div
                      key={i}
                      className="bg-primary/30 rounded-sm flex-1"
                      style={{ height: `${(value / Math.max(...stat.data)) * 100}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(value / Math.max(...stat.data)) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Weekly Chart */}
        <motion.section
          className="glass-card rounded-3xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-6">Weekly Overview</h2>
          
          <div className="grid grid-cols-7 gap-4">
            {weeklyData.map((day, index) => (
              <motion.div
                key={day.day}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                <div className="text-sm text-muted-foreground mb-2">{day.day}</div>
                
                {/* Temperature Bar */}
                <div className="bg-primary/20 rounded-lg p-3 mb-2">
                  <div className="text-lg font-bold text-foreground">{day.temp}°</div>
                  <div className="text-xs text-muted-foreground">Temp</div>
                </div>
                
                {/* Humidity Bar */}
                <div className="bg-blue-500/20 rounded-lg p-2 mb-2">
                  <div className="text-sm font-semibold text-foreground">{day.humidity}%</div>
                  <div className="text-xs text-muted-foreground">Humidity</div>
                </div>
                
                {/* Wind Bar */}
                <div className="bg-green-500/20 rounded-lg p-2">
                  <div className="text-sm font-semibold text-foreground">{day.wind}</div>
                  <div className="text-xs text-muted-foreground">Wind</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <motion.section
            className="glass-card rounded-3xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Temperature Trends</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Highest this week</span>
                <span className="font-semibold text-foreground">26°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Lowest this week</span>
                <span className="font-semibold text-foreground">21°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Average</span>
                <span className="font-semibold text-foreground">23.3°C</span>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="glass-card rounded-3xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Weather Patterns</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sunny days</span>
                <span className="font-semibold text-green-500">4 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cloudy days</span>
                <span className="font-semibold text-yellow-500">2 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Rainy days</span>
                <span className="font-semibold text-blue-500">1 day</span>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}