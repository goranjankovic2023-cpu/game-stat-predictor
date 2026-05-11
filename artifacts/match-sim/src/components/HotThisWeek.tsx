import { useMemo } from "react";
import { matches, Match, SPORTS } from "@/data/matches";
import { SimulationResult, getImpliedProbabilities } from "@/lib/simulation";

export interface HotPick {
  match: Match;
  outcome: "home" | "draw" | "away";
  label: string;
  odds: number;
  simPct: number;
  impliedPct: number;
  edge: number;
  confidence: number;
}

export function getHotPicks(results: Record<number, SimulationResult>): HotPick[] {
  const picks: HotPick[] = [];
  for (const match of matches) {
    const result = results[match.id];
    if (!result) continue;
    const imp = getImpliedProbabilities(match.odds);
    const opts: { outcome: "home" | "draw" | "away"; label: string; odds: number; simPct: number; impPct: number }[] = [
      { outcome: "home", label: match.home, odds: match.odds.home, simPct: result.homeWinPct, impPct: imp.home * 100 },
      { outcome: "away", label: match.away, odds: match.odds.away, simPct: result.awayWinPct, impPct: imp.away * 100 },
    ];
    if (match.odds.draw) {
      opts.push({ outcome: "draw", label: "Draw", odds: match.odds.draw, simPct: result.drawPct, impPct: imp.draw * 100 });
    }
    for (const o of opts) {
      const edge = o.simPct - o.impPct;
      if (edge > 0 && o.simPct > 30) {
        picks.push({
          match, outcome: o.outcome, label: o.label, odds: o.odds,
          simPct: o.simPct, impliedPct: o.impPct, edge,
          confidence: o.simPct * (edge / 10),
        });
      }
    }
  }
  return picks.sort((a, b) => b.confidence - a.confidence);
}

const SPORT_COLORS: Record<string, string> = {
  football: "text-emerald-400", basketball: "text-orange-400",
  handball: "text-blue-400", volleyball: "text-purple-400",
};
const SPORT_BG: Record<string, string> = {
  football: "bg-emerald-500/15 border-emerald-500/25",
  basketball: "bg-orange-500/15 border-orange-500/25",
  handball: "bg-blue-500/15 border-blue-500/25",
  volleyball: "bg-purple-500/15 border-purple-500/25",
};

interface Props { results: Record<number, SimulationResult>; onClose: () => void; }

export default function HotThisWeek({ results, onClose }: Props) {
  const picks = useMemo(() => getHotPicks(results), [results]);
  const simCount = Object.keys(results).length;

  const sportBreakdown = useMemo(() =>
    SPORTS.map((s) => {
      const sp = picks.filter((p) => p.match.sport === s.key);
      return { ...s, count: sp.length };
    }).filter((s) => s.count > 0),
  [picks]);

  return (
    <div className="bg-[#0d1e2e] border border-white/8 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/8 flex items-center gap-3">
        <div className="w-6 h-6 bg-amber-500 rounded-lg flex items-center justify-center shrink-0 text-sm">🔥</div>
        <div className="flex-1">
          <div className="text-white font-bold text-sm">Hot This Week</div>
          <div className="text-white/30 text-[10px]">Ranked by value edge · {simCount}/{matches.length} simulated</div>
        </div>
        <button onClick={onClose} className="w-6 h-6 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/15 transition-colors">
          <svg className="w-3 h-3 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {simCount < 5 ? (
        <div className="p-8 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto mb-3" />
          <div className="text-white/30 text-xs">Simulating… {simCount}/{matches.length}</div>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {/* Sport pills */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {sportBreakdown.map((s) => (
              <div key={s.key} className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${SPORT_BG[s.key]}`}>
                <span>{s.emoji}</span>
                <span className={SPORT_COLORS[s.key]}>{s.label}</span>
                <span className="text-white/30">{s.count}</span>
              </div>
            ))}
          </div>

          {/* Ranked picks */}
          <div className="space-y-1.5">
            {picks.slice(0, 25).map((p, i) => {
              const sportEmoji = SPORTS.find((s) => s.key === p.match.sport)?.emoji ?? "⚽";
              return (
                <div key={`${p.match.id}-${p.outcome}`}
                  className={`rounded-xl px-3 py-2.5 flex items-center gap-3 border ${i < 3 ? "bg-amber-500/10 border-amber-500/25" : "bg-white/3 border-white/6"}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    i === 0 ? "bg-amber-500 text-black" : i === 1 ? "bg-white/20 text-white" : i === 2 ? "bg-amber-900/60 text-amber-400" : "bg-white/5 text-white/25"
                  }`}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-sm shrink-0">{sportEmoji}</span>
                      <span className="text-white text-xs font-bold truncate">{p.label}</span>
                    </div>
                    <div className="text-white/25 text-[9px] truncate">{p.match.home} vs {p.match.away}</div>
                    <div className="text-white/15 text-[9px]">{p.match.flag} {p.match.leagueShort} · {p.match.date.slice(5).replace("-", "/")} {p.match.time}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-white text-sm font-black">{p.odds.toFixed(2)}</div>
                    <div className={`text-[10px] font-bold ${SPORT_COLORS[p.match.sport]}`}>{p.simPct.toFixed(1)}%</div>
                    <div className="text-amber-400 text-[9px]">+{p.edge.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          {picks.length === 0 && (
            <div className="text-center py-6 text-white/20 text-xs">No value picks yet — try again once more simulations finish</div>
          )}
        </div>
      )}
    </div>
  );
}
