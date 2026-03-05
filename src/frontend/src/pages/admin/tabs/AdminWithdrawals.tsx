import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownToLine, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { CoinBadge } from "../../../components/shared/CoinBadge";
import { WithdrawalStatusBadge } from "../../../components/shared/StatusBadge";
import { useData } from "../../../contexts/DataContext";

export function AdminWithdrawals() {
  const {
    withdrawalRequests,
    updateWithdrawalRequest,
    adjustCoins,
    getUserById,
  } = useData();

  const sorted = [...withdrawalRequests].sort(
    (a, b) =>
      new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
  );

  const pendingCount = withdrawalRequests.filter(
    (w) => w.status === "pending",
  ).length;

  const handleApprove = (reqId: string, userId: string, amount: number) => {
    // Coins already deducted at request time, just mark completed
    updateWithdrawalRequest(reqId, {
      status: "completed",
      reviewedAt: new Date().toISOString(),
    });
    const user = getUserById(userId);
    toast.success(
      `Withdrawal approved for ${user?.inGameName ?? "user"}. ₹${amount} to be sent.`,
    );
  };

  const handleReject = (reqId: string, userId: string, amount: number) => {
    // Refund coins
    adjustCoins(
      userId,
      amount,
      "admin_adjustment",
      "Withdrawal request rejected - coins refunded",
    );
    updateWithdrawalRequest(reqId, {
      status: "rejected",
      reviewedAt: new Date().toISOString(),
    });
    toast.success(`Withdrawal rejected. ${amount} coins refunded.`);
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
        className="p-4 border-b flex items-center gap-2"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <ArrowDownToLine className="w-4 h-4" style={{ color: "#00f5ff" }} />
        <h2
          className="font-display font-bold text-base"
          style={{ color: "#e2e8f0" }}
        >
          Withdrawal Requests
        </h2>
        {pendingCount > 0 && (
          <span
            className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(255,215,0,0.15)",
              color: "#ffd700",
              border: "1px solid rgba(255,215,0,0.3)",
            }}
          >
            {pendingCount} pending
          </span>
        )}
      </div>

      {sorted.length === 0 ? (
        <div
          className="py-12 text-center"
          data-ocid="admin.withdrawals.empty_state"
        >
          <ArrowDownToLine
            className="w-8 h-8 mx-auto mb-2 opacity-20"
            style={{ color: "#64748b" }}
          />
          <p style={{ color: "#475569" }}>No withdrawal requests yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <TableHead style={{ color: "#64748b" }}>Date</TableHead>
                <TableHead style={{ color: "#64748b" }}>Player</TableHead>
                <TableHead style={{ color: "#64748b" }}>Coins</TableHead>
                <TableHead style={{ color: "#64748b" }}>UPI ID</TableHead>
                <TableHead style={{ color: "#64748b" }}>Status</TableHead>
                <TableHead style={{ color: "#64748b" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((req, i) => {
                const user = getUserById(req.userId);
                return (
                  <TableRow
                    key={req.id}
                    data-ocid={`admin.withdrawal.row.${i + 1}`}
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  >
                    <TableCell
                      className="text-xs font-mono"
                      style={{ color: "#64748b" }}
                    >
                      {new Date(req.requestedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#e2e8f0" }}
                        >
                          {user?.inGameName ?? "Unknown"}
                        </p>
                        <p className="text-xs" style={{ color: "#64748b" }}>
                          {user?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <CoinBadge amount={req.amountCoins} size="sm" />
                    </TableCell>
                    <TableCell
                      className="font-mono text-sm"
                      style={{ color: "#94a3b8" }}
                    >
                      {req.upiId}
                    </TableCell>
                    <TableCell>
                      <WithdrawalStatusBadge status={req.status} />
                    </TableCell>
                    <TableCell>
                      {req.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleApprove(req.id, req.userId, req.amountCoins)
                            }
                            data-ocid={`admin.withdrawal.approve.button.${i + 1}`}
                            className="h-7 text-xs font-bold"
                            style={{
                              background: "rgba(57,255,20,0.1)",
                              border: "1px solid rgba(57,255,20,0.35)",
                              color: "#39ff14",
                            }}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleReject(req.id, req.userId, req.amountCoins)
                            }
                            data-ocid={`admin.withdrawal.reject.button.${i + 1}`}
                            className="h-7 text-xs font-bold"
                            style={{
                              background: "rgba(255,68,68,0.08)",
                              border: "1px solid rgba(255,68,68,0.3)",
                              color: "#ff4444",
                            }}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: "#475569" }}>
                          Reviewed
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
