import { useState } from "react";
import { matches } from "@/data/matches";
import { SimulationResult } from "@/lib/simulation";

interface Pick {
  matchId: number;
  outcome: "home" | "draw" | "away";
}

interface AccaBuilderProps {
  results: Record<number, SimulationResult>;
}

const outcomeLabel = (outcome: "home" | "draw" | "away", match: (typeof matches)[0]) => {
  if (outcome === "home") return match.home;
  if (outcome === "away") return match.away;
  return "Draw";
};

const outcomeOdds = (outcome: "home" | "draw" | "away", match: (typeof matches)[0]) => {
  if (outcome === "home") return match.odds.home;
  if (outcome === "away") return match.odds.away;
  return match.odds.draw;
};

const outcomePct = (outcome: "home" | "draw" | "away", result: SimulationResult) => {
  if (outcome === "home") return result.homeWinPct;
  if (outcome === "away") return result.awayWinPct;
  return result.drawPct;
};

export default function AccaBuilder({ results }: AccaBuilderProps) {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [open, setOpen] = useState(false);

  const togglePick = (matchId: number, outcome: "home" | "draw" | "away") => {
    setPicks((prev) => {
      const existing = prev.find((p) => p.matchId === matchId);
      if (existing && existing.outcome === outcome) {
        return prev.filter((p) => p.matchId !== matchId);
      }
      const filtered = prev.filter((p) => p.matchId !== matchId);
      return [...filtered, { matchId, outcome }];
    });
  };

  const pickedMatches = picks
    .map((p) => {
      const match = matches.find((m) => m.id === p.matchId)!;
      const result = results[p.matchId];
      return { ...p, match, result };
    })
    .filter((p) => p.result);

  const combinedOdds = pickedMatches.reduce((acc, p) => acc * outcomeOdds(p.outcome, p.match), 1);
  const combinedSimProb = pickedMatches.reduce((acc, p) => acc * (outcomePct(p.outcome, p.result) / 100), 1);
  const impliedProb = pickedMatches.length > 0 ? 1 / combinedOdds : 0;
  const edge = combinedSimProb - impliedProb;
  const expectedValue = combinedSimProb * combinedOdds - 1;
  const hasValue = edge > 0.005;

  const edgeColor = hasValue ? "text-emerald-400" : "text-rose-400";
  const evColor = expectedValue > 0 ? "text-emerald-400" : "text-rose-400";

  const readyCount = Object.keys(results).length;

  return (
    <div className="sticky bottom-0 z-20">
      {/* Collapsed bar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-[#0d2137] border-t border-white/10 px-5 py-3 flex items-center gap-3"
      >
        <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div className="flex-1 text-left">
          <span className="text-white font-bold text-sm">Accumulator Builder</span>
          {picks.length > 0 && (
            <span className="ml-2 bg-emerald-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{picks.length}</span>
          )}
          {readyCount < 6 && (
            <span className="ml-2 text-white/30 text-[10px]">Running simulations…</span>
          )}
        </div>
        {picks.length > 0 && (
          <div className="text-right shrink-0">
            <div className="text-white font-black text-base">{combinedOdds.toFixed(2)}x</div>
            <div className={`text-[10px] font-semibold ${combinedSimProb > 0 ? (hasValue ? "text-emerald-400" : "text-rose-400") : "text-white/30"}`}>
              {combinedSimProb > 0 ? `Sim: ${(combinedSimProb * 100).toFixed(2)}%` : "Select picks"}
            </div>
          </div>
        )}
        <svg
          className={`w-4 h-4 text-white/40 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="bg-[#080f17] border-t border-white/8 max-h-[70vh] overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">

            {/* Stats summary */}
            {picks.length >= 2 && (
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-white/5 rounded-xl py-3 text-center">
                  <div className="text-white font-black text-lg">{picks.length}</div>
                  <div className="text-[9px] text-white/30 mt-0.5">Legs</div>
                </div>
                <div className="bg-white/5 rounded-xl py-3 text-center">
                  <div className="text-white font-black text-lg">{combinedOdds.toFixed(2)}</div>
                  <div className="text-[9px] text-white/30 mt-0.5">Total Odds</div>
                </div>
                <div className="bg-white/5 rounded-xl py-3 text-center">
                  <div className={`font-black text-lg ${edgeColor}`}>{(combinedSimProb * 100).toFixed(2)}%</div>
                  <div className="text-[9px] text-white/30 mt-0.5">Sim Prob</div>
                </div>
                <div className="bg-white/5 rounded-xl py-3 text-center">
                  <div className={`font-black text-lg ${evColor}`}>{expectedValue >= 0 ? "+" : ""}{(expectedValue * 100).toFixed(1)}%</div>
                  <div className="text-[9px] text-white/30 mt-0.5">Exp. Value</div>
                </div>
              </div>
            )}

            {/* Value / no value banner */}
            {picks.length >= 2 && (
              <div className={`rounded-xl px-4 py-2.5 flex items-center gap-3 border ${hasValue ? "bg-emerald-500/10 border-emerald-500/25" : "bg-rose-500/10 border-rose-500/25"}`}>
                <div className={`w-2 h-2 rounded-full shrink-0 ${hasValue ? "bg-emerald-400" : "bg-rose-400"}`} />
                <div className="flex-1">
                  <div className={`text-xs font-bold ${hasValue ? "text-emerald-400" : "text-rose-400"}`}>
                    {hasValue ? "Value Accumulator" : "No Edge Found"}
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5">
                    {hasValue
                      ? `Model edge: +${(edge * 100).toFixed(2)}% over implied probability`
                      : `Model underperforms implied by ${(Math.abs(edge) * 100).toFixed(2)}%`}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-white/30">Implied</div>
                  <div className="text-white text-xs font-semibold">{(impliedProb * 100).toFixed(2)}%</div>
                </div>
              </div>
            )}

            {/* Per-match pick rows */}
            {matches.map((match) => {
              const result = results[match.id];
              const pick = picks.find((p) => p.matchId === match.id);
              return (
                <div key={match.id} className="bg-[#0f1923] rounded-xl border border-white/8 overflow-hidden">
                  <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-white/30">{match.home} vs {match.away}</span>
                    {pick && (
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        ✓ {outcomeLabel(pick.outcome, match)}
                      </span>
                    )}
                  </div>
                  <div className="flex">
                    {(["home", "draw", "away"] as const).map((outcome) => {
                      const selected = pick?.outcome === outcome;
                      const odds = outcomeOdds(outcome, match);
                      const pct = result ? outcomePct(outcome, result) : null;
                      const label = outcome === "draw" ? "Draw" : outcome === "home" ? "1" : "2";
                      return (
                        <button
                          key={outcome}
                          onClick={() => togglePick(match.id, outcome)}
                          className={`flex-1 py-3 text-center transition-colors border-r last:border-r-0 border-white/5 ${
                            selected
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "hover:bg-white/5 text-white/60"
                          }`}
                        >
                          <div className="text-[10px] text-white/30">{label}</div>
                          <div className={`text-sm font-bold mt-0.5 ${selected ? "text-emerald-400" : "text-white"}`}>{odds.toFixed(2)}</div>
                          {pct !== null && (
                            <div className={`text-[9px] mt-0.5 ${selected ? "text-emerald-300" : "text-white/30"}`}>{pct.toFixed(1)}%</div>
                          )}
                          {pct === null && (
                            <div className="text-[9px] text-white/20 mt-0.5">…</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {picks.length > 0 && (
              <button
                onClick={() => setPicks([])}
                className="w-full text-center text-xs text-rose-400/60 hover:text-rose-400 transition-colors py-2"
              >
                Clear all picks
              </button>
            )}

            {picks.length === 0 && (
              <div className="text-center py-4 text-white/20 text-xs">
                Tap any odds above to add a leg to your accumulator
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
