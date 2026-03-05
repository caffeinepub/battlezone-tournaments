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
  CheckCircle2,
  Copy,
  CreditCard,
  Gift,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { PaymentStatusBadge } from "../components/shared/StatusBadge";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

export function PaymentPage() {
  const {
    platformSettings,
    createPaymentRequest,
    getPaymentsByUser,
    isUtrDuplicate,
  } = useData();
  const { session } = useAuth();

  const [utr, setUtr] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{
    utr?: string;
    amount?: string;
    general?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const paymentRequests = session ? getPaymentsByUser(session.userId) : [];

  const bonusPercent = platformSettings.depositBonusPercent ?? 4;
  const bonusMinAmount = platformSettings.depositBonusMinAmount ?? 100;
  const amountNum = Number.parseFloat(amount);
  const qualifiesForBonus =
    !Number.isNaN(amountNum) && amountNum >= bonusMinAmount;
  const bonusCoins = qualifiesForBonus
    ? Math.floor(amountNum * (bonusPercent / 100))
    : 0;
  const totalCoins = qualifiesForBonus ? amountNum + bonusCoins : amountNum;

  const handleCopy = () => {
    navigator.clipboard.writeText(platformSettings.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("UPI ID copied to clipboard!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!utr.trim()) {
      newErrors.utr = "UTR / Transaction ID is required.";
    } else if (isUtrDuplicate(utr.trim())) {
      newErrors.utr = "This UTR number has already been submitted.";
    }

    const parsedAmount = Number.parseFloat(amount);
    if (!amount) {
      newErrors.amount = "Amount is required.";
    } else if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = "Enter a valid amount.";
    } else if (parsedAmount < 20) {
      newErrors.amount = "Minimum deposit amount is ₹20.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      createPaymentRequest({
        userId: session!.userId,
        utrNumber: utr.trim(),
        amountPaid: parsedAmount,
      });
      setSuccessMsg(
        `Payment request submitted! UTR: ${utr.trim()}. Admin will verify and add coins shortly.`,
      );
      setUtr("");
      setAmount("");
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
          <CreditCard className="w-6 h-6" style={{ color: "#00f5ff" }} />
          <h1
            className="font-display font-black text-3xl"
            style={{ color: "#e2e8f0" }}
          >
            Add Coins via UPI
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* UPI Payment Info */}
          <div className="space-y-5">
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(13,13,26,0.95)",
                border: "1px solid rgba(0,245,255,0.2)",
                boxShadow: "0 0 20px rgba(0,245,255,0.05)",
              }}
            >
              <h2
                className="font-display font-bold text-lg mb-4"
                style={{ color: "#e2e8f0" }}
              >
                Step 1: Pay via UPI
              </h2>

              <p className="text-sm mb-3" style={{ color: "#64748b" }}>
                Send payment to the UPI ID below using any UPI app:
              </p>

              {/* UPI ID Display */}
              <div
                className="flex items-center gap-3 p-4 rounded-lg mb-4"
                style={{
                  background: "rgba(0,245,255,0.05)",
                  border: "1px solid rgba(0,245,255,0.3)",
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs mb-1" style={{ color: "#64748b" }}>
                    UPI ID
                  </p>
                  <p
                    className="font-mono font-bold text-lg"
                    style={{ color: "#00f5ff" }}
                  >
                    {platformSettings.upiId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  data-ocid="payment.copy_upi.button"
                  className="flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-all"
                  style={{
                    background: copied
                      ? "rgba(57,255,20,0.1)"
                      : "rgba(0,245,255,0.1)",
                    border: copied
                      ? "1px solid rgba(57,255,20,0.4)"
                      : "1px solid rgba(0,245,255,0.3)",
                    color: copied ? "#39ff14" : "#00f5ff",
                  }}
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Bonus Banner */}
              <div
                className="flex items-center gap-2 p-3 rounded-lg mb-3"
                style={{
                  background: "rgba(255,215,0,0.08)",
                  border: "1px solid rgba(255,215,0,0.35)",
                }}
                data-ocid="payment.bonus.panel"
              >
                <Gift
                  className="w-4 h-4 shrink-0"
                  style={{ color: "#ffd700" }}
                />
                <p className="text-sm font-medium" style={{ color: "#ffd700" }}>
                  Deposit ₹{bonusMinAmount}+ and get{" "}
                  <strong>{bonusPercent}% bonus coins</strong> free!
                </p>
              </div>

              <div className="space-y-2 text-sm" style={{ color: "#94a3b8" }}>
                <p>
                  📝 Note your{" "}
                  <strong className="text-foreground">
                    UTR/Transaction ID
                  </strong>{" "}
                  after payment
                </p>
                <p>
                  ⏱ Coins are added after admin verification (within 24 hours)
                </p>
                <p>❌ Duplicate UTR numbers will be rejected</p>
              </div>
            </div>
          </div>

          {/* Submit Form */}
          <div>
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
                Step 2: Submit Request
              </h2>

              {successMsg && (
                <Alert
                  className="mb-4"
                  style={{
                    background: "rgba(57,255,20,0.06)",
                    border: "1px solid rgba(57,255,20,0.3)",
                  }}
                  data-ocid="payment.submit.success_state"
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
                    htmlFor="utr"
                    style={{ color: "#94a3b8" }}
                    className="text-sm"
                  >
                    UTR / Transaction ID *
                  </Label>
                  <Input
                    id="utr"
                    placeholder="e.g. 426891234567"
                    value={utr}
                    onChange={(e) => {
                      setUtr(e.target.value);
                      setErrors((p) => ({ ...p, utr: undefined }));
                    }}
                    data-ocid="payment.utr.input"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(0,245,255,0.2)",
                      color: "#e2e8f0",
                    }}
                  />
                  {errors.utr && (
                    <p
                      className="text-xs"
                      style={{ color: "#ff4444" }}
                      data-ocid="payment.utr.error_state"
                    >
                      {errors.utr}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="amount"
                    style={{ color: "#94a3b8" }}
                    className="text-sm"
                  >
                    Amount Paid (₹) *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Min. ₹20"
                    min={20}
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setErrors((p) => ({ ...p, amount: undefined }));
                    }}
                    data-ocid="payment.amount.input"
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
                      data-ocid="payment.amount.error_state"
                    >
                      {errors.amount}
                    </p>
                  )}

                  {/* Live Bonus Breakdown */}
                  {!Number.isNaN(amountNum) && amountNum >= 20 && (
                    <div
                      className="rounded-lg p-3 space-y-1.5"
                      data-ocid="payment.bonus.breakdown"
                      style={{
                        background: qualifiesForBonus
                          ? "rgba(255,215,0,0.06)"
                          : "rgba(255,255,255,0.03)",
                        border: qualifiesForBonus
                          ? "1px solid rgba(255,215,0,0.3)"
                          : "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div
                        className="flex justify-between text-xs"
                        style={{ color: "#94a3b8" }}
                      >
                        <span>Base coins</span>
                        <span className="font-mono">{amountNum} coins</span>
                      </div>
                      {qualifiesForBonus ? (
                        <>
                          <div
                            className="flex justify-between text-xs"
                            style={{ color: "#ffd700" }}
                          >
                            <span>
                              🎁 {bonusPercent}% bonus (₹{bonusMinAmount}+
                              offer)
                            </span>
                            <span className="font-mono">
                              +{bonusCoins} coins
                            </span>
                          </div>
                          <div
                            className="flex justify-between text-sm font-bold border-t pt-1.5"
                            style={{
                              color: "#39ff14",
                              borderColor: "rgba(255,215,0,0.2)",
                            }}
                          >
                            <span>Total you receive</span>
                            <span className="font-mono">
                              {totalCoins} coins
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs" style={{ color: "#64748b" }}>
                          Deposit ₹{bonusMinAmount}+ to unlock {bonusPercent}%
                          bonus coins
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {errors.general && (
                  <Alert
                    variant="destructive"
                    style={{
                      background: "rgba(255,68,68,0.08)",
                      border: "1px solid rgba(255,68,68,0.3)",
                    }}
                    data-ocid="payment.general.error_state"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription style={{ color: "#ff4444" }}>
                      {errors.general}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  data-ocid="payment.submit_button"
                  className="w-full h-11 font-bold tracking-wide"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(0,245,255,0.08))",
                    border: "1px solid rgba(0,245,255,0.4)",
                    color: "#00f5ff",
                    boxShadow: "0 0 10px rgba(0,245,255,0.2)",
                  }}
                >
                  {submitting ? "Submitting..." : "SUBMIT PAYMENT REQUEST"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Payment History */}
        {paymentRequests.length > 0 && (
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
                Payment History
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <TableHead style={{ color: "#64748b" }}>Date</TableHead>
                  <TableHead style={{ color: "#64748b" }}>UTR Number</TableHead>
                  <TableHead style={{ color: "#64748b" }}>
                    Amount Paid
                  </TableHead>
                  <TableHead style={{ color: "#64748b" }}>
                    Coins Added
                  </TableHead>
                  <TableHead style={{ color: "#64748b" }}>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentRequests.map((req, i) => (
                  <TableRow
                    key={req.id}
                    data-ocid={`payment.history.row.${i + 1}`}
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  >
                    <TableCell
                      className="text-xs font-mono"
                      style={{ color: "#64748b" }}
                    >
                      {new Date(req.submittedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </TableCell>
                    <TableCell
                      className="font-mono text-sm"
                      style={{ color: "#94a3b8" }}
                    >
                      {req.utrNumber}
                    </TableCell>
                    <TableCell
                      className="font-mono"
                      style={{ color: "#94a3b8" }}
                    >
                      ₹{req.amountPaid}
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
                      <PaymentStatusBadge status={req.status} />
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
