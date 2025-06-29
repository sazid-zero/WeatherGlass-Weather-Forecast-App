import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

interface SettingsToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SettingsToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false
}: SettingsToggleProps) {
  return (
    <motion.div
      className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex-1">
        <Label htmlFor={id} className="font-medium text-foreground cursor-pointer">
          {label}
        </Label>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </motion.div>
  );
}