import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Shield, Trophy } from "lucide-react";
import { useState } from "react";
import { STORAGE_KEYS, setItem } from "../lib/storage";

export function AgeGate() {
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  const handleEnter = () => {
    if (!confirmed) return;
    setItem(STORAGE_KEYS.AGE_CONFIRMED, true);
    navigate({ to: "/auth/login" });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#080810" }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Background glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(0,245,255,0.04)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(57,255,20,0.03)" }}
      />

      <div className="relative z-10 w-full max-w-lg animate-slide-up">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl mb-6 relative">
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(57,255,20,0.08))",
                border: "2px solid rgba(0,245,255,0.4)",
                boxShadow:
                  "0 0 30px rgba(0,245,255,0.2), inset 0 0 20px rgba(0,245,255,0.05)",
              }}
            />
            <Swords
              size={36}
              style={{ color: "#00f5ff", position: "relative", zIndex: 1 }}
            />
          </div>

          <h1
            className="font-display font-black text-5xl tracking-tight mb-2"
            style={{
              color: "#00f5ff",
              textShadow:
                "0 0 20px rgba(0,245,255,0.6), 0 0 40px rgba(0,245,255,0.3)",
            }}
          >
            BattleZone
          </h1>
          <div
            className="font-mono text-base tracking-[0.3em] font-bold mb-1"
            style={{
              color: "#39ff14",
              textShadow: "0 0 10px rgba(57,255,20,0.5)",
            }}
          >
            TOURNAMENTS
          </div>
          <p className="text-sm" style={{ color: "#64748b" }}>
            For Garena Free Fire Players
          </p>
        </div>

        {/* Disclaimer Box */}
        <div
          className="rounded-xl p-5 mb-6 space-y-4"
          style={{
            background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(0,245,255,0.2)",
            boxShadow:
              "0 0 20px rgba(0,245,255,0.05), inset 0 0 20px rgba(0,245,255,0.02)",
          }}
        >
          {/* Affiliation Disclaimer */}
          <div className="flex gap-3">
            <AlertTriangle
              className="w-5 h-5 mt-0.5 shrink-0"
              style={{ color: "#ffd700" }}
            />
            <div>
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "#ffd700" }}
              >
                Affiliation Disclaimer
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#94a3b8" }}
              >
                This website is{" "}
                <strong className="text-foreground">NOT affiliated with</strong>
                , endorsed by, or connected to{" "}
                <strong className="text-foreground">Garena Free Fire</strong> or
                its developers. Free Fire is a trademark of Garena.
              </p>
            </div>
          </div>

          <div
            className="h-px"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />

          {/* Age Restriction */}
          <div className="flex gap-3">
            <Shield
              className="w-5 h-5 mt-0.5 shrink-0"
              style={{ color: "#ff4444" }}
            />
            <div>
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "#ff4444" }}
              >
                🔞 Age Restriction: 14+
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#94a3b8" }}
              >
                You must be{" "}
                <strong className="text-foreground">14 years or older</strong>{" "}
                to use this platform. By entering, you confirm you meet the
                minimum age requirement.
              </p>
            </div>
          </div>

          <div
            className="h-px"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />

          {/* Skill-based */}
          <div className="flex gap-3">
            <Trophy
              className="w-5 h-5 mt-0.5 shrink-0"
              style={{ color: "#39ff14" }}
            />
            <div>
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "#39ff14" }}
              >
                🏆 Skill-Based Contest
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#94a3b8" }}
              >
                This platform hosts{" "}
                <strong className="text-foreground">
                  skill-based competitions
                </strong>
                . Participation is voluntary. Results are determined solely by
                player skill and performance.
              </p>
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <div
          className="flex items-start gap-3 mb-6 p-4 rounded-lg"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Checkbox
            id="age-confirm"
            checked={confirmed}
            onCheckedChange={(c) => setConfirmed(c === true)}
            data-ocid="agegate.checkbox"
            className="mt-0.5"
            style={{ borderColor: confirmed ? "#00f5ff" : "#475569" }}
          />
          <Label
            htmlFor="age-confirm"
            className="text-sm leading-relaxed cursor-pointer"
            style={{ color: "#94a3b8" }}
          >
            I confirm I am{" "}
            <strong className="text-foreground">14+ years old</strong> and I
            agree to the{" "}
            <Link
              to="/legal/terms"
              className="underline transition-colors"
              style={{ color: "#00f5ff" }}
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              to="/legal/privacy"
              className="underline transition-colors"
              style={{ color: "#00f5ff" }}
            >
              Privacy Policy
            </Link>
            .
          </Label>
        </div>

        {/* Enter button */}
        <Button
          onClick={handleEnter}
          disabled={!confirmed}
          data-ocid="agegate.submit_button"
          className="w-full h-12 font-display font-bold text-base tracking-wider transition-all duration-300"
          style={
            confirmed
              ? {
                  background:
                    "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(57,255,20,0.1))",
                  border: "1px solid #00f5ff",
                  color: "#00f5ff",
                  boxShadow:
                    "0 0 15px rgba(0,245,255,0.4), 0 0 30px rgba(0,245,255,0.15)",
                }
              : {
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#475569",
                  cursor: "not-allowed",
                }
          }
        >
          ⚔️ ENTER BATTLEZONE
        </Button>

        {/* Legal links */}
        <div className="flex justify-center gap-4 mt-4">
          <Link
            to="/legal/terms"
            data-ocid="agegate.terms.link"
            className="text-xs underline transition-colors"
            style={{ color: "#475569" }}
          >
            Terms & Conditions
          </Link>
          <Link
            to="/legal/privacy"
            data-ocid="agegate.privacy.link"
            className="text-xs underline transition-colors"
            style={{ color: "#475569" }}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

// inline SVG Swords icon since lucide doesn't export it as Swords
function Swords({
  size = 24,
  style,
}: {
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-label="Swords icon"
      role="img"
    >
      <title>Swords</title>
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <line x1="19" y1="21" x2="21" y2="19" />
      <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
      <line x1="5" y1="14" x2="9" y2="18" />
      <line x1="7" y1="11" x2="11" y2="15" />
    </svg>
  );
}
