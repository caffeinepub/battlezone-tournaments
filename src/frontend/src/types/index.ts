// ==========================================
// BATTLEZONE TOURNAMENTS - TYPE DEFINITIONS
// ==========================================

export interface LocalUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  freeFireUID: string;
  inGameName: string;
  coinBalance: number;
  status: "pending" | "approved" | "banned" | "rejected";
  role: "user" | "admin";
  principal?: string;
  createdAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  matchType: "solo" | "duo" | "squad";
  entryFee: number;
  prizePool: number;
  dateTime: string; // ISO string
  maxPlayers: number;
  mapName: string;
  status: "upcoming" | "live" | "completed";
  roomId?: string;
  roomPassword?: string;
  roomVisible: boolean;
  joinedUserIds: string[];
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  actionType:
    | "deposit"
    | "withdrawal"
    | "entry_fee"
    | "prize"
    | "bonus"
    | "penalty"
    | "admin_adjustment";
  amount: number; // positive = credit, negative = debit
  reason: string;
  timestamp: string;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  utrNumber: string;
  amountPaid: number;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  coinsAdded?: number;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amountCoins: number;
  upiId: string;
  status: "pending" | "approved" | "rejected" | "completed";
  requestedAt: string;
  reviewedAt?: string;
}

export interface PlatformSettings {
  upiId: string;
}

export interface Session {
  userId: string;
  email: string;
  role: "user" | "admin";
}

export type TournamentStatus = Tournament["status"];
export type PaymentStatus = PaymentRequest["status"];
export type WithdrawalStatus = WithdrawalRequest["status"];
export type UserStatus = LocalUser["status"];
export type TransactionType = Transaction["actionType"];
