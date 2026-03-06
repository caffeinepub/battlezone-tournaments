import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Coins,
  Mail,
  Shield,
  Swords,
  Trophy,
  User,
} from "lucide-react";
import { useData } from "../../contexts/DataContext";
import type { LocalUser } from "../../types";

interface UserDetailModalProps {
  user: LocalUser | null;
  onClose: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  deposit: "#39ff14",
  withdrawal: "#ff4444",
  entry_fee: "#ff8c00",
  prize: "#ffd700",
  bonus: "#00f5ff",
  penalty: "#ff4444",
  admin_adjustment: "#8b5cf6",
};

const TYPE_LABELS: Record<string, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  entry_fee: "Entry Fee",
  prize: "Prize Won",
  bonus: "Bonus",
  penalty: "Penalty",
  admin_adjustment: "Admin Adj.",
};

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  const { tournaments, getTransactionsByUser } = useData();

  if (!user) return null;

  const userTournaments = tournaments.filter((t) =>
    t.joinedUserIds.includes(user.id),
  );
  const userTxns = getTransactionsByUser(user.id).slice(0, 20);
  const addedCoins = user.coinBalance - (user.winningBalance ?? 0);

  const getStatusBadge = (status: string) => {
    if (status === "banned") {
      return (
        <Badge
          className="text-xs font-bold"
          style={{
            background: "rgba(255,68,68,0.12)",
            border: "1px solid rgba(255,68,68,0.35)",
            color: "#ff6b6b",
          }}
        >
          Banned
        </Badge>
      );
    }
    return (
      <Badge
        className="text-xs font-bold"
        style={{
          background: "rgba(57,255,20,0.1)",
          border: "1px solid rgba(57,255,20,0.3)",
          color: "#39ff14",
        }}
      >
        Active
      </Badge>
    );
  };

  const getTournamentStatusBadge = (status: string) => {
    const map: Record<string, { color: string; bg: string; border: string }> = {
      live: {
        color: "#39ff14",
        bg: "rgba(57,255,20,0.1)",
        border: "rgba(57,255,20,0.3)",
      },
      upcoming: {
        color: "#00f5ff",
        bg: "rgba(0,245,255,0.1)",
        border: "rgba(0,245,255,0.3)",
      },
      completed: {
        color: "#64748b",
        bg: "rgba(100,116,139,0.1)",
        border: "rgba(100,116,139,0.3)",
      },
    };
    const s = map[status] ?? map.completed;
    return (
      <Badge
        className="text-xs font-bold capitalize"
        style={{
          background: s.bg,
          border: `1px solid ${s.border}`,
          color: s.color,
        }}
      >
        {status}
      </Badge>
    );
  };

  return (
    <Dialog
      open={!!user}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="max-w-2xl w-full p-0 border overflow-hidden"
        data-ocid="admin.user_detail.dialog"
        style={{
          background: "rgba(8,8,16,0.99)",
          borderColor: "rgba(0,245,255,0.2)",
          boxShadow: "0 0 60px rgba(0,245,255,0.06)",
        }}
      >
        <DialogHeader
          className="px-6 pt-6 pb-0"
          style={{ borderBottom: "none" }}
        >
          <DialogTitle className="sr-only">User Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[85vh]">
          <div className="px-6 pb-6 space-y-6">
            {/* ── Profile Section ── */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(0,245,255,0.04)",
                border: "1px solid rgba(0,245,255,0.12)",
              }}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center font-display font-black text-2xl flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(57,255,20,0.05))",
                    border: "2px solid rgba(0,245,255,0.3)",
                    color: "#00f5ff",
                    textShadow: "0 0 12px rgba(0,245,255,0.6)",
                  }}
                >
                  {user.fullName.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2
                      className="font-display font-black text-xl"
                      style={{ color: "#e2e8f0" }}
                    >
                      {user.fullName}
                    </h2>
                    {getStatusBadge(user.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center gap-2">
                      <Mail
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: "#64748b" }}
                      />
                      <span
                        className="text-xs font-mono truncate"
                        style={{ color: "#94a3b8" }}
                      >
                        {user.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: "#64748b" }}
                      />
                      <span
                        className="text-xs font-mono"
                        style={{ color: "#00f5ff" }}
                      >
                        IGN: {user.inGameName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: "#64748b" }}
                      />
                      <span
                        className="text-xs font-mono"
                        style={{ color: "#94a3b8" }}
                      >
                        FF UID: {user.freeFireUID}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: "#64748b" }}
                      />
                      <span
                        className="text-xs font-mono"
                        style={{ color: "#94a3b8" }}
                      >
                        Joined{" "}
                        {new Date(user.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Balance Section ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Coins className="w-4 h-4" style={{ color: "#ffd700" }} />
                <h3
                  className="font-display font-bold text-sm"
                  style={{ color: "#e2e8f0" }}
                >
                  Coin Balance
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-lg p-4 text-center"
                  style={{
                    background: "rgba(0,245,255,0.06)",
                    border: "1px solid rgba(0,245,255,0.15)",
                  }}
                >
                  <div
                    className="font-mono font-black text-2xl mb-1"
                    style={{
                      color: "#00f5ff",
                      textShadow: "0 0 10px rgba(0,245,255,0.4)",
                    }}
                  >
                    {Math.max(0, addedCoins).toLocaleString()}
                  </div>
                  <div
                    className="text-xs font-mono"
                    style={{ color: "#64748b" }}
                  >
                    Added Coins
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#475569" }}>
                    Non-withdrawable
                  </div>
                </div>
                <div
                  className="rounded-lg p-4 text-center"
                  style={{
                    background: "rgba(57,255,20,0.06)",
                    border: "1px solid rgba(57,255,20,0.15)",
                  }}
                >
                  <div
                    className="font-mono font-black text-2xl mb-1"
                    style={{
                      color: "#39ff14",
                      textShadow: "0 0 10px rgba(57,255,20,0.4)",
                    }}
                  >
                    {(user.winningBalance ?? 0).toLocaleString()}
                  </div>
                  <div
                    className="text-xs font-mono"
                    style={{ color: "#64748b" }}
                  >
                    Winnings
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#475569" }}>
                    Withdrawable
                  </div>
                </div>
              </div>
            </div>

            <Separator style={{ background: "rgba(255,255,255,0.05)" }} />

            {/* ── Tournaments Section ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Swords className="w-4 h-4" style={{ color: "#00f5ff" }} />
                <h3
                  className="font-display font-bold text-sm"
                  style={{ color: "#e2e8f0" }}
                >
                  Joined Tournaments
                </h3>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(0,245,255,0.08)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#00f5ff",
                  }}
                >
                  {userTournaments.length}
                </span>
              </div>

              {userTournaments.length === 0 ? (
                <div
                  className="py-8 text-center rounded-lg"
                  data-ocid="admin.user_detail.tournaments.empty_state"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <Swords
                    className="w-6 h-6 mx-auto mb-2 opacity-20"
                    style={{ color: "#64748b" }}
                  />
                  <p className="text-xs" style={{ color: "#475569" }}>
                    No tournaments joined yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {userTournaments.map((t, idx) => (
                    <div
                      key={t.id}
                      data-ocid={`admin.user_detail.tournament.item.${idx + 1}`}
                      className="flex items-center justify-between px-4 py-3 rounded-lg"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div>
                        <p
                          className="text-sm font-bold"
                          style={{ color: "#e2e8f0" }}
                        >
                          {t.name}
                        </p>
                        <p
                          className="text-xs font-mono mt-0.5"
                          style={{ color: "#64748b" }}
                        >
                          {new Date(t.dateTime).toLocaleDateString("en-IN")} ·
                          💰 {t.entryFee} entry
                        </p>
                      </div>
                      {getTournamentStatusBadge(t.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator style={{ background: "rgba(255,255,255,0.05)" }} />

            {/* ── Transaction History ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4" style={{ color: "#ffd700" }} />
                <h3
                  className="font-display font-bold text-sm"
                  style={{ color: "#e2e8f0" }}
                >
                  Recent Transactions
                </h3>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,215,0,0.08)",
                    border: "1px solid rgba(255,215,0,0.2)",
                    color: "#ffd700",
                  }}
                >
                  Last {Math.min(20, userTxns.length)}
                </span>
              </div>

              {userTxns.length === 0 ? (
                <div
                  className="py-8 text-center rounded-lg"
                  data-ocid="admin.user_detail.txns.empty_state"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <p className="text-xs" style={{ color: "#475569" }}>
                    No transactions yet
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {userTxns.map((tx, idx) => {
                    const color = TYPE_COLORS[tx.actionType] ?? "#94a3b8";
                    const isPos = tx.amount >= 0;
                    return (
                      <div
                        key={tx.id}
                        data-ocid={`admin.user_detail.txn.item.${idx + 1}`}
                        className="flex items-center justify-between px-4 py-2.5 rounded-lg"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Badge
                            className="text-xs font-bold flex-shrink-0"
                            style={{
                              background: `${color}15`,
                              border: `1px solid ${color}40`,
                              color,
                            }}
                          >
                            {TYPE_LABELS[tx.actionType] ?? tx.actionType}
                          </Badge>
                          <span
                            className="text-xs truncate"
                            style={{ color: "#94a3b8" }}
                          >
                            {tx.reason}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                          <span
                            className="font-mono font-bold text-sm"
                            style={{ color: isPos ? "#39ff14" : "#ff4444" }}
                          >
                            {isPos ? "+" : ""}
                            {tx.amount.toLocaleString()}
                          </span>
                          <span
                            className="text-xs font-mono"
                            style={{ color: "#475569" }}
                          >
                            {new Date(tx.timestamp).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
