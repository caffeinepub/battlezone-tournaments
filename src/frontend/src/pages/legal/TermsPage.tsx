import { Link } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";

export function TermsPage() {
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#080810" }}>
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          data-ocid="terms.back.link"
          className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-80 transition-opacity"
          style={{ color: "#64748b" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-6 h-6" style={{ color: "#00f5ff" }} />
          <h1
            className="font-display font-black text-3xl"
            style={{ color: "#e2e8f0" }}
          >
            Terms & Conditions
          </h1>
        </div>

        <div
          className="rounded-xl p-8 space-y-6 text-sm leading-relaxed"
          style={{
            background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(0,245,255,0.1)",
            color: "#94a3b8",
          }}
        >
          <div
            className="p-4 rounded-lg"
            style={{
              background: "rgba(255,68,68,0.06)",
              border: "1px solid rgba(255,68,68,0.2)",
            }}
          >
            <p className="font-bold" style={{ color: "#ff4444" }}>
              ⚠️ DISCLAIMER: This website is NOT affiliated with, endorsed by, or
              connected to Garena Free Fire or its developers. Free Fire is a
              trademark of Garena. All game references are for identification
              purposes only.
            </p>
          </div>

          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using BattleZone Tournaments ("Platform"), you
              agree to be bound by these Terms and Conditions. If you disagree
              with any part of these terms, you may not access the Platform.
            </p>
          </section>

          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              2. Age Restriction
            </h2>
            <p>
              You must be at least{" "}
              <strong className="text-foreground">14 years of age</strong> to
              participate in any activity on this Platform. By creating an
              account, you represent and warrant that you meet this age
              requirement. We reserve the right to terminate accounts found in
              violation.
            </p>
          </section>

          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              3. Skill-Based Competitions
            </h2>
            <p>
              All tournaments hosted on BattleZone are{" "}
              <strong className="text-foreground">
                skill-based competitions
              </strong>
              . Results are determined solely by player performance and skill in
              the game. Participation is voluntary. Entry fees are paid for the
              opportunity to compete, and prizes are awarded based on
              competitive outcomes.
            </p>
          </section>

          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              4. Coin System & Payments
            </h2>
            <p className="mb-2">
              The Platform uses a virtual coin system for tournament
              participation. Coins can be acquired through the UPI payment
              system after admin verification. Coins have no cash value outside
              the Platform.
            </p>
            <p>
              All payment requests are verified manually by administrators.
              Duplicate UTR numbers will be rejected. Fraudulent payment
              submissions may result in account suspension.
            </p>
          </section>

          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              5. Withdrawals
            </h2>
            <p>
              Withdrawal requests are subject to admin approval and may take up
              to 24-48 hours to process. The Platform reserves the right to
              reject withdrawal requests if there is suspected fraudulent
              activity.
            </p>
          </section>

          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              6. Account Conduct
            </h2>
            <p>
              Users must not engage in cheating, exploiting, or any form of
              misconduct during tournaments. Accounts found violating conduct
              rules may be suspended or permanently banned without notice.
            </p>
          </section>

          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              7. Platform Liability
            </h2>
            <p>
              BattleZone Tournaments is not responsible for technical issues,
              server downtime, or circumstances beyond our control that may
              affect tournament outcomes. We reserve the right to cancel,
              postpone, or reschedule tournaments at any time.
            </p>
          </section>

          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              8. Modifications
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Continued
              use of the Platform following any changes constitutes acceptance
              of the revised terms.
            </p>
          </section>

          <p
            className="text-xs pt-4 border-t"
            style={{ borderColor: "rgba(255,255,255,0.06)", color: "#475569" }}
          >
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
