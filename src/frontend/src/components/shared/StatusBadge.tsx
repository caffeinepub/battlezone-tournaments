import { Badge } from "@/components/ui/badge";
import type {
  PaymentStatus,
  TournamentStatus,
  UserStatus,
  WithdrawalStatus,
} from "../../types";

interface TournamentStatusBadgeProps {
  status: TournamentStatus;
}

export function TournamentStatusBadge({ status }: TournamentStatusBadgeProps) {
  const config: Record<
    TournamentStatus,
    { label: string; color: string; glow: string }
  > = {
    upcoming: {
      label: "UPCOMING",
      color: "#00f5ff",
      glow: "0 0 8px rgba(0,245,255,0.5)",
    },
    live: {
      label: "LIVE",
      color: "#39ff14",
      glow: "0 0 8px rgba(57,255,20,0.5)",
    },
    completed: {
      label: "COMPLETED",
      color: "#64748b",
      glow: "none",
    },
  };

  const { label, color, glow } = config[status];

  return (
    <Badge
      variant="outline"
      className="text-xs font-bold font-mono tracking-wider border"
      style={{
        color,
        borderColor: color,
        boxShadow: glow,
        backgroundColor: `${color}10`,
      }}
    >
      {label}
    </Badge>
  );
}

interface MatchTypeBadgeProps {
  matchType: "solo" | "duo" | "squad";
}

export function MatchTypeBadge({ matchType }: MatchTypeBadgeProps) {
  const config: Record<
    "solo" | "duo" | "squad",
    { label: string; color: string }
  > = {
    solo: { label: "SOLO", color: "#ffd700" },
    duo: { label: "DUO", color: "#8b5cf6" },
    squad: { label: "SQUAD", color: "#ff6b35" },
  };

  const { label, color } = config[matchType];

  return (
    <Badge
      variant="outline"
      className="text-xs font-bold font-mono tracking-wider"
      style={{
        color,
        borderColor: color,
        backgroundColor: `${color}15`,
        boxShadow: `0 0 6px ${color}40`,
      }}
    >
      {label}
    </Badge>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config: Record<PaymentStatus, { label: string; color: string }> = {
    pending: { label: "PENDING", color: "#ffd700" },
    approved: { label: "APPROVED", color: "#39ff14" },
    rejected: { label: "REJECTED", color: "#ff4444" },
  };

  const { label, color } = config[status];

  return (
    <Badge
      variant="outline"
      className="text-xs font-bold font-mono"
      style={{
        color,
        borderColor: color,
        backgroundColor: `${color}15`,
      }}
    >
      {label}
    </Badge>
  );
}

interface WithdrawalStatusBadgeProps {
  status: WithdrawalStatus;
}

export function WithdrawalStatusBadge({ status }: WithdrawalStatusBadgeProps) {
  const config: Record<WithdrawalStatus, { label: string; color: string }> = {
    pending: { label: "PENDING", color: "#ffd700" },
    approved: { label: "APPROVED", color: "#39ff14" },
    rejected: { label: "REJECTED", color: "#ff4444" },
    completed: { label: "COMPLETED", color: "#00f5ff" },
  };

  const { label, color } = config[status];

  return (
    <Badge
      variant="outline"
      className="text-xs font-bold font-mono"
      style={{
        color,
        borderColor: color,
        backgroundColor: `${color}15`,
      }}
    >
      {label}
    </Badge>
  );
}

interface UserStatusBadgeProps {
  status: UserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const config: Record<UserStatus, { label: string; color: string }> = {
    pending: { label: "PENDING", color: "#ffd700" },
    approved: { label: "APPROVED", color: "#39ff14" },
    banned: { label: "BANNED", color: "#ff4444" },
    rejected: { label: "REJECTED", color: "#ff6b6b" },
  };

  const { label, color } = config[status];

  return (
    <Badge
      variant="outline"
      className="text-xs font-bold font-mono"
      style={{
        color,
        borderColor: color,
        backgroundColor: `${color}15`,
      }}
    >
      {label}
    </Badge>
  );
}
