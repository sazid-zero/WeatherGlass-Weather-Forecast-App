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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState, useEffect } from 'react';
import { useSettings } from './use-settings';
var LOCATION_HISTORY_KEY = 'weather-location-history';
export function useLocationHistory() {
    var settings = useSettings().settings;
    var _a = useState([]), locations = _a[0], setLocations = _a[1];
    useEffect(function () {
        if (settings.weather.saveLocationHistory) {
            try {
                var stored = localStorage.getItem(LOCATION_HISTORY_KEY);
                if (stored) {
                    var parsed = JSON.parse(stored);
                    // Convert date strings back to Date objects
                    var processedLocations = parsed.map(function (loc) { return (__assign(__assign({}, loc), { lastAccessed: new Date(loc.lastAccessed), addedAt: new Date(loc.addedAt) })); });
                    setLocations(processedLocations);
                }
            }
            catch (error) {
                console.warn('Failed to load location history:', error);
            }
        }
    }, [settings.weather.saveLocationHistory]);
    var saveLocation = function (name, country, coordinates) {
        if (!settings.weather.saveLocationHistory)
            return;
        var existingIndex = locations.findIndex(function (loc) {
            return loc.name.toLowerCase() === name.toLowerCase() && loc.country === country;
        });
        if (existingIndex >= 0) {
            // Update existing location's last accessed time
            var updatedLocations = __spreadArray([], locations, true);
            updatedLocations[existingIndex] = __assign(__assign({}, updatedLocations[existingIndex]), { lastAccessed: new Date() });
            setLocations(updatedLocations);
            localStorage.setItem(LOCATION_HISTORY_KEY, JSON.stringify(updatedLocations));
        }
        else {
            // Add new location
            var newLocation = {
                id: Date.now().toString(),
                name: name,
                country: country,
                coordinates: coordinates,
                favorite: false,
                lastAccessed: new Date(),
                addedAt: new Date(),
            };
            var updatedLocations = __spreadArray([newLocation], locations.slice(0, 49), true); // Keep max 50 locations
            setLocations(updatedLocations);
            localStorage.setItem(LOCATION_HISTORY_KEY, JSON.stringify(updatedLocations));
        }
    };
    var toggleFavorite = function (id) {
        var updatedLocations = locations.map(function (loc) {
            return loc.id === id ? __assign(__assign({}, loc), { favorite: !loc.favorite }) : loc;
        });
        setLocations(updatedLocations);
        localStorage.setItem(LOCATION_HISTORY_KEY, JSON.stringify(updatedLocations));
    };
    var removeLocation = function (id) {
        var updatedLocations = locations.filter(function (loc) { return loc.id !== id; });
        setLocations(updatedLocations);
        localStorage.setItem(LOCATION_HISTORY_KEY, JSON.stringify(updatedLocations));
    };
    var clearHistory = function () {
        setLocations([]);
        localStorage.removeItem(LOCATION_HISTORY_KEY);
    };
    var getFavorites = function () { return locations.filter(function (loc) { return loc.favorite; }); };
    var getRecent = function (limit) {
        if (limit === void 0) { limit = 10; }
        return locations
            .sort(function (a, b) { return b.lastAccessed.getTime() - a.lastAccessed.getTime(); })
            .slice(0, limit);
    };
    return {
        locations: locations,
        saveLocation: saveLocation,
        toggleFavorite: toggleFavorite,
        removeLocation: removeLocation,
        clearHistory: clearHistory,
        getFavorites: getFavorites,
        getRecent: getRecent,
    };
}
