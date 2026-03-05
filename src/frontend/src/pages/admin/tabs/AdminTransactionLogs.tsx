import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Receipt, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { TransactionDetailModal } from "../../../components/TransactionDetailModal";
import { useData } from "../../../contexts/DataContext";
import type { Transaction } from "../../../types";

const ACTION_LABELS: Record<string, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  entry_fee: "Entry Fee",
  prize: "Prize",
  bonus: "Bonus",
  penalty: "Penalty",
  admin_adjustment: "Admin Adjustment",
};

export function AdminTransactionLogs() {
  const { transactions, users } = useData();
  const [filterUserId, setFilterUserId] = useState<string>("all");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const selectedUser = users.find((u) => u.id === selectedTx?.userId);

  const nonAdminUsers = users.filter((u) => u.role !== "admin");

  const filtered = transactions
    .filter((t) => (filterUserId === "all" ? true : t.userId === filterUserId))
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.inGameName ?? userId;
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(13,13,26,0.95)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="p-4 border-b flex items-center justify-between flex-wrap gap-3"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4" style={{ color: "#00f5ff" }} />
          <h2
            className="font-display font-bold text-base"
            style={{ color: "#e2e8f0" }}
          >
            Transaction Logs ({filtered.length})
          </h2>
        </div>
        <Select value={filterUserId} onValueChange={setFilterUserId}>
          <SelectTrigger
            className="w-48 h-8 text-xs"
            data-ocid="admin.logs.filter.select"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(0,245,255,0.2)",
              color: "#e2e8f0",
            }}
          >
            <SelectValue placeholder="Filter by player" />
          </SelectTrigger>
          <SelectContent
            style={{
              background: "rgba(13,13,26,0.98)",
              border: "1px solid rgba(0,245,255,0.2)",
            }}
          >
            <SelectItem value="all">All Players</SelectItem>
            {nonAdminUsers.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.inGameName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center" data-ocid="admin.logs.empty_state">
          <Receipt
            className="w-8 h-8 mx-auto mb-2 opacity-20"
            style={{ color: "#64748b" }}
          />
          <p style={{ color: "#475569" }}>No transactions found</p>
        </div>
      ) : (
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <TableHead style={{ color: "#64748b" }}>Date/Time</TableHead>
                <TableHead style={{ color: "#64748b" }}>Player</TableHead>
                <TableHead style={{ color: "#64748b" }}>Type</TableHead>
                <TableHead style={{ color: "#64748b" }}>Reason</TableHead>
                <TableHead className="text-right" style={{ color: "#64748b" }}>
                  Amount
                </TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tx, i) => {
                const isPositive = tx.amount > 0;
                return (
                  <TableRow
                    key={tx.id}
                    data-ocid={`admin.log.row.${i + 1}`}
                    style={{
                      borderColor: "rgba(255,255,255,0.04)",
                      cursor: "pointer",
                    }}
                    className="hover:bg-white/[0.04] transition-colors group"
                    onClick={() => setSelectedTx(tx)}
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
                    <TableCell className="text-sm" style={{ color: "#94a3b8" }}>
                      {getUserName(tx.userId)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {isPositive ? (
                          <TrendingUp
                            className="w-3.5 h-3.5"
                            style={{ color: "#39ff14" }}
                          />
                        ) : (
                          <TrendingDown
                            className="w-3.5 h-3.5"
                            style={{ color: "#ff4444" }}
                          />
                        )}
                        <span className="text-xs" style={{ color: "#94a3b8" }}>
                          {ACTION_LABELS[tx.actionType] ?? tx.actionType}
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
                        style={{ color: isPositive ? "#39ff14" : "#ff4444" }}
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

      <TransactionDetailModal
        transaction={selectedTx}
        user={selectedUser}
        onClose={() => setSelectedTx(null)}
        data-ocid="admin.transaction.detail.modal"
      />
    </div>
  );
}
