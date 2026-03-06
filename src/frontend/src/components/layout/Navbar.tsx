import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  CreditCard,
  Gift,
  LogOut,
  Menu,
  ShieldCheck,
  Swords,
  Trophy,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";

export function Navbar() {
  const { session, currentUser, logout, isAdmin } = useAuth();
  const { users } = useData();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get fresh user data
  const liveUser = users.find((u) => u.id === session?.userId);
  const coinBalance = liveUser?.coinBalance ?? currentUser?.coinBalance ?? 0;
  const displayName =
    liveUser?.inGameName ?? currentUser?.inGameName ?? "Player";
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate({ to: "/auth/login" });
  };

  const playLinks = [
    { to: "/tournaments", label: "Tournaments", icon: Swords },
    { to: "/giveaway", label: "Giveaways", icon: Gift },
  ];

  const financeLinks = [
    { to: "/wallet", label: "Wallet", icon: Wallet },
    { to: "/payment", label: "Payment", icon: CreditCard },
    { to: "/withdrawal", label: "Withdraw", icon: ArrowDownToLine },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(8,8,16,0.95)",
        backdropFilter: "blur(16px)",
        borderColor: "rgba(0,245,255,0.15)",
        boxShadow: "0 1px 20px rgba(0,245,255,0.05)",
      }}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/tournaments"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          search={{ tab: undefined } as any}
          data-ocid="nav.link"
          className="flex items-center gap-2 group"
        >
          <div
            className="w-8 h-8 rounded flex items-center justify-center font-display font-black text-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(57,255,20,0.1))",
              border: "1px solid rgba(0,245,255,0.4)",
              boxShadow: "0 0 10px rgba(0,245,255,0.2)",
              color: "#00f5ff",
            }}
          >
            BZ
          </div>
          <div className="hidden sm:block">
            <div
              className="font-display font-black text-base leading-tight"
              style={{
                color: "#00f5ff",
                textShadow: "0 0 8px rgba(0,245,255,0.6)",
              }}
            >
              BattleZone
            </div>
            <div
              className="text-xs font-mono tracking-widest"
              style={{ color: "#64748b" }}
            >
              TOURNAMENTS
            </div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-0.5">
          {/* Play group */}
          {playLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              search={to === "/tournaments" ? ({} as any) : undefined}
              data-ocid={`nav.${label.toLowerCase()}.link`}
              className="flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-all duration-200 hover:bg-white/5"
              style={{ color: "#94a3b8" }}
              activeProps={{
                style: {
                  color: "#00f5ff",
                  textShadow: "0 0 8px rgba(0,245,255,0.5)",
                  background: "rgba(0,245,255,0.08)",
                },
              }}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          ))}

          {/* Divider */}
          <div
            className="w-px h-5 mx-1"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />

          {/* Finance group */}
          {financeLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              data-ocid={`nav.${label.toLowerCase()}.link`}
              className="flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-all duration-200 hover:bg-white/5"
              style={{ color: "#94a3b8" }}
              activeProps={{
                style: {
                  color: "#39ff14",
                  textShadow: "0 0 8px rgba(57,255,20,0.5)",
                  background: "rgba(57,255,20,0.06)",
                },
              }}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          ))}

          {isAdmin && (
            <>
              <div
                className="w-px h-5 mx-1"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
              <Link
                to="/admin"
                data-ocid="nav.admin.link"
                className="flex items-center gap-1.5 px-3 py-2 rounded text-sm font-bold transition-all duration-200"
                style={{ color: "#8b5cf6" }}
                activeProps={{
                  style: {
                    color: "#8b5cf6",
                    background: "rgba(139,92,246,0.1)",
                    textShadow: "0 0 8px rgba(139,92,246,0.5)",
                  },
                }}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden lg:inline">Admin</span>
              </Link>
            </>
          )}
        </div>

        {/* Right: Coin balance + User menu */}
        <div className="flex items-center gap-3">
          {/* Coin Balance */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold"
            style={{
              color: "#ffd700",
              borderColor: "rgba(255,215,0,0.4)",
              background: "rgba(255,215,0,0.08)",
              boxShadow: "0 0 8px rgba(255,215,0,0.2)",
            }}
          >
            <span>💰</span>
            <span>{coinBalance.toLocaleString()}</span>
          </div>

          {/* Mobile coin */}
          <div
            className="flex sm:hidden items-center gap-1 px-2 py-1 rounded border font-mono text-xs font-bold"
            style={{
              color: "#ffd700",
              borderColor: "rgba(255,215,0,0.4)",
              background: "rgba(255,215,0,0.08)",
            }}
          >
            💰 {coinBalance.toLocaleString()}
          </div>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                data-ocid="nav.user.open_modal_button"
                className="flex items-center gap-2 p-1 rounded-lg transition-all hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Avatar
                  className="w-8 h-8 border"
                  style={{ borderColor: "rgba(0,245,255,0.4)" }}
                >
                  <AvatarFallback
                    className="text-xs font-bold font-mono"
                    style={{
                      background: "rgba(0,245,255,0.1)",
                      color: "#00f5ff",
                    }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 border"
              style={{
                background: "rgba(13,13,26,0.98)",
                borderColor: "rgba(0,245,255,0.2)",
                backdropFilter: "blur(12px)",
              }}
              data-ocid="nav.user.dropdown_menu"
            >
              <div className="px-2 py-1.5 mb-1">
                <p className="text-xs font-mono" style={{ color: "#64748b" }}>
                  Signed in as
                </p>
                <p
                  className="text-sm font-bold truncate"
                  style={{ color: "#00f5ff" }}
                >
                  {displayName}
                </p>
              </div>
              <DropdownMenuSeparator
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              />
              <DropdownMenuItem asChild>
                <Link
                  to="/profile"
                  data-ocid="nav.profile.link"
                  className="flex items-center gap-2 cursor-pointer"
                  style={{ color: "#e2e8f0" }}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link
                    to="/admin"
                    data-ocid="nav.admin.link"
                    className="flex items-center gap-2 cursor-pointer"
                    style={{ color: "#8b5cf6" }}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              />
              <DropdownMenuItem
                onClick={handleLogout}
                data-ocid="nav.logout.button"
                className="flex items-center gap-2 cursor-pointer"
                style={{ color: "#ff4444" }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden w-8 h-8"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.mobile.toggle"
            style={{ color: "#94a3b8" }}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile full-screen overlay menu */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed inset-0 z-50 flex flex-col"
          style={{
            background: "#000000",
            backdropFilter: "blur(20px)",
            animation: "menuFadeIn 0.2s ease-out forwards",
          }}
          data-ocid="nav.mobile.panel"
        >
          {/* Header row */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(0,245,255,0.12)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded flex items-center justify-center font-display font-black text-base"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,245,255,0.25), rgba(57,255,20,0.12))",
                  border: "1px solid rgba(0,245,255,0.45)",
                  boxShadow: "0 0 12px rgba(0,245,255,0.25)",
                  color: "#00f5ff",
                }}
              >
                BZ
              </div>
              <div>
                <div
                  className="font-display font-black text-sm leading-tight"
                  style={{
                    color: "#00f5ff",
                    textShadow: "0 0 8px rgba(0,245,255,0.6)",
                  }}
                >
                  BattleZone
                </div>
                <div
                  className="text-xs font-mono tracking-widest"
                  style={{ color: "#475569", fontSize: "9px" }}
                >
                  TOURNAMENTS
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.mobile.close_button"
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-white/8"
              style={{
                color: "#94a3b8",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info banner */}
          <div
            className="flex items-center justify-between px-5 py-3 flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,245,255,0.06), rgba(57,255,20,0.03))",
              borderBottom: "1px solid rgba(0,245,255,0.08)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-mono font-black text-sm flex-shrink-0"
                style={{
                  background: "rgba(0,245,255,0.1)",
                  border: "1.5px solid rgba(0,245,255,0.4)",
                  color: "#00f5ff",
                  boxShadow: "0 0 10px rgba(0,245,255,0.2)",
                }}
              >
                {initials}
              </div>
              <div>
                <p
                  className="text-xs font-mono"
                  style={{ color: "#475569", lineHeight: 1 }}
                >
                  Signed in as
                </p>
                <p
                  className="font-bold text-sm mt-0.5"
                  style={{ color: "#00f5ff" }}
                >
                  {displayName}
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold"
              style={{
                color: "#ffd700",
                borderColor: "rgba(255,215,0,0.4)",
                background: "rgba(255,215,0,0.08)",
                boxShadow: "0 0 8px rgba(255,215,0,0.15)",
              }}
            >
              <span>💰</span>
              <span>{coinBalance.toLocaleString()}</span>
            </div>
          </div>

          {/* Main grid content */}
          <div className="flex-1 px-4 py-5 flex flex-col gap-5 overflow-y-auto">
            {/* Two-column grid: PLAY | FINANCE */}
            <div className="grid grid-cols-2 gap-3">
              {/* PLAY section */}
              <div className="flex flex-col gap-2">
                <p
                  className="text-xs font-mono tracking-widest px-1 mb-1"
                  style={{ color: "#00f5ff", opacity: 0.7 }}
                >
                  ⚔ PLAY
                </p>
                {playLinks.map(({ to, label, icon: Icon }) => {
                  const isGiveaway = to === "/giveaway";
                  const accentColor = isGiveaway ? "#ffd700" : "#00f5ff";
                  const accentRgb = isGiveaway ? "255,215,0" : "0,245,255";
                  return (
                    <Link
                      key={to}
                      to={to}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      search={to === "/tournaments" ? ({} as any) : undefined}
                      onClick={() => setMobileOpen(false)}
                      data-ocid={`nav.mobile.${label.toLowerCase().replace(/\s+/g, "_")}.link`}
                      className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                      style={{
                        color: accentColor,
                        background: `rgba(${accentRgb},0.06)`,
                        border: `1px solid rgba(${accentRgb},0.18)`,
                        minHeight: "48px",
                      }}
                    >
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `rgba(${accentRgb},0.12)`,
                          border: `1px solid rgba(${accentRgb},0.2)`,
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="leading-tight">{label}</span>
                    </Link>
                  );
                })}
                {/* My Tournaments */}
                <Link
                  to="/tournaments"
                  search={{ tab: "my" }}
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.mobile.my_tournaments.link"
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{
                    color: "#39ff14",
                    background: "rgba(57,255,20,0.06)",
                    border: "1px solid rgba(57,255,20,0.18)",
                    minHeight: "48px",
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(57,255,20,0.12)",
                      border: "1px solid rgba(57,255,20,0.2)",
                    }}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                  </span>
                  <span className="leading-tight">My Tourneys</span>
                </Link>
              </div>

              {/* FINANCE section */}
              <div className="flex flex-col gap-2">
                <p
                  className="text-xs font-mono tracking-widest px-1 mb-1"
                  style={{ color: "#39ff14", opacity: 0.7 }}
                >
                  💰 FINANCE
                </p>
                {financeLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    data-ocid={`nav.mobile.${label.toLowerCase().replace(/\s+/g, "_")}.link`}
                    className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                    style={{
                      color: "#b0ffd0",
                      background: "rgba(57,255,20,0.06)",
                      border: "1px solid rgba(57,255,20,0.18)",
                      minHeight: "48px",
                    }}
                  >
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(57,255,20,0.1)",
                        border: "1px solid rgba(57,255,20,0.18)",
                        color: "#39ff14",
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="leading-tight">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* ACCOUNT section */}
            <div>
              <p
                className="text-xs font-mono tracking-widest px-1 mb-2"
                style={{ color: "#94a3b8", opacity: 0.6 }}
              >
                👤 ACCOUNT
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.mobile.profile.link"
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{
                    color: "#94a3b8",
                    background: "rgba(148,163,184,0.06)",
                    border: "1px solid rgba(148,163,184,0.15)",
                    minHeight: "48px",
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(148,163,184,0.1)",
                      border: "1px solid rgba(148,163,184,0.18)",
                    }}
                  >
                    <User className="w-3.5 h-3.5" />
                  </span>
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  data-ocid="nav.mobile.logout.button"
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 w-full"
                  style={{
                    color: "#ff6b6b",
                    background: "rgba(255,68,68,0.06)",
                    border: "1px solid rgba(255,68,68,0.2)",
                    minHeight: "48px",
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(255,68,68,0.1)",
                      border: "1px solid rgba(255,68,68,0.2)",
                    }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </span>
                  Logout
                </button>
              </div>
            </div>

            {/* ADMIN section */}
            {isAdmin && (
              <div>
                <p
                  className="text-xs font-mono tracking-widest px-1 mb-2"
                  style={{ color: "#8b5cf6", opacity: 0.8 }}
                >
                  🛡 ADMIN
                </p>
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.mobile.admin.link"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95 w-full"
                  style={{
                    color: "#c4b5fd",
                    background: "rgba(139,92,246,0.08)",
                    border: "1px solid rgba(139,92,246,0.25)",
                    boxShadow: "0 0 16px rgba(139,92,246,0.1)",
                    minHeight: "52px",
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(139,92,246,0.15)",
                      border: "1px solid rgba(139,92,246,0.25)",
                    }}
                  >
                    <ShieldCheck
                      className="w-4 h-4"
                      style={{ color: "#a78bfa" }}
                    />
                  </span>
                  <span>Admin Panel</span>
                  <span
                    className="ml-auto text-xs font-mono px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(139,92,246,0.15)",
                      color: "#a78bfa",
                    }}
                  >
                    ADMIN
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Footer branding */}
          <div
            className="flex-shrink-0 flex items-center justify-center py-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-xs font-mono" style={{ color: "#334155" }}>
              BattleZone Tournaments · v1.0
            </p>
          </div>

          {/* Fade-in animation keyframes injected via style tag */}
          <style>{`
            @keyframes menuFadeIn {
              from { opacity: 0; transform: scale(0.97); }
              to   { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </header>
  );
}
