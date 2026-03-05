import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Swords, Trophy } from "lucide-react";
import { useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { TournamentCard } from "../components/shared/TournamentCard";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import type { TournamentStatus } from "../types";

type MainFilter = TournamentStatus | "my";

export function TournamentsPage() {
  const { tournaments } = useData();
  const { session } = useAuth();
  const [filter, setFilter] = useState<MainFilter>("upcoming");
  const [mySubFilter, setMySubFilter] = useState<TournamentStatus>("upcoming");

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

  // My Tournaments data
  const myTournaments = tournaments.filter(
    (t) => session && t.joinedUserIds.includes(session.userId),
  );

  const mySubFiltered = myTournaments
    .filter((t) => t.status === mySubFilter)
    .sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    );

  const myCounts = {
    upcoming: myTournaments.filter((t) => t.status === "upcoming").length,
    live: myTournaments.filter((t) => t.status === "live").length,
    completed: myTournaments.filter((t) => t.status === "completed").length,
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
          onValueChange={(v) => {
            setFilter(v as MainFilter);
          }}
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

            {/* My Tournaments tab */}
            <TabsTrigger
              value="my"
              data-ocid="tournaments.my.tab"
              className="font-mono text-xs font-bold tracking-wider px-3 py-2 data-[state=active]:text-background transition-all"
              style={{ color: "#64748b" }}
            >
              <Trophy className="w-3.5 h-3.5 mr-1.5 inline-block" />
              MY TOURNAMENTS{" "}
              <span
                className="ml-1 text-xs opacity-60"
                style={{ fontFamily: "inherit" }}
              >
                ({myTournaments.length})
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Standard status tabs */}
          {(["live", "upcoming", "completed"] as const).map((status) => (
            <TabsContent key={status} value={status} className="mt-0">
              {filter !== "my" &&
                (sorted.length === 0 ? (
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
                ))}
            </TabsContent>
          ))}

          {/* My Tournaments tab */}
          <TabsContent value="my" className="mt-0">
            {myTournaments.length === 0 ? (
              /* Empty state: user hasn't joined any tournament */
              <div
                className="flex flex-col items-center justify-center py-20 rounded-xl"
                style={{
                  background: "rgba(13,13,26,0.6)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                data-ocid="tournaments.my.empty_state"
              >
                <Trophy
                  className="w-12 h-12 mb-3 opacity-20"
                  style={{ color: "#64748b" }}
                />
                <p
                  className="font-display text-lg font-bold"
                  style={{ color: "#475569" }}
                >
                  You haven't joined any tournaments yet
                </p>
                <p className="text-sm mt-1 mb-4" style={{ color: "#374151" }}>
                  Browse and join a competition to see it here
                </p>
                <button
                  type="button"
                  onClick={() => setFilter("upcoming")}
                  data-ocid="tournaments.my.primary_button"
                  className="font-mono text-xs font-bold tracking-wider px-4 py-2 rounded transition-all"
                  style={{
                    background: "rgba(0,245,255,0.1)",
                    border: "1px solid rgba(0,245,255,0.35)",
                    color: "#00f5ff",
                  }}
                >
                  BROWSE TOURNAMENTS
                </button>
              </div>
            ) : (
              /* My Tournaments sub-filter tabs */
              <div>
                {/* Sub-filter tabs */}
                <div
                  className="flex gap-1 mb-5 p-1 rounded-lg w-fit"
                  style={{
                    background: "rgba(13,13,26,0.7)",
                    border: "1px solid rgba(0,245,255,0.1)",
                  }}
                >
                  {(
                    [
                      { value: "upcoming", label: "UPCOMING" },
                      { value: "live", label: "LIVE" },
                      { value: "completed", label: "COMPLETED" },
                    ] as const
                  ).map(({ value, label }) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setMySubFilter(value)}
                      data-ocid={`tournaments.my.${value}.tab`}
                      className="font-mono text-xs font-bold tracking-wider px-3 py-1.5 rounded transition-all"
                      style={
                        mySubFilter === value
                          ? {
                              background: "rgba(0,245,255,0.15)",
                              color: "#00f5ff",
                              border: "1px solid rgba(0,245,255,0.4)",
                            }
                          : {
                              color: "#64748b",
                              border: "1px solid transparent",
                            }
                      }
                    >
                      {label}{" "}
                      <span className="ml-1 opacity-60">
                        ({myCounts[value]})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Sub-filtered tournament grid */}
                {mySubFiltered.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-16 rounded-xl"
                    style={{
                      background: "rgba(13,13,26,0.6)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    data-ocid="tournaments.my.sub.empty_state"
                  >
                    <Swords
                      className="w-10 h-10 mb-3 opacity-20"
                      style={{ color: "#64748b" }}
                    />
                    <p
                      className="font-display text-base font-bold"
                      style={{ color: "#475569" }}
                    >
                      No {mySubFilter} tournaments
                    </p>
                    <p className="text-sm mt-1" style={{ color: "#374151" }}>
                      Your joined {mySubFilter} tournaments will appear here
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {mySubFiltered.map((tournament, idx) => (
                      <TournamentCard
                        key={tournament.id}
                        tournament={tournament}
                        currentUserId={session?.userId}
                        index={idx + 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
