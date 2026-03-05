import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, ArrowDownToLine, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { CoinBadge } from "../components/shared/CoinBadge";
import { WithdrawalStatusBadge } from "../components/shared/StatusBadge";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

export function WithdrawalPage() {
  const { createWithdrawalRequest, getWithdrawalsByUser, adjustCoins, users } =
    useData();
  const { session } = useAuth();

  const [amountCoins, setAmountCoins] = useState("");
  const [upiId, setUpiId] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; upi?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const liveUser = users.find((u) => u.id === session?.userId);
  const coinBalance = liveUser?.coinBalance ?? 0;
  const withdrawals = session ? getWithdrawalsByUser(session.userId) : [];

  const MIN_WITHDRAWAL = 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    const amountNum = Number.parseInt(amountCoins, 10);

    if (!amountCoins) {
      newErrors.amount = "Amount is required.";
    } else if (Number.isNaN(amountNum) || amountNum < MIN_WITHDRAWAL) {
      newErrors.amount = `Minimum withdrawal is ${MIN_WITHDRAWAL} coins.`;
    } else if (amountNum > coinBalance) {
      newErrors.amount = `Insufficient balance. You have ${coinBalance} coins.`;
    }

    if (!upiId.trim()) {
      newErrors.upi = "UPI ID is required.";
    } else if (!/^[\w.-]+@[\w]+$/.test(upiId.trim())) {
      newErrors.upi = "Enter a valid UPI ID (e.g. name@upi).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      // Deduct coins first
      const success = adjustCoins(
        session!.userId,
        -amountNum,
        "withdrawal",
        `Withdrawal request: ${amountNum} coins to ${upiId.trim()}`,
      );
      if (!success) {
        setErrors({ amount: "Failed to deduct coins. Insufficient balance." });
        return;
      }

      createWithdrawalRequest({
        userId: session!.userId,
        amountCoins: amountNum,
        upiId: upiId.trim(),
      });

      setSuccessMsg(
        `Withdrawal request submitted for ${amountNum} coins to ${upiId.trim()}. Coins have been deducted pending approval.`,
      );
      setAmountCoins("");
      setUpiId("");
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <ArrowDownToLine className="w-6 h-6" style={{ color: "#00f5ff" }} />
          <h1
            className="font-display font-black text-3xl"
            style={{ color: "#e2e8f0" }}
          >
            Withdrawal
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Balance Info */}
          <div
            className="rounded-xl p-5 flex flex-col gap-4"
            style={{
              background: "rgba(13,13,26,0.95)",
              border: "1px solid rgba(0,245,255,0.15)",
            }}
          >
            <h2
              className="font-display font-bold text-lg"
              style={{ color: "#e2e8f0" }}
            >
              Balance Info
            </h2>
            <div>
              <p className="text-xs mb-1" style={{ color: "#64748b" }}>
                Available Balance
              </p>
              <CoinBadge amount={coinBalance} size="lg" />
            </div>
            <div
              className="space-y-2 text-sm rounded-lg p-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p style={{ color: "#94a3b8" }}>
                💡 Minimum withdrawal:{" "}
                <strong className="text-foreground">
                  {MIN_WITHDRAWAL} coins
                </strong>
              </p>
              <p style={{ color: "#94a3b8" }}>
                ⏱ Payment processed within 48-72 hours after admin approval.
                Sometimes on the same day.
              </p>
              <p style={{ color: "#94a3b8" }}>
                💰 Coins are deducted immediately upon request
              </p>
            </div>
          </div>

          {/* Withdrawal Form */}
          <div
            className="rounded-xl p-5"
            style={{
              background: "rgba(13,13,26,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h2
              className="font-display font-bold text-lg mb-4"
              style={{ color: "#e2e8f0" }}
            >
              Request Withdrawal
            </h2>

            {successMsg && (
              <Alert
                className="mb-4"
                style={{
                  background: "rgba(57,255,20,0.06)",
                  border: "1px solid rgba(57,255,20,0.3)",
                }}
                data-ocid="withdrawal.submit.success_state"
              >
                <CheckCircle2
                  className="w-4 h-4"
                  style={{ color: "#39ff14" }}
                />
                <AlertDescription style={{ color: "#39ff14" }}>
                  {successMsg}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="withdrawAmount"
                  style={{ color: "#94a3b8" }}
                  className="text-sm"
                >
                  Amount (Coins) *
                </Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  placeholder={`Min. ${MIN_WITHDRAWAL} coins`}
                  value={amountCoins}
                  onChange={(e) => {
                    setAmountCoins(e.target.value);
                    setErrors((p) => ({ ...p, amount: undefined }));
                  }}
                  data-ocid="withdrawal.amount.input"
                  max={coinBalance}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.amount && (
                  <p
                    className="text-xs"
                    style={{ color: "#ff4444" }}
                    data-ocid="withdrawal.amount.error_state"
                  >
                    {errors.amount}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="withdrawUPI"
                  style={{ color: "#94a3b8" }}
                  className="text-sm"
                >
                  Your UPI ID *
                </Label>
                <Input
                  id="withdrawUPI"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setErrors((p) => ({ ...p, upi: undefined }));
                  }}
                  data-ocid="withdrawal.upi.input"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.upi && (
                  <p
                    className="text-xs"
                    style={{ color: "#ff4444" }}
                    data-ocid="withdrawal.upi.error_state"
                  >
                    {errors.upi}
                  </p>
                )}
              </div>

              <Alert
                style={{
                  background: "rgba(255,68,68,0.05)",
                  border: "1px solid rgba(255,68,68,0.15)",
                }}
              >
                <AlertCircle className="w-4 h-4" style={{ color: "#ff4444" }} />
                <AlertDescription
                  className="text-xs"
                  style={{ color: "#94a3b8" }}
                >
                  Coins are deducted immediately. If rejected, coins will be
                  refunded.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={submitting || coinBalance < MIN_WITHDRAWAL}
                data-ocid="withdrawal.submit_button"
                className="w-full h-11 font-bold tracking-wide"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,68,68,0.1), rgba(255,68,68,0.05))",
                  border: "1px solid rgba(255,68,68,0.4)",
                  color: "#ff6b6b",
                }}
              >
                {submitting ? "Submitting..." : "REQUEST WITHDRAWAL"}
              </Button>
            </form>
          </div>
        </div>

        {/* Withdrawal History */}
        {withdrawals.length > 0 && (
          <div
            className="mt-6 rounded-xl overflow-hidden"
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
                Withdrawal History
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <TableHead style={{ color: "#64748b" }}>Date</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Coins</TableHead>
                  <TableHead style={{ color: "#64748b" }}>UPI ID</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((req, i) => (
                  <TableRow
                    key={req.id}
                    data-ocid={`withdrawal.history.row.${i + 1}`}
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  >
                    <TableCell
                      className="text-xs font-mono"
                      style={{ color: "#64748b" }}
                    >
                      {new Date(req.requestedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
