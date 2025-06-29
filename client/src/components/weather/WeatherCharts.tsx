import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Droplets, Wind } from 'lucide-react';
import type { ForecastData } from '@shared/schema';
import { useTheme } from '@/components/ui/theme-provider';

interface WeatherChartsProps {
  forecastData: ForecastData[];
}

function getConditionColor(condition: string): string {
  switch (condition.toLowerCase()) {
    case 'clear': return '#fbbf24';
    case 'clouds': return '#94a3b8';
    case 'rain': return '#3b82f6';
    case 'snow': return '#e5e7eb';
    case 'thunderstorm': return '#8b5cf6';
    case 'drizzle': return '#06b6d4';
    case 'mist':
    case 'fog': return '#6b7280';
    default: return '#64748b';
  }
}

export function WeatherCharts({ forecastData }: WeatherChartsProps) {
  const { theme } = useTheme();
  const isLightTheme = theme === 'light';
  
  // Theme-aware colors
  const axisColor = isLightTheme ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)';
  const gridColor = isLightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
  const tooltipBg = isLightTheme ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)';
  const tooltipBorder = isLightTheme ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';

  if (!forecastData || forecastData.length === 0) {
    return (
      <motion.div 
        className="glass-card rounded-3xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">Weather Analytics</h3>
          <p className="text-muted-foreground">Charts will appear when forecast data is available</p>
        </div>
      </motion.div>
    );
  }

  // Prepare data for charts
  const chartData = forecastData.slice(0, 24).map(forecast => ({
    time: new Date(forecast.date).toLocaleTimeString('en-US', { 
      hour: 'numeric',
      hour12: true 
    }),
    fullDate: new Date(forecast.date),
    temperature: Math.round(forecast.temperature),
    tempMax: Math.round(forecast.tempMax),
    tempMin: Math.round(forecast.tempMin),
    humidity: forecast.humidity,
    windSpeed: Math.round(forecast.windSpeed * 10) / 10,
    precipitation: forecast.precipitationChance
  }));

  // Weather condition distribution
  const conditionData = forecastData.reduce((acc, forecast) => {
    const condition = forecast.weatherMain;
    acc[condition] = (acc[condition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(conditionData).map(([name, value]) => ({
    name,
    value,
    color: getConditionColor(name)
  }));

  // Calculate trends
  const tempTrend = chartData.length > 1 ? 
    chartData[chartData.length - 1].temperature - chartData[0].temperature : 0;
  const humidityTrend = chartData.length > 1 ?
    chartData[chartData.length - 1].humidity - chartData[0].humidity : 0;

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Weather Analytics</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            {tempTrend > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className="text-muted-foreground">
              Temperature {tempTrend > 0 ? 'rising' : 'falling'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Temperature Trend Chart */}
      <motion.div 
        className="glass-card-hover rounded-3xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">24-Hour Temperature Trend</h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span>Temperature</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span>Max</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <span>Min</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="time" 
              stroke={axisColor} 
              fontSize={12}
            />
            <YAxis 
              stroke={axisColor} 
              fontSize={12}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '12px',
                backdropFilter: 'blur(12px)',
                color: isLightTheme ? '#000' : '#fff'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="tempMax" 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="tempMin" 
              stroke="#06b6d4" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Multi-metric Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Humidity & Precipitation */}
        <motion.div 
          className="glass-card-hover rounded-3xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center space-x-2">
              <Droplets className="w-5 h-5 text-blue-400" />
              <span>Humidity & Rain</span>
            </h3>
            <div className="flex items-center space-x-2 text-sm">
              {humidityTrend > 0 ? (
                <TrendingUp className="w-4 h-4 text-blue-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-blue-400" />
              )}
              <span className="text-muted-foreground">
                {Math.abs(humidityTrend)}% change
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="time" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '12px',
                  color: isLightTheme ? '#000' : '#fff'
                }}
              />
              <Bar dataKey="humidity" fill="#06b6d4" name="Humidity %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="precipitation" fill="#8b5cf6" name="Rain Chance %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Wind Speed */}
        <motion.div 
          className="glass-card-hover rounded-3xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center space-x-2">
              <Wind className="w-5 h-5 text-green-400" />
              <span>Wind Speed</span>
            </h3>
            <span className="text-sm text-muted-foreground">m/s</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="time" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '12px',
                  color: isLightTheme ? '#000' : '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="windSpeed" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Weather Distribution */}
      <motion.div 
        className="glass-card-hover rounded-3xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ scale: 1.01 }}
      >
        <h3 className="text-xl font-semibold mb-6">Weather Conditions Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-4">
            {pieData.map((item, index) => (
              <motion.div 
                key={item.name}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">{item.value}</span>
                  <span className="text-muted-foreground text-sm ml-1">hours</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}