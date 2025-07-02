import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
export function SettingsToggle(_a) {
    var id = _a.id, label = _a.label, description = _a.description, checked = _a.checked, onCheckedChange = _a.onCheckedChange, _b = _a.disabled, disabled = _b === void 0 ? false : _b;
    return (_jsxs(motion.div, { className: "flex items-center justify-between p-4 rounded-2xl hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300", initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, whileHover: { scale: 1.01 }, children: [_jsxs("div", { className: "flex-1", children: [_jsx(Label, { htmlFor: id, className: "font-medium text-foreground cursor-pointer", children: label }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: description })] }), _jsx(Switch, { id: id, checked: checked, onCheckedChange: onCheckedChange, disabled: disabled })] }));
}
