import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Providers } from './providers';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen bg-bg">
        <Header variant="app" />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
