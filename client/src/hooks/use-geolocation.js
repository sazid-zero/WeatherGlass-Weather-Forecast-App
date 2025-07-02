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
import { useState, useEffect } from 'react';
export function useGeolocation() {
    var _a = useState({
        latitude: null,
        longitude: null,
        error: null,
        loading: true,
    }), state = _a[0], setState = _a[1];
    useEffect(function () {
        if (!navigator.geolocation) {
            setState(function (prev) { return (__assign(__assign({}, prev), { error: 'Geolocation is not supported by this browser.', loading: false })); });
            return;
        }
        var success = function (position) {
            setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
                loading: false,
            });
        };
        var error = function (error) {
            var errorMessage = 'Unable to retrieve your location.';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access denied by user.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out.';
                    break;
            }
            setState(function (prev) { return (__assign(__assign({}, prev), { error: errorMessage, loading: false })); });
        };
        var options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(success, error, options);
    }, []);
    return state;
}
