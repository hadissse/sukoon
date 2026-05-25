export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col min-h-dvh bg-white">{children}</div>;
}
