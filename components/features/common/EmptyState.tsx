import { SearchX } from 'lucide-react';

import { cn } from '@/lib/utils';

type EmptyStateProps = {
  title?: string;
  message: string;
  className?: string;
};

export function EmptyState({
  title = 'No listings yet',
  message,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-10 text-center',
        className,
      )}
    >
      <SearchX className="text-muted-foreground size-8" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
}
