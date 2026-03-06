// ==========================================
// DATA CONTEXT - All localStorage state
// ==========================================

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  SEED_PLATFORM_SETTINGS,
  SEED_TOURNAMENTS,
  SEED_USERS,
  generateSeedTransactions,
} from "../lib/seedData";
import { STORAGE_KEYS, generateId, getItem, setItem } from "../lib/storage";
import type {
  Giveaway,
  GiveawayEntry,
  LocalUser,
  PaymentRequest,
  PlatformSettings,
  Tournament,
  Transaction,
  WithdrawalRequest,
} from "../types";

interface DataContextType {
  // Users
  users: LocalUser[];
  getUserById: (id: string) => LocalUser | undefined;
  getUserByEmail: (email: string) => LocalUser | undefined;
  createUser: (user: Omit<LocalUser, "id" | "createdAt">) => LocalUser;
  updateUser: (id: string, updates: Partial<LocalUser>) => void;

  // Tournaments
  tournaments: Tournament[];
  getTournamentById: (id: string) => Tournament | undefined;
  createTournament: (
    data: Omit<
      Tournament,
      "id" | "createdAt" | "joinedUserIds" | "roomVisible"
    >,
  ) => Tournament;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;

  // Transactions
  transactions: Transaction[];
  getTransactionsByUser: (userId: string) => Transaction[];
  addTransaction: (tx: Omit<Transaction, "id" | "timestamp">) => Transaction;

  // Payment Requests
  paymentRequests: PaymentRequest[];
  getPaymentsByUser: (userId: string) => PaymentRequest[];
  createPaymentRequest: (
    data: Omit<PaymentRequest, "id" | "submittedAt" | "status">,
  ) => PaymentRequest;
  updatePaymentRequest: (id: string, updates: Partial<PaymentRequest>) => void;
  isUtrDuplicate: (utr: string) => boolean;

  // Withdrawals
  withdrawalRequests: WithdrawalRequest[];
  getWithdrawalsByUser: (userId: string) => WithdrawalRequest[];
  createWithdrawalRequest: (
    data: Omit<WithdrawalRequest, "id" | "requestedAt" | "status">,
  ) => WithdrawalRequest;
  updateWithdrawalRequest: (
    id: string,
    updates: Partial<WithdrawalRequest>,
  ) => void;

  // Platform Settings
  platformSettings: PlatformSettings;
  updatePlatformSettings: (updates: Partial<PlatformSettings>) => void;

  // Giveaways
  giveaways: Giveaway[];
  getGiveawayById: (id: string) => Giveaway | undefined;
  createGiveaway: (
    data: Omit<
      Giveaway,
      "id" | "createdAt" | "status" | "winnerId" | "winnerPickedAt"
    >,
  ) => Giveaway;
  updateGiveaway: (id: string, updates: Partial<Giveaway>) => void;
  giveawayEntries: GiveawayEntry[];
  getEntriesByGiveaway: (giveawayId: string) => GiveawayEntry[];
  getEntriesByUser: (userId: string) => GiveawayEntry[];
  createGiveawayEntry: (
    data: Omit<GiveawayEntry, "id" | "enteredAt">,
  ) => GiveawayEntry;
  hasUserEnteredGiveaway: (giveawayId: string, userId: string) => boolean;
  pickGiveawayWinner: (giveawayId: string) => string | null;

  // Coin operations
  adjustCoins: (
    userId: string,
    amount: number,
    actionType: Transaction["actionType"],
    reason: string,
  ) => boolean;

  // Delete user
  deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

function initializeData(): void {
  const initialized = getItem<boolean>(STORAGE_KEYS.INITIALIZED);
  if (initialized) return;

  // Clear any stale data from previous versions
  for (const key of Object.values(STORAGE_KEYS)) {
    localStorage.removeItem(key);
  }
  // Also clear old versioned keys
  for (const key of ["bz_initialized_v1", "bz_initialized_v2"]) {
    localStorage.removeItem(key);
  }

  setItem(STORAGE_KEYS.USERS, SEED_USERS);
  setItem(STORAGE_KEYS.TOURNAMENTS, SEED_TOURNAMENTS);
  setItem(STORAGE_KEYS.TRANSACTIONS, generateSeedTransactions());
  setItem(STORAGE_KEYS.PAYMENT_REQUESTS, []);
  setItem(STORAGE_KEYS.WITHDRAWAL_REQUESTS, []);
  setItem(STORAGE_KEYS.PLATFORM_SETTINGS, SEED_PLATFORM_SETTINGS);
  setItem(STORAGE_KEYS.GIVEAWAYS, []);
  setItem(STORAGE_KEYS.GIVEAWAY_ENTRIES, []);
  setItem(STORAGE_KEYS.INITIALIZED, true);
}

export function DataProvider({ children }: { children: ReactNode }) {
  // All state is initialised synchronously from localStorage via lazy initialisers.
  // `initializeData()` seeds localStorage on the very first run, so by the time
  // the lazy initialisers read from storage the data is already there.  This
  // eliminates the one-render flash where contexts are empty and "My Tournaments"
  // shows the empty state even for a logged-in user who has joined tournaments.
  const [users, setUsers] = useState<LocalUser[]>(() => {
    initializeData();
    return getItem<LocalUser[]>(STORAGE_KEYS.USERS) ?? [];
  });
  const [tournaments, setTournaments] = useState<Tournament[]>(
    () => getItem<Tournament[]>(STORAGE_KEYS.TOURNAMENTS) ?? [],
  );
  const [transactions, setTransactions] = useState<Transaction[]>(
    () => getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS) ?? [],
  );
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(
    () => getItem<PaymentRequest[]>(STORAGE_KEYS.PAYMENT_REQUESTS) ?? [],
  );
  const [withdrawalRequests, setWithdrawalRequests] = useState<
    WithdrawalRequest[]
  >(() => getItem<WithdrawalRequest[]>(STORAGE_KEYS.WITHDRAWAL_REQUESTS) ?? []);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(
    () => {
      const stored = getItem<PlatformSettings>(STORAGE_KEYS.PLATFORM_SETTINGS);
      // Migrate legacy settings that may not have newer fields
      return { ...SEED_PLATFORM_SETTINGS, ...stored };
    },
  );
  const [giveaways, setGiveaways] = useState<Giveaway[]>(
    () => getItem<Giveaway[]>(STORAGE_KEYS.GIVEAWAYS) ?? [],
  );
  const [giveawayEntries, setGiveawayEntries] = useState<GiveawayEntry[]>(
    () => getItem<GiveawayEntry[]>(STORAGE_KEYS.GIVEAWAY_ENTRIES) ?? [],
  );

  // ---- Users ----
  const getUserById = useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users],
  );

  const getUserByEmail = useCallback(
    (email: string) =>
      users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
    [users],
  );

  const createUser = useCallback(
    (data: Omit<LocalUser, "id" | "createdAt">): LocalUser => {
      const user: LocalUser = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      const updated = [...users, user];
      setUsers(updated);
      setItem(STORAGE_KEYS.USERS, updated);
      return user;
    },
    [users],
  );

  const updateUser = useCallback(
    (id: string, updates: Partial<LocalUser>) => {
      const updated = users.map((u) =>
        u.id === id ? { ...u, ...updates } : u,
      );
      setUsers(updated);
      setItem(STORAGE_KEYS.USERS, updated);
    },
    [users],
  );

  // ---- Tournaments ----
  const getTournamentById = useCallback(
    (id: string) => tournaments.find((t) => t.id === id),
    [tournaments],
  );

  const createTournament = useCallback(
    (
      data: Omit<
        Tournament,
        "id" | "createdAt" | "joinedUserIds" | "roomVisible"
      >,
    ): Tournament => {
      const tournament: Tournament = {
        ...data,
        id: generateId(),
        joinedUserIds: [],
        roomVisible: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [...tournaments, tournament];
      setTournaments(updated);
      setItem(STORAGE_KEYS.TOURNAMENTS, updated);
      return tournament;
    },
    [tournaments],
  );

  const updateTournament = useCallback(
    (id: string, updates: Partial<Tournament>) => {
      const updated = tournaments.map((t) =>
        t.id === id ? { ...t, ...updates } : t,
      );
      setTournaments(updated);
      setItem(STORAGE_KEYS.TOURNAMENTS, updated);
    },
    [tournaments],
  );

  // ---- Transactions ----
  const getTransactionsByUser = useCallback(
    (userId: string) =>
      transactions
        .filter((t) => t.userId === userId)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        ),
    [transactions],
  );

  const addTransaction = useCallback(
    (data: Omit<Transaction, "id" | "timestamp">): Transaction => {
      const tx: Transaction = {
        ...data,
        id: generateId(),
        timestamp: new Date().toISOString(),
      };
      const updated = [...transactions, tx];
      setTransactions(updated);
      setItem(STORAGE_KEYS.TRANSACTIONS, updated);
      return tx;
    },
    [transactions],
  );

  // ---- Payment Requests ----
  const getPaymentsByUser = useCallback(
    (userId: string) =>
      paymentRequests
        .filter((p) => p.userId === userId)
        .sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime(),
        ),
    [paymentRequests],
  );

  const createPaymentRequest = useCallback(
    (
      data: Omit<PaymentRequest, "id" | "submittedAt" | "status">,
    ): PaymentRequest => {
      const request: PaymentRequest = {
        ...data,
        id: generateId(),
        status: "pending",
        submittedAt: new Date().toISOString(),
      };
      const updated = [...paymentRequests, request];
      setPaymentRequests(updated);
      setItem(STORAGE_KEYS.PAYMENT_REQUESTS, updated);
      return request;
    },
    [paymentRequests],
  );

  const updatePaymentRequest = useCallback(
    (id: string, updates: Partial<PaymentRequest>) => {
      const updated = paymentRequests.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      );
      setPaymentRequests(updated);
      setItem(STORAGE_KEYS.PAYMENT_REQUESTS, updated);
    },
    [paymentRequests],
  );

  const isUtrDuplicate = useCallback(
    (utr: string) =>
      paymentRequests.some(
        (p) => p.utrNumber.toLowerCase() === utr.toLowerCase(),
      ),
    [paymentRequests],
  );

  // ---- Withdrawals ----
  const getWithdrawalsByUser = useCallback(
    (userId: string) =>
      withdrawalRequests
        .filter((w) => w.userId === userId)
        .sort(
          (a, b) =>
            new Date(b.requestedAt).getTime() -
            new Date(a.requestedAt).getTime(),
        ),
    [withdrawalRequests],
  );

  const createWithdrawalRequest = useCallback(
    (
      data: Omit<WithdrawalRequest, "id" | "requestedAt" | "status">,
    ): WithdrawalRequest => {
      const request: WithdrawalRequest = {
        ...data,
        id: generateId(),
        status: "pending",
        requestedAt: new Date().toISOString(),
      };
      const updated = [...withdrawalRequests, request];
      setWithdrawalRequests(updated);
      setItem(STORAGE_KEYS.WITHDRAWAL_REQUESTS, updated);
      return request;
    },
    [withdrawalRequests],
  );

  const updateWithdrawalRequest = useCallback(
    (id: string, updates: Partial<WithdrawalRequest>) => {
      const updated = withdrawalRequests.map((w) =>
        w.id === id ? { ...w, ...updates } : w,
      );
      setWithdrawalRequests(updated);
      setItem(STORAGE_KEYS.WITHDRAWAL_REQUESTS, updated);
    },
    [withdrawalRequests],
  );

  // ---- Giveaways ----
  const getGiveawayById = useCallback(
    (id: string) => giveaways.find((g) => g.id === id),
    [giveaways],
  );

  const createGiveaway = useCallback(
    (
      data: Omit<
        Giveaway,
        "id" | "createdAt" | "status" | "winnerId" | "winnerPickedAt"
      >,
    ): Giveaway => {
      const giveaway: Giveaway = {
        ...data,
        id: generateId(),
        status: "active",
        createdAt: new Date().toISOString(),
      };
      const updated = [...giveaways, giveaway];
      setGiveaways(updated);
      setItem(STORAGE_KEYS.GIVEAWAYS, updated);
      return giveaway;
    },
    [giveaways],
  );

  const updateGiveaway = useCallback(
    (id: string, updates: Partial<Giveaway>) => {
      const updated = giveaways.map((g) =>
        g.id === id ? { ...g, ...updates } : g,
      );
      setGiveaways(updated);
      setItem(STORAGE_KEYS.GIVEAWAYS, updated);
    },
    [giveaways],
  );

  const getEntriesByGiveaway = useCallback(
    (giveawayId: string) =>
      giveawayEntries.filter((e) => e.giveawayId === giveawayId),
    [giveawayEntries],
  );

  const getEntriesByUser = useCallback(
    (userId: string) => giveawayEntries.filter((e) => e.userId === userId),
    [giveawayEntries],
  );

  const hasUserEnteredGiveaway = useCallback(
    (giveawayId: string, userId: string) =>
      giveawayEntries.some(
        (e) => e.giveawayId === giveawayId && e.userId === userId,
      ),
    [giveawayEntries],
  );

  const createGiveawayEntry = useCallback(
    (data: Omit<GiveawayEntry, "id" | "enteredAt">): GiveawayEntry => {
      const entry: GiveawayEntry = {
        ...data,
        id: generateId(),
        enteredAt: new Date().toISOString(),
      };
      const updated = [...giveawayEntries, entry];
      setGiveawayEntries(updated);
      setItem(STORAGE_KEYS.GIVEAWAY_ENTRIES, updated);
      return entry;
    },
    [giveawayEntries],
  );

  const pickGiveawayWinner = useCallback(
    (giveawayId: string): string | null => {
      const entries = giveawayEntries.filter(
        (e) => e.giveawayId === giveawayId,
      );
      if (entries.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * entries.length);
      const winner = entries[randomIndex];
      return winner.userId;
    },
    [giveawayEntries],
  );

  // ---- Delete User ----
  const deleteUser = useCallback(
    (id: string) => {
      const updatedUsers = users.filter((u) => u.id !== id);
      const updatedTransactions = transactions.filter((t) => t.userId !== id);
      const updatedPayments = paymentRequests.filter((p) => p.userId !== id);
      const updatedWithdrawals = withdrawalRequests.filter(
        (w) => w.userId !== id,
      );

      setUsers(updatedUsers);
      setTransactions(updatedTransactions);
      setPaymentRequests(updatedPayments);
      setWithdrawalRequests(updatedWithdrawals);

      setItem(STORAGE_KEYS.USERS, updatedUsers);
      setItem(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
      setItem(STORAGE_KEYS.PAYMENT_REQUESTS, updatedPayments);
      setItem(STORAGE_KEYS.WITHDRAWAL_REQUESTS, updatedWithdrawals);
    },
    [users, transactions, paymentRequests, withdrawalRequests],
  );

  // ---- Platform Settings ----
  const updatePlatformSettings = useCallback(
    (updates: Partial<PlatformSettings>) => {
      const updated = { ...platformSettings, ...updates };
      setPlatformSettings(updated);
      setItem(STORAGE_KEYS.PLATFORM_SETTINGS, updated);
    },
    [platformSettings],
  );

  // ---- Coin operations ----
  const adjustCoins = useCallback(
    (
      userId: string,
      amount: number,
      actionType: Transaction["actionType"],
      reason: string,
    ): boolean => {
      const user = users.find((u) => u.id === userId);
      if (!user) return false;

      const newBalance = user.coinBalance + amount;
      if (newBalance < 0) return false;

      // Track winning balance separately
      const currentWinningBalance = user.winningBalance ?? 0;
      let newWinningBalance = currentWinningBalance;

      if (actionType === "prize") {
        // Prize credits go to both coinBalance and winningBalance
        newWinningBalance = currentWinningBalance + amount;
      } else if (actionType === "withdrawal") {
        // Withdrawal deducts from winningBalance first (amount is negative)
        const deduction = Math.abs(amount);
        newWinningBalance = Math.max(0, currentWinningBalance - deduction);
      }

      updateUser(userId, {
        coinBalance: newBalance,
        winningBalance: newWinningBalance,
      });
      addTransaction({ userId, actionType, amount, reason });
      return true;
    },
    [users, updateUser, addTransaction],
  );

  const value: DataContextType = {
    users,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    tournaments,
    getTournamentById,
    createTournament,
    updateTournament,
    transactions,
    getTransactionsByUser,
    addTransaction,
    paymentRequests,
    getPaymentsByUser,
    createPaymentRequest,
    updatePaymentRequest,
    isUtrDuplicate,
    withdrawalRequests,
    getWithdrawalsByUser,
    createWithdrawalRequest,
    updateWithdrawalRequest,
    platformSettings,
    updatePlatformSettings,
    giveaways,
    getGiveawayById,
    createGiveaway,
    updateGiveaway,
    giveawayEntries,
    getEntriesByGiveaway,
    getEntriesByUser,
    createGiveawayEntry,
    hasUserEnteredGiveaway,
    pickGiveawayWinner,
    adjustCoins,
    deleteUser,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
