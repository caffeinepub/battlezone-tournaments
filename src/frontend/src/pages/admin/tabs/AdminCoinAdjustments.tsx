import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Coins } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CoinBadge } from "../../../components/shared/CoinBadge";
import { useData } from "../../../contexts/DataContext";
import type { Transaction } from "../../../types";

type ActionType = Extract<
  Transaction["actionType"],
  "bonus" | "penalty" | "admin_adjustment"
>;

export function AdminCoinAdjustments() {
  const { users, adjustCoins } = useData();

  const nonAdminUsers = users.filter(
    (u) => u.role !== "admin" && u.status === "approved",
  );

  const [selectedUserId, setSelectedUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [actionType, setActionType] = useState<ActionType>("admin_adjustment");
  const [errors, setErrors] = useState<{
    user?: string;
    amount?: string;
    reason?: string;
  }>({});
  const [success, setSuccess] = useState("");

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!selectedUserId) newErrors.user = "Select a user.";
    const amountNum = Number.parseInt(amount, 10);
    if (!amount || Number.isNaN(amountNum) || amountNum === 0) {
      newErrors.amount = "Enter a non-zero integer amount.";
    }
    if (!reason.trim()) newErrors.reason = "Reason is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Determine final amount sign
    let finalAmount = amountNum;
    if (actionType === "penalty") finalAmount = -Math.abs(amountNum);
    else if (actionType === "bonus") finalAmount = Math.abs(amountNum);
    // admin_adjustment: use as entered (can be positive or negative)

    const success = adjustCoins(
      selectedUserId,
      finalAmount,
      actionType,
      reason.trim(),
    );

    if (!success) {
      setErrors({ amount: "Insufficient balance for deduction." });
      return;
    }

    setSuccess(
      `${finalAmount > 0 ? "Added" : "Deducted"} ${Math.abs(finalAmount)} coins ${finalAmount > 0 ? "to" : "from"} ${selectedUser?.inGameName}.`,
    );
    toast.success("Coin adjustment applied!");
    setAmount("");
    setReason("");
    setErrors({});
    setTimeout(() => setSuccess(""), 4000);
  };

  return (
    <div className="space-y-5">
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(13,13,26,0.95)",
          border: "1px solid rgba(255,215,0,0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Coins className="w-4 h-4" style={{ color: "#ffd700" }} />
          <h2
            className="font-display font-bold text-base"
            style={{ color: "#e2e8f0" }}
          >
            Coin Adjustments
          </h2>
        </div>

        {success && (
          <Alert
            className="mb-4"
            style={{
              background: "rgba(57,255,20,0.06)",
              border: "1px solid rgba(57,255,20,0.3)",
            }}
            data-ocid="admin.coins.success_state"
          >
            <CheckCircle2 className="w-4 h-4" style={{ color: "#39ff14" }} />
            <AlertDescription style={{ color: "#39ff14" }}>
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Select User */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label style={{ color: "#94a3b8" }} className="text-xs">
                Select Player *
              </Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger
                  data-ocid="admin.coins.user.select"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                >
                  <SelectValue placeholder="Choose a player" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "rgba(13,13,26,0.98)",
                    border: "1px solid rgba(0,245,255,0.2)",
                  }}
                >
                  {nonAdminUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.inGameName} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.user && (
                <p
                  className="text-xs"
                  style={{ color: "#ff4444" }}
                  data-ocid="admin.coins.user.error_state"
                >
                  {errors.user}
                </p>
              )}
            </div>

            {/* Action Type */}
            <div className="space-y-1.5">
              <Label style={{ color: "#94a3b8" }} className="text-xs">
                Action Type *
              </Label>
              <Select
                value={actionType}
                onValueChange={(v) => setActionType(v as ActionType)}
              >
                <SelectTrigger
                  data-ocid="admin.coins.type.select"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "rgba(13,13,26,0.98)",
                    border: "1px solid rgba(0,245,255,0.2)",
                  }}
                >
                  <SelectItem value="bonus">Bonus (Add)</SelectItem>
                  <SelectItem value="penalty">Penalty (Deduct)</SelectItem>
                  <SelectItem value="admin_adjustment">
                    Manual Adjustment
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <Label style={{ color: "#94a3b8" }} className="text-xs">
                Amount (Coins) *
              </Label>
              <Input
                type="number"
                placeholder={
                  actionType === "penalty"
                    ? "e.g. 100 (will deduct)"
                    : actionType === "bonus"
                      ? "e.g. 200 (will add)"
                      : "e.g. 100 or -100"
                }
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors((p) => ({ ...p, amount: undefined }));
                }}
                data-ocid="admin.coins.amount.input"
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
                  data-ocid="admin.coins.amount.error_state"
                >
                  {errors.amount}
                </p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <Label style={{ color: "#94a3b8" }} className="text-xs">
              Reason *
            </Label>
            <Textarea
              placeholder="Describe the reason for this adjustment..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrors((p) => ({ ...p, reason: undefined }));
              }}
              data-ocid="admin.coins.reason.textarea"
              rows={2}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(0,245,255,0.2)",
                color: "#e2e8f0",
                resize: "none",
              }}
            />
            {errors.reason && (
              <p
                className="text-xs"
                style={{ color: "#ff4444" }}
                data-ocid="admin.coins.reason.error_state"
              >
                {errors.reason}
              </p>
            )}
          </div>

          {/* Preview */}
          {selectedUser && amount && !Number.isNaN(Number(amount)) && (
            <div
              className="p-3 rounded-lg flex items-center gap-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div>
                <p className="text-xs" style={{ color: "#64748b" }}>
                  Current Balance
                </p>
                <CoinBadge amount={selectedUser.coinBalance} size="sm" />
              </div>
              <span style={{ color: "#64748b" }}>→</span>
              <div>
                <p className="text-xs" style={{ color: "#64748b" }}>
                  After Adjustment
                </p>
                <CoinBadge
                  amount={
                    selectedUser.coinBalance +
                    (actionType === "penalty"
                      ? -Math.abs(Number(amount))
                      : actionType === "bonus"
                        ? Math.abs(Number(amount))
                        : Number(amount))
                  }
                  size="sm"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            data-ocid="admin.coins.submit_button"
            className="font-bold h-10 px-6"
            style={{
              background: "rgba(255,215,0,0.1)",
              border: "1px solid rgba(255,215,0,0.4)",
              color: "#ffd700",
              boxShadow: "0 0 10px rgba(255,215,0,0.15)",
            }}
          >
            Apply Adjustment
          </Button>
        </form>
      </div>
    </div>
  );
}
