'use client';

import { useState } from 'react';

import { AutocompleteDropdown } from '@/components/features/search/AutocompleteDropdown';
import { Input } from '@/components/ui/input';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import { cn } from '@/lib/utils';

type AreaSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export function AreaSearchInput({
  value,
  onChange,
  disabled = false,
  className,
}: AreaSearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { suggestions, isLoading } = useAutocomplete({
    query: value,
    enabled: !disabled && isFocused,
  });

  const showDropdown = isFocused && value.trim().length > 0;

  return (
    <div className={cn('relative space-y-2', className)}>
      <label htmlFor="property-area" className="text-sm font-medium">
        Property or Area
      </label>
      <Input
        id="property-area"
        type="text"
        autoComplete="off"
        placeholder="e.g. Mont Kiara, Bangsar, KLCC"
        value={value}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => window.setTimeout(() => setIsFocused(false), 150)}
        onChange={(event) => onChange(event.target.value)}
      />
      <AutocompleteDropdown
        suggestions={suggestions}
        isLoading={isLoading}
        isOpen={showDropdown}
        onSelect={(suggestion) => {
          onChange(suggestion);
          setIsFocused(false);
        }}
      />
      <p className="text-muted-foreground text-xs">
        Start typing to see autocomplete suggestions.
      </p>
    </div>
  );
}
