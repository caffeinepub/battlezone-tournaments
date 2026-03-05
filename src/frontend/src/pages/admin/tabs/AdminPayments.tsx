import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, CreditCard, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentStatusBadge } from "../../../components/shared/StatusBadge";
import { useData } from "../../../contexts/DataContext";

export function AdminPayments() {
  const { paymentRequests, updatePaymentRequest, adjustCoins, getUserById } =
    useData();
  const [coinsToAdd, setCoinsToAdd] = useState<Record<string, string>>({});

  const sorted = [...paymentRequests].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );

  const handleApprove = (reqId: string, userId: string, utr: string) => {
    const coins = Number.parseInt(coinsToAdd[reqId] ?? "0", 10);
    if (!coins || Number.isNaN(coins) || coins <= 0) {
      toast.error("Enter valid coins amount to add.");
      return;
    }

    const success = adjustCoins(
      userId,
      coins,
      "deposit",
      `UPI payment approved - UTR: ${utr}`,
    );
    if (!success) {
      toast.error("Failed to add coins.");
      return;
    }

    updatePaymentRequest(reqId, {
      status: "approved",
      reviewedAt: new Date().toISOString(),
      coinsAdded: coins,
    });
    toast.success(`Approved! Added ${coins} coins.`);
  };

  const handleReject = (reqId: string) => {
    updatePaymentRequest(reqId, {
      status: "rejected",
      reviewedAt: new Date().toISOString(),
    });
    toast.success("Payment request rejected.");
  };

  const pendingCount = paymentRequests.filter(
    (p) => p.status === "pending",
  ).length;

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
        <CreditCard className="w-4 h-4" style={{ color: "#00f5ff" }} />
        <h2
          className="font-display font-bold text-base"
          style={{ color: "#e2e8f0" }}
        >
          Payment Requests
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
          data-ocid="admin.payments.empty_state"
        >
          <CreditCard
            className="w-8 h-8 mx-auto mb-2 opacity-20"
            style={{ color: "#64748b" }}
          />
          <p style={{ color: "#475569" }}>No payment requests yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <TableHead style={{ color: "#64748b" }}>Date</TableHead>
                <TableHead style={{ color: "#64748b" }}>Player</TableHead>
                <TableHead style={{ color: "#64748b" }}>UTR Number</TableHead>
                <TableHead style={{ color: "#64748b" }}>Amount Paid</TableHead>
                <TableHead style={{ color: "#64748b" }}>Status</TableHead>
                <TableHead style={{ color: "#64748b" }}>Coins Added</TableHead>
                <TableHead style={{ color: "#64748b" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((req, i) => {
                const user = getUserById(req.userId);
                return (
                  <TableRow
                    key={req.id}
                    data-ocid={`admin.payment.row.${i + 1}`}
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  >
                    <TableCell
                      className="text-xs font-mono"
                      style={{ color: "#64748b" }}
                    >
                      {new Date(req.submittedAt).toLocaleDateString("en-IN", {
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
                    <TableCell
                      className="font-mono text-sm"
                      style={{ color: "#94a3b8" }}
                    >
                      {req.utrNumber}
                    </TableCell>
                    <TableCell
                      className="font-mono font-bold"
                      style={{ color: "#ffd700" }}
                    >
                      ₹{req.amountPaid}
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={req.status} />
                    </TableCell>
                    <TableCell>
                      {req.coinsAdded ? (
                        <span
                          className="font-mono font-bold"
                          style={{ color: "#39ff14" }}
                        >
                          +{req.coinsAdded} 💰
                        </span>
                      ) : (
                        <span style={{ color: "#475569" }}>—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {req.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Coins"
                            value={coinsToAdd[req.id] ?? ""}
                            onChange={(e) =>
                              setCoinsToAdd((prev) => ({
                                ...prev,
                                [req.id]: e.target.value,
                              }))
                            }
                            data-ocid={`admin.payment.coins.input.${i + 1}`}
                            className="h-7 w-20 text-xs"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(0,245,255,0.2)",
                              color: "#e2e8f0",
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              handleApprove(req.id, req.userId, req.utrNumber)
                            }
                            data-ocid={`admin.payment.approve.button.${i + 1}`}
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
                            onClick={() => handleReject(req.id)}
                            data-ocid={`admin.payment.reject.button.${i + 1}`}
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
