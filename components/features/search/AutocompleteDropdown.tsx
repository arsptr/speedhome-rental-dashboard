import { cn } from '@/lib/utils';

type AutocompleteDropdownProps = {
  suggestions: string[];
  isLoading?: boolean;
  isOpen: boolean;
  onSelect: (value: string) => void;
  className?: string;
};

export function AutocompleteDropdown({
  suggestions,
  isLoading = false,
  isOpen,
  onSelect,
  className,
}: AutocompleteDropdownProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        'bg-popover text-popover-foreground absolute top-full z-20 mt-2 w-full overflow-hidden rounded-md border shadow-md',
        className,
      )}
      role="listbox"
    >
      {isLoading ? (
        <p className="text-muted-foreground px-3 py-2 text-sm">Loading suggestions...</p>
      ) : suggestions.length > 0 ? (
        <ul className="max-h-56 overflow-y-auto py-1">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                className="hover:bg-accent hover:text-accent-foreground w-full px-3 py-2 text-left text-sm"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect(suggestion)}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground px-3 py-2 text-sm">No matching areas found.</p>
      )}
    </div>
  );
}
