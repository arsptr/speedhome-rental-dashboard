import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type UrlInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export function UrlInput({ value, onChange, disabled = false, className }: UrlInputProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor="speedhome-url" className="text-sm font-medium">
        SPEEDHOME URL
      </label>
      <Input
        id="speedhome-url"
        type="url"
        inputMode="url"
        placeholder="https://www.speedhome.com.my/..."
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="text-muted-foreground text-xs">
        Paste a public SPEEDHOME listing or search URL.
      </p>
    </div>
  );
}
