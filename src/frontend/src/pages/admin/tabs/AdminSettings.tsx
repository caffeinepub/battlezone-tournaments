import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  DollarSign,
  Settings,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { CoinBadge } from "../../../components/shared/CoinBadge";
import { useData } from "../../../contexts/DataContext";

export function AdminSettings() {
  const {
    platformSettings,
    updatePlatformSettings,
    tournaments,
    transactions,
  } = useData();
  const [upiInput, setUpiInput] = useState(platformSettings.upiId);
  const [feeInput, setFeeInput] = useState(
    String(platformSettings.platformFeePercent ?? 4),
  );
  const [bonusPercentInput, setBonusPercentInput] = useState(
    String(platformSettings.depositBonusPercent ?? 4),
  );
  const [bonusMinInput, setBonusMinInput] = useState(
    String(platformSettings.depositBonusMinAmount ?? 100),
  );
  const [saved, setSaved] = useState(false);
  const [upiError, setUpiError] = useState("");
  const [feeError, setFeeError] = useState("");
  const [bonusError, setBonusError] = useState("");

  const handleSaveUPI = () => {
    if (!upiInput.trim()) {
      setUpiError("UPI ID is required.");
      return;
    }
    updatePlatformSettings({ upiId: upiInput.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveFee = () => {
    const val = Number.parseFloat(feeInput);
    if (Number.isNaN(val) || val < 0 || val > 100) {
      setFeeError("Enter a valid percentage between 0 and 100.");
      return;
    }
    updatePlatformSettings({ platformFeePercent: val });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveBonus = () => {
    const bpVal = Number.parseFloat(bonusPercentInput);
    const bmVal = Number.parseFloat(bonusMinInput);
    if (Number.isNaN(bpVal) || bpVal < 0 || bpVal > 100) {
      setBonusError("Enter a valid bonus percentage between 0 and 100.");
      return;
    }
    if (Number.isNaN(bmVal) || bmVal < 1) {
      setBonusError("Enter a valid minimum deposit amount (at least ₹1).");
      return;
    }
    updatePlatformSettings({
      depositBonusPercent: bpVal,
      depositBonusMinAmount: bmVal,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Profit summary calculations
  const totalEntryFees = tournaments.reduce(
    (sum, t) => sum + t.entryFee * t.joinedUserIds.length,
    0,
  );

  const totalPrizePools = tournaments.reduce((sum, t) => {
    // Only count completed tournaments for realized prizes
    if (t.status === "completed") return sum + t.prizePool;
    return sum;
  }, 0);

  const unrealizedPrizePools = tournaments.reduce((sum, t) => {
    if (t.status !== "completed") return sum + t.prizePool;
    return sum;
  }, 0);

  const projectedCommission = tournaments.reduce((sum, t) => {
    return sum + (t.entryFee * t.maxPlayers - t.prizePool);
  }, 0);

  return (
    <div className="space-y-6">
      {/* UPI Settings */}
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(13,13,26,0.95)",
          border: "1px solid rgba(0,245,255,0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4" style={{ color: "#00f5ff" }} />
          <h2
            className="font-display font-bold text-base"
            style={{ color: "#e2e8f0" }}
          >
            Platform Settings
          </h2>
        </div>

        {saved && (
          <Alert
            className="mb-4"
            style={{
              background: "rgba(57,255,20,0.06)",
              border: "1px solid rgba(57,255,20,0.3)",
            }}
            data-ocid="admin.settings.success_state"
          >
            <CheckCircle2 className="w-4 h-4" style={{ color: "#39ff14" }} />
            <AlertDescription style={{ color: "#39ff14" }}>
              Settings saved successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="max-w-md space-y-1.5">
          <Label
            style={{ color: "#94a3b8" }}
            className="text-xs uppercase tracking-wide"
          >
            Platform UPI ID
          </Label>
          <p className="text-xs mb-2" style={{ color: "#64748b" }}>
            This UPI ID is displayed to users on the Payment page
          </p>
          <div className="flex gap-2">
            <Input
              value={upiInput}
              onChange={(e) => {
                setUpiInput(e.target.value);
                setUpiError("");
              }}
              placeholder="e.g. battlezone@paytm"
              data-ocid="admin.settings.upi.input"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(0,245,255,0.2)",
                color: "#e2e8f0",
              }}
            />
            <Button
              onClick={handleSaveUPI}
              data-ocid="admin.settings.upi.save_button"
              className="font-bold px-4"
              style={{
                background: "rgba(0,245,255,0.1)",
                border: "1px solid rgba(0,245,255,0.4)",
                color: "#00f5ff",
              }}
            >
              Save
            </Button>
          </div>
          {upiError && (
            <p
              className="text-xs"
              style={{ color: "#ff4444" }}
              data-ocid="admin.settings.upi.error_state"
            >
              {upiError}
            </p>
          )}
          <p className="text-xs" style={{ color: "#64748b" }}>
            Current:{" "}
            <span className="font-mono" style={{ color: "#00f5ff" }}>
              {platformSettings.upiId}
            </span>
          </p>
        </div>

        {/* Platform Fee % */}
        <div
          className="max-w-md space-y-1.5 pt-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <Label
            style={{ color: "#94a3b8" }}
            className="text-xs uppercase tracking-wide"
          >
            Platform Fee on Withdrawal (%)
          </Label>
          <p className="text-xs mb-2" style={{ color: "#64748b" }}>
            This percentage is deducted from every withdrawal payout
          </p>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={feeInput}
              onChange={(e) => {
                setFeeInput(e.target.value);
                setFeeError("");
              }}
              placeholder="e.g. 4"
              data-ocid="admin.settings.fee.input"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,215,0,0.2)",
                color: "#e2e8f0",
              }}
            />
            <Button
              onClick={handleSaveFee}
              data-ocid="admin.settings.fee.save_button"
              className="font-bold px-4"
              style={{
                background: "rgba(255,215,0,0.08)",
                border: "1px solid rgba(255,215,0,0.35)",
                color: "#ffd700",
              }}
            >
              Save
            </Button>
          </div>
          {feeError && (
            <p
              className="text-xs"
              style={{ color: "#ff4444" }}
              data-ocid="admin.settings.fee.error_state"
            >
              {feeError}
            </p>
          )}
          <p className="text-xs" style={{ color: "#64748b" }}>
            Current:{" "}
            <span className="font-mono" style={{ color: "#ffd700" }}>
              {platformSettings.platformFeePercent ?? 4}%
            </span>
          </p>
        </div>

        {/* Deposit Bonus Settings */}
        <div
          className="max-w-md space-y-1.5 pt-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <Label
            style={{ color: "#94a3b8" }}
            className="text-xs uppercase tracking-wide"
          >
            Deposit Bonus Settings
          </Label>
          <p className="text-xs mb-2" style={{ color: "#64748b" }}>
            Users get this bonus % on deposits at or above the minimum amount
          </p>
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <p className="text-xs" style={{ color: "#64748b" }}>
                Bonus %
              </p>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={bonusPercentInput}
                onChange={(e) => {
                  setBonusPercentInput(e.target.value);
                  setBonusError("");
                }}
                placeholder="e.g. 4"
                data-ocid="admin.settings.bonus_percent.input"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,215,0,0.2)",
                  color: "#e2e8f0",
                }}
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-xs" style={{ color: "#64748b" }}>
                Min Deposit (₹)
              </p>
              <Input
                type="number"
                min={1}
                step={1}
                value={bonusMinInput}
                onChange={(e) => {
                  setBonusMinInput(e.target.value);
                  setBonusError("");
                }}
                placeholder="e.g. 100"
                data-ocid="admin.settings.bonus_min.input"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,215,0,0.2)",
                  color: "#e2e8f0",
                }}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSaveBonus}
                data-ocid="admin.settings.bonus.save_button"
                className="font-bold px-4 h-10"
                style={{
                  background: "rgba(255,215,0,0.08)",
                  border: "1px solid rgba(255,215,0,0.35)",
                  color: "#ffd700",
                }}
              >
                Save
              </Button>
            </div>
          </div>
          {bonusError && (
            <p
              className="text-xs"
              style={{ color: "#ff4444" }}
              data-ocid="admin.settings.bonus.error_state"
            >
              {bonusError}
            </p>
          )}
          <p className="text-xs" style={{ color: "#64748b" }}>
            Current:{" "}
            <span className="font-mono" style={{ color: "#ffd700" }}>
              {platformSettings.depositBonusPercent ?? 4}% bonus on deposits of
              ₹{platformSettings.depositBonusMinAmount ?? 100}+
            </span>
          </p>
        </div>
      </div>

      {/* Profit Summary */}
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(13,13,26,0.95)",
          border: "1px solid rgba(57,255,20,0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <DollarSign className="w-4 h-4" style={{ color: "#39ff14" }} />
          <h2
            className="font-display font-bold text-base"
            style={{ color: "#e2e8f0" }}
          >
            Profit Summary
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Total Entry Fees */}
          <div
            className="rounded-lg p-4"
            style={{
              background: "rgba(0,245,255,0.05)",
              border: "1px solid rgba(0,245,255,0.15)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" style={{ color: "#00f5ff" }} />
              <span className="text-xs" style={{ color: "#64748b" }}>
                Total Entry Fees
              </span>
            </div>
            <CoinBadge amount={totalEntryFees} size="md" />
            <p className="text-xs mt-1" style={{ color: "#475569" }}>
              From{" "}
              {transactions.filter((t) => t.actionType === "entry_fee").length}{" "}
              entries
            </p>
          </div>

          {/* Prize Pools */}
          <div
            className="rounded-lg p-4"
            style={{
              background: "rgba(255,68,68,0.04)",
              border: "1px solid rgba(255,68,68,0.15)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4" style={{ color: "#ff4444" }} />
              <span className="text-xs" style={{ color: "#64748b" }}>
                Unrealized Prize Pools
              </span>
            </div>
            <CoinBadge amount={unrealizedPrizePools} size="md" />
            <p className="text-xs mt-1" style={{ color: "#475569" }}>
              Active tournament pools
            </p>
          </div>

          {/* Commission */}
          <div
            className="rounded-lg p-4"
            style={{
              background: "rgba(57,255,20,0.05)",
              border: "1px solid rgba(57,255,20,0.2)",
              boxShadow: "0 0 10px rgba(57,255,20,0.05)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4" style={{ color: "#39ff14" }} />
              <span className="text-xs" style={{ color: "#64748b" }}>
                Platform Commission
              </span>
            </div>
            <CoinBadge
              amount={Math.max(0, totalEntryFees - totalPrizePools)}
              size="md"
            />
            <p className="text-xs mt-1" style={{ color: "#475569" }}>
              Entry fees minus prizes paid
            </p>
          </div>

          {/* Tournaments breakdown */}
          <div
            className="sm:col-span-2 lg:col-span-3 rounded-lg p-4"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              className="text-xs font-mono font-bold mb-3"
              style={{ color: "#64748b" }}
            >
              TOURNAMENT BREAKDOWN
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs mb-0.5" style={{ color: "#64748b" }}>
                  Total Tournaments
                </p>
                <p className="font-mono font-bold" style={{ color: "#e2e8f0" }}>
                  {tournaments.length}
                </p>
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: "#64748b" }}>
                  Completed
                </p>
                <p className="font-mono font-bold" style={{ color: "#64748b" }}>
                  {tournaments.filter((t) => t.status === "completed").length}
                </p>
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: "#64748b" }}>
                  Total Players Joined
                </p>
                <p className="font-mono font-bold" style={{ color: "#00f5ff" }}>
                  {tournaments.reduce(
                    (sum, t) => sum + t.joinedUserIds.length,
                    0,
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: "#64748b" }}>
                  Projected Commission
                </p>
                <CoinBadge amount={projectedCommission} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
