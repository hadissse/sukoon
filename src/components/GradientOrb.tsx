const gradients: Record<string, [string, string]> = {
  dawn: ['#F8D6BE', '#E9785E'],
  sage: ['#C9D2BE', '#8FA084'],
  lake: ['#C2D3E2', '#7E97B8'],
  dusk: ['#9C8AB8', '#5A3E7A'],
  night: ['#3A4490', '#1B1F47'],
  ember: ['#F5A584', '#D4704A'],
  dust: ['#D4C4B0', '#8B7B6B'],
};

export function GradientOrb({
  variant = 'dawn',
  size = 160,
  className = ''
}: {
  variant?: keyof typeof gradients
  size?: number
  className?: string
}) {
  const [a, b] = gradients[variant] || gradients.dawn;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${a}, ${b})`,
        opacity: 0.4,
      }}
    />
  );
}
