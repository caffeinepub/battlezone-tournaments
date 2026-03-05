import { useNavigate } from "@tanstack/react-router";
import { MapPin, Trophy, Users } from "lucide-react";
import type { Tournament } from "../../types";
import { CoinBadge } from "./CoinBadge";
import { CountdownTimer } from "./CountdownTimer";
import { MatchTypeBadge, TournamentStatusBadge } from "./StatusBadge";

interface TournamentCardProps {
  tournament: Tournament;
  currentUserId?: string;
  index: number;
}

export function TournamentCard({
  tournament,
  currentUserId,
  index,
}: TournamentCardProps) {
  const navigate = useNavigate();
  const isJoined = currentUserId
    ? tournament.joinedUserIds.includes(currentUserId)
    : false;

  const fillPercent = Math.round(
    (tournament.joinedUserIds.length / tournament.maxPlayers) * 100,
  );

  return (
    <article
      data-ocid={`tournament.item.${index}`}
      className="glass-card glass-card-hover rounded-lg p-5 cursor-pointer relative overflow-hidden group"
      onClick={() =>
        navigate({ to: "/tournaments/$id", params: { id: tournament.id } })
      }
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate({ to: "/tournaments/$id", params: { id: tournament.id } });
        }
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-60"
        style={{
          background:
            tournament.status === "live"
              ? "linear-gradient(90deg, transparent, #39ff14, transparent)"
              : tournament.status === "upcoming"
                ? "linear-gradient(90deg, transparent, #00f5ff, transparent)"
                : "linear-gradient(90deg, transparent, #64748b, transparent)",
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3
            className="font-display font-bold text-base leading-tight truncate"
            style={{ color: "#e2e8f0" }}
          >
            {tournament.name}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <MatchTypeBadge matchType={tournament.matchType} />
          <TournamentStatusBadge status={tournament.status} />
        </div>
      </div>

      {/* Map */}
      <div className="flex items-center gap-1.5 mb-3">
        <MapPin className="w-3.5 h-3.5" style={{ color: "#64748b" }} />
        <span className="text-xs" style={{ color: "#64748b" }}>
          {tournament.mapName}
        </span>
      </div>

      {/* Prize & Entry */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div
          className="rounded p-2"
          style={{
            background: "rgba(57,255,20,0.05)",
            border: "1px solid rgba(57,255,20,0.15)",
          }}
        >
          <div className="flex items-center gap-1 mb-0.5">
            <Trophy className="w-3 h-3" style={{ color: "#39ff14" }} />
            <span className="text-xs" style={{ color: "#64748b" }}>
              Prize Pool
            </span>
          </div>
          <CoinBadge amount={tournament.prizePool} size="sm" />
        </div>
        <div
          className="rounded p-2"
          style={{
            background: "rgba(0,245,255,0.05)",
            border: "1px solid rgba(0,245,255,0.15)",
          }}
        >
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-xs" style={{ color: "#64748b" }}>
              Entry Fee
            </span>
          </div>
          <CoinBadge amount={tournament.entryFee} size="sm" />
        </div>
      </div>

      {/* Players fill bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" style={{ color: "#64748b" }} />
            <span className="text-xs" style={{ color: "#64748b" }}>
              {tournament.joinedUserIds.length} / {tournament.maxPlayers}{" "}
              players
            </span>
          </div>
          <span className="text-xs font-mono" style={{ color: "#64748b" }}>
            {fillPercent}%
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${fillPercent}%`,
              background:
                fillPercent >= 90
                  ? "linear-gradient(90deg, #ff4444, #ff6b6b)"
                  : fillPercent >= 60
                    ? "linear-gradient(90deg, #ffd700, #ffed70)"
                    : "linear-gradient(90deg, #00f5ff, #39ff14)",
              boxShadow:
                fillPercent >= 90
                  ? "0 0 6px rgba(255,68,68,0.5)"
                  : "0 0 6px rgba(0,245,255,0.4)",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <CountdownTimer
          dateTime={tournament.dateTime}
          status={tournament.status}
        />
        {isJoined ? (
          <span
            className="text-xs font-bold font-mono px-2 py-0.5 rounded border"
            style={{
              color: "#39ff14",
              borderColor: "rgba(57,255,20,0.4)",
              background: "rgba(57,255,20,0.1)",
            }}
          >
            ✓ JOINED
          </span>
        ) : tournament.status !== "completed" ? (
          <span
            className="text-xs font-bold font-mono px-2 py-0.5 rounded border opacity-60 group-hover:opacity-100 transition-opacity"
            style={{
              color: "#00f5ff",
              borderColor: "rgba(0,245,255,0.4)",
              background: "rgba(0,245,255,0.05)",
            }}
          >
            VIEW →
          </span>
        ) : null}
      </div>
    </article>
  );
}
