import { notFound } from 'next/navigation';

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== 'development') notFound();
  return <div className="flex flex-col min-h-dvh bg-cream">{children}</div>;
}
