import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onCitySearch: (city: string) => void;
  className?: string;
}

export function SearchBar({ onCitySearch, className = "" }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onCitySearch(searchTerm.trim());
      setSearchTerm('');
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className={`glass-card rounded-2xl p-1 flex items-center space-x-3 w-80 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Search className="text-muted-foreground ml-4 h-4 w-4" />
      <input
        type="text"
        placeholder="Search for cities..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-transparent outline-none flex-1 p-3 text-foreground placeholder:text-muted-foreground"
      />
    </motion.form>
  );
}
