import { AppLayout } from '@/components/layout/AppLayout';
import { SearchSection } from '@/components/features/search/SearchSection';

export default function HomePage() {
  return (
    <AppLayout>
      <SearchSection />
    </AppLayout>
  );
}
