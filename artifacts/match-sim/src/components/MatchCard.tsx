import { useState, useEffect, useRef } from "react";
import { Match } from "@/data/matches";
import { runSimulation, getImpliedProbabilities, SimulationResult } from "@/lib/simulation";

interface MatchCardProps {
  match: Match;
  onResult?: (matchId: number, result: SimulationResult) => void;
  delay?: number;
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex-1 bg-white/8 rounded-full h-1.5 overflow-hidden">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

export default function MatchCard({ match, onResult, delay = 0 }: MatchCardProps) {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const ran = useRef(false);

  const implied = getImpliedProbabilities(match.odds);
  const hasDraw = match.odds.draw !== undefined;

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    setRunning(true);
    const t = setTimeout(() => {
      const sim = runSimulation(match.odds, match.sport, 30000, match.leagueAvgTotal);
      setResult(sim);
      setRunning(false);
      onResult?.(match.id, sim);
    }, delay + 40);
    return () => clearTimeout(t);
  }, [match.id]);

  const valueAlert = (() => {
    if (!result) return null;
    const simH = result.homeWinPct / 100, simA = result.awayWinPct / 100;
    const edgeH = simH - implied.home, edgeA = simA - implied.away;
    if (edgeH > 0.06) return { label: match.home, edge: edgeH, odds: match.odds.home };
    if (edgeA > 0.06) return { label: match.away, edge: edgeA, odds: match.odds.away };
    return null;
  })();

  const pick = (() => {
    if (!result) return null;
    const best = result.homeWinPct > result.awayWinPct ? "home" : "away";
    return best === "home"
      ? { label: match.home, pct: result.homeWinPct }
      : { label: match.away, pct: result.awayWinPct };
  })();

  // Sport-specific score label
  const scoreLabel = match.sport === "basketball" ? "Pts" : match.sport === "handball" ? "Gls" : match.sport === "volleyball" ? "Sets" : "xG";

  return (
    <div className="bg-[#0f1923] rounded-xl border border-white/8 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d2137]/80 to-transparent px-4 py-3 border-b border-white/6">
        {match.context && (
          <div className="text-[9px] text-emerald-400/70 uppercase tracking-widest mb-1">{match.context}</div>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-white font-bold text-sm leading-tight flex-1">{match.home}</span>
          <span className="text-white/25 text-[10px] shrink-0">vs</span>
          <span className="text-white font-bold text-sm leading-tight flex-1 text-right">{match.away}</span>
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-white/30">1 {match.odds.home.toFixed(2)}</span>
          {hasDraw && <span className="text-[11px] text-white/30">X {match.odds.draw!.toFixed(2)}</span>}
          <span className="text-[11px] text-white/30">2 {match.odds.away.toFixed(2)}</span>
        </div>
      </div>

      {running && (
        <div className="flex items-center justify-center gap-2 py-5">
          <div className="w-3 h-3 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-white/25 text-xs">Simulating…</span>
        </div>
      )}

      {!running && result && (
        <div className="p-4 space-y-3">
          {valueAlert && (
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <span className="text-amber-400 text-[9px] font-bold uppercase tracking-wide">Value</span>
              <span className="text-white text-xs font-semibold">{valueAlert.label}</span>
              <span className="ml-auto text-amber-400 text-[10px] font-bold">+{(valueAlert.edge * 100).toFixed(1)}%</span>
            </div>
          )}

          {/* Win % */}
          <div>
            <div className="flex gap-1.5 mb-1.5">
              <div className="flex-1 text-center bg-white/5 rounded-lg py-2">
                <div className="text-lg font-black text-white">{result.homeWinPct.toFixed(1)}%</div>
                <div className="text-[9px] text-white/25 mt-0.5 truncate px-1">{match.home}</div>
              </div>
              {hasDraw && result.drawPct > 0 && (
                <div className="flex-1 text-center bg-white/5 rounded-lg py-2">
                  <div className="text-lg font-black text-white/40">{result.drawPct.toFixed(1)}%</div>
                  <div className="text-[9px] text-white/25 mt-0.5">Draw</div>
                </div>
              )}
              <div className="flex-1 text-center bg-white/5 rounded-lg py-2">
                <div className="text-lg font-black text-white">{result.awayWinPct.toFixed(1)}%</div>
                <div className="text-[9px] text-white/25 mt-0.5 truncate px-1">{match.away}</div>
              </div>
            </div>
            <div className="flex gap-0.5 h-1">
              <div className="bg-emerald-500 rounded-l-full" style={{ width: `${result.homeWinPct}%` }} />
              {hasDraw && result.drawPct > 0 && <div className="bg-white/20" style={{ width: `${result.drawPct}%` }} />}
              <div className="bg-blue-400 rounded-r-full" style={{ width: `${result.awayWinPct}%` }} />
            </div>
          </div>

          {/* Sport-specific markets */}
          {match.sport === "football" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[9px] text-white/25 uppercase tracking-widest mb-1">xG</div>
                <div className="bg-white/5 rounded-lg px-2 py-2 flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-base font-black text-emerald-400">{result.avgHomeScore.toFixed(2)}</div>
                    <div className="text-[8px] text-white/20">Home</div>
                  </div>
                  <div className="text-white/15 text-xs">:</div>
                  <div className="text-center">
                    <div className="text-base font-black text-blue-400">{result.avgAwayScore.toFixed(2)}</div>
                    <div className="text-[8px] text-white/20">Away</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[9px] text-white/25 uppercase tracking-widest mb-1">Goals Mkts</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/40 w-12 shrink-0">O 1.5</span>
                    <Bar value={result.over15} color="bg-emerald-400" />
                    <span className="text-[10px] text-white font-bold w-9 text-right">{result.over15.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/40 w-12 shrink-0">O 2.5</span>
                    <Bar value={result.over25} color="bg-emerald-400" />
                    <span className="text-[10px] text-white font-bold w-9 text-right">{result.over25.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/40 w-12 shrink-0">U 2.5</span>
                    <Bar value={result.under25} color="bg-blue-400" />
                    <span className="text-[10px] text-white font-bold w-9 text-right">{result.under25.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              {/* Scorelines */}
              <div className="col-span-2">
                <div className="text-[9px] text-white/25 uppercase tracking-widest mb-1">Top Scorelines</div>
                <div className="grid grid-cols-4 gap-1">
                  {result.topScorelines.slice(0, 4).map((s) => (
                    <div key={s.score} className="bg-white/5 rounded py-1 text-center">
                      <div className="text-xs font-bold text-white">{s.score}</div>
                      <div className="text-[8px] text-white/25">{s.pct.toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {match.sport === "basketball" && (
            <div>
              <div className="text-[9px] text-white/25 uppercase tracking-widest mb-1.5">Expected Pts &amp; Totals</div>
              <div className="flex gap-2 mb-2">
                <div className="flex-1 bg-white/5 rounded-lg py-2 text-center">
                  <div className="text-lg font-black text-emerald-400">{result.avgHomeScore.toFixed(0)}</div>
                  <div className="text-[8px] text-white/20">Home Pts</div>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg py-2 text-center">
                  <div className="text-sm font-black text-white/60">{result.avgTotalScore.toFixed(0)}</div>
                  <div className="text-[8px] text-white/20">Total</div>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg py-2 text-center">
                  <div className="text-lg font-black text-blue-400">{result.avgAwayScore.toFixed(0)}</div>
                  <div className="text-[8px] text-white/20">Away Pts</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/40 w-16 shrink-0">O {result.totalHighLine}</span>
                  <Bar value={result.overTotalHigh} color="bg-amber-400" />
                  <span className="text-[10px] text-white font-bold w-9 text-right">{result.overTotalHigh.toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/40 w-16 shrink-0">O {result.totalMidLine}</span>
                  <Bar value={result.overTotalMid} color="bg-emerald-400" />
                  <span className="text-[10px] text-white font-bold w-9 text-right">{result.overTotalMid.toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/40 w-16 shrink-0">U {result.totalMidLine}</span>
                  <Bar value={100 - result.overTotalMid} color="bg-blue-400" />
                  <span className="text-[10px] text-white font-bold w-9 text-right">{(100 - result.overTotalMid).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/40 w-16 shrink-0">O {result.totalLowLine}</span>
                  <Bar value={result.overTotalLow} color="bg-emerald-400" />
                  <span className="text-[10px] text-white font-bold w-9 text-right">{result.overTotalLow.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          )}

          {match.sport === "handball" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[9px] text-white/25 uppercase tracking-widest mb-1">Expected Goals</div>
                <div className="bg-white/5 rounded-lg px-2 py-2 flex justify-between">
                  <div className="text-center">
                    <div className="text-base font-black text-emerald-400">{result.avgHomeScore.toFixed(0)}</div>
                    <div className="text-[8px] text-white/20">Home</div>
                  </div>
                  <div className="text-white/15 text-xs self-center">:</div>
                  <div className="text-center">
                    <div className="text-base font-black text-blue-400">{result.avgAwayScore.toFixed(0)}</div>
                    <div className="text-[8px] text-white/20">Away</div>
                  </div>
                </div>
                <div className="text-center text-[9px] text-white/25 mt-1">Total {result.avgTotalScore.toFixed(0)}</div>
              </div>
              <div>
                <div className="text-[9px] text-white/25 uppercase tracking-widest mb-1">Goals Totals</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/40 w-14 shrink-0">O {result.totalHighLine}</span>
                    <Bar value={result.overTotalHigh} color="bg-amber-400" />
                    <span className="text-[10px] text-white font-bold w-8 text-right">{result.overTotalHigh.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/40 w-14 shrink-0">O {result.totalMidLine}</span>
                    <Bar value={result.overTotalMid} color="bg-emerald-400" />
                    <span className="text-[10px] text-white font-bold w-8 text-right">{result.overTotalMid.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/40 w-14 shrink-0">O {result.totalLowLine}</span>
                    <Bar value={result.overTotalLow} color="bg-emerald-400" />
                    <span className="text-[10px] text-white font-bold w-8 text-right">{result.overTotalLow.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {match.sport === "volleyball" && (
            <div>
              <div className="text-[9px] text-white/25 uppercase tracking-widest mb-1.5">Set Outcomes</div>
              <div className="grid grid-cols-3 gap-1 mb-2">
                {result.topScorelines.map((s) => (
                  <div key={s.score} className="bg-white/5 rounded py-1 text-center">
                    <div className="text-xs font-bold text-white">{s.score}</div>
                    <div className="text-[8px] text-white/25">{s.pct.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                {[
                  { label: `${match.home} 3-0`, val: result.homeWinIn3 },
                  { label: `${match.home} 3-1`, val: result.homeWinIn4 },
                  { label: `${match.home} 3-2`, val: result.homeWinIn5 },
                  { label: `${match.away} 3-0`, val: result.awayWinIn3 },
                  { label: `${match.away} 3-1`, val: result.awayWinIn4 },
                  { label: `${match.away} 3-2`, val: result.awayWinIn5 },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/40 w-24 shrink-0 truncate">{r.label}</span>
                    <Bar value={r.val} color="bg-emerald-400" />
                    <span className="text-[10px] text-white font-bold w-9 text-right">{r.val.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sim pick */}
          {pick && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 flex items-center justify-between">
              <div>
                <div className="text-[9px] text-emerald-400/60 uppercase tracking-widest">Sim Pick</div>
                <div className="text-white font-bold text-sm">{pick.label}</div>
              </div>
              <div className="text-emerald-400 font-black text-xl">{pick.pct.toFixed(1)}%</div>
            </div>
          )}

          {/* Football expanded stats */}
          {match.sport === "football" && (
            <>
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full text-center text-xs text-white/20 hover:text-white/50 transition-colors"
              >
                {expanded ? "Less ↑" : "More stats ↓"}
              </button>
              {expanded && (
                <div className="space-y-3 border-t border-white/6 pt-3">
                  <div className="space-y-1">
                    {[
                      { label: "O 3.5 Goals", val: result.over35, color: "bg-amber-400" },
                      { label: "U 1.5 Goals", val: result.under15, color: "bg-blue-400" },
                      { label: "BTTS", val: result.btts, color: "bg-purple-400" },
                      { label: `${match.home} CS`, val: result.cleanSheetHome, color: "bg-emerald-400" },
                      { label: `${match.away} CS`, val: result.cleanSheetAway, color: "bg-emerald-400" },
                      { label: `${match.home} W to Nil`, val: result.homeWinToNil, color: "bg-emerald-400" },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40 w-28 shrink-0">{r.label}</span>
                        <Bar value={r.val} color={r.color} />
                        <span className="text-[10px] text-white font-bold w-9 text-right">{r.val.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-[9px] text-white/25 uppercase tracking-widest mb-1.5">HT Result</div>
                    <div className="flex gap-1.5">
                      {[
                        { l: "Home", v: result.halfTimeLeads.home },
                        { l: "Draw", v: result.halfTimeLeads.draw },
                        { l: "Away", v: result.halfTimeLeads.away },
                      ].map((r) => (
                        <div key={r.l} className="flex-1 bg-white/5 rounded py-1.5 text-center">
                          <div className="text-xs font-bold text-white">{r.v.toFixed(1)}%</div>
                          <div className="text-[8px] text-white/25 mt-0.5">{r.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-[9px] text-white/15 border-t border-white/5 pt-2">
                    Poisson · xG {result.lambdaHome.toFixed(2)}:{result.lambdaAway.toFixed(2)} · 30k sims · Overround {implied.overround.toFixed(1)}%
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
