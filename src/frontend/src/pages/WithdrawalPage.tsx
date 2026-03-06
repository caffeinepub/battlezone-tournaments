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
import {
  AlertCircle,
  ArrowDownToLine,
  CheckCircle2,
  Gift,
  Minus,
  PlusCircle,
  Smartphone,
  Trophy,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { CoinBadge } from "../components/shared/CoinBadge";
import { WithdrawalStatusBadge } from "../components/shared/StatusBadge";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

type WithdrawalMethod = "upi" | "google_play_gift_card";

export function WithdrawalPage() {
  const {
    createWithdrawalRequest,
    getWithdrawalsByUser,
    adjustCoins,
    users,
    platformSettings,
  } = useData();
  const { session } = useAuth();

  const [amountCoins, setAmountCoins] = useState("");
  const [method, setMethod] = useState<WithdrawalMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{
    amount?: string;
    upi?: string;
    email?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const liveUser = users.find((u) => u.id === session?.userId);
  const coinBalance = liveUser?.coinBalance ?? 0;
  const winningBalance = liveUser?.winningBalance ?? 0;
  const withdrawals = session ? getWithdrawalsByUser(session.userId) : [];

  const MIN_WITHDRAWAL = 100;
  const feePercent = platformSettings.platformFeePercent ?? 4;

  // Live fee breakdown — only winnings are withdrawable
  const amountNum = Number.parseInt(amountCoins, 10);
  const validAmount =
    !Number.isNaN(amountNum) &&
    amountNum >= MIN_WITHDRAWAL &&
    amountNum <= winningBalance;
  const platformFee = validAmount
    ? Math.ceil((amountNum * feePercent) / 100)
    : 0;
  const payoutCoins = validAmount ? amountNum - platformFee : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    const parsedAmount = Number.parseInt(amountCoins, 10);

    if (!amountCoins) {
      newErrors.amount = "Amount is required.";
    } else if (Number.isNaN(parsedAmount) || parsedAmount < MIN_WITHDRAWAL) {
      newErrors.amount = `Minimum withdrawal is ${MIN_WITHDRAWAL} coins.`;
    } else if (parsedAmount > winningBalance) {
      newErrors.amount = `Insufficient winnings. You can withdraw up to ${winningBalance} coins (winnings only).`;
    }

    if (method === "upi") {
      if (!upiId.trim()) {
        newErrors.upi = "UPI ID is required.";
      } else if (!/^[\w.-]+@[\w]+$/.test(upiId.trim())) {
        newErrors.upi = "Enter a valid UPI ID (e.g. name@upi).";
      }
    }

    if (method === "google_play_gift_card") {
      if (!email.trim()) {
        newErrors.email = "Email is required for Google Play Gift Card.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors.email = "Enter a valid email address.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const destination = method === "upi" ? upiId.trim() : email.trim();
      const methodLabel = method === "upi" ? "UPI" : "Google Play Gift Card";
      const fee = Math.ceil((parsedAmount * feePercent) / 100);
      const payout = parsedAmount - fee;

      // Deduct the full requested amount from wallet (winnings only)
      const success = adjustCoins(
        session!.userId,
        -parsedAmount,
        "withdrawal",
        `Withdrawal request: ${parsedAmount} coins via ${methodLabel} to ${destination} (fee: ${fee}, payout: ${payout})`,
      );
      if (!success) {
        setErrors({
          amount: "Failed to deduct coins. Insufficient winnings balance.",
        });
        return;
      }

      createWithdrawalRequest({
        userId: session!.userId,
        amountCoins: parsedAmount,
        platformFee: fee,
        payoutCoins: payout,
        upiId: method === "upi" ? upiId.trim() : "",
        withdrawalMethod: method,
        email: method === "google_play_gift_card" ? email.trim() : undefined,
      });

      setSuccessMsg(
        `Withdrawal request submitted! You will receive ${payout} coins (₹${payout}) via ${methodLabel} to ${destination} after admin approval.`,
      );
      setAmountCoins("");
      setUpiId("");
      setEmail("");
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

            {/* Winnings balance — withdrawable */}
            <div
              className="rounded-lg p-3"
              style={{
                background: "rgba(57,255,20,0.05)",
                border: "1px solid rgba(57,255,20,0.25)",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Trophy className="w-3.5 h-3.5" style={{ color: "#39ff14" }} />
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "#39ff14" }}
                >
                  Winnings (Withdrawable)
                </p>
              </div>
              <CoinBadge amount={winningBalance} size="lg" />
            </div>

            {/* Added coins — non-withdrawable */}
            <div
              className="rounded-lg p-3"
              style={{
                background: "rgba(0,245,255,0.04)",
                border: "1px solid rgba(0,245,255,0.15)",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <PlusCircle
                  className="w-3.5 h-3.5"
                  style={{ color: "#00f5ff" }}
                />
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "#00f5ff" }}
                >
                  Added Coins (Non-withdrawable)
                </p>
              </div>
              <CoinBadge
                amount={Math.max(0, coinBalance - winningBalance)}
                size="lg"
              />
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
                💸 Platform fee:{" "}
                <strong className="text-foreground">{feePercent}%</strong>{" "}
                deducted from payout
              </p>
              <p style={{ color: "#94a3b8" }}>
                ⏱ Payment processed within 48-72 hours after admin approval.
                Sometimes on the same day.
              </p>
              <p style={{ color: "#94a3b8" }}>
                💰 Coins are deducted immediately upon request
              </p>
              <p style={{ color: "#94a3b8" }}>
                🏆 Only <strong className="text-foreground">Winnings</strong>{" "}
                can be withdrawn. Added/deposited coins are for entry fees only.
              </p>
            </div>

            {/* Live Fee Breakdown */}
            {validAmount && (
              <div
                className="rounded-lg p-3 space-y-2"
                style={{
                  background: "rgba(0,245,255,0.04)",
                  border: "1px solid rgba(0,245,255,0.2)",
                }}
                data-ocid="withdrawal.fee_breakdown.panel"
              >
                <p
                  className="text-xs font-mono font-bold uppercase tracking-wide mb-2"
                  style={{ color: "#00f5ff" }}
                >
                  Payout Breakdown
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: "#94a3b8" }}>Requested</span>
                  <CoinBadge amount={amountNum} size="sm" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span
                    className="flex items-center gap-1"
                    style={{ color: "#ff6b6b" }}
                  >
                    <Minus className="w-3 h-3" />
                    Platform fee ({feePercent}%)
                  </span>
                  <span
                    className="font-mono font-bold text-sm"
                    style={{ color: "#ff6b6b" }}
                  >
                    -{platformFee} coins
                  </span>
                </div>
                <div
                  className="flex justify-between items-center pt-2 border-t"
                  style={{ borderColor: "rgba(0,245,255,0.2)" }}
                >
                  <span
                    className="flex items-center gap-1 font-semibold text-sm"
                    style={{ color: "#39ff14" }}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    You receive
                  </span>
                  <CoinBadge amount={payoutCoins} size="sm" />
                </div>
              </div>
            )}
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
              {/* Method Selector */}
              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-sm">
                  Withdrawal Method *
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("upi");
                      setErrors({});
                    }}
                    data-ocid="withdrawal.method.upi.toggle"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all"
                    style={
                      method === "upi"
                        ? {
                            background: "rgba(0,245,255,0.12)",
                            border: "1px solid rgba(0,245,255,0.5)",
                            color: "#00f5ff",
                          }
                        : {
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#64748b",
                          }
                    }
                  >
                    <Smartphone className="w-4 h-4 shrink-0" />
                    UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("google_play_gift_card");
                      setErrors({});
                    }}
                    data-ocid="withdrawal.method.gplay.toggle"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all"
                    style={
                      method === "google_play_gift_card"
                        ? {
                            background: "rgba(57,255,20,0.1)",
                            border: "1px solid rgba(57,255,20,0.5)",
                            color: "#39ff14",
                          }
                        : {
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#64748b",
                          }
                    }
                  >
                    <Gift className="w-4 h-4 shrink-0" />
                    Google Play
                  </button>
                </div>
              </div>

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
                  max={winningBalance}
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
                {/* Inline payout hint when amount is valid */}
                {validAmount && (
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "#39ff14" }}
                  >
                    You will receive {payoutCoins} coins after {feePercent}% fee
                  </p>
                )}
              </div>

              {method === "upi" && (
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
              )}

              {method === "google_play_gift_card" && (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="withdrawEmail"
                    style={{ color: "#94a3b8" }}
                    className="text-sm"
                  >
                    Google Account Email *
                  </Label>
                  <Input
                    id="withdrawEmail"
                    type="email"
                    placeholder="your@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    data-ocid="withdrawal.email.input"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(57,255,20,0.25)",
                      color: "#e2e8f0",
                    }}
                  />
                  <p className="text-xs" style={{ color: "#64748b" }}>
                    The Google Play gift card will be sent to this email.
                  </p>
                  {errors.email && (
                    <p
                      className="text-xs"
                      style={{ color: "#ff4444" }}
                      data-ocid="withdrawal.email.error_state"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
              )}

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
                  Coins are deducted immediately. If rejected, the full amount
                  will be refunded to your wallet.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={submitting || winningBalance < MIN_WITHDRAWAL}
                data-ocid="withdrawal.submit_button"
                className="w-full h-11 font-bold tracking-wide"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,68,68,0.1), rgba(255,68,68,0.05))",
                  border: "1px solid rgba(255,68,68,0.4)",
                  color: "#ff6b6b",
                }}
              >
                {submitting
                  ? "Submitting..."
                  : validAmount
                    ? `REQUEST WITHDRAWAL · Receive ${payoutCoins} coins`
                    : "REQUEST WITHDRAWAL"}
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
                  <TableHead style={{ color: "#64748b" }}>Requested</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Fee</TableHead>
                  <TableHead style={{ color: "#64748b" }}>You Get</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Method</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Details</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((req, i) => {
                  // Support legacy requests that may not have fee fields
                  const fee =
                    req.platformFee ??
                    Math.ceil((req.amountCoins * feePercent) / 100);
                  const payout = req.payoutCoins ?? req.amountCoins - fee;
                  return (
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
                      <TableCell>
                        <span
                          className="text-xs font-mono"
                          style={{ color: "#ff6b6b" }}
                        >
                          -{fee}
                        </span>
                      </TableCell>
                      <TableCell>
                        <CoinBadge amount={payout} size="sm" />
                      </TableCell>
                      <TableCell>
                        {req.withdrawalMethod === "google_play_gift_card" ? (
                          <span
                            className="text-xs font-semibold flex items-center gap-1"
                            style={{ color: "#39ff14" }}
                          >
                            <Gift className="w-3 h-3" />
                            Google Play
                          </span>
                        ) : (
                          <span
                            className="text-xs font-semibold flex items-center gap-1"
                            style={{ color: "#00f5ff" }}
                          >
                            <Smartphone className="w-3 h-3" />
                            UPI
                          </span>
                        )}
                      </TableCell>
                      <TableCell
                        className="font-mono text-sm"
                        style={{ color: "#94a3b8" }}
                      >
                        {req.withdrawalMethod === "google_play_gift_card"
                          ? (req.email ?? "-")
                          : req.upiId || "-"}
                      </TableCell>
                      <TableCell>
                        <WithdrawalStatusBadge status={req.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
