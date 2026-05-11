import { useState, useEffect } from "react";
import { Match } from "@/data/matches";
import { runSimulation, getImpliedProbabilities, SimulationResult } from "@/lib/simulation";

interface MatchCardProps {
  match: Match;
  onResult?: (matchId: number, result: SimulationResult) => void;
}

function PctBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-1.5 border-b border-white/5 last:border-0 ${highlight ? "text-emerald-400" : ""}`}>
      <span className="text-xs text-white/50">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-emerald-400" : "text-white"}`}>{value}</span>
    </div>
  );
}

export default function MatchCard({ match, onResult }: MatchCardProps) {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const implied = getImpliedProbabilities(match.odds);

  useEffect(() => {
    setRunning(true);
    const timer = setTimeout(() => {
      const sim = runSimulation(match.odds, 40000);
      setResult(sim);
      setRunning(false);
      onResult?.(match.id, sim);
    }, 50);
    return () => clearTimeout(timer);
  }, [match.id]);

  const recommendation = (() => {
    if (!result) return null;
    const { homeWinPct, drawPct, awayWinPct } = result;
    const highestPct = Math.max(homeWinPct, drawPct, awayWinPct);
    if (highestPct < 40) return null;
    if (homeWinPct === highestPct) return { label: `${match.home} to Win`, pct: homeWinPct, odds: match.odds.home };
    if (awayWinPct === highestPct) return { label: `${match.away} to Win`, pct: awayWinPct, odds: match.odds.away };
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
    <div className="bg-[#0f1923] rounded-2xl border border-white/8 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d2137] to-[#0f1923] px-5 py-4 border-b border-white/8">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-white/30 uppercase tracking-widest">{match.league}</span>
          <span className="text-[10px] text-white/30">{match.date} · {match.time}</span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <span className="text-white font-bold text-base leading-tight flex-1 text-left">{match.home}</span>
          <span className="text-white/30 text-xs font-medium shrink-0">vs</span>
          <span className="text-white font-bold text-base leading-tight flex-1 text-right">{match.away}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px] text-white/40">1 {match.odds.home.toFixed(2)}</span>
          <span className="text-[11px] text-white/40">X {match.odds.draw.toFixed(2)}</span>
          <span className="text-[11px] text-white/40">2 {match.odds.away.toFixed(2)}</span>
        </div>
      </div>

      {running && (
        <div className="flex items-center justify-center gap-2 py-8">
          <div className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-white/40 text-xs">Simulating 40,000 matches...</span>
        </div>
      )}

      {!running && result && (
        <div className="p-5 space-y-5">
          {/* Value Alert */}
          {valueAlert && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-amber-400 text-xs">Value Bet</span>
              <span className="text-white/60 text-xs">·</span>
              <span className="text-white text-xs font-semibold">{valueAlert.label}</span>
              <span className="ml-auto text-amber-400 text-xs font-bold">+{(valueAlert.edge * 100).toFixed(1)}% edge</span>
            </div>
          )}

          {/* Win Probabilities */}
          <div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Win Probability</div>
            <div className="flex gap-2 mb-3">
              <div className="flex-1 text-center bg-white/5 rounded-xl py-3">
                <div className="text-2xl font-black text-white">{result.homeWinPct.toFixed(1)}%</div>
                <div className="text-[10px] text-white/30 mt-1 truncate px-1">{match.home}</div>
              </div>
              <div className="flex-1 text-center bg-white/5 rounded-xl py-3">
                <div className="text-2xl font-black text-white/60">{result.drawPct.toFixed(1)}%</div>
                <div className="text-[10px] text-white/30 mt-1">Draw</div>
              </div>
              <div className="flex-1 text-center bg-white/5 rounded-xl py-3">
                <div className="text-2xl font-black text-white">{result.awayWinPct.toFixed(1)}%</div>
                <div className="text-[10px] text-white/30 mt-1 truncate px-1">{match.away}</div>
              </div>
            </div>
            <div className="flex gap-1 h-2">
              <div className="bg-emerald-500 rounded-l-full transition-all duration-700" style={{ width: `${result.homeWinPct}%` }} />
              <div className="bg-white/30 transition-all duration-700" style={{ width: `${result.drawPct}%` }} />
              <div className="bg-blue-400 rounded-r-full transition-all duration-700" style={{ width: `${result.awayWinPct}%` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-emerald-500">Home</span>
              <span className="text-[9px] text-white/30">Draw</span>
              <span className="text-[9px] text-blue-400">Away</span>
            </div>
          </div>

          {/* Expected Goals */}
          <div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Expected Goals</div>
            <div className="flex gap-2">
              <div className="flex-1 bg-white/5 rounded-xl py-3 text-center">
                <div className="text-3xl font-black text-emerald-400">{result.avgHomeGoals.toFixed(2)}</div>
                <div className="text-[10px] text-white/30 mt-1">xG Home</div>
              </div>
              <div className="flex items-center justify-center px-2 text-white/20 font-bold">:</div>
              <div className="flex-1 bg-white/5 rounded-xl py-3 text-center">
                <div className="text-3xl font-black text-blue-400">{result.avgAwayGoals.toFixed(2)}</div>
                <div className="text-[10px] text-white/30 mt-1">xG Away</div>
              </div>
            </div>
            <div className="text-center mt-2 text-white/40 text-xs">Avg total: <span className="text-white font-bold">{result.avgTotalGoals.toFixed(2)}</span> goals</div>
          </div>

          {/* Top Scorelines */}
          <div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Most Likely Scorelines</div>
            <div className="grid grid-cols-4 gap-2">
              {result.topScorelines.slice(0, 8).map((s) => (
                <div key={s.score} className="bg-white/5 rounded-lg py-2 px-1 text-center border border-white/5">
                  <div className="text-sm font-bold text-white">{s.score}</div>
                  <div className="text-[9px] text-white/30 mt-0.5">{s.pct.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          {recommendation && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-emerald-400/60 uppercase tracking-widest">Simulation Pick</div>
                <div className="text-white font-bold text-sm mt-0.5">{recommendation.label}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-white/30">Sim Prob</div>
                <div className="text-emerald-400 font-black text-lg">{recommendation.pct.toFixed(1)}%</div>
              </div>
            </div>
          )}

          {/* Toggle expanded */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-center text-xs text-white/30 hover:text-white/60 transition-colors py-1"
          >
            {expanded ? "Show less ↑" : "More stats ↓"}
          </button>

          {expanded && (
            <div className="space-y-4 border-t border-white/8 pt-4">
              {/* Goals Markets */}
              <div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Goals Markets</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50">Over 1.5 Goals</span>
                    <div className="flex items-center gap-2 w-40">
                      <PctBar value={result.over15} color="bg-emerald-400" />
                      <span className="text-xs text-white font-semibold w-10 text-right">{result.over15.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50">Over 2.5 Goals</span>
                    <div className="flex items-center gap-2 w-40">
                      <PctBar value={result.over25} color="bg-emerald-400" />
                      <span className="text-xs text-white font-semibold w-10 text-right">{result.over25.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50">Over 3.5 Goals</span>
                    <div className="flex items-center gap-2 w-40">
                      <PctBar value={result.over35} color="bg-amber-400" />
                      <span className="text-xs text-white font-semibold w-10 text-right">{result.over35.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50">BTTS (Both Score)</span>
                    <div className="flex items-center gap-2 w-40">
                      <PctBar value={result.btts} color="bg-blue-400" />
                      <span className="text-xs text-white font-semibold w-10 text-right">{result.btts.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean Sheets & Win to Nil */}
              <div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Clean Sheets & Win to Nil</div>
                <div className="space-y-0">
                  <Stat label={`${match.home} Clean Sheet`} value={`${result.cleanSheetHome.toFixed(1)}%`} />
                  <Stat label={`${match.away} Clean Sheet`} value={`${result.cleanSheetAway.toFixed(1)}%`} />
                  <Stat label={`${match.home} Win to Nil`} value={`${result.homeWinToNil.toFixed(1)}%`} />
                  <Stat label={`${match.away} Win to Nil`} value={`${result.awayWinToNil.toFixed(1)}%`} />
                </div>
              </div>

              {/* Half Time */}
              <div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Half Time Result</div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white/5 rounded-lg py-2 text-center">
                    <div className="text-sm font-bold text-white">{result.halfTimeLeads.home.toFixed(1)}%</div>
                    <div className="text-[9px] text-white/30 mt-0.5">Home</div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-lg py-2 text-center">
                    <div className="text-sm font-bold text-white/60">{result.halfTimeLeads.draw.toFixed(1)}%</div>
                    <div className="text-[9px] text-white/30 mt-0.5">Draw</div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-lg py-2 text-center">
                    <div className="text-sm font-bold text-white">{result.halfTimeLeads.away.toFixed(1)}%</div>
                    <div className="text-[9px] text-white/30 mt-0.5">Away</div>
                  </div>
                </div>
              </div>

              {/* Goal Distribution */}
              <div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Total Goals Distribution</div>
                <div className="flex items-end gap-1 h-16">
                  {result.goalDistribution.map((g) => (
                    <div key={g.goals} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-emerald-500/60 rounded-t"
                        style={{ height: `${(g.pct / Math.max(...result.goalDistribution.map((x) => x.pct))) * 52}px` }}
                      />
                      <span className="text-[8px] text-white/30">{g.goals}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Info */}
              <div className="text-[10px] text-white/20 pt-2 border-t border-white/5">
                Model: Poisson · xG Home {result.lambdaHome.toFixed(2)} · xG Away {result.lambdaAway.toFixed(2)} · 40,000 iterations · Implied overround {getImpliedProbabilities(match.odds).overround.toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
