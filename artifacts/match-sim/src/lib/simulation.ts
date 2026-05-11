export type Sport = "football" | "basketball" | "handball" | "volleyball";

export interface ImpliedProbabilities {
  home: number;
  draw: number;
  away: number;
  overround: number;
}

export interface SimulationResult {
  sport: Sport;
  homeWinPct: number;
  drawPct: number;
  awayWinPct: number;
  avgHomeScore: number;
  avgAwayScore: number;
  avgTotalScore: number;
  // Football / Handball goals markets
  over15: number;
  over25: number;
  over35: number;
  under15: number;
  under25: number;
  under35: number;
  btts: number;
  cleanSheetHome: number;
  cleanSheetAway: number;
  homeWinToNil: number;
  awayWinToNil: number;
  // Basketball totals
  overTotalHigh: number;   // e.g. over 225.5 NBA / over 162.5 EL
  overTotalMid: number;    // e.g. over 215.5 NBA / over 155.5 EL
  overTotalLow: number;    // e.g. over 205.5 NBA / over 147.5 EL
  totalHighLine: number;
  totalMidLine: number;
  totalLowLine: number;
  // Volleyball set markets
  homeWinIn3: number;
  homeWinIn4: number;
  homeWinIn5: number;
  awayWinIn3: number;
  awayWinIn4: number;
  awayWinIn5: number;
  // Universal
  topScorelines: { score: string; pct: number }[];
  scoreDistribution: { label: string; pct: number }[];
  halfTimeLeads: { home: number; draw: number; away: number };
  lambdaHome: number;
  lambdaAway: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function poissonPmf(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  let logP = -lambda + k * Math.log(lambda);
  for (let i = 2; i <= k; i++) logP -= Math.log(i);
  return Math.exp(logP);
}

function buildScoreMatrix(lh: number, la: number, max = 8) {
  const m: number[][] = [];
  for (let i = 0; i <= max; i++) {
    m[i] = [];
    for (let j = 0; j <= max; j++) m[i][j] = poissonPmf(i, lh) * poissonPmf(j, la);
  }
  return m;
}

function calcFootballProbs(lh: number, la: number) {
  const m = buildScoreMatrix(lh, la);
  let h = 0, d = 0, a = 0;
  for (let i = 0; i < m.length; i++)
    for (let j = 0; j < m[i].length; j++) {
      if (i > j) h += m[i][j];
      else if (i === j) d += m[i][j];
      else a += m[i][j];
    }
  return { h, d, a };
}

function findLambdas(pH: number, pA: number): { lh: number; la: number } {
  let bestLh = 1.2, bestLa = 1.0, bestErr = Infinity;
  for (let lh = 0.2; lh <= 4.5; lh += 0.05) {
    for (let la = 0.2; la <= 4.5; la += 0.05) {
      const p = calcFootballProbs(lh, la);
      const err = Math.abs(p.h - pH) + Math.abs(p.a - pA);
      if (err < bestErr) { bestErr = err; bestLh = lh; bestLa = la; }
    }
  }
  return { lh: bestLh, la: bestLa };
}

function samplePoisson(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

function sampleNormal(mean: number, std: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function getImpliedProbabilities(odds: { home: number; draw?: number; away: number }): ImpliedProbabilities {
  const rawH = 1 / odds.home;
  const rawD = odds.draw ? 1 / odds.draw : 0;
  const rawA = 1 / odds.away;
  const total = rawH + rawD + rawA;
  return {
    home: rawH / total,
    draw: rawD / total,
    away: rawA / total,
    overround: (total - 1) * 100,
  };
}

// ─── Football ───────────────────────────────────────────────────────────────

function simulateFootball(odds: { home: number; draw?: number; away: number }, n: number): SimulationResult {
  const imp = getImpliedProbabilities(odds);
  const { lh, la } = findLambdas(imp.home, imp.away);

  let homeWins = 0, draws = 0, awayWins = 0;
  let totalH = 0, totalA = 0;
  let btts = 0, over15 = 0, over25 = 0, over35 = 0;
  let csHome = 0, csAway = 0, hWinNil = 0, aWinNil = 0;
  let htHome = 0, htDraw = 0, htAway = 0;
  const scorelines: Record<string, number> = {};
  const goalCounts: Record<number, number> = {};

  for (let i = 0; i < n; i++) {
    const hg = samplePoisson(lh), ag = samplePoisson(la);
    const hhg = samplePoisson(lh * 0.5), hag = samplePoisson(la * 0.5);
    if (hg > ag) homeWins++; else if (hg === ag) draws++; else awayWins++;
    if (hhg > hag) htHome++; else if (hhg === hag) htDraw++; else htAway++;
    totalH += hg; totalA += ag;
    const total = hg + ag;
    if (hg > 0 && ag > 0) btts++;
    if (total > 1.5) over15++;
    if (total > 2.5) over25++;
    if (total > 3.5) over35++;
    if (ag === 0) csHome++;
    if (hg === 0) csAway++;
    if (hg > ag && ag === 0) hWinNil++;
    if (ag > hg && hg === 0) aWinNil++;
    const key = `${hg}-${ag}`;
    scorelines[key] = (scorelines[key] || 0) + 1;
    goalCounts[total] = (goalCounts[total] || 0) + 1;
  }

  const topScorelines = Object.entries(scorelines)
    .map(([score, c]) => ({ score, pct: (c / n) * 100 }))
    .sort((a, b) => b.pct - a.pct).slice(0, 8);

  const maxG = Math.max(...Object.keys(goalCounts).map(Number));
  const scoreDistribution = Array.from({ length: Math.min(maxG + 1, 10) }, (_, g) => ({
    label: String(g), pct: ((goalCounts[g] || 0) / n) * 100,
  }));

  const avgH = totalH / n, avgA = totalA / n;
  return {
    sport: "football", homeWinPct: (homeWins / n) * 100, drawPct: (draws / n) * 100, awayWinPct: (awayWins / n) * 100,
    avgHomeScore: avgH, avgAwayScore: avgA, avgTotalScore: avgH + avgA,
    over15: (over15 / n) * 100, over25: (over25 / n) * 100, over35: (over35 / n) * 100,
    under15: 100 - (over15 / n) * 100, under25: 100 - (over25 / n) * 100, under35: 100 - (over35 / n) * 100,
    btts: (btts / n) * 100, cleanSheetHome: (csHome / n) * 100, cleanSheetAway: (csAway / n) * 100,
    homeWinToNil: (hWinNil / n) * 100, awayWinToNil: (aWinNil / n) * 100,
    overTotalHigh: 0, overTotalMid: 0, overTotalLow: 0,
    totalHighLine: 0, totalMidLine: 0, totalLowLine: 0,
    homeWinIn3: 0, homeWinIn4: 0, homeWinIn5: 0, awayWinIn3: 0, awayWinIn4: 0, awayWinIn5: 0,
    topScorelines, scoreDistribution,
    halfTimeLeads: { home: (htHome / n) * 100, draw: (htDraw / n) * 100, away: (htAway / n) * 100 },
    lambdaHome: lh, lambdaAway: la,
  };
}

// ─── Handball ───────────────────────────────────────────────────────────────

function simulateHandball(odds: { home: number; draw?: number; away: number }, n: number): SimulationResult {
  const imp = getImpliedProbabilities(odds);
  // Handball: higher scoring, avg ~28-32 per team in EHF CL
  const avgGoalsPerTeam = 28;
  const totalAvg = avgGoalsPerTeam * 2;
  // Distribute goals based on implied win probability
  const strengthRatio = imp.home / imp.away;
  const lh = (totalAvg / 2) * Math.sqrt(strengthRatio) * 1.02; // slight home advantage
  const la = (totalAvg / 2) / Math.sqrt(strengthRatio);

  let homeWins = 0, draws = 0, awayWins = 0;
  let totalH = 0, totalA = 0;
  let over49 = 0, over54 = 0, over59 = 0;
  let htHome = 0, htDraw = 0, htAway = 0;
  const scorelines: Record<string, number> = {};
  const totalCounts: Record<number, number> = {};

  for (let i = 0; i < n; i++) {
    const hg = samplePoisson(lh), ag = samplePoisson(la);
    const hhg = samplePoisson(lh * 0.5), hag = samplePoisson(la * 0.5);
    if (hg > ag) homeWins++; else if (hg === ag) draws++; else awayWins++;
    if (hhg > hag) htHome++; else if (hhg === hag) htDraw++; else htAway++;
    totalH += hg; totalA += ag;
    const total = hg + ag;
    if (total > 49) over49++;
    if (total > 54) over54++;
    if (total > 59) over59++;
    const key = `${hg}-${ag}`;
    scorelines[key] = (scorelines[key] || 0) + 1;
    const bucket = Math.floor(total / 5) * 5;
    totalCounts[bucket] = (totalCounts[bucket] || 0) + 1;
  }

  const topScorelines = Object.entries(scorelines)
    .map(([score, c]) => ({ score, pct: (c / n) * 100 }))
    .sort((a, b) => b.pct - a.pct).slice(0, 8);
  const scoreDistribution = Object.entries(totalCounts)
    .map(([label, c]) => ({ label: `${label}+`, pct: (c / n) * 100 }))
    .sort((a, b) => Number(a.label) - Number(b.label)).slice(0, 9);

  const avgH = totalH / n, avgA = totalA / n;
  return {
    sport: "handball", homeWinPct: (homeWins / n) * 100, drawPct: (draws / n) * 100, awayWinPct: (awayWins / n) * 100,
    avgHomeScore: avgH, avgAwayScore: avgA, avgTotalScore: avgH + avgA,
    over15: (over49 / n) * 100, over25: (over54 / n) * 100, over35: (over59 / n) * 100,
    under15: 100 - (over49 / n) * 100, under25: 100 - (over54 / n) * 100, under35: 100 - (over59 / n) * 100,
    btts: 99, cleanSheetHome: 0, cleanSheetAway: 0, homeWinToNil: 0, awayWinToNil: 0,
    overTotalHigh: (over59 / n) * 100, overTotalMid: (over54 / n) * 100, overTotalLow: (over49 / n) * 100,
    totalHighLine: 59.5, totalMidLine: 54.5, totalLowLine: 49.5,
    homeWinIn3: 0, homeWinIn4: 0, homeWinIn5: 0, awayWinIn3: 0, awayWinIn4: 0, awayWinIn5: 0,
    topScorelines, scoreDistribution,
    halfTimeLeads: { home: (htHome / n) * 100, draw: (htDraw / n) * 100, away: (htAway / n) * 100 },
    lambdaHome: lh, lambdaAway: la,
  };
}

// ─── Basketball ─────────────────────────────────────────────────────────────

function simulateBasketball(odds: { home: number; away: number }, n: number, leagueAvgTotal = 215): SimulationResult {
  const imp = getImpliedProbabilities(odds);
  // Derive expected scores from win probability
  const homeAdv = 0.03;
  const pHomeAdj = Math.max(0.05, Math.min(0.95, imp.home - homeAdv));
  // Convert win prob to expected point differential (logit model)
  const logit = Math.log(pHomeAdj / (1 - pHomeAdj));
  const expectedDiff = logit * 8; // ~8 pts per logit unit
  const std = 12;
  const expectedHome = leagueAvgTotal / 2 + expectedDiff / 2;
  const expectedAway = leagueAvgTotal / 2 - expectedDiff / 2;

  const midLine = leagueAvgTotal;
  const highLine = leagueAvgTotal + 10;
  const lowLine = leagueAvgTotal - 10;

  let homeWins = 0, awayWins = 0;
  let totalH = 0, totalA = 0;
  let overHigh = 0, overMid = 0, overLow = 0;
  let htHome = 0, htAway = 0;
  const scorelines: Record<string, number> = {};
  const buckets: Record<number, number> = {};

  for (let i = 0; i < n; i++) {
    let hg = Math.round(sampleNormal(expectedHome, std));
    let ag = Math.round(sampleNormal(expectedAway, std));
    if (hg < 60) hg = 60;
    if (ag < 60) ag = 60;
    // NBA no OT simplification: if tied, home wins (slight edge)
    if (hg === ag) { if (Math.random() < 0.52) hg++; else ag++; }
    if (hg > ag) homeWins++; else awayWins++;
    // Half-time: use first half scoring ~47% of total
    const htH = Math.round(hg * 0.47 + sampleNormal(0, 3));
    const htA = Math.round(ag * 0.47 + sampleNormal(0, 3));
    if (htH > htA) htHome++; else htAway++;
    totalH += hg; totalA += ag;
    const total = hg + ag;
    if (total > highLine) overHigh++;
    if (total > midLine) overMid++;
    if (total > lowLine) overLow++;
    const key = `${hg}-${ag}`;
    scorelines[key] = (scorelines[key] || 0) + 1;
    const b = Math.floor(total / 10) * 10;
    buckets[b] = (buckets[b] || 0) + 1;
  }

  const topScorelines = Object.entries(scorelines)
    .map(([score, c]) => ({ score, pct: (c / n) * 100 }))
    .sort((a, b) => b.pct - a.pct).slice(0, 8);
  const scoreDistribution = Object.entries(buckets)
    .map(([label, c]) => ({ label: `${label}s`, pct: (c / n) * 100 }))
    .sort((a, b) => Number(a.label) - Number(b.label));

  const avgH = totalH / n, avgA = totalA / n;
  return {
    sport: "basketball", homeWinPct: (homeWins / n) * 100, drawPct: 0, awayWinPct: (awayWins / n) * 100,
    avgHomeScore: avgH, avgAwayScore: avgA, avgTotalScore: avgH + avgA,
    over15: 0, over25: 0, over35: 0, under15: 0, under25: 0, under35: 0,
    btts: 100, cleanSheetHome: 0, cleanSheetAway: 0, homeWinToNil: 0, awayWinToNil: 0,
    overTotalHigh: (overHigh / n) * 100, overTotalMid: (overMid / n) * 100, overTotalLow: (overLow / n) * 100,
    totalHighLine: highLine, totalMidLine: midLine, totalLowLine: lowLine,
    homeWinIn3: 0, homeWinIn4: 0, homeWinIn5: 0, awayWinIn3: 0, awayWinIn4: 0, awayWinIn5: 0,
    topScorelines, scoreDistribution,
    halfTimeLeads: { home: (htHome / n) * 100, draw: 0, away: (htAway / n) * 100 },
    lambdaHome: expectedHome, lambdaAway: expectedAway,
  };
}

// ─── Volleyball ──────────────────────────────────────────────────────────────

function solveSetWinProb(matchWinProb: number): number {
  // Binary search for q (set win prob) such that match win prob = matchWinProb
  // P(win match) = P(win 3 sets in best of 5) with set win prob q
  const matchProb = (q: number) => {
    const p3 = q ** 3;
    const p4 = 3 * q ** 3 * (1 - q);
    const p5 = 6 * q ** 3 * (1 - q) ** 2;
    return p3 + p4 + p5;
  };
  let lo = 0.01, hi = 0.99;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (matchProb(mid) < matchWinProb) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

function simulateVolleyball(odds: { home: number; away: number }, n: number): SimulationResult {
  const imp = getImpliedProbabilities(odds);
  const q = solveSetWinProb(imp.home); // home set win prob

  let homeWins = 0, awayWins = 0;
  let hw3 = 0, hw4 = 0, hw5 = 0, aw3 = 0, aw4 = 0, aw5 = 0;
  const matchScores: Record<string, number> = {};

  for (let i = 0; i < n; i++) {
    let hSets = 0, aSets = 0;
    while (hSets < 3 && aSets < 3) {
      if (Math.random() < q) hSets++; else aSets++;
    }
    const totalSets = hSets + aSets;
    const key = `${hSets}-${aSets}`;
    matchScores[key] = (matchScores[key] || 0) + 1;
    if (hSets > aSets) {
      homeWins++;
      if (totalSets === 3) hw3++; else if (totalSets === 4) hw4++; else hw5++;
    } else {
      awayWins++;
      if (totalSets === 3) aw3++; else if (totalSets === 4) aw4++; else aw5++;
    }
  }

  const topScorelines = Object.entries(matchScores)
    .map(([score, c]) => ({ score, pct: (c / n) * 100 }))
    .sort((a, b) => b.pct - a.pct);

  const scoreDistribution = [3, 4, 5].map((sets) => ({
    label: `${sets} Sets`,
    pct: ((hw3 + hw4 + hw5 + aw3 + aw4 + aw5) > 0
      ? (sets === 3 ? (hw3 + aw3) : sets === 4 ? (hw4 + aw4) : (hw5 + aw5)) / n * 100
      : 0),
  }));

  const avgSets = (3 * (hw3 + aw3) + 4 * (hw4 + aw4) + 5 * (hw5 + aw5)) / n;

  return {
    sport: "volleyball", homeWinPct: (homeWins / n) * 100, drawPct: 0, awayWinPct: (awayWins / n) * 100,
    avgHomeScore: 0, avgAwayScore: 0, avgTotalScore: avgSets,
    over15: 0, over25: 0, over35: 0, under15: 0, under25: 0, under35: 0,
    btts: 0, cleanSheetHome: 0, cleanSheetAway: 0, homeWinToNil: 0, awayWinToNil: 0,
    overTotalHigh: 0, overTotalMid: 0, overTotalLow: 0,
    totalHighLine: 0, totalMidLine: 0, totalLowLine: 0,
    homeWinIn3: (hw3 / n) * 100, homeWinIn4: (hw4 / n) * 100, homeWinIn5: (hw5 / n) * 100,
    awayWinIn3: (aw3 / n) * 100, awayWinIn4: (aw4 / n) * 100, awayWinIn5: (aw5 / n) * 100,
    topScorelines, scoreDistribution,
    halfTimeLeads: { home: 0, draw: 0, away: 0 },
    lambdaHome: q, lambdaAway: 1 - q,
  };
}

// ─── Main entry ─────────────────────────────────────────────────────────────

export function runSimulation(
  odds: { home: number; draw?: number; away: number },
  sport: Sport,
  iterations = 30000,
  leagueAvgTotal?: number
): SimulationResult {
  switch (sport) {
    case "basketball": return simulateBasketball(odds as { home: number; away: number }, iterations, leagueAvgTotal ?? 215);
    case "handball":   return simulateHandball(odds, iterations);
    case "volleyball": return simulateVolleyball(odds as { home: number; away: number }, iterations);
    default:           return simulateFootball(odds, iterations);
  }
}
