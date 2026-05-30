import { TabBar } from '@/components/TabBar';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { AuthBootstrap } from '@/components/AuthBootstrap';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-dvh">
      <AuthBootstrap />

      {/* Desktop: persistent left sidebar (nav + actions). Hidden on mobile. */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile-only top bar — replaced by the sidebar on md+ */}
        <div className="md:hidden">
          <Header />
        </div>

        <main className="flex-1 pb-20 md:pb-10 w-full max-w-[430px] md:max-w-[900px] mx-auto md:px-8">
          {children}
        </main>
      </div>

      {/* Mobile-only bottom tab bar — replaced by the sidebar on md+ */}
      <div className="md:hidden">
        <TabBar />
      </div>
    </div>
  );
}
