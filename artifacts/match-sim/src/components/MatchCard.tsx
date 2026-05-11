import { useState, useEffect } from "react";
import { Match } from "@/data/matches";
import { runSimulation, getImpliedProbabilities, SimulationResult } from "@/lib/simulation";

interface MatchCardProps {
  match: Match;
  onResult?: (matchId: number, result: SimulationResult) => void;
}

function PctBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
      <div
        className={`h-1.5 rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
      <span className="text-xs text-white/50">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

// Stagger simulations so not all 35+ fire at once
let globalSimQueue = 0;

export default function MatchCard({ match, onResult }: MatchCardProps) {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const implied = getImpliedProbabilities(match.odds);

  useEffect(() => {
    const delay = (globalSimQueue++ % 9) * 200;
    setRunning(true);
    const timer = setTimeout(() => {
      const sim = runSimulation(match.odds, 30000);
      setResult(sim);
      setRunning(false);
      onResult?.(match.id, sim);
    }, delay + 60);
    return () => clearTimeout(timer);
  }, [match.id]);

  const recommendation = (() => {
    if (!result) return null;
    const { homeWinPct, drawPct, awayWinPct } = result;
    const highestPct = Math.max(homeWinPct, drawPct, awayWinPct);
    if (homeWinPct === highestPct) return { label: `${match.home} Win`, pct: homeWinPct, odds: match.odds.home };
    if (awayWinPct === highestPct) return { label: `${match.away} Win`, pct: awayWinPct, odds: match.odds.away };
    return { label: "Draw", pct: drawPct, odds: match.odds.draw };
  })();

  const valueAlert = (() => {
    if (!result) return null;
    const simH = result.homeWinPct / 100;
    const simA = result.awayWinPct / 100;
    const impH = implied.home;
    const impA = implied.away;
    const edgeH = simH - impH;
    const edgeA = simA - impA;
    if (edgeH > 0.06) return { label: `${match.home} Win`, edge: edgeH, odds: match.odds.home };
    if (edgeA > 0.06) return { label: `${match.away} Win`, edge: edgeA, odds: match.odds.away };
    return null;
  })();

  return (
    <div className="bg-[#0f1923] rounded-xl border border-white/8 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d2137] to-[#0f1923] px-4 py-3 border-b border-white/8">
        <div className="flex items-center justify-between gap-2">
          <span className="text-white font-bold text-sm leading-tight flex-1 text-left">{match.home}</span>
          <span className="text-white/30 text-xs font-medium shrink-0">vs</span>
          <span className="text-white font-bold text-sm leading-tight flex-1 text-right">{match.away}</span>
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-white/35">1 {match.odds.home.toFixed(2)}</span>
          <span className="text-[11px] text-white/35">X {match.odds.draw.toFixed(2)}</span>
          <span className="text-[11px] text-white/35">2 {match.odds.away.toFixed(2)}</span>
        </div>
      </div>

      {running && (
        <div className="flex items-center justify-center gap-2 py-5">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-white/30 text-xs">Simulating…</span>
        </div>
      )}

      {!running && result && (
        <div className="p-4 space-y-4">
          {/* Value Alert */}
          {valueAlert && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 flex items-center gap-2">
              <span className="text-amber-400 text-[10px] font-semibold uppercase tracking-wide">Value</span>
              <span className="text-white text-xs font-semibold">{valueAlert.label}</span>
              <span className="ml-auto text-amber-400 text-xs font-bold">+{(valueAlert.edge * 100).toFixed(1)}% edge</span>
            </div>
          )}

          {/* Win Probabilities */}
          <div>
            <div className="text-[9px] text-white/25 uppercase tracking-widest mb-2">Win Probability</div>
            <div className="flex gap-1.5 mb-2">
              <div className="flex-1 text-center bg-white/5 rounded-lg py-2.5">
                <div className="text-xl font-black text-white">{result.homeWinPct.toFixed(1)}%</div>
                <div className="text-[9px] text-white/25 mt-0.5 truncate px-1">{match.home}</div>
              </div>
              <div className="flex-1 text-center bg-white/5 rounded-lg py-2.5">
                <div className="text-xl font-black text-white/50">{result.drawPct.toFixed(1)}%</div>
                <div className="text-[9px] text-white/25 mt-0.5">Draw</div>
              </div>
              <div className="flex-1 text-center bg-white/5 rounded-lg py-2.5">
                <div className="text-xl font-black text-white">{result.awayWinPct.toFixed(1)}%</div>
                <div className="text-[9px] text-white/25 mt-0.5 truncate px-1">{match.away}</div>
              </div>
            </div>
            <div className="flex gap-0.5 h-1.5">
              <div className="bg-emerald-500 rounded-l-full" style={{ width: `${result.homeWinPct}%` }} />
              <div className="bg-white/25" style={{ width: `${result.drawPct}%` }} />
              <div className="bg-blue-400 rounded-r-full" style={{ width: `${result.awayWinPct}%` }} />
            </div>
          </div>

          {/* xG + Top scorelines in one row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[9px] text-white/25 uppercase tracking-widest mb-1.5">Expected Goals</div>
              <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                <div className="text-center">
                  <div className="text-lg font-black text-emerald-400">{result.avgHomeGoals.toFixed(2)}</div>
                  <div className="text-[9px] text-white/25">Home</div>
                </div>
                <div className="text-white/20 font-bold text-xs">:</div>
                <div className="text-center">
                  <div className="text-lg font-black text-blue-400">{result.avgAwayGoals.toFixed(2)}</div>
                  <div className="text-[9px] text-white/25">Away</div>
                </div>
              </div>
              <div className="text-center text-[9px] text-white/25 mt-1">Avg total {result.avgTotalGoals.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[9px] text-white/25 uppercase tracking-widest mb-1.5">Top Scorelines</div>
              <div className="grid grid-cols-2 gap-1">
                {result.topScorelines.slice(0, 4).map((s) => (
                  <div key={s.score} className="bg-white/5 rounded py-1 text-center">
                    <div className="text-xs font-bold text-white">{s.score}</div>
                    <div className="text-[8px] text-white/25">{s.pct.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sim Pick */}
          {recommendation && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 flex items-center justify-between">
              <div>
                <div className="text-[9px] text-emerald-400/60 uppercase tracking-widest">Sim Pick</div>
                <div className="text-white font-bold text-sm">{recommendation.label}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-white/25">Sim Prob</div>
                <div className="text-emerald-400 font-black text-lg">{recommendation.pct.toFixed(1)}%</div>
              </div>
            </div>
          )}

          {/* Toggle expanded */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-center text-xs text-white/25 hover:text-white/50 transition-colors"
          >
            {expanded ? "Show less ↑" : "More stats ↓"}
          </button>

          {expanded && (
            <div className="space-y-3 border-t border-white/8 pt-3">
              <div>
                <div className="text-[9px] text-white/25 uppercase tracking-widest mb-2">Goals Markets</div>
                <div className="space-y-1.5">
                  {[
                    { label: "Over 1.5", val: result.over15, color: "bg-emerald-400" },
                    { label: "Over 2.5", val: result.over25, color: "bg-emerald-400" },
                    { label: "Over 3.5", val: result.over35, color: "bg-amber-400" },
                    { label: "BTTS", val: result.btts, color: "bg-blue-400" },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between items-center gap-3">
                      <span className="text-xs text-white/50 w-16 shrink-0">{r.label}</span>
                      <PctBar value={r.val} color={r.color} />
                      <span className="text-xs text-white font-semibold w-10 text-right shrink-0">{r.val.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[9px] text-white/25 uppercase tracking-widest mb-1">Clean Sheets & Win to Nil</div>
                <Stat label={`${match.home} Clean Sheet`} value={`${result.cleanSheetHome.toFixed(1)}%`} />
                <Stat label={`${match.away} Clean Sheet`} value={`${result.cleanSheetAway.toFixed(1)}%`} />
                <Stat label={`${match.home} Win to Nil`} value={`${result.homeWinToNil.toFixed(1)}%`} />
                <Stat label={`${match.away} Win to Nil`} value={`${result.awayWinToNil.toFixed(1)}%`} />
              </div>

              <div>
                <div className="text-[9px] text-white/25 uppercase tracking-widest mb-2">Half Time</div>
                <div className="flex gap-1.5">
                  {[
                    { label: "Home", val: result.halfTimeLeads.home },
                    { label: "Draw", val: result.halfTimeLeads.draw },
                    { label: "Away", val: result.halfTimeLeads.away },
                  ].map((r) => (
                    <div key={r.label} className="flex-1 bg-white/5 rounded-lg py-1.5 text-center">
                      <div className="text-xs font-bold text-white">{r.val.toFixed(1)}%</div>
                      <div className="text-[8px] text-white/25 mt-0.5">{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[9px] text-white/25 uppercase tracking-widest mb-2">Goals Distribution</div>
                <div className="flex items-end gap-1 h-12">
                  {result.goalDistribution.map((g) => (
                    <div key={g.goals} className="flex-1 flex flex-col items-center gap-0.5">
                      <div
                        className="w-full bg-emerald-500/50 rounded-t"
                        style={{ height: `${(g.pct / Math.max(...result.goalDistribution.map((x) => x.pct))) * 40}px` }}
                      />
                      <span className="text-[8px] text-white/25">{g.goals}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[9px] text-white/15 pt-1 border-t border-white/5">
                Poisson model · xG {result.lambdaHome.toFixed(2)}:{result.lambdaAway.toFixed(2)} · 30k sims · Overround {implied.overround.toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
