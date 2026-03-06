import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Coins,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { CoinBadge } from "../components/shared/CoinBadge";
import { CountdownTimer } from "../components/shared/CountdownTimer";
import {
  MatchTypeBadge,
  TournamentStatusBadge,
} from "../components/shared/StatusBadge";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

export function TournamentDetailPage() {
  const { id } = useParams({ from: "/tournaments/$id" });
  const navigate = useNavigate();
  const { getTournamentById, updateTournament, adjustCoins, users } = useData();
  const { session } = useAuth();
  const [joining, setJoining] = useState(false);

  const tournament = getTournamentById(id);

  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="font-display text-xl" style={{ color: "#ff4444" }}>
              Tournament not found
            </p>
            <Button
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() =>
                navigate({
                  to: "/tournaments",
                  search: { tab: undefined } as any,
                })
              }
              className="mt-4"
              style={{
                border: "1px solid rgba(0,245,255,0.4)",
                color: "#00f5ff",
              }}
            >
              Back to Tournaments
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const liveUser = users.find((u) => u.id === session?.userId);
  const isJoined = session
    ? tournament.joinedUserIds.includes(session.userId)
    : false;
  const canJoin =
    !isJoined &&
    tournament.status !== "completed" &&
    liveUser &&
    liveUser.coinBalance >= tournament.entryFee &&
    tournament.joinedUserIds.length < tournament.maxPlayers;

  const showRoom =
    isJoined &&
    tournament.roomVisible &&
    tournament.status !== "completed" &&
    tournament.roomId;

  const fillPercent = Math.round(
    (tournament.joinedUserIds.length / tournament.maxPlayers) * 100,
  );

  const handleJoin = async () => {
    if (!session || !liveUser) return;
    setJoining(true);
    try {
      const success = adjustCoins(
        session.userId,
        -tournament.entryFee,
        "entry_fee",
        `Tournament entry: ${tournament.name}`,
      );
      if (!success) {
        toast.error("Insufficient coin balance.");
        return;
      }
      updateTournament(tournament.id, {
        joinedUserIds: [...tournament.joinedUserIds, session.userId],
      });
      toast.success("Successfully joined the tournament!");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <button
          type="button"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={() =>
            navigate({ to: "/tournaments", search: { tab: undefined } as any })
          }
          data-ocid="tournament.detail.button"
          className="flex items-center gap-2 mb-6 text-sm hover:opacity-80 transition-opacity"
          style={{ color: "#64748b" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tournaments
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header Card */}
            <div
              className="rounded-xl p-6 relative overflow-hidden"
              style={{
                background: "rgba(13,13,26,0.95)",
                border: "1px solid rgba(0,245,255,0.15)",
              }}
            >
              {/* Top line */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background:
                    tournament.status === "live"
                      ? "linear-gradient(90deg, transparent, #39ff14, transparent)"
                      : tournament.status === "upcoming"
                        ? "linear-gradient(90deg, transparent, #00f5ff, transparent)"
                        : "linear-gradient(90deg, transparent, #64748b, transparent)",
                }}
              />

              <div className="flex flex-wrap items-start gap-3 mb-4">
                <MatchTypeBadge matchType={tournament.matchType} />
                <TournamentStatusBadge status={tournament.status} />
              </div>

              <h1
                className="font-display font-black text-2xl md:text-3xl mb-3"
                style={{ color: "#e2e8f0" }}
              >
                {tournament.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <CountdownTimer
                  dateTime={tournament.dateTime}
                  status={tournament.status}
                  className="text-sm"
                />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  className="rounded-lg p-3"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin
                      className="w-3.5 h-3.5"
                      style={{ color: "#64748b" }}
                    />
                    <span className="text-xs" style={{ color: "#64748b" }}>
                      Map
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#e2e8f0" }}
                  >
                    {tournament.mapName}
                  </span>
                </div>

                <div
                  className="rounded-lg p-3"
                  style={{
                    background: "rgba(255,215,0,0.04)",
                    border: "1px solid rgba(255,215,0,0.12)",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Coins
                      className="w-3.5 h-3.5"
                      style={{ color: "#ffd700" }}
                    />
                    <span className="text-xs" style={{ color: "#64748b" }}>
                      Entry
                    </span>
                  </div>
                  <CoinBadge amount={tournament.entryFee} size="sm" />
                </div>

                <div
                  className="rounded-lg p-3"
                  style={{
                    background: "rgba(57,255,20,0.04)",
                    border: "1px solid rgba(57,255,20,0.12)",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Trophy
                      className="w-3.5 h-3.5"
                      style={{ color: "#39ff14" }}
                    />
                    <span className="text-xs" style={{ color: "#64748b" }}>
                      Prize
                    </span>
                  </div>
                  <CoinBadge amount={tournament.prizePool} size="sm" />
                </div>

                <div
                  className="rounded-lg p-3"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar
                      className="w-3.5 h-3.5"
                      style={{ color: "#64748b" }}
                    />
                    <span className="text-xs" style={{ color: "#64748b" }}>
                      Date
                    </span>
                  </div>
                  <span
                    className="text-xs font-mono"
                    style={{ color: "#94a3b8" }}
                  >
                    {new Date(tournament.dateTime).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Players Progress */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(13,13,26,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: "#00f5ff" }} />
                  <span
                    className="font-medium text-sm"
                    style={{ color: "#e2e8f0" }}
                  >
                    Players
                  </span>
                </div>
                <span
                  className="font-mono text-sm font-bold"
                  style={{ color: "#94a3b8" }}
                >
                  {tournament.joinedUserIds.length} / {tournament.maxPlayers}
                </span>
              </div>
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${fillPercent}%`,
                    background:
                      fillPercent >= 90
                        ? "linear-gradient(90deg, #ff4444, #ff6b6b)"
                        : "linear-gradient(90deg, #00f5ff, #39ff14)",
                    boxShadow: "0 0 8px rgba(0,245,255,0.4)",
                  }}
                />
              </div>
              <p className="text-xs mt-2" style={{ color: "#64748b" }}>
                {tournament.maxPlayers - tournament.joinedUserIds.length} slots
                remaining
              </p>
            </div>

            {/* Room Details */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(13,13,26,0.95)",
                border: showRoom
                  ? "1px solid rgba(57,255,20,0.3)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                {showRoom ? (
                  <Eye className="w-4 h-4" style={{ color: "#39ff14" }} />
                ) : (
                  <EyeOff className="w-4 h-4" style={{ color: "#64748b" }} />
                )}
                <span
                  className="font-medium text-sm"
                  style={{ color: "#e2e8f0" }}
                >
                  Room Details
                </span>
                {showRoom && (
                  <span
                    className="text-xs font-mono ml-auto"
                    style={{ color: "#39ff14" }}
                  >
                    ✓ VISIBLE
                  </span>
                )}
              </div>

              {showRoom ? (
                <div className="space-y-3">
                  <div
                    className="rounded-lg p-3"
                    style={{
                      background: "rgba(57,255,20,0.05)",
                      border: "1px solid rgba(57,255,20,0.2)",
                    }}
                  >
                    <p className="text-xs mb-1" style={{ color: "#64748b" }}>
                      Room ID
                    </p>
                    <p
                      className="font-mono font-bold text-lg"
                      style={{ color: "#39ff14" }}
                    >
                      {tournament.roomId}
                    </p>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{
                      background: "rgba(57,255,20,0.05)",
                      border: "1px solid rgba(57,255,20,0.2)",
                    }}
                  >
                    <p className="text-xs mb-1" style={{ color: "#64748b" }}>
                      Room Password
                    </p>
                    <p
                      className="font-mono font-bold text-lg"
                      style={{ color: "#39ff14" }}
                    >
                      {tournament.roomPassword}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Lock
                    className="w-8 h-8 opacity-30"
                    style={{ color: "#64748b" }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#64748b" }}
                    >
                      {!isJoined
                        ? "Join the tournament to see room details"
                        : tournament.status === "completed"
                          ? "Tournament has ended"
                          : "Room details will be revealed before match starts"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-4">
            {/* Join Card */}
            <div
              className="rounded-xl p-5 sticky top-24"
              style={{
                background: "rgba(13,13,26,0.95)",
                border: "1px solid rgba(0,245,255,0.15)",
              }}
            >
              <h3
                className="font-display font-bold text-lg mb-4"
                style={{ color: "#e2e8f0" }}
              >
                {isJoined ? "You're Registered!" : "Join Tournament"}
              </h3>

              {/* Entry fee */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm" style={{ color: "#64748b" }}>
                  Entry Fee
                </span>
                <CoinBadge amount={tournament.entryFee} size="sm" />
              </div>

              {/* Your balance */}
              {liveUser && (
                <div
                  className="flex items-center justify-between mb-4 pb-4"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span className="text-sm" style={{ color: "#64748b" }}>
                    Your Balance
                  </span>
                  <CoinBadge amount={liveUser.coinBalance} size="sm" />
                </div>
              )}

              {isJoined ? (
                <div
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{
                    background: "rgba(57,255,20,0.08)",
                    border: "1px solid rgba(57,255,20,0.3)",
                  }}
                  data-ocid="tournament.joined.success_state"
                >
                  <CheckCircle2
                    className="w-5 h-5"
                    style={{ color: "#39ff14" }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#39ff14" }}
                  >
                    Registered
                  </span>
                </div>
              ) : tournament.status === "completed" ? (
                <Alert
                  style={{
                    background: "rgba(100,116,139,0.08)",
                    border: "1px solid rgba(100,116,139,0.2)",
                  }}
                  data-ocid="tournament.completed.error_state"
                >
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription style={{ color: "#64748b" }}>
                    This tournament has ended.
                  </AlertDescription>
                </Alert>
              ) : liveUser && liveUser.coinBalance < tournament.entryFee ? (
                <Alert
                  style={{
                    background: "rgba(255,68,68,0.08)",
                    border: "1px solid rgba(255,68,68,0.2)",
                  }}
                  data-ocid="tournament.insufficient.error_state"
                >
                  <AlertCircle
                    className="w-4 h-4"
                    style={{ color: "#ff4444" }}
                  />
                  <AlertDescription style={{ color: "#ff4444" }}>
                    Insufficient coins. Add coins first.
                  </AlertDescription>
                </Alert>
              ) : (
                <Button
                  onClick={handleJoin}
                  disabled={joining || !canJoin}
                  data-ocid="tournament.join.primary_button"
                  className="w-full h-11 font-bold tracking-wide transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(57,255,20,0.1))",
                    border: "1px solid #00f5ff",
                    color: "#00f5ff",
                    boxShadow: "0 0 12px rgba(0,245,255,0.3)",
                  }}
                >
                  {joining ? "Joining..." : "JOIN TOURNAMENT"}
                </Button>
              )}

              {/* Prize breakdown */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span style={{ color: "#64748b" }}>Prize Pool</span>
                  <CoinBadge amount={tournament.prizePool} size="sm" />
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: "#64748b" }}>Max Players</span>
                  <span className="font-mono" style={{ color: "#94a3b8" }}>
                    {tournament.maxPlayers}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: "#64748b" }}>Platform Commission</span>
                  <CoinBadge
                    amount={
                      tournament.entryFee * tournament.maxPlayers -
                      tournament.prizePool
                    }
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Joined Players ─── */}
        <div
          className="mt-6 rounded-xl overflow-hidden"
          style={{
            background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(0,245,255,0.12)",
          }}
          data-ocid="tournament.players.panel"
        >
          <div
            className="flex items-center gap-2 px-5 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Users className="w-4 h-4" style={{ color: "#00f5ff" }} />
            <h2
              className="font-display font-bold text-base"
              style={{ color: "#e2e8f0" }}
            >
              Joined Players
            </h2>
            <span
              className="ml-auto font-mono text-xs"
              style={{ color: "#64748b" }}
            >
              {tournament.joinedUserIds.length} / {tournament.maxPlayers}
            </span>
          </div>

          {tournament.joinedUserIds.length === 0 ? (
            <div
              className="py-10 text-center"
              data-ocid="tournament.players.empty_state"
            >
              <Users
                className="w-10 h-10 mx-auto mb-3 opacity-20"
                style={{ color: "#00f5ff" }}
              />
              <p className="text-sm" style={{ color: "#475569" }}>
                No players have joined yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <th
                      className="text-left px-5 py-2.5 text-xs font-medium w-12"
                      style={{ color: "#64748b" }}
                    >
                      #
                    </th>
                    <th
                      className="text-left px-5 py-2.5 text-xs font-medium"
                      style={{ color: "#64748b" }}
                    >
                      In-Game Name
                    </th>
                    <th
                      className="text-left px-5 py-2.5 text-xs font-medium"
                      style={{ color: "#64748b" }}
                    >
                      Free Fire UID
                    </th>
                    <th
                      className="text-left px-5 py-2.5 text-xs font-medium"
                      style={{ color: "#64748b" }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tournament.joinedUserIds.map((uid, idx) => {
                    const player = users.find((u) => u.id === uid);
                    const isWinner = tournament.winners?.some(
                      (w) => w.userId === uid,
                    );
                    const winnerEntry = tournament.winners?.find(
                      (w) => w.userId === uid,
                    );
                    return (
                      <tr
                        key={uid}
                        data-ocid={`tournament.players.row.${idx + 1}`}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td
                          className="px-5 py-3 font-mono text-xs"
                          style={{ color: "#475569" }}
                        >
                          {idx + 1}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            {isWinner && (
                              <Trophy
                                className="w-3.5 h-3.5 flex-shrink-0"
                                style={{ color: "#ffd700" }}
                              />
                            )}
                            <span
                              className="font-medium text-sm"
                              style={{ color: "#e2e8f0" }}
                            >
                              {player?.inGameName ?? "Unknown Player"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className="font-mono text-xs"
                            style={{ color: "#94a3b8" }}
                          >
                            {player?.freeFireUID ?? "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {isWinner && winnerEntry ? (
                            <span
                              className="text-xs font-bold"
                              style={{
                                color:
                                  winnerEntry.rank === 1
                                    ? "#ffd700"
                                    : winnerEntry.rank === 2
                                      ? "#94a3b8"
                                      : "#cd7f32",
                              }}
                            >
                              🏆 Rank #{winnerEntry.rank}
                            </span>
                          ) : (
                            <span
                              className="text-xs"
                              style={{ color: "#475569" }}
                            >
                              Participant
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ─── Results / Winners ─── */}
        {tournament.winners && tournament.winners.length > 0 && (
          <div
            className="mt-6 rounded-xl overflow-hidden"
            style={{
              background: "rgba(13,13,26,0.95)",
              border: "1px solid rgba(255,215,0,0.2)",
            }}
            data-ocid="tournament.results.panel"
          >
            {/* gold top glow line */}
            <div
              className="h-0.5"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #ffd700, transparent)",
              }}
            />
            <div
              className="flex items-center gap-2 px-5 py-3"
              style={{ borderBottom: "1px solid rgba(255,215,0,0.1)" }}
            >
              <Trophy className="w-4 h-4" style={{ color: "#ffd700" }} />
              <h2
                className="font-display font-bold text-base"
                style={{ color: "#ffd700" }}
              >
                Results
              </h2>
            </div>

            <div className="p-4 space-y-3">
              {[...tournament.winners]
                .sort((a, b) => a.rank - b.rank)
                .map((winner, idx) => {
                  const player = users.find((u) => u.id === winner.userId);
                  const rankColor =
                    winner.rank === 1
                      ? "#ffd700"
                      : winner.rank === 2
                        ? "#94a3b8"
                        : winner.rank === 3
                          ? "#cd7f32"
                          : "#64748b";
                  const rankLabel =
                    winner.rank === 1
                      ? "🥇 1st"
                      : winner.rank === 2
                        ? "🥈 2nd"
                        : winner.rank === 3
                          ? "🥉 3rd"
                          : `#${winner.rank}`;
                  return (
                    <div
                      key={winner.userId}
                      data-ocid={`tournament.results.item.${idx + 1}`}
                      className="flex items-center justify-between rounded-lg px-4 py-3"
                      style={{
                        background:
                          winner.rank === 1
                            ? "rgba(255,215,0,0.06)"
                            : "rgba(255,255,255,0.02)",
                        border: `1px solid ${winner.rank === 1 ? "rgba(255,215,0,0.2)" : "rgba(255,255,255,0.05)"}`,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className="text-sm font-bold font-mono w-10"
                          style={{ color: rankColor }}
                        >
                          {rankLabel}
                        </span>
                        <div>
                          <p
                            className="text-sm font-bold"
                            style={{ color: "#e2e8f0" }}
                          >
                            {player?.inGameName ?? "Unknown"}
                          </p>
                          <p
                            className="text-xs font-mono"
                            style={{ color: "#64748b" }}
                          >
                            UID: {player?.freeFireUID ?? "—"}
                          </p>
                        </div>
                      </div>
                      <CoinBadge amount={winner.coinsAwarded} size="sm" />
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
