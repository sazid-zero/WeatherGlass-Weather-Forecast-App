import { jsx as _jsx } from "react/jsx-runtime";
import { LocationContext, useLocationStateManager } from '@/hooks/use-location-state';
export function LocationProvider({ children }) {
    const locationManager = useLocationStateManager();
    return (_jsx(LocationContext.Provider, { value: locationManager, children: children }));
}
