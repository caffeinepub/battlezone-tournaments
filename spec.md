# BattleZone Tournaments

## Current State
- Navbar has a hamburger (three-lines) mobile menu with links to Tournaments, Wallet, Payment, Withdraw, and Admin
- "My Tournaments" section lives as a tab inside TournamentsPage
- Admin Users tab shows a table of all users with Ban/Unban action only (no clickable detail view)
- No Giveaway system exists anywhere

## Requested Changes (Diff)

### Add
- **My Tournaments in sidebar/hamburger**: Move "My Tournaments" into the hamburger (three-lines) side-drawer menu as a dedicated menu item linking to the existing My Tournaments tab on TournamentsPage
- **Admin user detail modal**: Clicking any user row in the admin Users tab opens a full-detail modal showing: profile info (name, email, IGN, FF UID, join date, status), coin balance breakdown (added coins vs winnings), tournament history, and transaction history
- **Giveaway system (user-facing)**: A new `/giveaway` route and page where logged-in users can browse active/upcoming/ended giveaways. Each card shows name, prize description, entry fee (in coins), end date/time, and entry count. Users can enter by paying the entry fee (coins deducted from coinBalance). Users can see their own entries.
- **Giveaway system (admin)**: New "Giveaways" tab in AdminDashboard. Admin can: create a giveaway (name, description/prize, entry fee in coins, end date), view all entries (with user IGN and FF UID), use an "Auto Pick Winner" button that randomly selects one entered user as the winner, and publish the winner (auto-credits a configurable coin prize to the winner with a "giveaway_prize" transaction).
- **Giveaway data types**: `Giveaway` and `GiveawayEntry` types added to types/index.ts
- **Giveaway storage**: STORAGE_KEYS.GIVEAWAYS and STORAGE_KEYS.GIVEAWAY_ENTRIES added; DataContext extended with giveaway CRUD and entry operations
- **Nav link for Giveaways**: Add "Giveaways" link in both desktop nav and hamburger mobile menu

### Modify
- **Navbar hamburger menu**: Expand the mobile drawer to include "My Tournaments" link (points to `/tournaments` with `?tab=my`) and "Giveaways" link. Also add "My Tournaments" as a distinct item in the desktop nav or keep it accessible via the hamburger.
- **TournamentsPage**: Accept a `?tab=my` query param to auto-open the My Tournaments sub-tab when navigated from the hamburger menu link
- **AdminUserApprovals**: Rows are now clickable; clicking opens a UserDetailModal
- **AdminDashboard**: Add "Giveaways" tab

### Remove
- Nothing removed

## Implementation Plan
1. Add `Giveaway` and `GiveawayEntry` types to types/index.ts
2. Add GIVEAWAYS and GIVEAWAY_ENTRIES to STORAGE_KEYS in storage.ts and bump init key to v4
3. Extend DataContext with giveaway state and operations (createGiveaway, updateGiveaway, getGiveawayEntries, createGiveawayEntry, pickGiveawayWinner)
4. Update Navbar to add "My Tournaments" and "Giveaways" in both desktop nav and mobile hamburger drawer
5. Update TournamentsPage to read `?tab=my` search param and default to "my" filter
6. Add UserDetailModal component (profile, balance breakdown, tournaments joined, transactions)
7. Update AdminUserApprovals to make rows clickable, opening UserDetailModal
8. Create GiveawayPage (user-facing) at /giveaway
9. Create AdminGiveaways tab component for the admin panel
10. Register /giveaway route in App.tsx; add Giveaways tab to AdminDashboard
