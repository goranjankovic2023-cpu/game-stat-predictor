import { useState, useCallback } from "react";
import { matches } from "@/data/matches";
import MatchCard from "@/components/MatchCard";
import AccaBuilder from "@/components/AccaBuilder";
import { SimulationResult } from "@/lib/simulation";

type DayFilter = "all" | "saturday" | "sunday";
type LeagueFilter = string;

const LEAGUE_ORDER = [
  "Bundesliga",
  "1. Liga",
  "Premier League",
  "Serie A",
  "La Liga",
  "Eredivisie",
];

export default function Home() {
  const [results, setResults] = useState<Record<number, SimulationResult>>({});
  const [dayFilter, setDayFilter] = useState<DayFilter>("all");
  const [leagueFilter, setLeagueFilter] = useState<LeagueFilter>("all");

  const handleResult = useCallback((matchId: number, result: SimulationResult) => {
    setResults((prev) => ({ ...prev, [matchId]: result }));
  }, []);

  const allLeagues = LEAGUE_ORDER.filter((l) => matches.some((m) => m.leagueShort === l));

  const filtered = matches.filter((m) => {
    if (dayFilter !== "all" && m.day !== dayFilter) return false;
    if (leagueFilter !== "all" && m.leagueShort !== leagueFilter) return false;
    return true;
  });

  // Group by league for display
  const grouped: Record<string, typeof filtered> = {};
  for (const m of filtered) {
    if (!grouped[m.leagueShort]) grouped[m.leagueShort] = [];
    grouped[m.leagueShort].push(m);
  }

  const groupKeys = LEAGUE_ORDER.filter((l) => grouped[l]?.length);

  const totalCount = filtered.length;
  const simCount = filtered.filter((m) => results[m.id]).length;

  return (
    <div className="min-h-screen bg-[#080f17] flex flex-col">
      {/* Header */}
      <div className="bg-[#0d1e2e] border-b border-white/8 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-black text-base leading-none">Match Simulator</h1>
            <p className="text-white/30 text-[10px] mt-0.5">
              Monte Carlo · Poisson · {simCount}/{totalCount} simulated
            </p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-emerald-400 text-[10px] font-semibold uppercase tracking-widest">{totalCount} Matches</div>
            <div className="text-white/30 text-[10px]">16–17 May 2026</div>
          </div>
        </div>

        {/* Day tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          {(["all", "saturday", "sunday"] as DayFilter[]).map((d) => {
            const label = d === "all" ? "All" : d === "saturday" ? "Sat 16.05" : "Sun 17.05";
            const count = d === "all" ? matches.length : matches.filter((m) => m.day === d).length;
            return (
              <button
                key={d}
                onClick={() => { setDayFilter(d); setLeagueFilter("all"); }}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
                  dayFilter === d
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 text-white/40 hover:text-white/70"
                }`}
              >
                {label}
                <span className={`ml-1 text-[10px] ${dayFilter === d ? "text-white/70" : "text-white/20"}`}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* League filter pills */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setLeagueFilter("all")}
            className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
              leagueFilter === "all" ? "bg-white/15 text-white" : "bg-white/5 text-white/40 hover:text-white/60"
            }`}
          >
            All Leagues
          </button>
          {allLeagues
            .filter((l) => dayFilter === "all" || matches.some((m) => m.leagueShort === l && m.day === dayFilter))
            .map((l) => {
              const flag = matches.find((m) => m.leagueShort === l)?.flag ?? "";
              return (
                <button
                  key={l}
                  onClick={() => setLeagueFilter(l)}
                  className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                    leagueFilter === l ? "bg-white/15 text-white" : "bg-white/5 text-white/40 hover:text-white/60"
                  }`}
                >
                  {flag} {l}
                </button>
              );
            })}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-2">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-2">
          <div className="bg-amber-500/8 border border-amber-500/15 rounded-xl px-4 py-2.5 flex items-start gap-2">
            <svg className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-amber-400/70 text-[10px] leading-relaxed">
              Predictions use a Poisson Monte Carlo model seeded from bookmaker odds. Odds shown are indicative — verify live lines before placing bets. For informational purposes only.
            </p>
          </div>
        </div>

        {/* Grouped match cards */}
        <div className="max-w-2xl mx-auto px-4 py-3 space-y-6 pb-4">
          {groupKeys.map((league) => {
            const leagueMatches = grouped[league];
            const sample = leagueMatches[0];
            return (
              <div key={league}>
                {/* League header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base leading-none">{sample.flag}</span>
                  <div>
                    <div className="text-white text-xs font-bold">{sample.league}</div>
                    <div className="text-white/30 text-[10px]">{sample.date} · {sample.time}</div>
                  </div>
                  <div className="ml-auto bg-white/5 rounded-full px-2 py-0.5 text-[10px] text-white/30">
                    {leagueMatches.length} matches
                  </div>
                </div>
                <div className="space-y-3">
                  {leagueMatches.map((match) => (
                    <MatchCard key={match.id} match={match} onResult={handleResult} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Accumulator Builder */}
      <AccaBuilder results={results} />
    </div>
  );
}
