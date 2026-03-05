// ==========================================
// LOCAL STORAGE UTILITIES
// ==========================================

export const STORAGE_KEYS = {
  INITIALIZED: "bz_initialized_v2",
  AGE_CONFIRMED: "bz_age_confirmed",
  SESSION: "bz_session",
  USERS: "bz_users",
  TOURNAMENTS: "bz_tournaments",
  TRANSACTIONS: "bz_transactions",
  PAYMENT_REQUESTS: "bz_payment_requests",
  WITHDRAWAL_REQUESTS: "bz_withdrawal_requests",
  PLATFORM_SETTINGS: "bz_platform_settings",
} as const;

export function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error("Failed to save to localStorage:", key);
  }
}

export function removeItem(key: string): void {
  localStorage.removeItem(key);
}

// Simple Base64 "hash" for demo purposes
export function hashPassword(password: string): string {
  return btoa(password);
}

export function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

// Simple UUID generator
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
