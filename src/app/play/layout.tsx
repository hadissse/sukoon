export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col min-h-dvh bg-ink">{children}</div>;
}
