import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-900/40 dark:bg-red-950/20',
        className,
      )}
      role="alert"
    >
      <AlertCircle className="size-8 text-red-600 dark:text-red-400" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-medium text-red-900 dark:text-red-100">{title}</p>
        <p className="text-sm text-red-700 dark:text-red-200">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
