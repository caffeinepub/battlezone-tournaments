import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Key, Plus, Swords, Trophy, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CoinBadge } from "../../../components/shared/CoinBadge";
import { CountdownTimer } from "../../../components/shared/CountdownTimer";
import {
  MatchTypeBadge,
  TournamentStatusBadge,
} from "../../../components/shared/StatusBadge";
import { useData } from "../../../contexts/DataContext";
import type { Tournament, TournamentWinner } from "../../../types";

// ─── Winners Panel ──────────────────────────────────────────────────────────

interface PendingWinner {
  userId: string;
  rank: number;
  coinsAwarded: number;
}

function WinnersPanel({
  tournament,
  onClose,
}: {
  tournament: Tournament;
  onClose: () => void;
}) {
  const { users, adjustCoins, updateTournament } = useData();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [rank, setRank] = useState("");
  const [coins, setCoins] = useState("");
  const [pending, setPending] = useState<PendingWinner[]>([]);

  const joinedPlayers = tournament.joinedUserIds
    .map((id) => users.find((u) => u.id === id))
    .filter(Boolean) as (typeof users)[0][];

  const alreadyAwardedIds = new Set(
    (tournament.winners ?? []).map((w) => w.userId),
  );
  const pendingIds = new Set(pending.map((p) => p.userId));

  // Players available to add (not yet awarded, not already pending)
  const availablePlayers = joinedPlayers.filter(
    (p) => !alreadyAwardedIds.has(p.id) && !pendingIds.has(p.id),
  );

  const handleAddToPending = () => {
    if (!selectedUserId) {
      toast.error("Select a player first.");
      return;
    }
    const rankNum = Number(rank);
    const coinsNum = Number(coins);
    if (!rankNum || rankNum < 1) {
      toast.error("Enter a valid rank.");
      return;
    }
    if (!coinsNum || coinsNum < 0) {
      toast.error("Enter a valid coin amount.");
      return;
    }
    setPending((prev) => [
      ...prev,
      { userId: selectedUserId, rank: rankNum, coinsAwarded: coinsNum },
    ]);
    setSelectedUserId("");
    setRank("");
    setCoins("");
  };

  const handleRemovePending = (userId: string) => {
    setPending((prev) => prev.filter((p) => p.userId !== userId));
  };

  const handleConfirm = () => {
    if (pending.length === 0) {
      toast.error("No pending winners to credit.");
      return;
    }
    const newWinners: TournamentWinner[] = pending.map((p) => ({
      userId: p.userId,
      rank: p.rank,
      coinsAwarded: p.coinsAwarded,
      awardedAt: new Date().toISOString(),
    }));

    for (const w of newWinners) {
      adjustCoins(
        w.userId,
        w.coinsAwarded,
        "prize",
        `Prize: ${tournament.name} - Rank ${w.rank}`,
      );
    }

    updateTournament(tournament.id, {
      winners: [...(tournament.winners ?? []), ...newWinners],
    });

    toast.success(
      `${newWinners.length} winner${newWinners.length > 1 ? "s" : ""} credited successfully!`,
    );
    setPending([]);
  };

  return (
    <div
      className="mt-2 mb-4 rounded-xl p-5 space-y-5"
      data-ocid="admin.winners.panel"
      style={{
        background: "rgba(20,10,40,0.98)",
        border: "1px solid rgba(255,215,0,0.25)",
        boxShadow: "0 0 24px rgba(255,215,0,0.05)",
      }}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4" style={{ color: "#ffd700" }} />
          <h3
            className="font-display font-bold text-base"
            style={{ color: "#ffd700" }}
          >
            Manage Winners — {tournament.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          data-ocid="admin.winners.close_button"
          className="p-1 rounded-md hover:bg-white/5 transition-colors"
          style={{ color: "#64748b" }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Joined Players Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-3.5 h-3.5" style={{ color: "#00f5ff" }} />
          <span className="text-xs font-bold" style={{ color: "#94a3b8" }}>
            JOINED PLAYERS ({joinedPlayers.length})
          </span>
        </div>
        {joinedPlayers.length === 0 ? (
          <p className="text-xs py-3" style={{ color: "#475569" }}>
            No players have joined this tournament.
          </p>
        ) : (
          <div
            className="rounded-lg overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  <th
                    className="text-left px-3 py-2 font-medium w-8"
                    style={{ color: "#64748b" }}
                  >
                    #
                  </th>
                  <th
                    className="text-left px-3 py-2 font-medium"
                    style={{ color: "#64748b" }}
                  >
                    IGN
                  </th>
                  <th
                    className="text-left px-3 py-2 font-medium"
                    style={{ color: "#64748b" }}
                  >
                    FF UID
                  </th>
                  <th
                    className="text-left px-3 py-2 font-medium"
                    style={{ color: "#64748b" }}
                  >
                    App ID
                  </th>
                  <th
                    className="text-left px-3 py-2 font-medium w-16"
                    style={{ color: "#64748b" }}
                  >
                    Won?
                  </th>
                </tr>
              </thead>
              <tbody>
                {joinedPlayers.map((player, idx) => {
                  const won = alreadyAwardedIds.has(player.id);
                  const winnerEntry = tournament.winners?.find(
                    (w) => w.userId === player.id,
                  );
                  return (
                    <tr
                      key={player.id}
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.04)",
                        background: won
                          ? "rgba(255,215,0,0.04)"
                          : "transparent",
                      }}
                    >
                      <td
                        className="px-3 py-2 font-mono"
                        style={{ color: "#475569" }}
                      >
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          {won && (
                            <Trophy
                              className="w-3 h-3"
                              style={{ color: "#ffd700" }}
                            />
                          )}
                          <span style={{ color: "#e2e8f0" }}>
                            {player.inGameName}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-3 py-2 font-mono"
                        style={{ color: "#94a3b8" }}
                      >
                        {player.freeFireUID}
                      </td>
                      <td
                        className="px-3 py-2 font-mono"
                        style={{ color: "#64748b" }}
                      >
                        {player.id.slice(0, 8)}…
                      </td>
                      <td className="px-3 py-2">
                        {won ? (
                          <span style={{ color: "#ffd700" }}>
                            ✓ Rank #{winnerEntry?.rank}
                          </span>
                        ) : (
                          <span style={{ color: "#475569" }}>—</span>
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

      {/* Add Winner */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p className="text-xs font-bold" style={{ color: "#94a3b8" }}>
          ADD WINNER
        </p>
        {availablePlayers.length === 0 ? (
          <p className="text-xs" style={{ color: "#475569" }}>
            All joined players have been awarded or are pending.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1.5 flex-1 min-w-36">
              <Label className="text-xs" style={{ color: "#64748b" }}>
                Select Player
              </Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger
                  data-ocid="admin.winners.player.select"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,215,0,0.2)",
                    color: "#e2e8f0",
                    height: "36px",
                    fontSize: "12px",
                  }}
                >
                  <SelectValue placeholder="Select player…" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "rgba(13,13,26,0.98)",
                    border: "1px solid rgba(255,215,0,0.2)",
                  }}
                >
                  {availablePlayers.map((p) => (
                    <SelectItem
                      key={p.id}
                      value={p.id}
                      style={{ color: "#e2e8f0", fontSize: "12px" }}
                    >
                      {p.inGameName} ({p.freeFireUID})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 w-24">
              <Label className="text-xs" style={{ color: "#64748b" }}>
                Rank
              </Label>
              <Input
                type="number"
                min="1"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="1"
                data-ocid="admin.winners.rank.input"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,215,0,0.2)",
                  color: "#e2e8f0",
                  height: "36px",
                  fontSize: "12px",
                }}
              />
            </div>

            <div className="space-y-1.5 w-32">
              <Label className="text-xs" style={{ color: "#64748b" }}>
                Coins to Award
              </Label>
              <Input
                type="number"
                min="0"
                value={coins}
                onChange={(e) => setCoins(e.target.value)}
                placeholder="e.g. 200"
                data-ocid="admin.winners.coins.input"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,215,0,0.2)",
                  color: "#e2e8f0",
                  height: "36px",
                  fontSize: "12px",
                }}
              />
            </div>

            <Button
              type="button"
              size="sm"
              onClick={handleAddToPending}
              data-ocid="admin.winners.add.secondary_button"
              style={{
                background: "rgba(0,245,255,0.08)",
                border: "1px solid rgba(0,245,255,0.3)",
                color: "#00f5ff",
                height: "36px",
                fontSize: "12px",
              }}
            >
              + Add to List
            </Button>
          </div>
        )}
      </div>

      {/* Pending Winners */}
      {pending.length > 0 && (
        <div>
          <p className="text-xs font-bold mb-2" style={{ color: "#94a3b8" }}>
            PENDING (not yet credited)
          </p>
          <div className="space-y-2">
            {pending.map((pw, idx) => {
              const player = users.find((u) => u.id === pw.userId);
              const rankColor =
                pw.rank === 1
                  ? "#ffd700"
                  : pw.rank === 2
                    ? "#94a3b8"
                    : pw.rank === 3
                      ? "#cd7f32"
                      : "#64748b";
              return (
                <div
                  key={pw.userId}
                  data-ocid={`admin.winners.pending.item.${idx + 1}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold font-mono w-10"
                      style={{ color: rankColor }}
                    >
                      #{pw.rank}
                    </span>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#e2e8f0" }}
                      >
                        {player?.inGameName ?? "Unknown"}
                      </p>
                      <p
                        className="text-xs font-mono"
                        style={{ color: "#64748b" }}
                      >
                        {player?.freeFireUID}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CoinBadge amount={pw.coinsAwarded} size="sm" />
                    <button
                      type="button"
                      onClick={() => handleRemovePending(pw.userId)}
                      data-ocid={`admin.winners.pending.delete_button.${idx + 1}`}
                      className="p-1 rounded hover:bg-red-500/10 transition-colors"
                      style={{ color: "#ff4444" }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm Button */}
      <div className="flex items-center gap-3 pt-1">
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={pending.length === 0}
          data-ocid="admin.winners.confirm.primary_button"
          className="font-bold h-10 px-6"
          style={{
            background:
              pending.length > 0
                ? "rgba(255,215,0,0.15)"
                : "rgba(255,255,255,0.04)",
            border:
              pending.length > 0
                ? "1px solid rgba(255,215,0,0.5)"
                : "1px solid rgba(255,255,255,0.08)",
            color: pending.length > 0 ? "#ffd700" : "#475569",
          }}
        >
          <Trophy className="w-4 h-4 mr-2" />
          Confirm & Credit Coins ({pending.length})
        </Button>
        {(tournament.winners?.length ?? 0) > 0 && (
          <span className="text-xs" style={{ color: "#64748b" }}>
            {tournament.winners!.length} already awarded
          </span>
        )}
      </div>
    </div>
  );
}

type FormData = {
  name: string;
  matchType: "solo" | "duo" | "squad";
  entryFee: string;
  prizePool: string;
  dateTime: string;
  maxPlayers: string;
  mapName: string;
  status: "upcoming" | "live" | "completed";
};

const EMPTY_FORM: FormData = {
  name: "",
  matchType: "solo",
  entryFee: "",
  prizePool: "",
  dateTime: "",
  maxPlayers: "",
  mapName: "",
  status: "upcoming",
};

export function AdminTournaments() {
  const { tournaments, createTournament, updateTournament } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Room editing state
  const [roomEditing, setRoomEditing] = useState<string | null>(null);
  const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState("");

  // Winners panel state
  const [winnersOpenId, setWinnersOpenId] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = "Required";
    if (!form.entryFee || Number.isNaN(Number(form.entryFee)))
      newErrors.entryFee = "Invalid";
    if (!form.prizePool || Number.isNaN(Number(form.prizePool)))
      newErrors.prizePool = "Invalid";
    if (!form.dateTime) newErrors.dateTime = "Required";
    if (!form.maxPlayers || Number.isNaN(Number(form.maxPlayers)))
      newErrors.maxPlayers = "Invalid";
    if (!form.mapName.trim()) newErrors.mapName = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      name: form.name.trim(),
      matchType: form.matchType,
      entryFee: Number(form.entryFee),
      prizePool: Number(form.prizePool),
      dateTime: new Date(form.dateTime).toISOString(),
      maxPlayers: Number(form.maxPlayers),
      mapName: form.mapName.trim(),
      status: form.status,
    };

    if (editingId) {
      updateTournament(editingId, data);
      toast.success("Tournament updated!");
    } else {
      createTournament(data);
      toast.success("Tournament created!");
    }
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleEdit = (t: Tournament) => {
    setEditingId(t.id);
    const localDate = new Date(t.dateTime);
    const offset = localDate.getTimezoneOffset();
    const adjusted = new Date(localDate.getTime() - offset * 60000);
    setForm({
      name: t.name,
      matchType: t.matchType,
      entryFee: String(t.entryFee),
      prizePool: String(t.prizePool),
      dateTime: adjusted.toISOString().slice(0, 16),
      maxPlayers: String(t.maxPlayers),
      mapName: t.mapName,
      status: t.status,
    });
    setShowForm(true);
  };

  const handleRoomSave = (tournamentId: string) => {
    updateTournament(tournamentId, {
      roomId,
      roomPassword,
    });
    setRoomEditing(null);
    toast.success("Room details updated!");
  };

  return (
    <div className="space-y-5">
      {/* Create Form */}
      {showForm && (
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(0,245,255,0.2)",
          }}
        >
          <h2
            className="font-display font-bold text-lg mb-4"
            style={{ color: "#e2e8f0" }}
          >
            {editingId ? "Edit Tournament" : "Create Tournament"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Tournament Name *
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  data-ocid="admin.tournament.name.input"
                  placeholder="e.g. Free Fire Sunday War"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.name && (
                  <p className="text-xs" style={{ color: "#ff4444" }}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Match Type *
                </Label>
                <Select
                  value={form.matchType}
                  onValueChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      matchType: v as FormData["matchType"],
                    }))
                  }
                >
                  <SelectTrigger
                    data-ocid="admin.tournament.type.select"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(0,245,255,0.2)",
                      color: "#e2e8f0",
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "rgba(13,13,26,0.98)",
                      border: "1px solid rgba(0,245,255,0.2)",
                    }}
                  >
                    <SelectItem value="solo">Solo</SelectItem>
                    <SelectItem value="duo">Duo</SelectItem>
                    <SelectItem value="squad">Squad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Entry Fee (Coins) *
                </Label>
                <Input
                  type="number"
                  value={form.entryFee}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, entryFee: e.target.value }))
                  }
                  data-ocid="admin.tournament.entryfee.input"
                  placeholder="e.g. 50"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.entryFee && (
                  <p className="text-xs" style={{ color: "#ff4444" }}>
                    {errors.entryFee}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Prize Pool (Coins) *
                </Label>
                <Input
                  type="number"
                  value={form.prizePool}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, prizePool: e.target.value }))
                  }
                  data-ocid="admin.tournament.prizepool.input"
                  placeholder="e.g. 400"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.prizePool && (
                  <p className="text-xs" style={{ color: "#ff4444" }}>
                    {errors.prizePool}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Date & Time *
                </Label>
                <Input
                  type="datetime-local"
                  value={form.dateTime}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, dateTime: e.target.value }))
                  }
                  data-ocid="admin.tournament.datetime.input"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.dateTime && (
                  <p className="text-xs" style={{ color: "#ff4444" }}>
                    {errors.dateTime}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Max Players *
                </Label>
                <Input
                  type="number"
                  value={form.maxPlayers}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, maxPlayers: e.target.value }))
                  }
                  data-ocid="admin.tournament.maxplayers.input"
                  placeholder="e.g. 12"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.maxPlayers && (
                  <p className="text-xs" style={{ color: "#ff4444" }}>
                    {errors.maxPlayers}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Map Name *
                </Label>
                <Input
                  value={form.mapName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, mapName: e.target.value }))
                  }
                  data-ocid="admin.tournament.map.input"
                  placeholder="e.g. Bermuda"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.mapName && (
                  <p className="text-xs" style={{ color: "#ff4444" }}>
                    {errors.mapName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Status *
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, status: v as FormData["status"] }))
                  }
                >
                  <SelectTrigger
                    data-ocid="admin.tournament.status.select"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(0,245,255,0.2)",
                      color: "#e2e8f0",
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "rgba(13,13,26,0.98)",
                      border: "1px solid rgba(0,245,255,0.2)",
                    }}
                  >
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                data-ocid="admin.tournament.submit_button"
                className="font-bold h-10 px-6"
                style={{
                  background: "rgba(0,245,255,0.1)",
                  border: "1px solid rgba(0,245,255,0.4)",
                  color: "#00f5ff",
                }}
              >
                {editingId ? "Update Tournament" : "Create Tournament"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(EMPTY_FORM);
                }}
                data-ocid="admin.tournament.cancel_button"
                variant="ghost"
                className="h-10"
                style={{ color: "#64748b" }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tournament List */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "rgba(13,13,26,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4" style={{ color: "#00f5ff" }} />
            <h2
              className="font-display font-bold text-base"
              style={{ color: "#e2e8f0" }}
            >
              Tournaments ({tournaments.length})
            </h2>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setForm(EMPTY_FORM);
            }}
            data-ocid="admin.tournament.open_modal_button"
            className="h-8 text-xs font-bold flex items-center gap-1"
            style={{
              background: "rgba(57,255,20,0.1)",
              border: "1px solid rgba(57,255,20,0.4)",
              color: "#39ff14",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Tournament
          </Button>
        </div>

        {tournaments.length === 0 ? (
          <div
            className="py-12 text-center"
            data-ocid="admin.tournaments.empty_state"
          >
            <p style={{ color: "#475569" }}>No tournaments yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <TableHead style={{ color: "#64748b" }}>Name</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Type</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Entry</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Prize</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Players</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Timer</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Status</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Room</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Visible</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournaments.map((t, i) => (
                  <>
                    <TableRow
                      key={t.id}
                      data-ocid={`admin.tournament.row.${i + 1}`}
                      style={{
                        borderColor: "rgba(255,255,255,0.04)",
                        background:
                          winnersOpenId === t.id
                            ? "rgba(255,215,0,0.03)"
                            : "transparent",
                      }}
                    >
                      <TableCell
                        className="font-medium text-sm"
                        style={{ color: "#e2e8f0" }}
                      >
                        {t.name}
                      </TableCell>
                      <TableCell>
                        <MatchTypeBadge matchType={t.matchType} />
                      </TableCell>
                      <TableCell>
                        <CoinBadge amount={t.entryFee} size="sm" />
                      </TableCell>
                      <TableCell>
                        <CoinBadge amount={t.prizePool} size="sm" />
                      </TableCell>
                      <TableCell
                        className="text-xs font-mono"
                        style={{ color: "#94a3b8" }}
                      >
                        {t.joinedUserIds.length}/{t.maxPlayers}
                      </TableCell>
                      <TableCell>
                        <CountdownTimer
                          dateTime={t.dateTime}
                          status={t.status}
                        />
                      </TableCell>
                      <TableCell>
                        <TournamentStatusBadge status={t.status} />
                      </TableCell>
                      <TableCell>
                        {roomEditing === t.id ? (
                          <div className="flex items-center gap-1">
                            <Input
                              value={roomId}
                              onChange={(e) => setRoomId(e.target.value)}
                              placeholder="Room ID"
                              className="h-6 text-xs w-24"
                              data-ocid={`admin.room.id.input.${i + 1}`}
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(0,245,255,0.2)",
                                color: "#e2e8f0",
                              }}
                            />
                            <Input
                              value={roomPassword}
                              onChange={(e) => setRoomPassword(e.target.value)}
                              placeholder="Password"
                              className="h-6 text-xs w-24"
                              data-ocid={`admin.room.password.input.${i + 1}`}
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(0,245,255,0.2)",
                                color: "#e2e8f0",
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => handleRoomSave(t.id)}
                              data-ocid={`admin.room.save_button.${i + 1}`}
                              className="h-6 text-xs px-2"
                              style={{
                                background: "rgba(57,255,20,0.1)",
                                border: "1px solid rgba(57,255,20,0.3)",
                                color: "#39ff14",
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setRoomEditing(t.id);
                              setRoomId(t.roomId ?? "");
                              setRoomPassword(t.roomPassword ?? "");
                            }}
                            data-ocid={`admin.room.edit_button.${i + 1}`}
                            className="flex items-center gap-1 text-xs hover:opacity-80"
                            style={{ color: t.roomId ? "#00f5ff" : "#64748b" }}
                          >
                            <Key className="w-3 h-3" />
                            {t.roomId ? t.roomId : "Set Room"}
                          </button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={t.roomVisible}
                          onCheckedChange={(v) => {
                            updateTournament(t.id, { roomVisible: v });
                            toast.success(
                              `Room ${v ? "visible" : "hidden"} for ${t.name}`,
                            );
                          }}
                          data-ocid={`admin.room.visibility.switch.${i + 1}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEdit(t)}
                            data-ocid={`admin.tournament.edit_button.${i + 1}`}
                            className="h-7 text-xs font-bold"
                            style={{
                              background: "rgba(0,245,255,0.06)",
                              border: "1px solid rgba(0,245,255,0.25)",
                              color: "#00f5ff",
                            }}
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              setWinnersOpenId(
                                winnersOpenId === t.id ? null : t.id,
                              )
                            }
                            data-ocid={`admin.winners.open_modal_button.${i + 1}`}
                            className="h-7 text-xs font-bold"
                            style={{
                              background:
                                winnersOpenId === t.id
                                  ? "rgba(255,215,0,0.15)"
                                  : "rgba(255,215,0,0.06)",
                              border:
                                winnersOpenId === t.id
                                  ? "1px solid rgba(255,215,0,0.5)"
                                  : "1px solid rgba(255,215,0,0.25)",
                              color: "#ffd700",
                            }}
                          >
                            <Trophy className="w-3 h-3 mr-1" />
                            Winners
                            {(t.winners?.length ?? 0) > 0 && (
                              <span
                                className="ml-1 font-mono"
                                style={{ color: "#ffd700", opacity: 0.7 }}
                              >
                                ({t.winners!.length})
                              </span>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Inline Winners Panel */}
                    {winnersOpenId === t.id && (
                      <TableRow
                        key={`${t.id}-winners`}
                        style={{ borderColor: "rgba(255,215,0,0.15)" }}
                      >
                        <TableCell colSpan={10} className="p-0 px-3">
                          <WinnersPanel
                            tournament={t}
                            onClose={() => setWinnersOpenId(null)}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
