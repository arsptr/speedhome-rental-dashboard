import { APP_NAME } from '@/utils/constants';

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur dark:bg-black/40">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="space-y-1">
          <p className="text-lg font-semibold tracking-tight sm:text-xl">{APP_NAME}</p>
          <p className="text-muted-foreground hidden text-sm sm:block">
            Compare rental prices from publicly available SPEEDHOME listings.
          </p>
        </div>
        <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium">
          MVP
        </span>
      </div>
    </header>
  );
}
