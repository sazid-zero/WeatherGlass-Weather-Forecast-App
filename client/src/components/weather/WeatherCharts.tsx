import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import type { ForecastData } from '@shared/schema';

interface WeatherChartsProps {
  forecastData: ForecastData[];
  className?: string;
}

export function WeatherCharts({ forecastData, className = '' }: WeatherChartsProps) {
  // Prepare data for charts
  const chartData = forecastData.slice(0, 7).map((forecast, index) => {
    const date = new Date(forecast.date);
    return {
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      date: date.getDate(),
      temp: Math.round(forecast.temperature),
      tempMin: Math.round(forecast.tempMin),
      tempMax: Math.round(forecast.tempMax),
      humidity: forecast.humidity,
      wind: Math.round(forecast.windSpeed * 3.6), // Convert m/s to km/h
    };
  });

  const hourlyData = forecastData.slice(0, 12).map((forecast, index) => {
    const date = new Date(forecast.date);
    return {
      time: date.getHours() + ':00',
      temp: Math.round(forecast.temperature),
      precipitation: forecast.precipitationChance || 0,
    };
  });

  if (!chartData.length) {
    return (
      <div className={`${className}`}>
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Weather Trends</h3>
          <div className="text-center text-muted-foreground py-8">
            No forecast data available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Temperature Trend Chart */}
      <motion.div 
        className="glass-card rounded-3xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">7-Day Temperature Forecast</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#tempGradient)"
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Hourly Temperature */}
      <motion.div 
        className="glass-card rounded-3xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Hourly Forecast</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData}>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: 'hsl(var(--chart-1))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Weather Metrics Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Humidity Chart */}
        <div className="glass-card rounded-3xl p-6">
          <h4 className="text-md font-semibold text-foreground mb-4">Humidity Levels</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                />
                <YAxis hide />
                <Bar 
                  dataKey="humidity" 
                  fill="hsl(var(--chart-2))" 
                  radius={[2, 2, 0, 0]}
                  opacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wind Speed Chart */}
        <div className="glass-card rounded-3xl p-6">
          <h4 className="text-md font-semibold text-foreground mb-4">Wind Speed</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                />
                <YAxis hide />
                <Area
                  type="monotone"
                  dataKey="wind"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  fill="url(#windGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Temperature Range Chart */}
      <motion.div 
        className="glass-card rounded-3xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Daily Temperature Range</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tempRangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Area
                type="monotone"
                dataKey="tempMax"
                stackId="1"
                stroke="hsl(var(--chart-4))"
                fill="url(#tempRangeGradient)"
              />
              <Area
                type="monotone"
                dataKey="tempMin"
                stackId="1"
                stroke="hsl(var(--chart-5))"
                fill="hsl(var(--chart-5))"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}