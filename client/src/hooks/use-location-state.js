var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { useState, useEffect, createContext, useContext } from 'react';
var LocationContext = createContext(undefined);
var LOCATION_STORAGE_KEY = 'weather-app-selected-location';
export function useLocationState() {
    var context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocationState must be used within LocationProvider');
    }
    return context;
}
export function useLocationStateManager() {
    var _a = useState(function () {
        try {
            var stored = localStorage.getItem(LOCATION_STORAGE_KEY);
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
    }), locationState = _a[0], setLocationState = _a[1];
    useEffect(function () {
        try {
            localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationState));
        }
        catch (error) {
            console.warn('Failed to save location state:', error);
        }
    }, [locationState]);
    var setSelectedLocation = function (location) {
        setLocationState({
            selectedLocation: location,
            isCurrentLocation: false,
            coordinates: null
        });
    };
    var setCurrentLocation = function (coords) {
        setLocationState({
            selectedLocation: null,
            isCurrentLocation: true,
            coordinates: coords
        });
    };
    var refreshLocation = function () {
        if (locationState.isCurrentLocation) {
            // Trigger current location refresh
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                }, function (error) {
                    console.error('Geolocation error:', error);
                });
            }
        }
        else if (locationState.selectedLocation) {
            // Keep the same selected location but force refresh
            setLocationState(function (prev) { return (__assign({}, prev)); });
        }
    };
    return {
        locationState: locationState,
        setSelectedLocation: setSelectedLocation,
        setCurrentLocation: setCurrentLocation,
        refreshLocation: refreshLocation
    };
}
export { LocationContext };
