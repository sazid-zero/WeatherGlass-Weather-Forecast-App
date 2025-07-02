import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';
export function ThemeToggle() {
    var _a = useTheme(), theme = _a.theme, setTheme = _a.setTheme;
    var toggleTheme = function () {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    return (_jsx(motion.button, { onClick: toggleTheme, className: "p-3 rounded-2xl bg-white/20 hover:bg-white/30 text-foreground transition-all duration-300", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(motion.div, { initial: false, animate: { rotate: theme === 'light' ? 0 : 180 }, transition: { duration: 0.3 }, children: theme === 'light' ? (_jsx(Moon, { className: "w-5 h-5" })) : (_jsx(Sun, { className: "w-5 h-5" })) }) }));
}
