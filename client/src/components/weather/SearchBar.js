import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationHistory } from '@/hooks/use-location-history';
export function SearchBar({ onCitySearch, className = "", placeholder = "Search for cities..." }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const searchRef = useRef(null);
    const { getRecent } = useLocationHistory();
    const popularCities = [
        'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore', 'Los Angeles',
        'Berlin', 'Rome', 'Barcelona', 'Amsterdam', 'Vienna', 'Prague', 'Mumbai', 'Delhi'
    ];
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };
    const handleSearch = (city) => {
        const searchCity = city || searchTerm.trim();
        if (searchCity) {
            onCitySearch(searchCity);
            setSearchTerm('');
            setIsOpen(false);
        }
    };
    const handleInputChange = (value) => {
        setSearchTerm(value);
        setIsOpen(true);
        if (value.trim()) {
            const filtered = popularCities.filter(city => city.toLowerCase().includes(value.toLowerCase()));
            setSuggestions(filtered.slice(0, 5));
        }
        else {
            setSuggestions([]);
        }
    };
    const recentLocations = getRecent(3);
    return (_jsxs("div", { className: `relative ${className}`, ref: searchRef, children: [_jsxs(motion.form, { onSubmit: handleSubmit, className: "glass-card rounded-2xl p-1 flex items-center space-x-3 w-80", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: [_jsx(Search, { className: "text-muted-foreground ml-4 h-4 w-4" }), _jsx("input", { type: "text", placeholder: placeholder, value: searchTerm, onChange: (e) => handleInputChange(e.target.value), onFocus: () => setIsOpen(true), className: "bg-transparent outline-none flex-1 p-3 text-foreground placeholder:text-muted-foreground" })] }), _jsx(AnimatePresence, { children: isOpen && (suggestions.length > 0 || recentLocations.length > 0) && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "absolute top-full left-0 right-0 mt-2 glass-card rounded-xl border border-white/20 dark:border-white/10 backdrop-blur-sm z-50 max-h-64 overflow-y-auto", children: [searchTerm && suggestions.length > 0 && (_jsxs("div", { className: "p-2", children: [_jsx("div", { className: "text-xs text-muted-foreground px-2 py-1 font-medium", children: "Suggestions" }), suggestions.map((city, index) => (_jsxs(motion.button, { onClick: () => handleSearch(city), className: "w-full text-left px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors flex items-center gap-2", initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, children: [_jsx(MapPin, { className: "h-4 w-4 text-primary" }), _jsx("span", { className: "text-foreground", children: city })] }, city)))] })), !searchTerm && recentLocations.length > 0 && (_jsxs("div", { className: "p-2", children: [_jsx("div", { className: "text-xs text-muted-foreground px-2 py-1 font-medium", children: "Recent Searches" }), recentLocations.map((location, index) => (_jsxs(motion.button, { onClick: () => handleSearch(location.name), className: "w-full text-left px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors flex items-center gap-2", initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, children: [_jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { children: [_jsx("div", { className: "text-foreground", children: location.name }), _jsx("div", { className: "text-xs text-muted-foreground", children: location.country })] })] }, location.id)))] })), !searchTerm && recentLocations.length === 0 && (_jsx("div", { className: "p-4 text-center text-muted-foreground text-sm", children: "Start typing to search for cities" }))] })) })] }));
}
