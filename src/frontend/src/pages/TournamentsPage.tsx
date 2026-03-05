import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Swords } from "lucide-react";
import { useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { TournamentCard } from "../components/shared/TournamentCard";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import type { TournamentStatus } from "../types";

export function TournamentsPage() {
  const { tournaments } = useData();
  const { session } = useAuth();
  const [filter, setFilter] = useState<TournamentStatus>("upcoming");

  const filtered = tournaments.filter((t) => t.status === filter);

  // Sort: by date ascending
  const sorted = [...filtered].sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
  );

  const counts = {
    upcoming: tournaments.filter((t) => t.status === "upcoming").length,
    live: tournaments.filter((t) => t.status === "live").length,
    completed: tournaments.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Swords className="w-6 h-6" style={{ color: "#00f5ff" }} />
            <h1
              className="font-display font-black text-3xl"
              style={{ color: "#e2e8f0" }}
            >
              Tournaments
            </h1>
          </div>
          <p className="text-sm" style={{ color: "#64748b" }}>
            Browse and join Free Fire skill-based competitions
          </p>
        </div>

        {/* Filter Tabs */}
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as TournamentStatus)}
          className="w-full"
        >
          <TabsList
            className="mb-6 p-1 h-auto gap-1"
            style={{
              background: "rgba(13,13,26,0.9)",
              border: "1px solid rgba(0,245,255,0.15)",
            }}
          >
            {(
              [
                { value: "live", label: "LIVE" },
                { value: "upcoming", label: "UPCOMING" },
                { value: "completed", label: "COMPLETED" },
              ] as const
            ).map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                data-ocid={`tournaments.${value}.tab`}
                className="font-mono text-xs font-bold tracking-wider px-3 py-2 data-[state=active]:text-background transition-all"
                style={{
                  color: "#64748b",
                }}
              >
                {label}{" "}
                <span
                  className="ml-1 text-xs opacity-60"
                  style={{ fontFamily: "inherit" }}
                >
                  ({counts[value]})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={filter} className="mt-0">
            {sorted.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-20 rounded-xl"
                style={{
                  background: "rgba(13,13,26,0.6)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                data-ocid="tournaments.empty_state"
              >
                <Swords
                  className="w-12 h-12 mb-3 opacity-20"
                  style={{ color: "#64748b" }}
                />
                <p
                  className="font-display text-lg font-bold"
                  style={{ color: "#475569" }}
                >
                  No tournaments found
                </p>
                <p className="text-sm mt-1" style={{ color: "#374151" }}>
                  Check back soon for new competitions
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sorted.map((tournament, idx) => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    currentUserId={session?.userId}
                    index={idx + 1}
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
