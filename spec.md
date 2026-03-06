# BattleZone Tournaments

## Current State
- Users have a single `coinBalance` field that mixes deposited coins, bonuses, prizes, and admin adjustments
- The Wallet page shows one unified balance with a total transaction history
- Withdrawals are limited only by `coinBalance` (any coin source)
- Transaction types: deposit, withdrawal, entry_fee, prize, bonus, penalty, admin_adjustment

## Requested Changes (Diff)

### Add
- `winningBalance` field on `LocalUser` to track coins earned from tournament prizes separately
- WalletPage: two distinct balance cards -- "Added Coins" (deposited + bonus + admin_adjustment) and "Winnings" (prize coins from tournaments)
- WithdrawalPage: show winnings balance separately; enforce that withdrawals can only be made from winnings (not from deposited coins)
- When winnings are withdrawn, deduct from `winningBalance` first, then from `coinBalance`

### Modify
- `LocalUser` type: add `winningBalance: number` (defaults to 0)
- `adjustCoins` / coin credit logic: when `actionType === "prize"`, also increment `winningBalance` on the user
- When processing a withdrawal, deduct from `winningBalance` as well as `coinBalance`; validate that withdrawal amount <= winningBalance
- WalletPage: separate transaction history into "Added Coins" section (deposit, bonus, admin_adjustment) and "Winnings" section (prize), with a combined total balance shown at top
- WithdrawalPage: replace "Available Balance" with two rows -- "Winnings (withdrawable)" and "Added Coins (non-withdrawable)"; cap withdrawal amount to winningBalance

### Remove
- Nothing removed

## Implementation Plan
1. Add `winningBalance: number` to `LocalUser` type (default 0)
2. Update `SEED_USERS` in seedData to include `winningBalance: 0`
3. In `DataContext.adjustCoins`: when actionType is "prize", also call `updateUser` to increment `winningBalance`
4. In `DataContext.adjustCoins`: when actionType is "withdrawal", also decrement `winningBalance` by the withdrawn amount (capped at winningBalance)
5. Update `WithdrawalPage`: read `winningBalance` from liveUser; replace the balance check so `validAmount` checks `amountNum <= winningBalance`; show two balance rows; update error messages to say "winnings balance"
6. Update `WalletPage`: show two balance cards -- "Added Coins" total and "Winnings" total; both are visible but only winnings are withdrawable
7. In `WithdrawalPage`, update the "Insufficient balance" error to reference winnings specifically
