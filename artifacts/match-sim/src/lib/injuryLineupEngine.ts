import type { Match } from "@/data/matches";
import type { FootballAvailabilityInput } from "@/lib/simulation";
import type { AvailabilityDecisionContext } from "@/lib/bettingDecision";

export type PlayerAvailabilityStatus = "injured" | "suspended" | "doubtful" | "rested" | "available";
export type PlayerImportance = "low" | "medium" | "high" | "key";
export type LineupStatus = "unknown" | "predicted" | "confirmed";
export type InjuryImpact = "none" | "low" | "medium" | "high";

export interface InjuryLineupRecord {
  matchId: number;
  team: string;
  player: string;
  status: PlayerAvailabilityStatus;
  importance: PlayerImportance;
  position: string;
  source: string;
  updatedAt: string;
}

export interface LineupRecord {
  matchId: number;
  team?: string;
  status: LineupStatus;
  source: string;
  updatedAt: string;
}

export interface MatchInjuryLineupIntel {
  matchId: number;
  lineupStatus: LineupStatus;
  homeLineupStatus: LineupStatus;
  awayLineupStatus: LineupStatus;
  injuries: InjuryLineupRecord[];
  injuryImpact: InjuryImpact;
  source?: string;
  updatedAt?: string;
  simulation?: FootballAvailabilityInput;
  decisionContext: AvailabilityDecisionContext;
  reason?: string;
}

export type InjuryLineupMap = Record<number, MatchInjuryLineupIntel>;

type FeedShape = {
  players?: unknown[];
  lineups?: unknown[];
};

const EMPTY_REASON = "Lineups/injuries unknown - not included.";

function isStatus(value: unknown): value is PlayerAvailabilityStatus {
  return value === "injured" || value === "suspended" || value === "doubtful" || value === "rested" || value === "available";
}

function isImportance(value: unknown): value is PlayerImportance {
  return value === "low" || value === "medium" || value === "high" || value === "key";
}

function isLineupStatus(value: unknown): value is LineupStatus {
  return value === "unknown" || value === "predicted" || value === "confirmed";
}

export function isInjuryLineupRecord(value: unknown): value is InjuryLineupRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<InjuryLineupRecord>;
  return (
    typeof item.matchId === "number" &&
    typeof item.team === "string" &&
    typeof item.player === "string" &&
    isStatus(item.status) &&
    isImportance(item.importance) &&
    typeof item.position === "string" &&
    typeof item.source === "string" &&
    typeof item.updatedAt === "string"
  );
}

export function isLineupRecord(value: unknown): value is LineupRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<LineupRecord>;
  return (
    typeof item.matchId === "number" &&
    isLineupStatus(item.status) &&
    typeof item.source === "string" &&
    typeof item.updatedAt === "string" &&
    (item.team === undefined || typeof item.team === "string")
  );
}

function parseFeed(data: unknown) {
  if (Array.isArray(data)) return { players: data.filter(isInjuryLineupRecord), lineups: [] as LineupRecord[] };

  const feed = data as FeedShape;
  return {
    players: Array.isArray(feed?.players) ? feed.players.filter(isInjuryLineupRecord) : [],
    lineups: Array.isArray(feed?.lineups) ? feed.lineups.filter(isLineupRecord) : [],
  };
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function teamSide(match: Match, team: string): "home" | "away" | null {
  const candidate = normalize(team);
  const home = normalize(match.home);
  const away = normalize(match.away);
  if (candidate === home || candidate.includes(home) || home.includes(candidate)) return "home";
  if (candidate === away || candidate.includes(away) || away.includes(candidate)) return "away";
  return null;
}

function statusPriority(status: LineupStatus) {
  if (status === "confirmed") return 2;
  if (status === "predicted") return 1;
  return 0;
}

function bestLineupStatus(statuses: LineupStatus[]) {
  return statuses.reduce<LineupStatus>((best, status) => statusPriority(status) > statusPriority(best) ? status : best, "unknown");
}

function positionBucket(position: string) {
  if (/striker|forward|wing|attacking|st\b|cf\b|lw\b|rw\b/i.test(position)) return "attack";
  if (/keeper|goalkeeper|gk\b|defender|centre.?back|center.?back|full.?back|cb\b|lb\b|rb\b/i.test(position)) return "defense";
  if (/midfield|dm\b|cm\b|am\b/i.test(position)) return "midfield";
  return "general";
}

function importanceWeight(importance: PlayerImportance) {
  if (importance === "key") return 1;
  if (importance === "high") return 0.72;
  if (importance === "medium") return 0.42;
  return 0.18;
}

function statusWeight(status: PlayerAvailabilityStatus) {
  if (status === "available") return -0.12;
  if (status === "doubtful") return 0.45;
  return 1;
}

function isAbsence(status: PlayerAvailabilityStatus) {
  return status === "injured" || status === "suspended" || status === "doubtful" || status === "rested";
}

function impactLevel(score: number): InjuryImpact {
  if (score <= 0.01) return "none";
  if (score < 0.7) return "low";
  if (score < 1.55) return "medium";
  return "high";
}

function mostRecent(records: { source: string; updatedAt: string }[]) {
  return records.reduce<{ source?: string; updatedAt?: string }>((best, record) => {
    const current = new Date(record.updatedAt).getTime();
    const prior = best.updatedAt ? new Date(best.updatedAt).getTime() : 0;
    if (Number.isFinite(current) && current >= prior) return { source: record.source, updatedAt: record.updatedAt };
    return best;
  }, {});
}

function buildSimulation(match: Match, players: InjuryLineupRecord[], homeStatus: LineupStatus, awayStatus: LineupStatus, source?: string, updatedAt?: string): FootballAvailabilityInput | undefined {
  if (players.length === 0 && homeStatus === "unknown" && awayStatus === "unknown") return undefined;

  const team = {
    home: { attack: 0, defense: 0 },
    away: { attack: 0, defense: 0 },
  };

  for (const player of players) {
    const side = teamSide(match, player.team);
    if (!side) continue;

    const bucket = positionBucket(player.position);
    const signedImpact = -statusWeight(player.status) * importanceWeight(player.importance);
    const attackShare = bucket === "attack" ? 1 : bucket === "midfield" ? 0.45 : bucket === "general" ? 0.25 : 0;
    const defenseShare = bucket === "defense" ? 1 : bucket === "midfield" ? 0.45 : bucket === "general" ? 0.25 : 0;

    team[side].attack += signedImpact * attackShare;
    team[side].defense += signedImpact * defenseShare;
  }

  const feedConfidence = Math.max(statusPriority(homeStatus), statusPriority(awayStatus)) === 2 ? 1 : Math.max(statusPriority(homeStatus), statusPriority(awayStatus)) === 1 ? 0.72 : 0.55;

  return {
    homeAttack: Math.max(-1, Math.min(1, team.home.attack)),
    homeDefense: Math.max(-1, Math.min(1, team.home.defense)),
    awayAttack: Math.max(-1, Math.min(1, team.away.attack)),
    awayDefense: Math.max(-1, Math.min(1, team.away.defense)),
    confidence: feedConfidence,
    confidenceAdjustment: 0,
    source: source ?? "injury-lineup feed",
    updatedAt: updatedAt ?? new Date().toISOString(),
  };
}

function buildMatchIntel(match: Match, players: InjuryLineupRecord[], lineups: LineupRecord[]): MatchInjuryLineupIntel {
  const matchLineups = lineups.filter((lineup) => lineup.matchId === match.id);
  const homeLineups = matchLineups.filter((lineup) => !lineup.team || teamSide(match, lineup.team) === "home").map((lineup) => lineup.status);
  const awayLineups = matchLineups.filter((lineup) => !lineup.team || teamSide(match, lineup.team) === "away").map((lineup) => lineup.status);
  const homeLineupStatus = bestLineupStatus(homeLineups);
  const awayLineupStatus = bestLineupStatus(awayLineups);
  const lineupStatus = homeLineupStatus === "confirmed" && awayLineupStatus === "confirmed"
    ? "confirmed"
    : bestLineupStatus([homeLineupStatus, awayLineupStatus]);
  const matchPlayers = players.filter((player) => player.matchId === match.id);
  const absenceScore = matchPlayers
    .filter((player) => isAbsence(player.status))
    .reduce((sum, player) => sum + importanceWeight(player.importance) * statusWeight(player.status), 0);
  const injuryImpact = impactLevel(absenceScore);
  const sourceInfo = mostRecent([...matchPlayers, ...matchLineups]);
  const simulation = buildSimulation(match, matchPlayers, homeLineupStatus, awayLineupStatus, sourceInfo.source, sourceInfo.updatedAt);
  const confidenceAdjustment =
    lineupStatus === "confirmed" && (injuryImpact === "none" || injuryImpact === "low") ? 6 :
    injuryImpact === "high" ? -12 :
    injuryImpact === "medium" ? -6 :
    lineupStatus === "predicted" ? 2 :
    -8;

  return {
    matchId: match.id,
    lineupStatus,
    homeLineupStatus,
    awayLineupStatus,
    injuries: matchPlayers,
    injuryImpact,
    source: sourceInfo.source,
    updatedAt: sourceInfo.updatedAt,
    simulation,
    decisionContext: {
      lineupStatus,
      injuryImpact,
      confidenceAdjustment,
      warning: simulation ? undefined : EMPTY_REASON,
    },
    reason: simulation ? undefined : EMPTY_REASON,
  };
}

export function unknownInjuryLineup(matchId: number): MatchInjuryLineupIntel {
  return {
    matchId,
    lineupStatus: "unknown",
    homeLineupStatus: "unknown",
    awayLineupStatus: "unknown",
    injuries: [],
    injuryImpact: "none",
    decisionContext: {
      lineupStatus: "unknown",
      injuryImpact: "none",
      confidenceAdjustment: -8,
      warning: EMPTY_REASON,
    },
    reason: EMPTY_REASON,
  };
}

export function getInjuryLineup(match: Match, map: InjuryLineupMap): MatchInjuryLineupIntel {
  return map[match.id] ?? unknownInjuryLineup(match.id);
}

export async function loadInjuryLineups(matches: Match[]): Promise<InjuryLineupMap> {
  try {
    const response = await fetch(`/injury-lineup.json?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`injury-lineup feed returned ${response.status}`);
    const feed = parseFeed(await response.json());
    return matches.reduce<InjuryLineupMap>((map, match) => {
      map[match.id] = buildMatchIntel(match, feed.players, feed.lineups);
      return map;
    }, {});
  } catch (error) {
    console.warn("[match-sim] injury-lineup feed unavailable; injuries and lineups are not included.", error);
    return matches.reduce<InjuryLineupMap>((map, match) => {
      map[match.id] = unknownInjuryLineup(match.id);
      return map;
    }, {});
  }
}
