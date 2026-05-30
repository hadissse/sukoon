import { TabBar } from '@/components/TabBar';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AuthBootstrap } from '@/components/AuthBootstrap';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // RTL: sidebar lives on the right (md:mr-60) so content is offset on its left.
    <div className="flex flex-col min-h-dvh md:mr-60">
      <AuthBootstrap />
      <Sidebar />
      <Header />
      <main className="flex-1 pb-20 md:pb-0 max-w-[430px] md:max-w-5xl mx-auto w-full">
        {children}
      </main>
      <TabBar />
    </div>
  );
}
