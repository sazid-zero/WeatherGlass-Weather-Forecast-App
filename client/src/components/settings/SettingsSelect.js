import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ErrorBoundary } from 'react-error-boundary';
export function SettingsSelect({ id, label, description, value, onValueChange, options, disabled = false }) {
    // Ensure we have valid options and value
    const validOptions = options || [];
    const safeValue = value || validOptions[0]?.value || '';
    // Handle value change with error boundary
    const handleValueChange = (newValue) => {
        try {
            onValueChange(newValue);
        }
        catch (error) {
            console.warn('Settings update failed:', error);
        }
    };
    return (_jsxs("div", { className: "flex items-center justify-between p-4 rounded-2xl hover:bg-white/30 dark:hover:bg-white/10 transition-colors duration-300", children: [_jsxs("div", { className: "flex-1 mr-4", children: [_jsx(Label, { htmlFor: id, className: "font-medium text-foreground", children: label }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: description })] }), _jsx(ErrorBoundary, { fallback: _jsx("div", { className: "w-40 h-10 bg-muted rounded-md flex items-center justify-center", children: _jsx("span", { className: "text-sm text-muted-foreground", children: "Error loading" }) }), onError: (error) => console.error('Select component error:', error), children: _jsxs(Select, { value: safeValue, onValueChange: handleValueChange, disabled: disabled, children: [_jsx(SelectTrigger, { className: "w-40", children: _jsx(SelectValue, { placeholder: "Select option..." }) }), _jsx(SelectContent, { children: validOptions.map((option) => (_jsx(SelectItem, { value: option.value, children: option.label }, option.value))) })] }) })] }));
}
