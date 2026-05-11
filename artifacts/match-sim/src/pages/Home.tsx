import { useState, useCallback, useRef, useEffect } from "react";
import { matches, SPORTS, getDateRange, formatDate, leaguesForSport } from "@/data/matches";
import { SimulationResult } from "@/lib/simulation";
import type { Sport } from "@/lib/simulation";
import MatchCard from "@/components/MatchCard";
import AccaBuilder from "@/components/AccaBuilder";
import DayStats from "@/components/DayStats";
import HotThisWeek from "@/components/HotThisWeek";

const DATES = getDateRange();

export default function Home() {
  const [results, setResults] = useState<Record<number, SimulationResult>>({});
  const [activeSport, setActiveSport] = useState<Sport>("football");
  const [activeDate, setActiveDate] = useState<string>(DATES[4]); // May 16
  const [activeLeague, setActiveLeague] = useState<string>("All");
  const [showDayStats, setShowDayStats] = useState(false);
  const [showHot, setShowHot] = useState(false);
  const dateStripRef = useRef<HTMLDivElement>(null);

  const handleResult = useCallback((matchId: number, result: SimulationResult) => {
    setResults((prev) => ({ ...prev, [matchId]: result }));
  }, []);

  // Scroll active date pill into view
  useEffect(() => {
    const strip = dateStripRef.current;
    if (!strip) return;
    const idx = DATES.indexOf(activeDate);
    const btn = strip.children[idx] as HTMLElement | undefined;
    btn?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeDate]);

  const leagues = ["All", ...leaguesForSport(activeSport)];
  // Reset league when it disappears after sport change
  const safeleague = leagues.includes(activeLeague) ? activeLeague : "All";

  const filteredMatches = matches.filter(
    (m) =>
      m.sport === activeSport &&
      m.date === activeDate &&
      (safeleague === "All" || m.leagueShort === safeleague)
  );

  const simCount = Object.keys(results).length;
  const totalCount = matches.length;

  const sportColor: Record<string, string> = {
    football:   "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
    basketball: "bg-orange-500/20 border-orange-500/40 text-orange-400",
    handball:   "bg-blue-500/20 border-blue-500/40 text-blue-400",
    volleyball: "bg-purple-500/20 border-purple-500/40 text-purple-400",
  };

  return (
    <div className="min-h-screen bg-[#080f17] text-white">
      {/* ── Sticky header ──────────────────────────────────────── */}
      <div className="bg-[#0d1e2e] border-b border-white/8 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4">

          {/* Title + action buttons */}
          <div className="flex items-center justify-between py-3">
            <div>
              <h1 className="text-base font-black text-white tracking-tight leading-none">Match Simulator</h1>
              <div className="text-[10px] text-white/25 mt-1">
                {simCount}/{totalCount} simulated · Poisson / Monte Carlo
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowHot((v) => !v); setShowDayStats(false); }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                  showHot
                    ? "bg-amber-500/25 border-amber-500/50 text-amber-400"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/15"
                }`}
              >
                🔥 <span className="hidden sm:inline">Hot Week</span>
              </button>
              <button
                onClick={() => { setShowDayStats((v) => !v); setShowHot(false); }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                  showDayStats
                    ? "bg-emerald-500/25 border-emerald-500/40 text-emerald-400"
                    : "bg-white/8 border-white/12 text-white/40 hover:text-white hover:bg-white/12"
                }`}
              >
                📊 <span className="hidden sm:inline">Stats</span>
              </button>
            </div>
          </div>

          {/* Sport tabs */}
          <div className="flex gap-1.5 pb-3">
            {SPORTS.map((s) => {
              const dayCount = matches.filter((m) => m.sport === s.key && m.date === activeDate).length;
              const isActive = activeSport === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => { setActiveSport(s.key); setActiveLeague("All"); }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    isActive ? sportColor[s.key] : "bg-white/5 border-white/8 text-white/40 hover:text-white/70"
                  }`}
                >
                  <span>{s.emoji}</span>
                  <span className="hidden xs:inline">{s.label}</span>
                  {dayCount > 0 && (
                    <span className={`text-[9px] font-black rounded-full px-1 ${isActive ? "bg-white/20 text-white" : "bg-white/8 text-white/30"}`}>
                      {dayCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date strip */}
        <div ref={dateStripRef} className="flex gap-1.5 overflow-x-auto scrollbar-hide px-4 pb-3 max-w-2xl mx-auto">
          {DATES.map((date) => {
            const fmt = formatDate(date);
            const cnt = matches.filter((m) => m.sport === activeSport && m.date === date).length;
            const active = activeDate === date;
            return (
              <button
                key={date}
                onClick={() => setActiveDate(date)}
                className={`shrink-0 flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl border text-center min-w-[46px] transition-all ${
                  active
                    ? "bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20"
                    : cnt > 0
                    ? "bg-white/8 border-white/12 text-white/60 hover:bg-white/12"
                    : "bg-white/3 border-white/5 text-white/15"
                }`}
              >
                <span className={`text-[8px] uppercase tracking-widest font-semibold ${active ? "text-emerald-100" : "text-white/40"}`}>{fmt.day}</span>
                <span className={`text-sm font-black leading-tight ${active ? "text-white" : ""}`}>{fmt.short.split(" ")[0]}</span>
                <span className={`text-[9px] ${active ? "text-emerald-100/70" : "text-white/30"}`}>{fmt.short.split(" ")[1]}</span>
                {cnt > 0 && (
                  <span className={`text-[8px] font-bold mt-0.5 ${active ? "text-emerald-100" : "text-white/25"}`}>{cnt}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* League filter pills */}
        {leagues.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide px-4 pb-3 max-w-2xl mx-auto">
            {leagues.map((lg) => {
              const flag = lg === "All" ? "" : (matches.find((m) => m.leagueShort === lg)?.flag ?? "");
              return (
                <button
                  key={lg}
                  onClick={() => setActiveLeague(lg)}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors ${
                    safeleague === lg
                      ? "bg-white/20 border-white/30 text-white"
                      : "bg-white/5 border-white/8 text-white/35 hover:text-white/60"
                  }`}
                >
                  {flag && <span className="mr-1">{flag}</span>}{lg}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 pb-28">

        {/* Hot This Week */}
        {showHot && (
          <HotThisWeek results={results} onClose={() => setShowHot(false)} />
        )}

        {/* Day Stats */}
        {showDayStats && (
          <DayStats date={activeDate} results={results} onClose={() => setShowDayStats(false)} />
        )}

        {/* Disclaimer */}
        <div className="bg-amber-500/8 border border-amber-500/15 rounded-xl px-3 py-2 flex items-start gap-2">
          <span className="text-amber-400 text-sm shrink-0">ℹ️</span>
          <p className="text-amber-400/60 text-[10px] leading-relaxed">
            Poisson Monte Carlo model seeded from bookmaker odds. For informational purposes only — verify live odds before placing bets.
          </p>
        </div>

        {/* Match cards */}
        {filteredMatches.length > 0 ? (
          <>
            <div className="text-[9px] text-white/20 uppercase tracking-widest flex items-center gap-2">
              <span>{formatDate(activeDate).long}</span>
              <span>·</span>
              <span>{filteredMatches.length} match{filteredMatches.length !== 1 ? "es" : ""}</span>
              {safeleague !== "All" && <><span>·</span><span>{safeleague}</span></>}
            </div>
            <div className="space-y-4">
              {filteredMatches.map((match, idx) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onResult={handleResult}
                  delay={idx * 120}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">{SPORTS.find((s) => s.key === activeSport)?.emoji}</div>
            <div className="text-white/30 text-sm font-semibold mb-1">No matches on this day</div>
            <div className="text-white/15 text-xs mb-4">Try another date or sport</div>
            <div className="flex flex-wrap justify-center gap-2">
              {DATES.filter((d) => matches.some((m) => m.sport === activeSport && m.date === d)).map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDate(d)}
                  className="px-3 py-1.5 bg-white/8 border border-white/12 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/12 transition-colors"
                >
                  {formatDate(d).short}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Background simulation progress */}
        {simCount < totalCount && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-[9px] text-white/15 mb-1">
              <span>Background simulations</span>
              <span>{simCount}/{totalCount}</span>
            </div>
            <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-0.5 bg-emerald-500/50 rounded-full transition-all duration-500"
                style={{ width: `${(simCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sticky accumulator */}
      <AccaBuilder results={results} />
    </div>
  );
}
