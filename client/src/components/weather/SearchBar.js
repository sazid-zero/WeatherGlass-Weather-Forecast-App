import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationHistory } from '@/hooks/use-location-history';
export function SearchBar(_a) {
    var onCitySearch = _a.onCitySearch, _b = _a.className, className = _b === void 0 ? "" : _b, _c = _a.placeholder, placeholder = _c === void 0 ? "Search for cities..." : _c;
    var _d = useState(''), searchTerm = _d[0], setSearchTerm = _d[1];
    var _e = useState(false), isOpen = _e[0], setIsOpen = _e[1];
    var _f = useState([]), suggestions = _f[0], setSuggestions = _f[1];
    var searchRef = useRef(null);
    var getRecent = useLocationHistory().getRecent;
    var popularCities = [
        'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore', 'Los Angeles',
        'Berlin', 'Rome', 'Barcelona', 'Amsterdam', 'Vienna', 'Prague', 'Mumbai', 'Delhi'
    ];
    useEffect(function () {
        var handleClickOutside = function (event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    var handleSubmit = function (e) {
        e.preventDefault();
        handleSearch();
    };
    var handleSearch = function (city) {
        var searchCity = city || searchTerm.trim();
        if (searchCity) {
            onCitySearch(searchCity);
            setSearchTerm('');
            setIsOpen(false);
        }
    };
    var handleInputChange = function (value) {
        setSearchTerm(value);
        setIsOpen(true);
        if (value.trim()) {
            var filtered = popularCities.filter(function (city) {
                return city.toLowerCase().includes(value.toLowerCase());
            });
            setSuggestions(filtered.slice(0, 5));
        }
        else {
            setSuggestions([]);
        }
    };
    var recentLocations = getRecent(3);
    return (_jsxs("div", { className: "relative ".concat(className), ref: searchRef, children: [_jsxs(motion.form, { onSubmit: handleSubmit, className: "glass-card rounded-2xl p-1 flex items-center space-x-3 w-80", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: [_jsx(Search, { className: "text-muted-foreground ml-4 h-4 w-4" }), _jsx("input", { type: "text", placeholder: placeholder, value: searchTerm, onChange: function (e) { return handleInputChange(e.target.value); }, onFocus: function () { return setIsOpen(true); }, className: "bg-transparent outline-none flex-1 p-3 text-foreground placeholder:text-muted-foreground" })] }), _jsx(AnimatePresence, { children: isOpen && (suggestions.length > 0 || recentLocations.length > 0) && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "absolute top-full left-0 right-0 mt-2 glass-card rounded-xl border border-white/20 dark:border-white/10 backdrop-blur-sm z-50 max-h-64 overflow-y-auto", children: [searchTerm && suggestions.length > 0 && (_jsxs("div", { className: "p-2", children: [_jsx("div", { className: "text-xs text-muted-foreground px-2 py-1 font-medium", children: "Suggestions" }), suggestions.map(function (city, index) { return (_jsxs(motion.button, { onClick: function () { return handleSearch(city); }, className: "w-full text-left px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors flex items-center gap-2", initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, children: [_jsx(MapPin, { className: "h-4 w-4 text-primary" }), _jsx("span", { className: "text-foreground", children: city })] }, city)); })] })), !searchTerm && recentLocations.length > 0 && (_jsxs("div", { className: "p-2", children: [_jsx("div", { className: "text-xs text-muted-foreground px-2 py-1 font-medium", children: "Recent Searches" }), recentLocations.map(function (location, index) { return (_jsxs(motion.button, { onClick: function () { return handleSearch(location.name); }, className: "w-full text-left px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors flex items-center gap-2", initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, children: [_jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { children: [_jsx("div", { className: "text-foreground", children: location.name }), _jsx("div", { className: "text-xs text-muted-foreground", children: location.country })] })] }, location.id)); })] })), !searchTerm && recentLocations.length === 0 && (_jsx("div", { className: "p-4 text-center text-muted-foreground text-sm", children: "Start typing to search for cities" }))] })) })] }));
}
