import { matches, Match } from "@/data/matches";
import { SimulationResult, getImpliedProbabilities } from "@/lib/simulation";

interface DayStatsProps {
  day: "saturday" | "sunday" | "all";
  results: Record<number, SimulationResult>;
}

interface ValuePick {
  match: Match;
  outcome: "home" | "draw" | "away";
  label: string;
  odds: number;
  simPct: number;
  impliedPct: number;
  edge: number;
}

export function getBestPicks(results: Record<number, SimulationResult>, count = 5): ValuePick[] {
  const picks: ValuePick[] = [];
  for (const match of matches) {
    const result = results[match.id];
    if (!result) continue;
    const implied = getImpliedProbabilities(match.odds);
    const options: { outcome: "home" | "draw" | "away"; label: string; odds: number; simPct: number; impliedPct: number }[] = [
      { outcome: "home", label: match.home, odds: match.odds.home, simPct: result.homeWinPct, impliedPct: implied.home * 100 },
      { outcome: "draw", label: "Draw", odds: match.odds.draw, simPct: result.drawPct, impliedPct: implied.draw * 100 },
      { outcome: "away", label: match.away, odds: match.odds.away, simPct: result.awayWinPct, impliedPct: implied.away * 100 },
    ];
    for (const o of options) {
      const edge = o.simPct - o.impliedPct;
      if (edge > 0) {
        picks.push({ match, outcome: o.outcome, label: o.label, odds: o.odds, simPct: o.simPct, impliedPct: o.impliedPct, edge });
      }
    }
  }
  return picks.sort((a, b) => b.edge - a.edge).slice(0, count);
}

export default function DayStats({ day, results }: DayStatsProps) {
  const dayMatches = day === "all" ? matches : matches.filter((m) => m.day === day);
  const simulated = dayMatches.filter((m) => results[m.id]);
  const simCount = simulated.length;

  if (simCount === 0) {
    return (
      <div className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-center text-white/25 text-xs">
        Running simulations…
      </div>
    );
  }

  const avgTotal = simulated.reduce((s, m) => s + results[m.id].avgTotalGoals, 0) / simCount;
  const over25Count = simulated.filter((m) => results[m.id].over25 > 50).length;
  const bttsCount = simulated.filter((m) => results[m.id].btts > 50).length;

  // Count value picks per day
  const valuePicks = getBestPicks(results, 999).filter((p) => day === "all" || p.match.day === day);

  // League breakdown
  const leagueMap: Record<string, { total: number; avgGoals: number }> = {};
  for (const m of simulated) {
    const r = results[m.id];
    if (!leagueMap[m.leagueShort]) leagueMap[m.leagueShort] = { total: 0, avgGoals: 0 };
    leagueMap[m.leagueShort].total++;
    leagueMap[m.leagueShort].avgGoals += r.avgTotalGoals;
  }

  const leagues = Object.entries(leagueMap).map(([name, d]) => ({
    name,
    total: d.total,
    avgGoals: d.avgGoals / d.total,
    flag: matches.find((m) => m.leagueShort === name)?.flag ?? "",
  }));

  return (
    <div className="space-y-3">
      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white/5 rounded-xl py-3 text-center">
          <div className="text-white font-black text-xl">{simCount}</div>
          <div className="text-[9px] text-white/30 mt-0.5">Matches</div>
        </div>
        <div className="bg-white/5 rounded-xl py-3 text-center">
          <div className="text-emerald-400 font-black text-xl">{avgTotal.toFixed(2)}</div>
          <div className="text-[9px] text-white/30 mt-0.5">Avg Goals</div>
        </div>
        <div className="bg-white/5 rounded-xl py-3 text-center">
          <div className="text-amber-400 font-black text-xl">{valuePicks.length}</div>
          <div className="text-[9px] text-white/30 mt-0.5">Value Bets</div>
        </div>
        <div className="bg-white/5 rounded-xl py-3 text-center">
          <div className="text-blue-400 font-black text-xl">{bttsCount}</div>
          <div className="text-[9px] text-white/30 mt-0.5">BTTS &gt;50%</div>
        </div>
      </div>

      {/* Goals breakdown */}
      <div className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 flex justify-between">
        <div className="text-center">
          <div className="text-white font-bold text-sm">{over25Count}/{simCount}</div>
          <div className="text-[9px] text-white/30 mt-0.5">Likely Over 2.5</div>
        </div>
        <div className="w-px bg-white/8" />
        <div className="text-center">
          <div className="text-white font-bold text-sm">{bttsCount}/{simCount}</div>
          <div className="text-[9px] text-white/30 mt-0.5">Likely BTTS</div>
        </div>
        <div className="w-px bg-white/8" />
        <div className="text-center">
          <div className="text-white font-bold text-sm">{avgTotal.toFixed(2)}</div>
          <div className="text-[9px] text-white/30 mt-0.5">Avg xG/Game</div>
        </div>
        <div className="w-px bg-white/8" />
        <div className="text-center">
          <div className="text-white font-bold text-sm">{simulated.filter((m) => results[m.id].over25 < 40).length}</div>
          <div className="text-[9px] text-white/30 mt-0.5">Low Scoring</div>
        </div>
      </div>

      {/* League breakdown */}
      <div className="space-y-1.5">
        <div className="text-[9px] text-white/25 uppercase tracking-widest px-1">League Breakdown</div>
        {leagues.map((l) => (
          <div key={l.name} className="bg-white/3 border border-white/8 rounded-xl px-3 py-2 flex items-center gap-3">
            <span className="text-base">{l.flag}</span>
            <div className="flex-1">
              <div className="text-white text-xs font-semibold">{l.name}</div>
              <div className="text-white/30 text-[9px]">{l.total} matches</div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 text-xs font-bold">{l.avgGoals.toFixed(2)}</div>
              <div className="text-white/25 text-[9px]">avg goals</div>
            </div>
          </div>
        ))}
      </div>

      {/* Top 3 value picks preview */}
      {valuePicks.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[9px] text-white/25 uppercase tracking-widest px-1">Top Value Picks This {day === "all" ? "Weekend" : day === "saturday" ? "Saturday" : "Sunday"}</div>
          {valuePicks.slice(0, 3).map((p, i) => (
            <div key={`${p.match.id}-${p.outcome}`} className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-3 py-2 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <span className="text-amber-400 text-[10px] font-black">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-semibold truncate">{p.label}</div>
                <div className="text-white/30 text-[9px] truncate">{p.match.home} vs {p.match.away} · {p.match.flag} {p.match.leagueShort}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-white text-xs font-bold">{p.odds.toFixed(2)}</div>
                <div className="text-amber-400 text-[9px] font-semibold">+{p.edge.toFixed(1)}% edge</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
