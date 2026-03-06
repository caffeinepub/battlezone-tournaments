import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { AdminCoinAdjustments } from "./tabs/AdminCoinAdjustments";
import { AdminGiveaways } from "./tabs/AdminGiveaways";
import { AdminPayments } from "./tabs/AdminPayments";
import { AdminSettings } from "./tabs/AdminSettings";
import { AdminTournaments } from "./tabs/AdminTournaments";
import { AdminTransactionLogs } from "./tabs/AdminTransactionLogs";
import { AdminUserApprovals } from "./tabs/AdminUserApprovals";
import { AdminWithdrawals } from "./tabs/AdminWithdrawals";

const TABS = [
  { value: "approvals", label: "Users" },
  { value: "tournaments", label: "Tournaments" },
  { value: "payments", label: "Payments" },
  { value: "coins", label: "Coins" },
  { value: "withdrawals", label: "Withdrawals" },
  { value: "giveaways", label: "Giveaways" },
  { value: "logs", label: "Logs" },
  { value: "settings", label: "Settings" },
] as const;

export function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("approvals");

  useEffect(() => {
    if (!isAdmin) {
      navigate({ to: "/admin/login" });
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="w-6 h-6" style={{ color: "#8b5cf6" }} />
          <div>
            <h1
              className="font-display font-black text-3xl"
              style={{
                color: "#8b5cf6",
                textShadow: "0 0 15px rgba(139,92,246,0.4)",
              }}
            >
              Admin Panel
            </h1>
            <p className="text-xs font-mono" style={{ color: "#64748b" }}>
              BattleZone Tournaments Management
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className="mb-6 p-1 h-auto gap-1 flex-wrap"
            style={{
              background: "rgba(13,13,26,0.9)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            {TABS.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                data-ocid={`admin.${value}.tab`}
                className="font-mono text-xs font-bold tracking-wider px-3 py-2 data-[state=active]:text-background transition-all"
                style={{ color: "#64748b" }}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="approvals">
            <AdminUserApprovals />
          </TabsContent>
          <TabsContent value="tournaments">
            <AdminTournaments />
          </TabsContent>
          <TabsContent value="payments">
            <AdminPayments />
          </TabsContent>
          <TabsContent value="coins">
            <AdminCoinAdjustments />
          </TabsContent>
          <TabsContent value="withdrawals">
            <AdminWithdrawals />
          </TabsContent>
          <TabsContent value="giveaways">
            <AdminGiveaways />
          </TabsContent>
          <TabsContent value="logs">
            <AdminTransactionLogs />
          </TabsContent>
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
