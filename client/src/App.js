import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Route, Switch } from "wouter";
import WeatherPage from "@/pages/weather";
import LocationsPage from "@/pages/locations";
import StatisticsPage from "@/pages/statistics";
import SettingsPage from "@/pages/settings";
import NotFoundPage from "@/pages/not-found";
import { WeatherSidebar } from "@/components/weather/WeatherSidebar";
import { LocationProvider } from "@/components/LocationProvider";
var queryClient = new QueryClient();
function ErrorFallback(_a) {
    var error = _a.error;
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "glass-card rounded-3xl p-8 max-w-md mx-4", children: [_jsx("h2", { className: "text-2xl font-bold text-red-600 mb-4", children: "Something went wrong" }), _jsx("p", { className: "text-muted-foreground mb-4", children: error.message })] }) }));
}
function App() {
    return (_jsx(ErrorBoundary, { FallbackComponent: ErrorFallback, children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(ThemeProvider, { defaultTheme: "system", storageKey: "weather-ui-theme", children: _jsxs(LocationProvider, { children: [_jsxs("div", { className: "flex min-h-screen weather-gradient-bg", children: [_jsx(WeatherSidebar, {}), _jsx("main", { className: "flex-1 overflow-auto", children: _jsxs(Switch, { children: [_jsx(Route, { path: "/", component: WeatherPage }), _jsx(Route, { path: "/locations", component: LocationsPage }), _jsx(Route, { path: "/statistics", component: StatisticsPage }), _jsx(Route, { path: "/settings", component: SettingsPage }), _jsx(Route, { component: NotFoundPage })] }) })] }), _jsx(Toaster, {})] }) }) }) }));
}
export default App;
