// ==========================================
// SEED DATA FOR BATTLEZONE TOURNAMENTS
// ==========================================

import type {
  LocalUser,
  PlatformSettings,
  Tournament,
  Transaction,
} from "../types";
import { generateId, hashPassword } from "./storage";

const NOW = new Date();

function hoursFromNow(hours: number): string {
  const d = new Date(NOW.getTime() + hours * 60 * 60 * 1000);
  return d.toISOString();
}

function daysFromNow(days: number): string {
  const d = new Date(NOW.getTime() + days * 24 * 60 * 60 * 1000);
  return d.toISOString();
}

function hoursAgo(hours: number): string {
  const d = new Date(NOW.getTime() - hours * 60 * 60 * 1000);
  return d.toISOString();
}

export const ADMIN_USER: LocalUser = {
  id: "admin-001",
  email: "admin@battlezone.gg",
  passwordHash: hashPassword("Admin@123"),
  fullName: "BattleZone Admin",
  freeFireUID: "ADMIN0001",
  inGameName: "BZ_Admin",
  coinBalance: 99999,
  status: "approved",
  role: "admin",
  createdAt: hoursAgo(720),
};

export const ADMIN_USER_2: LocalUser = {
  id: "admin-002",
  email: "rewq61631@gmail.com",
  passwordHash: hashPassword("joharsingh12"),
  fullName: "Johar Singh",
  freeFireUID: "ADMIN0002",
  inGameName: "BZ_Admin2",
  coinBalance: 99999,
  status: "approved",
  role: "admin",
  createdAt: hoursAgo(720),
};

export const SEED_USERS: LocalUser[] = [ADMIN_USER, ADMIN_USER_2];

export const SEED_TOURNAMENTS: Tournament[] = [
  {
    id: "t-001",
    name: "Free Fire Sunday War",
    matchType: "solo",
    entryFee: 50,
    prizePool: 400,
    dateTime: hoursFromNow(2),
    maxPlayers: 12,
    mapName: "Bermuda",
    status: "upcoming",
    roomId: "",
    roomPassword: "",
    roomVisible: false,
    joinedUserIds: [],
    createdAt: hoursAgo(24),
  },
  {
    id: "t-002",
    name: "Squad Showdown #3",
    matchType: "squad",
    entryFee: 100,
    prizePool: 800,
    dateTime: hoursAgo(1),
    maxPlayers: 24,
    mapName: "Kalahari",
    status: "live",
    roomId: "SQUAD303",
    roomPassword: "show2024",
    roomVisible: true,
    joinedUserIds: [],
    createdAt: hoursAgo(48),
  },
  {
    id: "t-003",
    name: "Duo Championship",
    matchType: "duo",
    entryFee: 75,
    prizePool: 600,
    dateTime: hoursAgo(5),
    maxPlayers: 16,
    mapName: "Purgatory",
    status: "completed",
    roomId: "DUO2024",
    roomPassword: "duo@pass",
    roomVisible: false,
    joinedUserIds: [],
    createdAt: hoursAgo(96),
  },
  {
    id: "t-004",
    name: "Pro League - Week 5",
    matchType: "solo",
    entryFee: 200,
    prizePool: 1500,
    dateTime: daysFromNow(3),
    maxPlayers: 20,
    mapName: "Bermuda MAX",
    status: "upcoming",
    roomId: "",
    roomPassword: "",
    roomVisible: false,
    joinedUserIds: [],
    createdAt: hoursAgo(12),
  },
];

export function generateSeedTransactions(): Transaction[] {
  return [];
}

export const SEED_PLATFORM_SETTINGS: PlatformSettings = {
  upiId: "battlezone@paytm",
};
