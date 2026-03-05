import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  CreditCard,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

const ACTION_LABELS: Record<
  string,
  { label: string; icon: React.ElementType; positive: boolean }
> = {
  deposit: { label: "Deposit", icon: TrendingUp, positive: true },
  withdrawal: { label: "Withdrawal", icon: TrendingDown, positive: false },
  entry_fee: { label: "Entry Fee", icon: TrendingDown, positive: false },
  prize: { label: "Prize Won", icon: TrendingUp, positive: true },
  bonus: { label: "Bonus", icon: TrendingUp, positive: true },
  penalty: { label: "Penalty", icon: TrendingDown, positive: false },
  admin_adjustment: {
    label: "Admin Adjustment",
    icon: TrendingUp,
    positive: true,
  },
};

export function WalletPage() {
  const { getTransactionsByUser, users } = useData();
  const { session } = useAuth();
  const navigate = useNavigate();

  const liveUser = users.find((u) => u.id === session?.userId);
  const coinBalance = liveUser?.coinBalance ?? 0;
  const transactions = session ? getTransactionsByUser(session.userId) : [];

  const totalIn = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = Math.abs(
    transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0),
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <Wallet className="w-6 h-6" style={{ color: "#00f5ff" }} />
          <h1
            className="font-display font-black text-3xl"
            style={{ color: "#e2e8f0" }}
          >
            Wallet
          </h1>
        </div>

        {/* Balance Card */}
        <div
          className="rounded-xl p-8 mb-6 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,245,255,0.08), rgba(57,255,20,0.04))",
            border: "1px solid rgba(0,245,255,0.3)",
            boxShadow: "0 0 30px rgba(0,245,255,0.08)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{
              background:
                "linear-gradient(90deg, transparent, #00f5ff, transparent)",
            }}
          />
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(0,245,255,0.06)" }}
          />

          <p className="text-sm font-mono mb-2" style={{ color: "#64748b" }}>
            CURRENT BALANCE
          </p>
          <div
            className="font-display font-black text-6xl mb-6"
            style={{
              color: "#ffd700",
              textShadow: "0 0 20px rgba(255,215,0,0.4)",
            }}
          >
            💰 {coinBalance.toLocaleString()}
          </div>

          {/* Stats row */}
          <div className="flex gap-6 mb-6">
            <div>
              <p className="text-xs mb-0.5" style={{ color: "#64748b" }}>
                Total In
              </p>
              <p className="font-mono font-bold" style={{ color: "#39ff14" }}>
                +{totalIn.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs mb-0.5" style={{ color: "#64748b" }}>
                Total Out
              </p>
              <p className="font-mono font-bold" style={{ color: "#ff4444" }}>
                -{totalOut.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => navigate({ to: "/payment" })}
              data-ocid="wallet.add_coins.button"
              className="flex items-center gap-2 font-bold h-10"
              style={{
                background: "rgba(57,255,20,0.1)",
                border: "1px solid rgba(57,255,20,0.4)",
                color: "#39ff14",
                boxShadow: "0 0 8px rgba(57,255,20,0.2)",
              }}
            >
              <CreditCard className="w-4 h-4" />
              Add Coins
            </Button>
            <Button
              onClick={() => navigate({ to: "/withdrawal" })}
              data-ocid="wallet.withdraw.button"
              className="flex items-center gap-2 font-bold h-10"
              style={{
                background: "rgba(0,245,255,0.05)",
                border: "1px solid rgba(0,245,255,0.3)",
                color: "#00f5ff",
              }}
            >
              <ArrowDownToLine className="w-4 h-4" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Transaction History */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="p-4 border-b"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <h2
              className="font-display font-bold text-lg"
              style={{ color: "#e2e8f0" }}
            >
              Transaction History
            </h2>
          </div>

          {transactions.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16"
              data-ocid="wallet.transactions.empty_state"
            >
              <Wallet
                className="w-10 h-10 mb-3 opacity-20"
                style={{ color: "#64748b" }}
              />
              <p style={{ color: "#475569" }}>No transactions yet</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <TableHead style={{ color: "#64748b" }}>
                      Date / Time
                    </TableHead>
                    <TableHead style={{ color: "#64748b" }}>Type</TableHead>
                    <TableHead style={{ color: "#64748b" }}>Reason</TableHead>
                    <TableHead
                      className="text-right"
                      style={{ color: "#64748b" }}
                    >
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx, i) => {
                    const info = ACTION_LABELS[tx.actionType] ?? {
                      label: tx.actionType,
                      icon: TrendingUp,
                      positive: tx.amount > 0,
                    };
                    const Icon = info.icon;
                    const isPositive = tx.amount > 0;

                    return (
                      <TableRow
                        key={tx.id}
                        data-ocid={`wallet.transactions.row.${i + 1}`}
                        style={{ borderColor: "rgba(255,255,255,0.04)" }}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell
                          className="text-xs font-mono"
                          style={{ color: "#64748b" }}
                        >
                          {new Date(tx.timestamp).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Icon
                              className="w-3.5 h-3.5"
                              style={{
                                color: isPositive ? "#39ff14" : "#ff4444",
                              }}
                            />
                            <span
                              className="text-xs"
                              style={{ color: "#94a3b8" }}
                            >
                              {info.label}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell
                          className="text-xs max-w-[200px] truncate"
                          style={{ color: "#64748b" }}
                        >
                          {tx.reason}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className="font-mono font-bold text-sm"
                            style={{
                              color: isPositive ? "#39ff14" : "#ff4444",
                            }}
                          >
                            {isPositive ? "+" : ""}
                            {tx.amount.toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
