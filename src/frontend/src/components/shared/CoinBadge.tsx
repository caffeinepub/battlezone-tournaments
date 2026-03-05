interface CoinBadgeProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  showSign?: boolean;
  className?: string;
}

export function CoinBadge({
  amount,
  size = "md",
  showSign = false,
  className = "",
}: CoinBadgeProps) {
  const isPositive = amount >= 0;
  const color = showSign ? (isPositive ? "#39ff14" : "#ff4444") : "#ffd700";
  const glow = showSign
    ? isPositive
      ? "0 0 6px rgba(57,255,20,0.4)"
      : "0 0 6px rgba(255,68,68,0.4)"
    : "0 0 6px rgba(255,215,0,0.4)";

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-lg px-4 py-1.5",
  };

  const prefix = showSign ? (isPositive ? "+" : "") : "";

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono font-bold rounded border ${sizeClasses[size]} ${className}`}
      style={{
        color,
        borderColor: `${color}60`,
        backgroundColor: `${color}10`,
        boxShadow: glow,
      }}
    >
      <span>💰</span>
      <span>
        {prefix}
        {Math.abs(amount).toLocaleString()}
      </span>
    </span>
  );
}
