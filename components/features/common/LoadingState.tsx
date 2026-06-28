import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

type LoadingStateProps = {
  title?: string;
  message?: string;
  className?: string;
};

export function LoadingState({
  title = 'Searching listings',
  message = 'Please wait while we prepare your search.',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-10 text-center',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="text-primary size-8 animate-spin" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
}
