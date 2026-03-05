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
  const [saved, setSaved] = useState(false);
  const [upiError, setUpiError] = useState("");

  const handleSaveUPI = () => {
    if (!upiInput.trim()) {
      setUpiError("UPI ID is required.");
      return;
    }
    updatePlatformSettings({ upiId: upiInput.trim() });
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
