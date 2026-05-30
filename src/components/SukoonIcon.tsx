interface SukoonIconProps {
  size?: number;
  className?: string;
}

export function SukoonIcon({ size = 36, className }: SukoonIconProps) {
  return (
    <img
      src="/sukoon-icon.svg"
      width={size}
      height={size}
      alt="سُكون"
      className={className}
      style={{ display: 'inline-block', flexShrink: 0 }}
    />
  );
}
