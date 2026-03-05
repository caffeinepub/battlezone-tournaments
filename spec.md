# BattleZone Tournaments

## Current State
- Full tournament management app with auth, wallet, payments, withdrawals, admin panel.
- Navbar has a user dropdown with a Logout button (works via `AuthContext.logout()`).
- ProfilePage shows user info and edit form, but no logout or delete account option.
- DataContext has `updateUser` but no `deleteUser` function.

## Requested Changes (Diff)

### Add
- `deleteUser(id: string)` function in DataContext that removes the user from localStorage users array and also cleans up their transactions, payment requests, and withdrawal requests.
- "Logout" button on the ProfilePage (in addition to the existing navbar dropdown option).
- "Delete Account" button on the ProfilePage with a confirmation AlertDialog before proceeding.
- On delete account confirmation: call `deleteUser`, call `logout`, then redirect to `/auth/login`.

### Modify
- `DataContext`: expose `deleteUser` in the context type and implementation.
- `ProfilePage`: add logout and delete account buttons in a new "Account Actions" section at the bottom of the profile card.

### Remove
- Nothing removed.

## Implementation Plan
1. Add `deleteUser` to DataContext interface + implementation (removes user, their transactions, payment requests, withdrawal requests from localStorage).
2. Update ProfilePage to import AlertDialog, add a bottom "Account Actions" section with:
   - A "Logout" button that calls `logout()` and navigates to `/auth/login`.
   - A "Delete Account" button that opens an AlertDialog confirming the action.
   - On confirm: call `deleteUser(session.userId)`, `logout()`, navigate to `/auth/login`.
3. Add proper `data-ocid` markers on new buttons and dialog controls.
