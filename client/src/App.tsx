import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { BrowserRouter, Route, Switch } from "wouter";
import WeatherPage from "@/pages/weather";
import LocationsPage from "@/pages/locations";
import StatisticsPage from "@/pages/statistics";
import SettingsPage from "@/pages/settings";
import NotFoundPage from "@/pages/not-found";
import { WeatherSidebar } from "@/components/weather/WeatherSidebar";
import { LocationProvider } from "@/components/LocationProvider";

const queryClient = new QueryClient();

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card rounded-3xl p-8 max-w-md mx-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
        >
          Reload page
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="weather-ui-theme">
          <LocationProvider>
            <div className="flex min-h-screen weather-gradient-bg">
              <WeatherSidebar />
              <main className="flex-1">
                <Switch>
                  <Route path="/" component={WeatherPage} />
                  <Route path="/locations" component={LocationsPage} />
                  <Route path="/statistics" component={StatisticsPage} />
                  <Route path="/settings" component={SettingsPage} />
                  <Route component={NotFoundPage} />
                </Switch>
              </main>
            </div>
            <Toaster />
          </LocationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}