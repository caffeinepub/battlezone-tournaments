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
  ArrowRight,
  CreditCard,
  PlusCircle,
  TrendingDown,
  TrendingUp,
  Trophy,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { TransactionDetailModal } from "../components/TransactionDetailModal";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import type { Transaction } from "../types";

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

function TransactionTable({
  title,
  icon,
  accentColor,
  transactions,
  emptyOcid,
  rowOcidPrefix,
  onSelect,
}: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  transactions: Transaction[];
  emptyOcid: string;
  rowOcidPrefix: string;
  onSelect: (tx: Transaction) => void;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(13,13,26,0.95)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="p-4 border-b flex items-center gap-2"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        {icon}
        <h2
          className="font-display font-bold text-lg"
          style={{ color: "#e2e8f0" }}
        >
          {title}
        </h2>
      </div>

      {transactions.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-12"
          data-ocid={emptyOcid}
        >
          <Wallet
            className="w-8 h-8 mb-3 opacity-20"
            style={{ color: "#64748b" }}
          />
          <p className="text-sm" style={{ color: "#475569" }}>
            No transactions yet
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <TableHead style={{ color: "#64748b" }}>Date / Time</TableHead>
                <TableHead style={{ color: "#64748b" }}>Type</TableHead>
                <TableHead style={{ color: "#64748b" }}>Reason</TableHead>
                <TableHead className="text-right" style={{ color: "#64748b" }}>
                  Amount
                </TableHead>
                <TableHead className="w-8" />
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
                    data-ocid={`${rowOcidPrefix}.${i + 1}`}
                    style={{
                      borderColor: "rgba(255,255,255,0.04)",
                      cursor: "pointer",
                    }}
                    className="hover:bg-white/[0.04] transition-colors group"
                    onClick={() => onSelect(tx)}
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
                            color: isPositive ? accentColor : "#ff4444",
                          }}
                        />
                        <span className="text-xs" style={{ color: "#94a3b8" }}>
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
                        style={{ color: isPositive ? accentColor : "#ff4444" }}
                      >
                        {isPositive ? "+" : ""}
                        {tx.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="w-8 text-center">
                      <ArrowRight
                        className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity mx-auto"
                        style={{ color: "#00f5ff" }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}

export function WalletPage() {
  const { getTransactionsByUser, users } = useData();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const liveUser = users.find((u) => u.id === session?.userId);
  const coinBalance = liveUser?.coinBalance ?? 0;
  const winningBalance = liveUser?.winningBalance ?? 0;
  const addedCoins = Math.max(0, coinBalance - winningBalance);
  const transactions = session ? getTransactionsByUser(session.userId) : [];

  // Prize transactions
  const prizeTxs = transactions.filter((t) => t.actionType === "prize");
  // Non-prize credit transactions (deposit, bonus, admin_adjustment)
  const addedTxs = transactions.filter(
    (t) => t.amount > 0 && t.actionType !== "prize",
  );

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

        {/* Balance Cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {/* Added Coins */}
          <div
            className="rounded-xl p-6 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,245,255,0.07), rgba(0,245,255,0.02))",
              border: "1px solid rgba(0,245,255,0.25)",
              boxShadow: "0 0 20px rgba(0,245,255,0.06)",
            }}
            data-ocid="wallet.added_coins.card"
          >
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #00f5ff, transparent)",
              }}
            />
            <div className="flex items-center gap-2 mb-3">
              <PlusCircle className="w-4 h-4" style={{ color: "#00f5ff" }} />
              <p
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: "#00f5ff" }}
              >
                Added Coins
              </p>
            </div>
            <div
              className="font-display font-black text-4xl mb-1"
              style={{
                color: "#ffd700",
                textShadow: "0 0 16px rgba(255,215,0,0.35)",
              }}
            >
              💰 {addedCoins.toLocaleString()}
            </div>
            <p className="text-xs mb-4" style={{ color: "#475569" }}>
              From deposits &amp; bonuses — not withdrawable
            </p>
            <Button
              onClick={() => navigate({ to: "/payment" })}
              data-ocid="wallet.add_coins.button"
              className="flex items-center gap-2 font-bold h-9 text-sm"
              style={{
                background: "rgba(0,245,255,0.08)",
                border: "1px solid rgba(0,245,255,0.35)",
                color: "#00f5ff",
              }}
            >
              <CreditCard className="w-4 h-4" />
              Add Coins
            </Button>
          </div>

          {/* Winnings */}
          <div
            className="rounded-xl p-6 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(57,255,20,0.07), rgba(57,255,20,0.02))",
              border: "1px solid rgba(57,255,20,0.25)",
              boxShadow: "0 0 20px rgba(57,255,20,0.06)",
            }}
            data-ocid="wallet.winnings.card"
          >
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #39ff14, transparent)",
              }}
            />
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4" style={{ color: "#39ff14" }} />
              <p
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: "#39ff14" }}
              >
                Winnings
              </p>
            </div>
            <div
              className="font-display font-black text-4xl mb-1"
              style={{
                color: "#39ff14",
                textShadow: "0 0 16px rgba(57,255,20,0.4)",
              }}
            >
              🏆 {winningBalance.toLocaleString()}
            </div>
            <p className="text-xs mb-4" style={{ color: "#475569" }}>
              From tournament prizes — withdrawable
            </p>
            <Button
              onClick={() => navigate({ to: "/withdrawal" })}
              data-ocid="wallet.withdraw.button"
              className="flex items-center gap-2 font-bold h-9 text-sm"
              style={{
                background: "rgba(57,255,20,0.08)",
                border: "1px solid rgba(57,255,20,0.35)",
                color: "#39ff14",
              }}
            >
              <ArrowDownToLine className="w-4 h-4" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div
          className="rounded-xl px-5 py-3 mb-6 flex gap-8"
          style={{
            background: "rgba(13,13,26,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <p className="text-xs mb-0.5" style={{ color: "#64748b" }}>
              Total Balance
            </p>
            <p className="font-mono font-bold" style={{ color: "#ffd700" }}>
              💰 {coinBalance.toLocaleString()}
            </p>
          </div>
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

        {/* Transaction History Sections */}
        <div className="space-y-6">
          {/* Winnings Transactions */}
          <TransactionTable
            title="Winnings History"
            icon={<Trophy className="w-4 h-4" style={{ color: "#39ff14" }} />}
            accentColor="#39ff14"
            transactions={prizeTxs}
            emptyOcid="wallet.winnings.empty_state"
            rowOcidPrefix="wallet.winnings.row"
            onSelect={setSelectedTx}
          />

          {/* Added Coins Transactions */}
          <TransactionTable
            title="Added Coins History"
            icon={
              <PlusCircle className="w-4 h-4" style={{ color: "#00f5ff" }} />
            }
            accentColor="#00f5ff"
            transactions={addedTxs}
            emptyOcid="wallet.added.empty_state"
            rowOcidPrefix="wallet.added.row"
            onSelect={setSelectedTx}
          />
        </div>
      </main>
      <Footer />

      <TransactionDetailModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        data-ocid="wallet.transaction.detail.modal"
      />
    </div>
  );
}
