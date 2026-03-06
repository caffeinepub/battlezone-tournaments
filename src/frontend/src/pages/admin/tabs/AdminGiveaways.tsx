import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronUp,
  Gift,
  Shuffle,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useData } from "../../../contexts/DataContext";

export function AdminGiveaways() {
  const {
    giveaways,
    createGiveaway,
    updateGiveaway,
    getEntriesByGiveaway,
    pickGiveawayWinner,
    adjustCoins,
    getUserById,
  } = useData();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [prizeCoins, setPrizeCoins] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [creating, setCreating] = useState(false);

  // Expanded entries panels
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Giveaway name is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }
    if (!entryFee || Number(entryFee) < 0) {
      toast.error("Valid entry fee required.");
      return;
    }
    if (!prizeCoins || Number(prizeCoins) <= 0) {
      toast.error("Prize coins must be greater than 0.");
      return;
    }
    if (!endDateTime) {
      toast.error("End date & time is required.");
      return;
    }

    setCreating(true);
    createGiveaway({
      name: name.trim(),
      description: description.trim(),
      entryFee: Number(entryFee),
      prizeCoins: Number(prizeCoins),
      endDateTime: new Date(endDateTime).toISOString(),
    });
    toast.success(`Giveaway "${name.trim()}" created!`);
    setName("");
    setDescription("");
    setEntryFee("");
    setPrizeCoins("");
    setEndDateTime("");
    setCreating(false);
  };

  const handleAutoPickWinner = (
    giveawayId: string,
    giveawayName: string,
    prizeCoinAmount: number,
  ) => {
    const winnerId = pickGiveawayWinner(giveawayId);
    if (!winnerId) {
      toast.error("No entries yet — cannot pick a winner.");
      return;
    }
    updateGiveaway(giveawayId, {
      winnerId,
      winnerPickedAt: new Date().toISOString(),
      status: "ended",
    });
    adjustCoins(
      winnerId,
      prizeCoinAmount,
      "prize",
      `Giveaway winner: ${giveawayName}`,
    );
    const winner = getUserById(winnerId);
    toast.success(
      `🎉 Winner picked: ${winner?.inGameName ?? "Unknown"}! ${prizeCoinAmount} coins credited.`,
    );
  };

  const handleEndGiveaway = (giveawayId: string, name: string) => {
    updateGiveaway(giveawayId, { status: "ended" });
    toast.success(`Giveaway "${name}" ended.`);
  };

  const sorted = [...giveaways].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const now = new Date();

  // Min datetime for input (current time)
  const minDateTime = new Date(now.getTime() + 60 * 1000)
    .toISOString()
    .slice(0, 16);

  return (
    <div className="space-y-6">
      {/* ── Create Giveaway Form ── */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "rgba(13,13,26,0.95)",
          border: "1px solid rgba(255,215,0,0.2)",
          boxShadow: "0 0 20px rgba(255,215,0,0.04)",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Gift className="w-5 h-5" style={{ color: "#ffd700" }} />
          <h2
            className="font-display font-bold text-lg"
            style={{ color: "#e2e8f0" }}
          >
            Create Giveaway
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs font-mono" style={{ color: "#94a3b8" }}>
              Giveaway Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Weekend Mega Giveaway"
              data-ocid="admin.giveaway.name.input"
              className="h-9 text-sm"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,215,0,0.2)",
                color: "#e2e8f0",
              }}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs font-mono" style={{ color: "#94a3b8" }}>
              Description / Prize Details
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the prize and rules..."
              data-ocid="admin.giveaway.description.textarea"
              className="text-sm resize-none"
              rows={3}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,215,0,0.15)",
                color: "#e2e8f0",
              }}
            />
          </div>

          {/* Entry Fee */}
          <div className="space-y-1.5">
            <Label className="text-xs font-mono" style={{ color: "#94a3b8" }}>
              Entry Fee (coins)
            </Label>
            <Input
              type="number"
              min="0"
              value={entryFee}
              onChange={(e) => setEntryFee(e.target.value)}
              placeholder="0"
              data-ocid="admin.giveaway.entry_fee.input"
              className="h-9 text-sm font-mono"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,215,0,0.15)",
                color: "#ffd700",
              }}
            />
            <p className="text-xs" style={{ color: "#475569" }}>
              0 = free entry
            </p>
          </div>

          {/* Prize Coins */}
          <div className="space-y-1.5">
            <Label className="text-xs font-mono" style={{ color: "#94a3b8" }}>
              Prize Coins for Winner
            </Label>
            <Input
              type="number"
              min="1"
              value={prizeCoins}
              onChange={(e) => setPrizeCoins(e.target.value)}
              placeholder="500"
              data-ocid="admin.giveaway.prize_coins.input"
              className="h-9 text-sm font-mono"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(57,255,20,0.2)",
                color: "#39ff14",
              }}
            />
          </div>

          {/* End Date & Time */}
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs font-mono" style={{ color: "#94a3b8" }}>
              End Date & Time
            </Label>
            <Input
              type="datetime-local"
              value={endDateTime}
              min={minDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              data-ocid="admin.giveaway.end_datetime.input"
              className="h-9 text-sm font-mono"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(0,245,255,0.2)",
                color: "#e2e8f0",
                colorScheme: "dark",
              }}
            />
          </div>
        </div>

        <div className="mt-5">
          <Button
            onClick={handleCreate}
            disabled={creating}
            data-ocid="admin.giveaway.create.submit_button"
            className="font-bold px-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,215,0,0.15))",
              border: "1px solid rgba(255,215,0,0.5)",
              color: "#ffd700",
              boxShadow: "0 0 15px rgba(255,215,0,0.15)",
            }}
          >
            <Gift className="w-4 h-4 mr-2" />
            Create Giveaway
          </Button>
        </div>
      </div>

      {/* ── Giveaway List ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5" style={{ color: "#ffd700" }} />
          <h2
            className="font-display font-bold text-lg"
            style={{ color: "#e2e8f0" }}
          >
            All Giveaways
          </h2>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(255,215,0,0.08)",
              border: "1px solid rgba(255,215,0,0.2)",
              color: "#ffd700",
            }}
          >
            {giveaways.length}
          </span>
        </div>

        {sorted.length === 0 ? (
          <div
            className="py-16 text-center rounded-xl"
            style={{
              background: "rgba(13,13,26,0.6)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            data-ocid="admin.giveaways.empty_state"
          >
            <Gift
              className="w-8 h-8 mx-auto mb-2 opacity-20"
              style={{ color: "#ffd700" }}
            />
            <p className="text-sm" style={{ color: "#475569" }}>
              No giveaways created yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((g, idx) => {
              const entries = getEntriesByGiveaway(g.id);
              const isExpanded = expandedId === g.id;
              const winner = g.winnerId ? getUserById(g.winnerId) : undefined;

              return (
                <div
                  key={g.id}
                  data-ocid={`admin.giveaways.item.${idx + 1}`}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: "rgba(13,13,26,0.95)",
                    border: `1px solid ${g.status === "active" ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  {/* Card Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3
                            className="font-display font-black text-base"
                            style={{ color: "#e2e8f0" }}
                          >
                            {g.name}
                          </h3>
                          <Badge
                            className="text-xs font-bold"
                            style={
                              g.status === "active"
                                ? {
                                    background: "rgba(57,255,20,0.1)",
                                    border: "1px solid rgba(57,255,20,0.3)",
                                    color: "#39ff14",
                                  }
                                : {
                                    background: "rgba(100,116,139,0.1)",
                                    border: "1px solid rgba(100,116,139,0.3)",
                                    color: "#64748b",
                                  }
                            }
                          >
                            {g.status === "active" ? "ACTIVE" : "ENDED"}
                          </Badge>
                        </div>
                        <p
                          className="text-xs mb-3"
                          style={{ color: "#94a3b8" }}
                        >
                          {g.description}
                        </p>

                        {/* Info row */}
                        <div className="flex flex-wrap gap-3">
                          <span
                            className="text-xs font-mono"
                            style={{ color: "#64748b" }}
                          >
                            Entry:{" "}
                            <span style={{ color: "#ffd700" }}>
                              {g.entryFee} coins
                            </span>
                          </span>
                          <span
                            className="text-xs font-mono"
                            style={{ color: "#64748b" }}
                          >
                            Prize:{" "}
                            <span style={{ color: "#39ff14" }}>
                              {g.prizeCoins.toLocaleString()} coins
                            </span>
                          </span>
                          <span
                            className="text-xs font-mono"
                            style={{ color: "#64748b" }}
                          >
                            Entries:{" "}
                            <span style={{ color: "#00f5ff" }}>
                              {entries.length}
                            </span>
                          </span>
                          <span
                            className="text-xs font-mono"
                            style={{ color: "#64748b" }}
                          >
                            Ends:{" "}
                            <span style={{ color: "#94a3b8" }}>
                              {new Date(g.endDateTime).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 items-start">
                        <Button
                          size="sm"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : g.id)
                          }
                          data-ocid={`admin.giveaway.entries.button.${idx + 1}`}
                          className="h-8 text-xs font-bold"
                          style={{
                            background: "rgba(0,245,255,0.06)",
                            border: "1px solid rgba(0,245,255,0.25)",
                            color: "#00f5ff",
                          }}
                        >
                          <Users className="w-3 h-3 mr-1" />
                          Entries ({entries.length})
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3 ml-1" />
                          ) : (
                            <ChevronDown className="w-3 h-3 ml-1" />
                          )}
                        </Button>

                        {g.status === "active" &&
                          entries.length > 0 &&
                          !g.winnerId && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleAutoPickWinner(g.id, g.name, g.prizeCoins)
                              }
                              data-ocid={`admin.giveaway.pick_winner.button.${idx + 1}`}
                              className="h-8 text-xs font-bold"
                              style={{
                                background:
                                  "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.1))",
                                border: "1px solid rgba(255,215,0,0.4)",
                                color: "#ffd700",
                                boxShadow: "0 0 10px rgba(255,215,0,0.1)",
                              }}
                            >
                              <Shuffle className="w-3 h-3 mr-1" />
                              Auto Pick Winner
                            </Button>
                          )}

                        {g.status === "active" && (
                          <Button
                            size="sm"
                            onClick={() => handleEndGiveaway(g.id, g.name)}
                            data-ocid={`admin.giveaway.end.button.${idx + 1}`}
                            className="h-8 text-xs font-bold"
                            style={{
                              background: "rgba(255,68,68,0.06)",
                              border: "1px solid rgba(255,68,68,0.25)",
                              color: "#ff6b6b",
                            }}
                          >
                            <X className="w-3 h-3 mr-1" />
                            End
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Winner section */}
                    {g.winnerId && winner && (
                      <div
                        className="mt-4 rounded-lg p-4"
                        style={{
                          background: "rgba(255,215,0,0.06)",
                          border: "1px solid rgba(255,215,0,0.2)",
                        }}
                        data-ocid={`admin.giveaway.winner.section.${idx + 1}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy
                            className="w-4 h-4"
                            style={{ color: "#ffd700" }}
                          />
                          <span
                            className="text-xs font-bold font-mono uppercase tracking-wider"
                            style={{ color: "#ffd700" }}
                          >
                            Winner
                          </span>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div>
                            <p
                              className="font-bold text-sm"
                              style={{ color: "#e2e8f0" }}
                            >
                              {winner.fullName}
                            </p>
                            <p
                              className="text-xs font-mono"
                              style={{ color: "#00f5ff" }}
                            >
                              IGN: {winner.inGameName}
                            </p>
                            <p
                              className="text-xs font-mono mt-0.5"
                              style={{ color: "#64748b" }}
                            >
                              FF UID: {winner.freeFireUID}
                            </p>
                          </div>
                          <div
                            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold"
                            style={{
                              background: "rgba(57,255,20,0.08)",
                              border: "1px solid rgba(57,255,20,0.25)",
                              color: "#39ff14",
                            }}
                          >
                            +{g.prizeCoins.toLocaleString()} coins credited
                          </div>
                        </div>
                        {g.winnerPickedAt && (
                          <p
                            className="text-xs font-mono mt-2"
                            style={{ color: "#475569" }}
                          >
                            Picked on{" "}
                            {new Date(g.winnerPickedAt).toLocaleString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expanded entries list */}
                  {isExpanded && (
                    <div
                      className="border-t px-5 py-4"
                      style={{ borderColor: "rgba(0,245,255,0.1)" }}
                    >
                      <h4
                        className="text-xs font-bold font-mono uppercase tracking-wider mb-3"
                        style={{ color: "#64748b" }}
                      >
                        Participants ({entries.length})
                      </h4>

                      {entries.length === 0 ? (
                        <p
                          className="text-xs text-center py-4"
                          style={{ color: "#475569" }}
                          data-ocid={`admin.giveaway.entries.empty_state.${idx + 1}`}
                        >
                          No entries yet
                        </p>
                      ) : (
                        <div className="space-y-1.5 max-h-64 overflow-y-auto">
                          {entries.map((entry, eIdx) => {
                            const u = getUserById(entry.userId);
                            const isWinner = g.winnerId === entry.userId;
                            return (
                              <div
                                key={entry.id}
                                data-ocid={`admin.giveaway.entry.item.${eIdx + 1}`}
                                className="flex items-center justify-between px-3 py-2 rounded-lg"
                                style={{
                                  background: isWinner
                                    ? "rgba(255,215,0,0.06)"
                                    : "rgba(255,255,255,0.02)",
                                  border: `1px solid ${isWinner ? "rgba(255,215,0,0.2)" : "rgba(255,255,255,0.04)"}`,
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className="text-xs font-mono w-5 text-right"
                                    style={{ color: "#475569" }}
                                  >
                                    {eIdx + 1}
                                  </span>
                                  <div>
                                    <span
                                      className="text-sm font-bold"
                                      style={{ color: "#e2e8f0" }}
                                    >
                                      {u?.inGameName ?? "Unknown"}
                                    </span>
                                    <span
                                      className="text-xs font-mono ml-2"
                                      style={{ color: "#64748b" }}
                                    >
                                      {u?.freeFireUID ?? "—"}
                                    </span>
                                  </div>
                                  {isWinner && (
                                    <Trophy
                                      className="w-3.5 h-3.5"
                                      style={{ color: "#ffd700" }}
                                    />
                                  )}
                                </div>
                                <span
                                  className="text-xs font-mono"
                                  style={{ color: "#475569" }}
                                >
                                  {new Date(entry.enteredAt).toLocaleDateString(
                                    "en-IN",
                                  )}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
