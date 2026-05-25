export default function EveningLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col min-h-dvh" style={{ background: '#0F1228' }}>{children}</div>;
}
