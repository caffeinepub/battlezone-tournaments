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
  LogOut,
  Menu,
  ShieldCheck,
  Swords,
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

  const navLinks = [
    { to: "/tournaments", label: "Tournaments", icon: Swords },
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
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
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
              {label}
            </Link>
          ))}
          {isAdmin && (
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
              Admin
            </Link>
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
            className="md:hidden w-8 h-8"
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: "rgba(8,8,16,0.98)",
            borderColor: "rgba(0,245,255,0.1)",
          }}
        >
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                data-ocid={`nav.mobile.${label.toLowerCase()}.link`}
                className="flex items-center gap-2 px-3 py-2.5 rounded text-sm font-medium"
                style={{ color: "#94a3b8" }}
                activeProps={{
                  style: {
                    color: "#00f5ff",
                    background: "rgba(0,245,255,0.08)",
                  },
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.mobile.admin.link"
                className="flex items-center gap-2 px-3 py-2.5 rounded text-sm font-bold"
                style={{ color: "#8b5cf6" }}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
