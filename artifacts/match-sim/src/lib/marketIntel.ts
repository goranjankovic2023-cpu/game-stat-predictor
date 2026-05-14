import type { Match } from "@/data/matches";

export type IntelLevel = "positive" | "neutral" | "negative" | "unknown";

export interface MatchIntel {
  matchId: number;
  injuryImpact: IntelLevel;
  injuryNote: string;
  playoffMomentum: IntelLevel;
  momentumNote: string;
  lineMovement: IntelLevel;
  lineNote: string;
  publicSentiment: IntelLevel;
  sentimentNote: string;
  confidenceAdjustment: number;
  homeAvailability?: number;
  awayAvailability?: number;
  homeLineupStrength?: number;
  awayLineupStrength?: number;
  homeRecentForm?: number;
  awayRecentForm?: number;
  homeMotivation?: number;
  awayMotivation?: number;
  sourceNote?: string;
  updatedAt?: string;
}

export type MarketIntelMap = Record<number, MatchIntel>;

function isIntelLevel(value: unknown): value is IntelLevel {
  return value === "positive" || value === "neutral" || value === "negative" || value === "unknown";
}

export function isMatchIntel(value: unknown): value is MatchIntel {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<MatchIntel>;
  return (
    typeof item.matchId === "number" &&
    isIntelLevel(item.injuryImpact) &&
    typeof item.injuryNote === "string" &&
    isIntelLevel(item.playoffMomentum) &&
    typeof item.momentumNote === "string" &&
    isIntelLevel(item.lineMovement) &&
    typeof item.lineNote === "string" &&
    isIntelLevel(item.publicSentiment) &&
    typeof item.sentimentNote === "string" &&
    typeof item.confidenceAdjustment === "number" &&
    (item.homeAvailability === undefined || typeof item.homeAvailability === "number") &&
    (item.awayAvailability === undefined || typeof item.awayAvailability === "number") &&
    (item.homeLineupStrength === undefined || typeof item.homeLineupStrength === "number") &&
    (item.awayLineupStrength === undefined || typeof item.awayLineupStrength === "number") &&
    (item.homeRecentForm === undefined || typeof item.homeRecentForm === "number") &&
    (item.awayRecentForm === undefined || typeof item.awayRecentForm === "number") &&
    (item.homeMotivation === undefined || typeof item.homeMotivation === "number") &&
    (item.awayMotivation === undefined || typeof item.awayMotivation === "number") &&
    (item.sourceNote === undefined || typeof item.sourceNote === "string") &&
    (item.updatedAt === undefined || typeof item.updatedAt === "string")
  );
}

export function parseMarketIntel(data: unknown): MarketIntelMap {
  if (!Array.isArray(data)) return {};
  return data.filter(isMatchIntel).reduce<MarketIntelMap>((map, item) => {
    map[item.matchId] = item;
    return map;
  }, {});
}

export function fallbackIntel(match: Match): MatchIntel {
  const hasPlayoffContext = /playoff|final|cup|semifinal|bronze|gold|game \d/i.test(`${match.league} ${match.context ?? ""}`);
  return {
    matchId: match.id,
    injuryImpact: "unknown",
    injuryNote: "Manual availability check pending",
    playoffMomentum: hasPlayoffContext ? "neutral" : "unknown",
    momentumNote: hasPlayoffContext ? "Playoff/high-stakes match detected" : "No playoff momentum signal",
    lineMovement: "unknown",
    lineNote: "Using current market price",
    publicSentiment: "unknown",
    sentimentNote: "Sentiment not priced into model",
    confidenceAdjustment: hasPlayoffContext ? 0.4 : 0,
    homeAvailability: 0,
    awayAvailability: 0,
    homeLineupStrength: 0,
    awayLineupStrength: 0,
    homeRecentForm: 0,
    awayRecentForm: 0,
    homeMotivation: hasPlayoffContext ? 0.4 : 0,
    awayMotivation: hasPlayoffContext ? 0.4 : 0,
    sourceNote: "Local model and manual refresh",
  };
}

export function getIntel(match: Match, intel: MarketIntelMap): MatchIntel {
  return intel[match.id] ?? fallbackIntel(match);
}

export function intelScore(intel: MatchIntel): number {
  return intel.confidenceAdjustment;
}

function rawProbabilities(odds: Match["odds"]) {
  return {
    home: 1 / odds.home,
    draw: odds.draw ? 1 / odds.draw : 0,
    away: 1 / odds.away,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function sideScore(intel: MatchIntel, side: "home" | "away") {
  if (side === "home") {
    return (
      (intel.homeAvailability ?? 0) +
      (intel.homeLineupStrength ?? 0) +
      (intel.homeRecentForm ?? 0) +
      (intel.homeMotivation ?? 0)
    );
  }
  return (
    (intel.awayAvailability ?? 0) +
    (intel.awayLineupStrength ?? 0) +
    (intel.awayRecentForm ?? 0) +
    (intel.awayMotivation ?? 0)
  );
}

export function intelSideDelta(intel: MatchIntel) {
  return clamp(sideScore(intel, "home") - sideScore(intel, "away"), -24, 24);
}

export function adjustedOddsForIntel(match: Match, intel: MatchIntel): Match["odds"] {
  const raw = rawProbabilities(match.odds);
  const delta = intelSideDelta(intel);
  const homeFactor = Math.exp(delta / 18);
  const awayFactor = Math.exp(-delta / 18);
  const drawFactor = match.odds.draw ? Math.max(0.9, 1 - Math.abs(delta) / 90) : 0;
  const adjustedRaw = {
    home: raw.home * homeFactor,
    draw: raw.draw * drawFactor,
    away: raw.away * awayFactor,
  };
  const total = adjustedRaw.home + adjustedRaw.draw + adjustedRaw.away;
  return {
    home: 1 / (adjustedRaw.home / total),
    ...(match.odds.draw ? { draw: 1 / (adjustedRaw.draw / total) } : {}),
    away: 1 / (adjustedRaw.away / total),
  };
}

export function intelSummary(intel: MatchIntel): string[] {
  const clean = (note: string, fallback: string) => {
    if (!note) return fallback;
    if (/no .*connected|not connected|fallback only/i.test(note)) return fallback;
    return note;
  };

  return [
    `Injuries: ${clean(intel.injuryNote, "Manual availability check pending")}`,
    `Momentum: ${clean(intel.momentumNote, "Market context only")}`,
    `Line: ${clean(intel.lineNote, "Using current market price")}`,
    `Public: ${clean(intel.sentimentNote, "Sentiment not priced into model")}`,
    `Source: ${clean(intel.sourceNote ?? "", "Local model and manual refresh")}`,
  ];
}
