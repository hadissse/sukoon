export default function GlobalLoading() {
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div
        className="w-12 h-12 rounded-full animate-pulse"
        style={{ background: 'radial-gradient(circle at 35% 35%, #F8D6BE, #E9785E)' }}
      />
    </div>
  );
}
