import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  ChevronRight,
  Hash,
  Mail,
  Shield,
  Swords,
  User,
} from "lucide-react";
import type { LocalUser, Transaction } from "../types";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  user?: LocalUser;
  onClose: () => void;
  "data-ocid"?: string;
}

const ACTION_META: Record<
  string,
  { label: string; positive: boolean; description: string }
> = {
  deposit: {
    label: "Deposit",
    positive: true,
    description: "Coins added via UPI payment",
  },
  withdrawal: {
    label: "Withdrawal",
    positive: false,
    description: "Coins withdrawn to UPI account",
  },
  entry_fee: {
    label: "Entry Fee",
    positive: false,
    description: "Tournament entry fee deducted",
  },
  prize: {
    label: "Prize Won",
    positive: true,
    description: "Tournament prize credited",
  },
  bonus: {
    label: "Bonus",
    positive: true,
    description: "Bonus coins credited by admin",
  },
  penalty: {
    label: "Penalty",
    positive: false,
    description: "Penalty deducted by admin",
  },
  admin_adjustment: {
    label: "Admin Adjustment",
    positive: true,
    description: "Manual adjustment by admin",
  },
};

function DetailRow({
  label,
  value,
  mono = false,
  accent = false,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span
        className="text-xs font-medium shrink-0 mt-0.5"
        style={{ color: "#475569" }}
      >
        {label}
      </span>
      <span
        className={`text-sm text-right ${mono ? "font-mono" : ""}`}
        style={{ color: accent ? "#00f5ff" : "#cbd5e1" }}
      >
        {value}
      </span>
    </div>
  );
}

export function TransactionDetailModal({
  transaction,
  user,
  onClose,
  "data-ocid": dataOcid,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  const meta = ACTION_META[transaction.actionType] ?? {
    label: transaction.actionType,
    positive: transaction.amount > 0,
    description: "Transaction",
  };

  const isPositive = transaction.amount > 0;
  const amountColor = isPositive ? "#39ff14" : "#ff4444";

  const formattedDate = new Date(transaction.timestamp).toLocaleString(
    "en-IN",
    {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    },
  );

  return (
    <Dialog open={!!transaction} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-ocid={dataOcid}
        className="max-w-md border-0 p-0 overflow-hidden"
        style={{
          background: "rgba(13,13,26,0.98)",
          border: "1px solid rgba(0,245,255,0.3)",
          boxShadow:
            "0 0 40px rgba(0,245,255,0.08), 0 20px 60px rgba(0,0,0,0.8)",
        }}
      >
        {/* Top gradient accent */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background:
              "linear-gradient(90deg, transparent, #00f5ff, transparent)",
          }}
        />

        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30"
          style={{
            background: isPositive
              ? "rgba(57,255,20,0.08)"
              : "rgba(255,68,68,0.08)",
          }}
        />

        <DialogHeader className="px-6 pt-7 pb-0 relative">
          <div className="flex items-center gap-2 mb-1">
            {isPositive ? (
              <ArrowUpCircle className="w-5 h-5" style={{ color: "#39ff14" }} />
            ) : (
              <ArrowDownCircle
                className="w-5 h-5"
                style={{ color: "#ff4444" }}
              />
            )}
            <DialogTitle
              className="font-display font-bold text-lg"
              style={{ color: "#e2e8f0" }}
            >
              Transaction Details
            </DialogTitle>
          </div>

          {/* Type badge */}
          <div className="flex items-center gap-2 mt-2 mb-1">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: isPositive
                  ? "rgba(57,255,20,0.1)"
                  : "rgba(255,68,68,0.1)",
                border: `1px solid ${isPositive ? "rgba(57,255,20,0.3)" : "rgba(255,68,68,0.3)"}`,
                color: amountColor,
              }}
            >
              {meta.label}
            </span>
            <span className="text-xs" style={{ color: "#475569" }}>
              {meta.description}
            </span>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4 relative">
          {/* Amount — hero element */}
          <div
            className="rounded-xl p-5 mb-5 text-center relative overflow-hidden"
            style={{
              background: isPositive
                ? "rgba(57,255,20,0.05)"
                : "rgba(255,68,68,0.05)",
              border: `1px solid ${isPositive ? "rgba(57,255,20,0.15)" : "rgba(255,68,68,0.15)"}`,
            }}
          >
            <p className="text-xs mb-1 font-mono" style={{ color: "#475569" }}>
              AMOUNT
            </p>
            <p
              className="font-display font-black text-4xl"
              style={{
                color: amountColor,
                textShadow: `0 0 20px ${isPositive ? "rgba(57,255,20,0.4)" : "rgba(255,68,68,0.4)"}`,
              }}
            >
              💰{" "}
              {isPositive
                ? `+${transaction.amount.toLocaleString()}`
                : transaction.amount.toLocaleString()}
            </p>
            <p className="text-xs mt-1" style={{ color: "#475569" }}>
              {isPositive
                ? "Coins credited to wallet"
                : "Coins debited from wallet"}
            </p>
          </div>

          {/* Transaction details */}
          <div
            className="rounded-xl px-4 mb-4"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <DetailRow
              label="Transaction ID"
              value={
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(0,245,255,0.08)",
                    border: "1px solid rgba(0,245,255,0.15)",
                    color: "#00f5ff",
                    wordBreak: "break-all",
                  }}
                >
                  {transaction.id}
                </span>
              }
            />
            <Separator style={{ background: "rgba(255,255,255,0.04)" }} />
            <DetailRow
              label={
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Date & Time
                </span>
              }
              value={formattedDate}
              mono
            />
            <Separator style={{ background: "rgba(255,255,255,0.04)" }} />
            <DetailRow
              label="Reason"
              value={
                <span className="leading-relaxed text-left block max-w-[220px]">
                  {transaction.reason}
                </span>
              }
            />
          </div>

          {/* Player info (admin view) */}
          {user && (
            <div
              className="rounded-xl px-4"
              style={{
                background: "rgba(0,245,255,0.02)",
                border: "1px solid rgba(0,245,255,0.08)",
              }}
            >
              <div className="flex items-center gap-2 py-3">
                <Shield className="w-3.5 h-3.5" style={{ color: "#00f5ff" }} />
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#00f5ff" }}
                >
                  Player Info
                </span>
                <ChevronRight
                  className="w-3 h-3 ml-auto"
                  style={{ color: "#334155" }}
                />
              </div>
              <Separator style={{ background: "rgba(0,245,255,0.08)" }} />
              <DetailRow
                label={
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Full Name
                  </span>
                }
                value={user.fullName}
              />
              <Separator style={{ background: "rgba(255,255,255,0.04)" }} />
              <DetailRow
                label={
                  <span className="flex items-center gap-1">
                    <Swords className="w-3 h-3" />
                    IGN
                  </span>
                }
                value={user.inGameName}
                accent
              />
              <Separator style={{ background: "rgba(255,255,255,0.04)" }} />
              <DetailRow
                label={
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    FF UID
                  </span>
                }
                value={user.freeFireUID}
                mono
              />
              <Separator style={{ background: "rgba(255,255,255,0.04)" }} />
              <DetailRow
                label={
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </span>
                }
                value={user.email}
                mono
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
