import { matches } from "@/data/matches";
import { SimulationResult, getImpliedProbabilities } from "@/lib/simulation";

interface DayStatsProps {
  date: string | null; // ISO date or null for all
  results: Record<number, SimulationResult>;
  onClose: () => void;
}

export function getBestPicks(results: Record<number, SimulationResult>, count = 5) {
  const picks: { match: (typeof matches)[0]; outcome: "home" | "draw" | "away"; label: string; odds: number; simPct: number; impliedPct: number; edge: number }[] = [];
  for (const match of matches) {
    const result = results[match.id];
    if (!result) continue;
    const imp = getImpliedProbabilities(match.odds);
    const opts: { outcome: "home" | "draw" | "away"; label: string; odds: number; simPct: number; impPct: number }[] = [
      { outcome: "home", label: match.home, odds: match.odds.home, simPct: result.homeWinPct, impPct: imp.home * 100 },
      { outcome: "away", label: match.away, odds: match.odds.away, simPct: result.awayWinPct, impPct: imp.away * 100 },
    ];
    if (match.odds.draw) opts.push({ outcome: "draw", label: "Draw", odds: match.odds.draw, simPct: result.drawPct, impPct: imp.draw * 100 });
    for (const o of opts) {
      const edge = o.simPct - o.impPct;
      if (edge > 0) picks.push({ match, outcome: o.outcome, label: o.label, odds: o.odds, simPct: o.simPct, impliedPct: o.impPct, edge });
    }
  }
  return picks.sort((a, b) => b.edge - a.edge).slice(0, count);
}

export default function DayStats({ date, results, onClose }: DayStatsProps) {
  const dayMatches = date ? matches.filter((m) => m.date === date) : matches;
  const simulated = dayMatches.filter((m) => results[m.id]);
  const n = simulated.length;

  const avgTotal = n > 0 ? simulated.reduce((s, m) => {
    const r = results[m.id];
    return s + (m.sport === "football" ? r.avgTotalScore : m.sport === "basketball" ? r.avgTotalScore / 100 : 0);
  }, 0) / Math.max(1, simulated.filter((m) => m.sport === "football").length) : 0;

  const footballSims = simulated.filter((m) => m.sport === "football");
  const basketballSims = simulated.filter((m) => m.sport === "basketball");
  const over25Count = footballSims.filter((m) => results[m.id].over25 > 50).length;
  const bttsCount = footballSims.filter((m) => results[m.id].btts > 50).length;

  const sportCounts: Record<string, number> = {};
  for (const m of dayMatches) sportCounts[m.sport] = (sportCounts[m.sport] || 0) + 1;

  const leagueMap: Record<string, { total: number; flag: string; avgGoals: number; fCount: number }> = {};
  for (const m of simulated) {
    if (!leagueMap[m.leagueShort]) leagueMap[m.leagueShort] = { total: 0, flag: m.flag, avgGoals: 0, fCount: 0 };
    leagueMap[m.leagueShort].total++;
    if (m.sport === "football") {
      leagueMap[m.leagueShort].avgGoals += results[m.id].avgTotalScore;
      leagueMap[m.leagueShort].fCount++;
    }
  }

  const valuePicks = getBestPicks(results, 5).filter((p) => !date || p.match.date === date);

  return (
    <div className="bg-[#0d1e2e] border border-white/8 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/8 flex items-center gap-3">
        <div className="flex-1">
          <div className="text-white font-bold text-sm">{date ? `${date.slice(5).replace("-", "/")} Stats` : "Full Week Stats"}</div>
          <div className="text-white/30 text-[10px]">{n} simulated · {dayMatches.length} total matches</div>
        </div>
        <button onClick={onClose} className="w-6 h-6 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/15 transition-colors">
          <svg className="w-3 h-3 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Sports breakdown */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { emoji: "⚽", label: "Football", key: "football" },
            { emoji: "🏀", label: "Basketball", key: "basketball" },
            { emoji: "🤾", label: "Handball", key: "handball" },
            { emoji: "🏐", label: "Volleyball", key: "volleyball" },
          ].map((s) => (
            <div key={s.key} className="bg-white/5 rounded-xl py-2.5 text-center">
              <div className="text-xl">{s.emoji}</div>
              <div className="text-white font-black text-sm mt-0.5">{sportCounts[s.key] ?? 0}</div>
              <div className="text-[8px] text-white/25">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Football summary */}
        {footballSims.length > 0 && (
          <div className="bg-white/3 border border-white/6 rounded-xl px-4 py-3">
            <div className="text-[9px] text-white/25 uppercase tracking-widest mb-2">⚽ Football Summary</div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-white font-bold text-sm">{avgTotal.toFixed(2)}</div>
                <div className="text-[8px] text-white/25 mt-0.5">Avg xG</div>
              </div>
              <div>
                <div className="text-emerald-400 font-bold text-sm">{over25Count}/{footballSims.length}</div>
                <div className="text-[8px] text-white/25 mt-0.5">O 2.5 likely</div>
              </div>
              <div>
                <div className="text-blue-400 font-bold text-sm">{bttsCount}/{footballSims.length}</div>
                <div className="text-[8px] text-white/25 mt-0.5">BTTS likely</div>
              </div>
              <div>
                <div className="text-amber-400 font-bold text-sm">{valuePicks.length}</div>
                <div className="text-[8px] text-white/25 mt-0.5">Value bets</div>
              </div>
            </div>
          </div>
        )}

        {/* Basketball summary */}
        {basketballSims.length > 0 && (
          <div className="bg-white/3 border border-white/6 rounded-xl px-4 py-3">
            <div className="text-[9px] text-white/25 uppercase tracking-widest mb-2">🏀 Basketball Summary</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-white font-bold text-sm">{basketballSims.length}</div>
                <div className="text-[8px] text-white/25 mt-0.5">Games</div>
              </div>
              <div>
                <div className="text-orange-400 font-bold text-sm">{(basketballSims.reduce((s, m) => s + results[m.id].avgTotalScore, 0) / basketballSims.length).toFixed(0)}</div>
                <div className="text-[8px] text-white/25 mt-0.5">Avg Total Pts</div>
              </div>
              <div>
                <div className="text-amber-400 font-bold text-sm">{basketballSims.filter((m) => results[m.id].overTotalMid > 55).length}</div>
                <div className="text-[8px] text-white/25 mt-0.5">High Scoring</div>
              </div>
            </div>
          </div>
        )}

        {/* League breakdown */}
        <div>
          <div className="text-[9px] text-white/25 uppercase tracking-widest mb-2">League Breakdown</div>
          <div className="space-y-1.5">
            {Object.entries(leagueMap).slice(0, 10).map(([name, d]) => (
              <div key={name} className="bg-white/3 border border-white/6 rounded-xl px-3 py-2 flex items-center gap-3">
                <span className="text-base">{d.flag}</span>
                <div className="flex-1">
                  <div className="text-white text-xs font-semibold">{name}</div>
                  <div className="text-white/25 text-[9px]">{d.total} matches</div>
                </div>
                {d.fCount > 0 && (
                  <div className="text-right">
                    <div className="text-emerald-400 text-xs font-bold">{(d.avgGoals / d.fCount).toFixed(2)}</div>
                    <div className="text-white/20 text-[9px]">avg xG</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top value picks */}
        {valuePicks.length > 0 && (
          <div>
            <div className="text-[9px] text-white/25 uppercase tracking-widest mb-2">Top Value Picks</div>
            <div className="space-y-1.5">
              {valuePicks.map((p, i) => (
                <div key={`${p.match.id}-${p.outcome}`} className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-3 py-2 flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <span className="text-amber-400 text-[9px] font-black">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-bold truncate">{p.label}</div>
                    <div className="text-white/25 text-[9px] truncate">{p.match.home} vs {p.match.away} · {p.match.flag} {p.match.leagueShort}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-white text-xs font-bold">{p.odds.toFixed(2)}</div>
                    <div className="text-amber-400 text-[9px] font-semibold">+{p.edge.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
