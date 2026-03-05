# BattleZone Tournaments

## Current State
App uses localStorage with an initialization version key (`bz_initialized_v2`) to seed data on first load. The seed data currently only contains 2 admin accounts (demo player was removed in a prior update). The admin panel Users tab shows all non-admin users from localStorage.

## Requested Changes (Diff)

### Add
- Old versioned key cleanup (`bz_initialized_v1`, `bz_initialized_v2`) when re-initializing

### Modify
- Bump `INITIALIZED` storage key from `bz_initialized_v2` to `bz_initialized_v3` to force a fresh re-seed on existing browsers
- `initializeData()` now clears all stale storage keys before re-seeding to ensure clean state

### Remove
- Nothing removed

## Implementation Plan
1. Bump storage version key to v3 so existing browsers with stale/corrupted data (from demo player removal) get a fresh initialization
2. Add cleanup of old versioned keys in the init function to prevent stale data overlap
