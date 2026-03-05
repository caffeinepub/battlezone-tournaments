import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { verifyPassword } from "../../lib/storage";

export function LoginPage() {
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
        setError("No account found with this email address.");
        return;
      }

      if (!verifyPassword(password, user.passwordHash)) {
        setError("Incorrect password. Please try again.");
        return;
      }

      if (user.status === "banned") {
        setError("Your account has been suspended. Please contact support.");
        return;
      }

      login(user);
      if (user.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/tournaments" });
      }
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
          <div
            className="font-display font-black text-4xl mb-1"
            style={{
              color: "#00f5ff",
              textShadow: "0 0 20px rgba(0,245,255,0.5)",
            }}
          >
            BattleZone
          </div>
          <div
            className="font-mono text-sm tracking-[0.3em] font-bold mb-4"
            style={{ color: "#39ff14" }}
          >
            TOURNAMENTS
          </div>
          <h2
            className="font-display text-2xl font-bold"
            style={{ color: "#e2e8f0" }}
          >
            Welcome Back, Warrior
          </h2>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form Card */}
        <div
          className="rounded-xl p-6"
          style={{
            background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(0,245,255,0.15)",
            boxShadow: "0 0 30px rgba(0,245,255,0.05)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ color: "#94a3b8" }}
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-ocid="login.input"
                autoComplete="email"
                className="h-11"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(0,245,255,0.2)",
                  color: "#e2e8f0",
                }}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium"
                style={{ color: "#94a3b8" }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-ocid="login.password.input"
                autoComplete="current-password"
                className="h-11"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(0,245,255,0.2)",
                  color: "#e2e8f0",
                }}
              />
            </div>

            {error && (
              <Alert
                variant="destructive"
                data-ocid="login.error_state"
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
              data-ocid="login.submit_button"
              className="w-full h-11 font-bold text-sm tracking-wide transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(0,245,255,0.1))",
                border: "1px solid rgba(0,245,255,0.5)",
                color: "#00f5ff",
                boxShadow: "0 0 10px rgba(0,245,255,0.2)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "LOGIN"
              )}
            </Button>
          </form>

          <div
            className="mt-5 pt-5 border-t text-center"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <p className="text-sm" style={{ color: "#64748b" }}>
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                data-ocid="login.register.link"
                className="font-semibold hover:underline"
                style={{ color: "#00f5ff" }}
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-4 text-xs" style={{ color: "#374151" }}>
          <p>⚠️ Not affiliated with Garena Free Fire. 14+ only.</p>
        </div>
      </div>
    </div>
  );
}
