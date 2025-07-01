import { useState, useEffect, createContext, useContext } from 'react';
const LocationContext = createContext(undefined);
const LOCATION_STORAGE_KEY = 'weather-app-selected-location';
export function useLocationState() {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocationState must be used within LocationProvider');
    }
    return context;
}
export function useLocationStateManager() {
    const [locationState, setLocationState] = useState(() => {
        try {
            const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        }
        catch (error) {
            console.warn('Failed to load location state:', error);
        }
        return {
            selectedLocation: null,
            isCurrentLocation: true,
            coordinates: null
        };
    });
    useEffect(() => {
        try {
            localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationState));
        }
        catch (error) {
            console.warn('Failed to save location state:', error);
        }
    }, [locationState]);
    const setSelectedLocation = (location) => {
        setLocationState({
            selectedLocation: location,
            isCurrentLocation: false,
            coordinates: null
        });
    };
    const setCurrentLocation = (coords) => {
        setLocationState({
            selectedLocation: null,
            isCurrentLocation: true,
            coordinates: coords
        });
    };
    const refreshLocation = () => {
        if (locationState.isCurrentLocation) {
            // Trigger current location refresh
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                }, (error) => {
                    console.error('Geolocation error:', error);
                });
            }
        }
        else if (locationState.selectedLocation) {
            // Keep the same selected location but force refresh
            setLocationState(prev => ({ ...prev }));
        }
    };
    return {
        locationState,
        setSelectedLocation,
        setCurrentLocation,
        refreshLocation
    };
}
export { LocationContext };
