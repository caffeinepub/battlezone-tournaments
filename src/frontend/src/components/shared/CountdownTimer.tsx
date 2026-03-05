import { useEffect, useState } from "react";

interface CountdownTimerProps {
  dateTime: string;
  status: "upcoming" | "live" | "completed";
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(dateTime: string): TimeLeft | null {
  const diff = new Date(dateTime).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({
  dateTime,
  status,
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    getTimeLeft(dateTime),
  );

  useEffect(() => {
    if (status !== "upcoming") return;

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(dateTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [dateTime, status]);

  if (status === "completed") {
    return (
      <span className={`font-mono text-xs text-muted-foreground ${className}`}>
        ENDED
      </span>
    );
  }

  if (status === "live") {
    return (
      <span
        className={`font-mono text-xs font-bold animate-pulse ${className}`}
        style={{ color: "#39ff14", textShadow: "0 0 8px #39ff14" }}
      >
        ⚡ LIVE NOW
      </span>
    );
  }

  if (!timeLeft) {
    return (
      <span
        className={`font-mono text-xs font-bold animate-pulse ${className}`}
        style={{ color: "#39ff14", textShadow: "0 0 8px #39ff14" }}
      >
        ⚡ STARTING
      </span>
    );
  }

  const parts: string[] = [];
  if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
  parts.push(`${timeLeft.hours}h`);
  parts.push(`${timeLeft.minutes}m`);
  parts.push(`${String(timeLeft.seconds).padStart(2, "0")}s`);

  return (
    <span
      className={`font-mono text-xs font-medium ${className}`}
      style={{ color: "#00f5ff" }}
    >
      ⏱ {parts.join(" ")}
    </span>
  );
}
