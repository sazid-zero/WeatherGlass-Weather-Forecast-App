import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

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
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
}