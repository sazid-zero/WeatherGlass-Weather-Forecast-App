import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

interface SettingsSelectProps {
  id: string;
  label: string;
  description: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

export function SettingsSelect({
  id,
  label,
  description,
  value,
  onValueChange,
  options,
  disabled = false
}: SettingsSelectProps) {
  // Ensure we have valid options and value
  const validOptions = options || [];
  const safeValue = value || validOptions[0]?.value || '';
  
  // Handle value change with error boundary
  const handleValueChange = (newValue: string) => {
    try {
      onValueChange(newValue);
    } catch (error) {
      console.warn('Settings update failed:', error);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex-1 mr-4">
        <Label htmlFor={id} className="font-medium text-foreground">
          {label}
        </Label>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <ErrorBoundary
        fallback={
          <div className="w-40 h-10 bg-muted rounded-md flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Error loading</span>
          </div>
        }
        onError={(error) => console.error('Select component error:', error)}
      >
        <Select value={safeValue} onValueChange={handleValueChange} disabled={disabled}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select option..." />
          </SelectTrigger>
          <SelectContent>
            {validOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ErrorBoundary>
    </motion.div>
  );
}