import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { hashPassword } from "../../lib/storage";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  freeFireUID: string;
  inGameName: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  freeFireUID?: string;
  inGameName?: string;
  general?: string;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.fullName.trim()) errors.fullName = "Full name is required.";
  if (!data.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address.";
  if (!data.password) errors.password = "Password is required.";
  else if (data.password.length < 6)
    errors.password = "Password must be at least 6 characters.";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords do not match.";
  if (!data.freeFireUID.trim())
    errors.freeFireUID = "Free Fire UID is required.";
  if (!data.inGameName.trim()) errors.inGameName = "In-game name is required.";

  return errors;
}

export function RegisterPage() {
  const { createUser, getUserByEmail } = useData();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    freeFireUID: "",
    inGameName: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Check duplicate email
      if (getUserByEmail(form.email)) {
        setErrors({ general: "An account with this email already exists." });
        return;
      }

      createUser({
        email: form.email.toLowerCase(),
        passwordHash: hashPassword(form.password),
        fullName: form.fullName.trim(),
        freeFireUID: form.freeFireUID.trim(),
        inGameName: form.inGameName.trim(),
        coinBalance: 0,
        winningBalance: 0,
        status: "approved",
        role: "user",
      });

      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "#080810" }}
      >
        <div
          className="rounded-xl p-8 text-center max-w-md w-full animate-slide-up"
          style={{
            background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(57,255,20,0.3)",
            boxShadow: "0 0 30px rgba(57,255,20,0.08)",
          }}
          data-ocid="register.success_state"
        >
          <CheckCircle2
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: "#39ff14" }}
          />
          <h2
            className="font-display text-2xl font-bold mb-2"
            style={{
              color: "#39ff14",
              textShadow: "0 0 10px rgba(57,255,20,0.5)",
            }}
          >
            Account Created!
          </h2>
          <p className="text-sm mb-6" style={{ color: "#94a3b8" }}>
            Your account is ready. You can now log in and start playing.
          </p>
          <Button
            onClick={() => navigate({ to: "/auth/login" })}
            data-ocid="register.login.button"
            className="w-full h-10"
            style={{
              background: "rgba(0,245,255,0.1)",
              border: "1px solid rgba(0,245,255,0.4)",
              color: "#00f5ff",
            }}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#080810" }}
    >
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-6">
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
            Create Account
          </h2>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Join the BattleZone community
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
            {errors.general && (
              <Alert
                variant="destructive"
                data-ocid="register.error_state"
                style={{
                  background: "rgba(255,68,68,0.08)",
                  border: "1px solid rgba(255,68,68,0.3)",
                }}
              >
                <AlertCircle className="w-4 h-4" />
                <AlertDescription style={{ color: "#ff4444" }}>
                  {errors.general}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="fullName"
                  style={{ color: "#94a3b8" }}
                  className="text-sm"
                >
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  data-ocid="register.fullname.input"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.fullName && (
                  <p
                    className="text-xs"
                    style={{ color: "#ff4444" }}
                    data-ocid="register.fullname.error_state"
                  >
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  style={{ color: "#94a3b8" }}
                  className="text-sm"
                >
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  data-ocid="register.email.input"
                  autoComplete="email"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.email && (
                  <p
                    className="text-xs"
                    style={{ color: "#ff4444" }}
                    data-ocid="register.email.error_state"
                  >
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  style={{ color: "#94a3b8" }}
                  className="text-sm"
                >
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange("password")}
                  data-ocid="register.password.input"
                  autoComplete="new-password"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.password && (
                  <p
                    className="text-xs"
                    style={{ color: "#ff4444" }}
                    data-ocid="register.password.error_state"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  style={{ color: "#94a3b8" }}
                  className="text-sm"
                >
                  Confirm Password *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  data-ocid="register.confirm_password.input"
                  autoComplete="new-password"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.confirmPassword && (
                  <p
                    className="text-xs"
                    style={{ color: "#ff4444" }}
                    data-ocid="register.confirm_password.error_state"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="freeFireUID"
                  style={{ color: "#94a3b8" }}
                  className="text-sm"
                >
                  Free Fire UID *
                </Label>
                <Input
                  id="freeFireUID"
                  placeholder="e.g. 123456789"
                  value={form.freeFireUID}
                  onChange={handleChange("freeFireUID")}
                  data-ocid="register.ffuid.input"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.freeFireUID && (
                  <p
                    className="text-xs"
                    style={{ color: "#ff4444" }}
                    data-ocid="register.ffuid.error_state"
                  >
                    {errors.freeFireUID}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="inGameName"
                  style={{ color: "#94a3b8" }}
                  className="text-sm"
                >
                  In-Game Name *
                </Label>
                <Input
                  id="inGameName"
                  placeholder="Your IGN"
                  value={form.inGameName}
                  onChange={handleChange("inGameName")}
                  data-ocid="register.ign.input"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.inGameName && (
                  <p
                    className="text-xs"
                    style={{ color: "#ff4444" }}
                    data-ocid="register.ign.error_state"
                  >
                    {errors.inGameName}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              data-ocid="register.submit_button"
              className="w-full h-11 font-bold text-sm tracking-wide mt-2 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(57,255,20,0.2), rgba(57,255,20,0.1))",
                border: "1px solid rgba(57,255,20,0.5)",
                color: "#39ff14",
                boxShadow: "0 0 10px rgba(57,255,20,0.2)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "CREATE ACCOUNT"
              )}
            </Button>
          </form>

          <div
            className="mt-5 pt-5 border-t text-center"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <p className="text-sm" style={{ color: "#64748b" }}>
              Already have an account?{" "}
              <Link
                to="/auth/login"
                data-ocid="register.login.link"
                className="font-semibold hover:underline"
                style={{ color: "#00f5ff" }}
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-4 text-xs" style={{ color: "#374151" }}>
          ⚠️ Not affiliated with Garena Free Fire. 14+ only.
        </div>
      </div>
    </div>
  );
}
