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
  winningBalance: number; // coins earned from tournament prizes (withdrawable)
  status: "pending" | "approved" | "banned" | "rejected";
  role: "user" | "admin";
  principal?: string;
  createdAt: string;
}

export interface TournamentWinner {
  userId: string;
  rank: number;
  coinsAwarded: number;
  awardedAt: string;
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
  winners?: TournamentWinner[];
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
  amountCoins: number; // total coins deducted from wallet
  platformFee: number; // fee coins kept by platform
  payoutCoins: number; // coins actually paid to user (amountCoins - platformFee)
  upiId: string;
  withdrawalMethod?: "upi" | "google_play_gift_card";
  email?: string;
  status: "pending" | "approved" | "rejected" | "completed";
  requestedAt: string;
  reviewedAt?: string;
}

export interface Giveaway {
  id: string;
  name: string;
  description: string; // prize description
  entryFee: number; // coins to enter
  prizeCoins: number; // coins awarded to winner
  endDateTime: string; // ISO string
  status: "active" | "ended";
  winnerId?: string;
  winnerPickedAt?: string;
  createdAt: string;
}

export interface GiveawayEntry {
  id: string;
  giveawayId: string;
  userId: string;
  enteredAt: string;
}

export interface PlatformSettings {
  upiId: string;
  platformFeePercent: number; // e.g. 4 means 4%
  depositBonusPercent: number; // e.g. 4 means 4% bonus on deposits >= depositBonusMinAmount
  depositBonusMinAmount: number; // minimum ₹ deposit to qualify for bonus (e.g. 100)
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
