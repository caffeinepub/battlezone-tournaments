import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { verifyPassword } from "../../lib/storage";

export function AdminLoginPage() {
  const { getUserByEmail } = useData();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const user = getUserByEmail(email);

      if (!user) {
        setError("No admin account found with this email address.");
        return;
      }

      if (!verifyPassword(password, user.passwordHash)) {
        setError("Incorrect password. Please try again.");
        return;
      }

      if (user.role !== "admin") {
        setError("Access denied. This portal is for admins only.");
        return;
      }

      if (user.status === "banned") {
        setError("Your account has been suspended.");
        return;
      }

      login(user);
      navigate({ to: "/admin" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#080810" }}
    >
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldCheck className="w-8 h-8" style={{ color: "#8b5cf6" }} />
            <div
              className="font-display font-black text-4xl"
              style={{
                color: "#8b5cf6",
                textShadow: "0 0 20px rgba(139,92,246,0.5)",
              }}
            >
              BattleZone
            </div>
          </div>
          <div
            className="font-mono text-sm tracking-[0.3em] font-bold mb-4"
            style={{ color: "#39ff14" }}
          >
            ADMIN PORTAL
          </div>
          <h2
            className="font-display text-2xl font-bold"
            style={{ color: "#e2e8f0" }}
          >
            Admin Access Only
          </h2>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Restricted area -- authorized personnel only
          </p>
        </div>

        {/* Form Card */}
        <div
          className="rounded-xl p-6"
          style={{
            background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(139,92,246,0.25)",
            boxShadow: "0 0 30px rgba(139,92,246,0.08)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="admin-email"
                className="text-sm font-medium"
                style={{ color: "#94a3b8" }}
              >
                Admin Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-ocid="admin_login.email.input"
                autoComplete="email"
                className="h-11"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  color: "#e2e8f0",
                }}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                className="text-sm font-medium"
                style={{ color: "#94a3b8" }}
              >
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-ocid="admin_login.password.input"
                autoComplete="current-password"
                className="h-11"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  color: "#e2e8f0",
                }}
              />
            </div>

            {error && (
              <Alert
                variant="destructive"
                data-ocid="admin_login.error_state"
                style={{
                  background: "rgba(255,68,68,0.08)",
                  border: "1px solid rgba(255,68,68,0.3)",
                }}
              >
                <AlertCircle className="w-4 h-4" />
                <AlertDescription style={{ color: "#ff4444" }}>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              data-ocid="admin_login.submit_button"
              className="w-full h-11 font-bold text-sm tracking-wide transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(139,92,246,0.15))",
                border: "1px solid rgba(139,92,246,0.6)",
                color: "#8b5cf6",
                boxShadow: "0 0 10px rgba(139,92,246,0.2)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "ACCESS ADMIN PANEL"
              )}
            </Button>
          </form>
        </div>

        <div className="text-center mt-4 text-xs" style={{ color: "#374151" }}>
          <p>Authorized personnel only. All activity is monitored.</p>
        </div>
      </div>
    </div>
  );
}
