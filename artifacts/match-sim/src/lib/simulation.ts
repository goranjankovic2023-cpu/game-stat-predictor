export interface ImpliedProbabilities {
  home: number;
  draw: number;
  away: number;
  overround: number;
}

export interface SimulationResult {
  homeWinPct: number;
  drawPct: number;
  awayWinPct: number;
  avgHomeGoals: number;
  avgAwayGoals: number;
  avgTotalGoals: number;
  btts: number;
  over15: number;
  over25: number;
  over35: number;
  cleanSheetHome: number;
  cleanSheetAway: number;
  homeWinToNil: number;
  awayWinToNil: number;
  topScorelines: { score: string; pct: number }[];
  goalDistribution: { goals: number; pct: number }[];
  halfTimeLeads: { home: number; draw: number; away: number };
  lambdaHome: number;
  lambdaAway: number;
}

function poissonPmf(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  let logP = -lambda + k * Math.log(lambda);
  for (let i = 2; i <= k; i++) logP -= Math.log(i);
  return Math.exp(logP);
}

function buildScoreMatrix(lh: number, la: number, maxGoals = 8) {
  const matrix: number[][] = [];
  for (let i = 0; i <= maxGoals; i++) {
    matrix[i] = [];
    for (let j = 0; j <= maxGoals; j++) {
      matrix[i][j] = poissonPmf(i, lh) * poissonPmf(j, la);
    }
  }
  return matrix;
}

function calcProbs(lh: number, la: number) {
  const m = buildScoreMatrix(lh, la);
  let h = 0, d = 0, a = 0;
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      if (i > j) h += m[i][j];
      else if (i === j) d += m[i][j];
      else a += m[i][j];
    }
  }
  return { h, d, a };
}

export function getImpliedProbabilities(odds: { home: number; draw: number; away: number }): ImpliedProbabilities {
  const rawH = 1 / odds.home;
  const rawD = 1 / odds.draw;
  const rawA = 1 / odds.away;
  const total = rawH + rawD + rawA;
  return {
    home: rawH / total,
    draw: rawD / total,
    away: rawA / total,
    overround: (total - 1) * 100,
  };
}

function findLambdas(pH: number, _pD: number, pA: number): { lh: number; la: number } {
  let bestLh = 1.2, bestLa = 1.1;
  let bestErr = Infinity;

  for (let lh = 0.3; lh <= 4.0; lh += 0.05) {
    for (let la = 0.3; la <= 4.0; la += 0.05) {
      const p = calcProbs(lh, la);
      const err = Math.abs(p.h - pH) + Math.abs(p.a - pA);
      if (err < bestErr) {
        bestErr = err;
        bestLh = lh;
        bestLa = la;
      }
    }
  }

  for (let dLh = -0.1; dLh <= 0.1; dLh += 0.005) {
    for (let dLa = -0.1; dLa <= 0.1; dLa += 0.005) {
      const lh = bestLh + dLh;
      const la = bestLa + dLa;
      if (lh <= 0 || la <= 0) continue;
      const p = calcProbs(lh, la);
      const err = Math.abs(p.h - pH) + Math.abs(p.a - pA);
      if (err < bestErr) {
        bestErr = err;
        bestLh = lh;
        bestLa = la;
      }
    }
  }

  return { lh: bestLh, la: bestLa };
}

function samplePoisson(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

export function runSimulation(odds: { home: number; draw: number; away: number }, iterations = 50000): SimulationResult {
  const implied = getImpliedProbabilities(odds);
  const { lh, la } = findLambdas(implied.home, implied.draw, implied.away);

  let homeWins = 0, draws = 0, awayWins = 0;
  let totalHomeGoals = 0, totalAwayGoals = 0;
  let btts = 0, over15 = 0, over25 = 0, over35 = 0;
  let cleanSheetHome = 0, cleanSheetAway = 0;
  let homeWinToNil = 0, awayWinToNil = 0;
  const scorelines: Record<string, number> = {};
  const goalCounts: Record<number, number> = {};
  let htHome = 0, htDraw = 0, htAway = 0;

  for (let i = 0; i < iterations; i++) {
    const hg = samplePoisson(lh);
    const ag = samplePoisson(la);

    const hhg = samplePoisson(lh * 0.5);
    const hag = samplePoisson(la * 0.5);

    if (hg > ag) homeWins++;
    else if (hg === ag) draws++;
    else awayWins++;

    if (hhg > hag) htHome++;
    else if (hhg === hag) htDraw++;
    else htAway++;

    totalHomeGoals += hg;
    totalAwayGoals += ag;

    const total = hg + ag;
    if (hg > 0 && ag > 0) btts++;
    if (total > 1.5) over15++;
    if (total > 2.5) over25++;
    if (total > 3.5) over35++;
    if (ag === 0) cleanSheetHome++;
    if (hg === 0) cleanSheetAway++;
    if (hg > ag && ag === 0) homeWinToNil++;
    if (ag > hg && hg === 0) awayWinToNil++;

    const key = `${hg}-${ag}`;
    scorelines[key] = (scorelines[key] || 0) + 1;

    goalCounts[total] = (goalCounts[total] || 0) + 1;
  }

  const topScorelines = Object.entries(scorelines)
    .map(([score, count]) => ({ score, pct: (count / iterations) * 100 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 8);

  const maxGoals = Math.max(...Object.keys(goalCounts).map(Number));
  const goalDistribution = Array.from({ length: Math.min(maxGoals + 1, 9) }, (_, g) => ({
    goals: g,
    pct: ((goalCounts[g] || 0) / iterations) * 100,
  }));

  return {
    homeWinPct: (homeWins / iterations) * 100,
    drawPct: (draws / iterations) * 100,
    awayWinPct: (awayWins / iterations) * 100,
    avgHomeGoals: totalHomeGoals / iterations,
    avgAwayGoals: totalAwayGoals / iterations,
    avgTotalGoals: (totalHomeGoals + totalAwayGoals) / iterations,
    btts: (btts / iterations) * 100,
    over15: (over15 / iterations) * 100,
    over25: (over25 / iterations) * 100,
    over35: (over35 / iterations) * 100,
    cleanSheetHome: (cleanSheetHome / iterations) * 100,
    cleanSheetAway: (cleanSheetAway / iterations) * 100,
    homeWinToNil: (homeWinToNil / iterations) * 100,
    awayWinToNil: (awayWinToNil / iterations) * 100,
    topScorelines,
    goalDistribution,
    halfTimeLeads: {
      home: (htHome / iterations) * 100,
      draw: (htDraw / iterations) * 100,
      away: (htAway / iterations) * 100,
    },
    lambdaHome: lh,
    lambdaAway: la,
  };
}
