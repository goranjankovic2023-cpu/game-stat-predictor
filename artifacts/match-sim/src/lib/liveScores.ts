import type { Match } from "@/data/matches";
import type { LiveEvent } from "@/components/LivePulse";

type ApiFootballFixture = {
  fixture?: {
    status?: {
      short?: string;
      elapsed?: number | null;
      long?: string;
    };
  };
  teams?: {
    home?: { name?: string };
    away?: { name?: string };
  };
  goals?: {
    home?: number | null;
    away?: number | null;
  };
};

type ApiHockeyGame = {
  date?: string;
  timer?: string | null;
  status?: { short?: string; long?: string };
  league?: { name?: string };
  teams?: {
    home?: { name?: string };
    away?: { name?: string };
  };
  scores?: {
    home?: number | null;
    away?: number | null;
  };
};

type ApiBasketballGame = {
  date?: string;
  status?: { short?: string; long?: string; timer?: string | null };
  league?: { name?: string };
  teams?: {
    home?: { name?: string };
    away?: { name?: string };
  };
  scores?: {
    home?: { total?: number | null };
    away?: { total?: number | null };
  };
};

const API_FOOTBALL_KEY = (import.meta.env.VITE_API_FOOTBALL_KEY || import.meta.env.VITE_API_SPORTS_KEY) as string | undefined;
const API_FOOTBALL_URL = "https://v3.football.api-sports.io/fixtures?live=all";
const API_HOCKEY_KEY = (import.meta.env.VITE_API_HOCKEY_KEY || import.meta.env.VITE_API_SPORTS_KEY) as string | undefined;
const API_HOCKEY_URL = "https://v1.hockey.api-sports.io/games";
const API_BASKETBALL_KEY = (import.meta.env.VITE_API_BASKETBALL_KEY || import.meta.env.VITE_API_SPORTS_KEY) as string | undefined;
const API_BASKETBALL_URL = "https://v1.basketball.api-sports.io/games";
const API_LIVE_CACHE_MS = 60 * 1000;

let footballCache: { at: number; events: LiveEvent[] } | null = null;
let hockeyCache: { at: number; events: LiveEvent[] } | null = null;
let basketballCache: { at: number; events: LiveEvent[] } | null = null;

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(fc|cf|ca|rc|real|club|deportivo)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function teamMatches(feedName: string | undefined, appName: string) {
  if (!feedName) return false;
  const feed = normalizeName(feedName);
  const app = normalizeName(appName);
  return feed === app || feed.includes(app) || app.includes(feed);
}

function findMatchForFixture(fixture: ApiFootballFixture, matches: Match[]) {
  const home = fixture.teams?.home?.name;
  const away = fixture.teams?.away?.name;
  return matches.find((match) =>
    match.sport === "football" &&
    teamMatches(home, match.home) &&
    teamMatches(away, match.away)
  );
}

function findMatchForTeams(sport: Match["sport"], home: string | undefined, away: string | undefined, matches: Match[]) {
  return matches.find((match) =>
    match.sport === sport &&
    teamMatches(home, match.home) &&
    teamMatches(away, match.away)
  );
}

function statusFromShort(short?: string): LiveEvent["status"] {
  if (!short) return "live";
  if (["FT", "AET", "PEN"].includes(short)) return "finished";
  if (["HT", "BT"].includes(short)) return "break";
  if (["NS", "TBD"].includes(short)) return "soon";
  return "live";
}

function statusFromGameShort(short?: string): LiveEvent["status"] {
  if (!short) return "live";
  if (["FT", "AOT", "AP", "PEN", "AET"].includes(short)) return "finished";
  if (["HT", "BT", "INT"].includes(short)) return "break";
  if (["NS", "TBD", "POST", "CANC"].includes(short)) return "soon";
  return "live";
}

function clockFromStatus(status?: ApiFootballFixture["fixture"]) {
  const elapsed = status?.status?.elapsed;
  const short = status?.status?.short;
  if (typeof elapsed === "number") return `${elapsed}'`;
  if (short) return short;
  return "LIVE";
}

function clockFromGame(status: ApiHockeyGame["status"], timer?: string | null) {
  if (timer) return timer;
  if (status?.short) return status.short;
  return "LIVE";
}

function dateInApiTimezone(offsetDays: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

async function fetchApiSportsDate<T>(baseUrl: string, key: string, date: string): Promise<T[]> {
  const response = await fetch(`${baseUrl}?date=${date}`, {
    cache: "no-store",
    headers: { "x-apisports-key": key },
  });
  if (!response.ok) throw new Error(`API-Sports returned ${response.status}`);

  const payload = await response.json() as { response?: T[]; errors?: unknown };
  if (!Array.isArray(payload.response)) return [];
  return payload.response;
}

export function hasApiFootballLiveProvider() {
  return Boolean(API_FOOTBALL_KEY);
}

export function hasApiHockeyLiveProvider() {
  return Boolean(API_HOCKEY_KEY);
}

export function hasApiBasketballLiveProvider() {
  return Boolean(API_BASKETBALL_KEY);
}

export async function fetchApiFootballLiveScores(matches: Match[]): Promise<LiveEvent[]> {
  if (!API_FOOTBALL_KEY) return [];
  if (footballCache && Date.now() - footballCache.at < API_LIVE_CACHE_MS) return footballCache.events;

  const response = await fetch(API_FOOTBALL_URL, {
    cache: "no-store",
    headers: { "x-apisports-key": API_FOOTBALL_KEY },
  });
  if (!response.ok) throw new Error(`API-FOOTBALL returned ${response.status}`);

  const payload = await response.json() as { response?: ApiFootballFixture[] };
  const fixtures = Array.isArray(payload.response) ? payload.response : [];
  const events: LiveEvent[] = [];

  for (const fixture of fixtures) {
    const match = findMatchForFixture(fixture, matches);
    if (!match) continue;
    events.push({
      matchId: match.id,
      clock: clockFromStatus(fixture.fixture),
      status: statusFromShort(fixture.fixture?.status?.short),
      homeScore: fixture.goals?.home ?? 0,
      awayScore: fixture.goals?.away ?? 0,
      note: "API-FOOTBALL live score",
      pressure: "neutral",
      updatedAt: new Date().toISOString(),
    });
  }

  footballCache = { at: Date.now(), events };
  return events;
}

export async function fetchApiHockeyLiveScores(matches: Match[]): Promise<LiveEvent[]> {
  if (!API_HOCKEY_KEY) return [];
  if (hockeyCache && Date.now() - hockeyCache.at < API_LIVE_CACHE_MS) return hockeyCache.events;

  const games = (await Promise.all([
    fetchApiSportsDate<ApiHockeyGame>(API_HOCKEY_URL, API_HOCKEY_KEY, dateInApiTimezone(-1)),
    fetchApiSportsDate<ApiHockeyGame>(API_HOCKEY_URL, API_HOCKEY_KEY, dateInApiTimezone(0)),
    fetchApiSportsDate<ApiHockeyGame>(API_HOCKEY_URL, API_HOCKEY_KEY, dateInApiTimezone(1)),
  ])).flat();

  const events: LiveEvent[] = [];
  for (const game of games) {
    const match = findMatchForTeams("hockey", game.teams?.home?.name, game.teams?.away?.name, matches);
    if (!match) continue;

    const status = statusFromGameShort(game.status?.short);
    events.push({
      matchId: match.id,
      clock: clockFromGame(game.status, game.timer),
      status,
      homeScore: game.scores?.home ?? 0,
      awayScore: game.scores?.away ?? 0,
      note: status === "finished" ? "API-HOCKEY final score" : "API-HOCKEY live score",
      pressure: "neutral",
      updatedAt: status === "finished" && game.date ? game.date : new Date().toISOString(),
    });
  }

  hockeyCache = { at: Date.now(), events };
  return events;
}

export async function fetchApiBasketballLiveScores(matches: Match[]): Promise<LiveEvent[]> {
  if (!API_BASKETBALL_KEY) return [];
  if (basketballCache && Date.now() - basketballCache.at < API_LIVE_CACHE_MS) return basketballCache.events;

  const games = (await Promise.all([
    fetchApiSportsDate<ApiBasketballGame>(API_BASKETBALL_URL, API_BASKETBALL_KEY, dateInApiTimezone(-1)),
    fetchApiSportsDate<ApiBasketballGame>(API_BASKETBALL_URL, API_BASKETBALL_KEY, dateInApiTimezone(0)),
    fetchApiSportsDate<ApiBasketballGame>(API_BASKETBALL_URL, API_BASKETBALL_KEY, dateInApiTimezone(1)),
  ])).flat();

  const events: LiveEvent[] = [];
  for (const game of games) {
    const match = findMatchForTeams("basketball", game.teams?.home?.name, game.teams?.away?.name, matches);
    if (!match) continue;

    const status = statusFromGameShort(game.status?.short);
    events.push({
      matchId: match.id,
      clock: clockFromGame(game.status, game.status?.timer),
      status,
      homeScore: game.scores?.home?.total ?? 0,
      awayScore: game.scores?.away?.total ?? 0,
      note: status === "finished" ? "API-BASKETBALL final score" : "API-BASKETBALL live score",
      pressure: "neutral",
      updatedAt: status === "finished" && game.date ? game.date : new Date().toISOString(),
    });
  }

  basketballCache = { at: Date.now(), events };
  return events;
}
