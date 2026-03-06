import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import type { Giveaway } from "../types";

function GiveawayCard({
  giveaway,
  currentUserId,
}: {
  giveaway: Giveaway;
  currentUserId: string | undefined;
}) {
  const {
    getEntriesByGiveaway,
    hasUserEnteredGiveaway,
    createGiveawayEntry,
    adjustCoins,
    getUserById,
    users,
  } = useData();

  const entries = getEntriesByGiveaway(giveaway.id);
  const alreadyEntered = currentUserId
    ? hasUserEnteredGiveaway(giveaway.id, currentUserId)
    : false;

  const currentUser = currentUserId ? getUserById(currentUserId) : undefined;
  const liveUser = currentUserId
    ? users.find((u) => u.id === currentUserId)
    : undefined;
  const balance = liveUser?.coinBalance ?? currentUser?.coinBalance ?? 0;
  const isActive = giveaway.status === "active";

  const winner = giveaway.winnerId ? getUserById(giveaway.winnerId) : undefined;

  const handleEnter = () => {
    if (!currentUserId) return;
    if (balance < giveaway.entryFee) {
      toast.error(
        `Insufficient coins. You need ${giveaway.entryFee} coins to enter.`,
      );
      return;
    }
    const success = adjustCoins(
      currentUserId,
      -giveaway.entryFee,
      "entry_fee",
      `Giveaway entry: ${giveaway.name}`,
    );
    if (!success) {
      toast.error("Failed to deduct entry fee. Check your balance.");
      return;
    }
    createGiveawayEntry({ giveawayId: giveaway.id, userId: currentUserId });
    toast.success(`Entered "${giveaway.name}"! Good luck! 🎉`);
  };

  const endDate = new Date(giveaway.endDateTime);
  const now = new Date();
  const isExpired = endDate < now;

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4 transition-all"
      style={{
        background: "rgba(13,13,26,0.95)",
        border: `1px solid ${isActive ? "rgba(255,215,0,0.2)" : "rgba(255,255,255,0.06)"}`,
        boxShadow: isActive ? "0 0 20px rgba(255,215,0,0.04)" : "none",
      }}
      data-ocid="giveaway.card"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: isActive
                ? "rgba(255,215,0,0.1)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${isActive ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            <Gift
              className="w-5 h-5"
              style={{ color: isActive ? "#ffd700" : "#64748b" }}
            />
          </div>
          <div>
            <h3
              className="font-display font-black text-base leading-tight"
              style={{ color: "#e2e8f0" }}
            >
              {giveaway.name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
              {giveaway.description}
            </p>
          </div>
        </div>
        <Badge
          className="text-xs font-bold flex-shrink-0"
          style={
            isActive
              ? {
                  background: "rgba(57,255,20,0.1)",
                  border: "1px solid rgba(57,255,20,0.3)",
                  color: "#39ff14",
                }
              : {
                  background: "rgba(100,116,139,0.1)",
                  border: "1px solid rgba(100,116,139,0.3)",
                  color: "#64748b",
                }
          }
        >
          {isActive ? "ACTIVE" : "ENDED"}
        </Badge>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <div
          className="rounded-lg p-3 text-center"
          style={{
            background: "rgba(255,215,0,0.06)",
            border: "1px solid rgba(255,215,0,0.12)",
          }}
        >
          <div
            className="font-mono font-black text-lg"
            style={{ color: "#ffd700" }}
          >
            {giveaway.entryFee}
          </div>
          <div className="text-xs font-mono" style={{ color: "#64748b" }}>
            Entry Fee
          </div>
        </div>
        <div
          className="rounded-lg p-3 text-center"
          style={{
            background: "rgba(57,255,20,0.06)",
            border: "1px solid rgba(57,255,20,0.12)",
          }}
        >
          <div
            className="font-mono font-black text-lg"
            style={{ color: "#39ff14" }}
          >
            {giveaway.prizeCoins.toLocaleString()}
          </div>
          <div className="text-xs font-mono" style={{ color: "#64748b" }}>
            Prize Coins
          </div>
        </div>
        <div
          className="rounded-lg p-3 text-center"
          style={{
            background: "rgba(0,245,255,0.06)",
            border: "1px solid rgba(0,245,255,0.12)",
          }}
        >
          <div
            className="font-mono font-black text-lg flex items-center justify-center gap-1"
            style={{ color: "#00f5ff" }}
          >
            <Users className="w-4 h-4" />
            {entries.length}
          </div>
          <div className="text-xs font-mono" style={{ color: "#64748b" }}>
            Entries
          </div>
        </div>
      </div>

      {/* End date */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono" style={{ color: "#64748b" }}>
          {isActive ? "Ends:" : "Ended:"}
        </span>
        <span
          className="text-xs font-mono font-bold"
          style={{ color: isExpired ? "#64748b" : "#94a3b8" }}
        >
          {endDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Action */}
      {isActive && (
        <div>
          {alreadyEntered ? (
            <div
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm"
              style={{
                background: "rgba(57,255,20,0.08)",
                border: "1px solid rgba(57,255,20,0.25)",
                color: "#39ff14",
              }}
              data-ocid="giveaway.entered.success_state"
            >
              <Trophy className="w-4 h-4" />
              Entered ✓
            </div>
          ) : (
            <Button
              onClick={handleEnter}
              disabled={!currentUserId}
              data-ocid="giveaway.enter.primary_button"
              className="w-full font-bold text-sm py-2.5 h-auto transition-all hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.1))",
                border: "1px solid rgba(255,215,0,0.4)",
                color: "#ffd700",
                boxShadow: "0 0 15px rgba(255,215,0,0.1)",
              }}
            >
              <Gift className="w-4 h-4 mr-2" />
              Enter ({giveaway.entryFee} coins)
            </Button>
          )}
        </div>
      )}

      {/* Winner section */}
      {!isActive && giveaway.winnerId && (
        <div
          className="rounded-lg p-4"
          style={{
            background: "rgba(255,215,0,0.06)",
            border: "1px solid rgba(255,215,0,0.2)",
          }}
          data-ocid="giveaway.winner.section"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4" style={{ color: "#ffd700" }} />
            <span
              className="text-xs font-bold font-mono uppercase tracking-wider"
              style={{ color: "#ffd700" }}
            >
              Winner Picked!
            </span>
          </div>
          {winner ? (
            <div>
              <p className="font-bold" style={{ color: "#e2e8f0" }}>
                {winner.inGameName}
              </p>
              <p
                className="text-xs font-mono mt-0.5"
                style={{ color: "#64748b" }}
              >
                FF UID: {winner.freeFireUID}
              </p>
            </div>
          ) : (
            <p className="text-xs" style={{ color: "#64748b" }}>
              Winner details unavailable
            </p>
          )}
          {giveaway.winnerPickedAt && (
            <p className="text-xs font-mono mt-2" style={{ color: "#475569" }}>
              Picked on{" "}
              {new Date(giveaway.winnerPickedAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      )}

      {!isActive && !giveaway.winnerId && (
        <div
          className="rounded-lg p-3 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <p className="text-xs" style={{ color: "#475569" }}>
            Giveaway ended — no winner was picked
          </p>
        </div>
      )}
    </div>
  );
}

export function GiveawayPage() {
  const { giveaways } = useData();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<"active" | "ended">("active");

  const activeGiveaways = giveaways
    .filter((g) => g.status === "active")
    .sort(
      (a, b) =>
        new Date(a.endDateTime).getTime() - new Date(b.endDateTime).getTime(),
    );

  const endedGiveaways = giveaways
    .filter((g) => g.status === "ended")
    .sort(
      (a, b) =>
        new Date(b.endDateTime).getTime() - new Date(a.endDateTime).getTime(),
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(255,215,0,0.1)",
                border: "1px solid rgba(255,215,0,0.3)",
                boxShadow: "0 0 15px rgba(255,215,0,0.1)",
              }}
            >
              <Gift className="w-5 h-5" style={{ color: "#ffd700" }} />
            </div>
            <div>
              <h1
                className="font-display font-black text-3xl"
                style={{
                  color: "#ffd700",
                  textShadow: "0 0 20px rgba(255,215,0,0.3)",
                }}
              >
                Giveaways
              </h1>
              <p className="text-sm" style={{ color: "#64748b" }}>
                Enter giveaways with coins for a chance to win big prizes
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 mt-4">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold"
              style={{
                background: "rgba(57,255,20,0.06)",
                border: "1px solid rgba(57,255,20,0.2)",
                color: "#39ff14",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {activeGiveaways.length} Active
            </div>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold"
              style={{
                background: "rgba(100,116,139,0.06)",
                border: "1px solid rgba(100,116,139,0.2)",
                color: "#64748b",
              }}
            >
              {endedGiveaways.length} Ended
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "active" | "ended")}
          className="w-full"
        >
          <TabsList
            className="mb-6 p-1 h-auto gap-1"
            style={{
              background: "rgba(13,13,26,0.9)",
              border: "1px solid rgba(255,215,0,0.12)",
            }}
          >
            <TabsTrigger
              value="active"
              data-ocid="giveaway.active.tab"
              className="font-mono text-xs font-bold tracking-wider px-4 py-2 data-[state=active]:text-background transition-all"
              style={{ color: "#64748b" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block mr-2"
                style={{
                  background: activeTab === "active" ? "#39ff14" : "#64748b",
                  boxShadow:
                    activeTab === "active"
                      ? "0 0 6px rgba(57,255,20,0.6)"
                      : "none",
                }}
              />
              ACTIVE ({activeGiveaways.length})
            </TabsTrigger>
            <TabsTrigger
              value="ended"
              data-ocid="giveaway.ended.tab"
              className="font-mono text-xs font-bold tracking-wider px-4 py-2 data-[state=active]:text-background transition-all"
              style={{ color: "#64748b" }}
            >
              ENDED ({endedGiveaways.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0">
            {activeGiveaways.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-24 rounded-xl"
                style={{
                  background: "rgba(13,13,26,0.6)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                data-ocid="giveaway.active.empty_state"
              >
                <Gift
                  className="w-12 h-12 mb-3 opacity-20"
                  style={{ color: "#ffd700" }}
                />
                <p
                  className="font-display text-lg font-bold"
                  style={{ color: "#475569" }}
                >
                  No active giveaways
                </p>
                <p className="text-sm mt-1" style={{ color: "#374151" }}>
                  Check back soon — admin will post new giveaways
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeGiveaways.map((g) => (
                  <GiveawayCard
                    key={g.id}
                    giveaway={g}
                    currentUserId={session?.userId}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ended" className="mt-0">
            {endedGiveaways.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-24 rounded-xl"
                style={{
                  background: "rgba(13,13,26,0.6)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                data-ocid="giveaway.ended.empty_state"
              >
                <Trophy
                  className="w-12 h-12 mb-3 opacity-20"
                  style={{ color: "#64748b" }}
                />
                <p
                  className="font-display text-lg font-bold"
                  style={{ color: "#475569" }}
                >
                  No ended giveaways yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {endedGiveaways.map((g) => (
                  <GiveawayCard
                    key={g.id}
                    giveaway={g}
                    currentUserId={session?.userId}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
