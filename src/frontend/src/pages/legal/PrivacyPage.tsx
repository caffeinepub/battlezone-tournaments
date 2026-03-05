import { Link } from "@tanstack/react-router";
import { ArrowLeft, Eye } from "lucide-react";

export function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#080810" }}>
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          data-ocid="privacy.back.link"
          className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-80 transition-opacity"
          style={{ color: "#64748b" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Eye className="w-6 h-6" style={{ color: "#00f5ff" }} />
          <h1
            className="font-display font-black text-3xl"
            style={{ color: "#e2e8f0" }}
          >
            Privacy Policy
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
          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              1. Information We Collect
            </h2>
            <p className="mb-2">
              We collect the following information when you register:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Full name and email address</li>
              <li>Free Fire UID and in-game name</li>
              <li>Payment transaction IDs (UTR numbers)</li>
              <li>UPI IDs for withdrawal requests</li>
            </ul>
          </section>

          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              2. How We Use Your Information
            </h2>
            <p className="mb-2">Your information is used to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Create and manage your account</li>
              <li>Process tournament registrations</li>
              <li>Verify UPI payment transactions</li>
              <li>Process withdrawal requests</li>
              <li>Prevent fraud and abuse</li>
            </ul>
          </section>

          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              3. Data Storage
            </h2>
            <p>
              Currently, all data is stored locally in your browser's
              localStorage. This means data is stored only on your device and is
              not transmitted to external servers beyond the Internet Computer
              canister.
            </p>
          </section>

          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              4. Data Security
            </h2>
            <p>
              We take reasonable measures to protect your information. Passwords
              are encoded and not stored in plain text. However, as this is a
              demonstration platform, we recommend not using real sensitive
              credentials.
            </p>
          </section>

          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              5. Third-Party Services
            </h2>
            <p>
              We do not share your personal information with third parties
              except as necessary to process payments (UPI ID used only for
              withdrawal processing). We are not affiliated with Garena Free
              Fire, Paytm, or any other third-party service.
            </p>
          </section>

          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              6. Your Rights
            </h2>
            <p>
              You have the right to access, modify, or request deletion of your
              personal information. Contact the platform administrator to
              exercise these rights.
            </p>
          </section>

          <section>
            <h2
              className="font-display font-bold text-lg mb-3"
              style={{ color: "#e2e8f0" }}
            >
              7. Contact
            </h2>
            <p>
              For privacy concerns, please contact the platform administrator
              through the admin contact channel.
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
