import { TabBar } from '@/components/TabBar';
import { Header } from '@/components/Header';
import { AuthBootstrap } from '@/components/AuthBootstrap';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh">
      <AuthBootstrap />
      <Header />
      <main className="flex-1 pb-20 max-w-[430px] mx-auto w-full">
        {children}
      </main>
      <TabBar />
    </div>
  );
}
