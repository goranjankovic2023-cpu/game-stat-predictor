export interface Match {
  id: number;
  home: string;
  away: string;
  date: string;
  day: "saturday" | "sunday";
  time: string;
  league: string;
  leagueShort: string;
  country: string;
  flag: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

export const matches: Match[] = [
  // ── SATURDAY 16 MAY ─────────────────────────────────────────────────
  // Bundesliga MD34 — simultaneous 15:30 CEST
  {
    id: 101, home: "Bayern Munich", away: "FC Köln",
    date: "SAT 16.05", day: "saturday", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪",
    odds: { home: 1.18, draw: 7.50, away: 15.00 },
  },
  {
    id: 102, home: "Borussia Dortmund", away: "Wolfsburg",
    date: "SAT 16.05", day: "saturday", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪",
    odds: { home: 1.55, draw: 4.20, away: 6.00 },
  },
  {
    id: 103, home: "Bayer Leverkusen", away: "Heidenheim",
    date: "SAT 16.05", day: "saturday", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪",
    odds: { home: 1.45, draw: 4.50, away: 7.00 },
  },
  {
    id: 104, home: "RB Leipzig", away: "Werder Bremen",
    date: "SAT 16.05", day: "saturday", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪",
    odds: { home: 1.60, draw: 4.00, away: 5.50 },
  },
  {
    id: 105, home: "Eintracht Frankfurt", away: "Mainz",
    date: "SAT 16.05", day: "saturday", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪",
    odds: { home: 1.80, draw: 3.60, away: 4.50 },
  },
  {
    id: 106, home: "Hamburger SV", away: "Stuttgart",
    date: "SAT 16.05", day: "saturday", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪",
    odds: { home: 2.20, draw: 3.30, away: 3.40 },
  },
  {
    id: 107, home: "Augsburg", away: "Freiburg",
    date: "SAT 16.05", day: "saturday", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪",
    odds: { home: 2.55, draw: 3.20, away: 2.80 },
  },
  {
    id: 108, home: "Hoffenheim", away: "Union Berlin",
    date: "SAT 16.05", day: "saturday", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪",
    odds: { home: 2.20, draw: 3.30, away: 3.40 },
  },
  {
    id: 109, home: "Borussia M'gladbach", away: "St. Pauli",
    date: "SAT 16.05", day: "saturday", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪",
    odds: { home: 1.90, draw: 3.50, away: 4.20 },
  },
  // Slovensko 1. liga — 17:00 CEST
  {
    id: 1, home: "Dunajska Streda", away: "Spartak Trnava",
    date: "SAT 16.05", day: "saturday", time: "17:00", league: "Slovensko 1. Liga", leagueShort: "1. Liga", country: "Slovakia", flag: "🇸🇰",
    odds: { home: 2.20, draw: 3.10, away: 3.10 },
  },
  {
    id: 2, home: "Komarno", away: "Tatran Prešov",
    date: "SAT 16.05", day: "saturday", time: "17:00", league: "Slovensko 1. Liga", leagueShort: "1. Liga", country: "Slovakia", flag: "🇸🇰",
    odds: { home: 2.30, draw: 3.00, away: 3.00 },
  },
  {
    id: 3, home: "Skalica", away: "Ružomberok",
    date: "SAT 16.05", day: "saturday", time: "17:00", league: "Slovensko 1. Liga", leagueShort: "1. Liga", country: "Slovakia", flag: "🇸🇰",
    odds: { home: 1.64, draw: 3.55, away: 4.80 },
  },
  {
    id: 4, home: "Slovan Bratislava", away: "Zemplin Michalovce",
    date: "SAT 16.05", day: "saturday", time: "17:00", league: "Slovensko 1. Liga", leagueShort: "1. Liga", country: "Slovakia", flag: "🇸🇰",
    odds: { home: 1.32, draw: 5.00, away: 7.00 },
  },
  {
    id: 5, home: "Trenčin", away: "FC Košice",
    date: "SAT 16.05", day: "saturday", time: "17:00", league: "Slovensko 1. Liga", leagueShort: "1. Liga", country: "Slovakia", flag: "🇸🇰",
    odds: { home: 2.65, draw: 3.45, away: 2.30 },
  },
  {
    id: 6, home: "Žilina", away: "Podbrezova",
    date: "SAT 16.05", day: "saturday", time: "17:00", league: "Slovensko 1. Liga", leagueShort: "1. Liga", country: "Slovakia", flag: "🇸🇰",
    odds: { home: 1.66, draw: 4.00, away: 4.05 },
  },

  // ── SUNDAY 17 MAY ───────────────────────────────────────────────────
  // Premier League MW37 — 15:00 BST all kick-off simultaneously
  {
    id: 201, home: "Aston Villa", away: "Liverpool",
    date: "SUN 17.05", day: "sunday", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    odds: { home: 3.10, draw: 3.90, away: 2.05 },
  },
  {
    id: 202, home: "Arsenal", away: "Burnley",
    date: "SUN 17.05", day: "sunday", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    odds: { home: 1.22, draw: 6.50, away: 12.00 },
  },
  {
    id: 203, home: "Manchester United", away: "Nottm Forest",
    date: "SUN 17.05", day: "sunday", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    odds: { home: 1.62, draw: 4.40, away: 5.00 },
  },
  {
    id: 204, home: "Chelsea", away: "Tottenham",
    date: "SUN 17.05", day: "sunday", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    odds: { home: 1.90, draw: 3.60, away: 4.00 },
  },
  {
    id: 205, home: "Newcastle United", away: "West Ham",
    date: "SUN 17.05", day: "sunday", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    odds: { home: 1.75, draw: 3.70, away: 4.80 },
  },
  {
    id: 206, home: "Bournemouth", away: "Manchester City",
    date: "SUN 17.05", day: "sunday", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    odds: { home: 4.50, draw: 3.80, away: 1.85 },
  },
  {
    id: 207, home: "Leeds United", away: "Brighton",
    date: "SUN 17.05", day: "sunday", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    odds: { home: 2.40, draw: 3.30, away: 2.90 },
  },
  {
    id: 208, home: "Crystal Palace", away: "Brentford",
    date: "SUN 17.05", day: "sunday", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    odds: { home: 2.20, draw: 3.40, away: 3.30 },
  },
  {
    id: 209, home: "Everton", away: "Sunderland",
    date: "SUN 17.05", day: "sunday", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    odds: { home: 2.10, draw: 3.30, away: 3.60 },
  },
  {
    id: 210, home: "Wolves", away: "Fulham",
    date: "SUN 17.05", day: "sunday", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    odds: { home: 2.50, draw: 3.30, away: 2.75 },
  },
  // Serie A MD37
  {
    id: 301, home: "AS Roma", away: "Lazio",
    date: "SUN 17.05", day: "sunday", time: "18:00", league: "Serie A MD37", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹",
    odds: { home: 1.75, draw: 3.50, away: 4.80 },
  },
  {
    id: 302, home: "Juventus", away: "Fiorentina",
    date: "SUN 17.05", day: "sunday", time: "18:00", league: "Serie A MD37", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹",
    odds: { home: 1.65, draw: 4.00, away: 5.50 },
  },
  {
    id: 303, home: "Genoa", away: "AC Milan",
    date: "SUN 17.05", day: "sunday", time: "18:00", league: "Serie A MD37", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹",
    odds: { home: 3.20, draw: 3.40, away: 2.10 },
  },
  {
    id: 304, home: "Inter Milan", away: "Verona",
    date: "SUN 17.05", day: "sunday", time: "18:00", league: "Serie A MD37", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹",
    odds: { home: 1.28, draw: 5.50, away: 10.00 },
  },
  {
    id: 305, home: "Atalanta", away: "Bologna",
    date: "SUN 17.05", day: "sunday", time: "18:00", league: "Serie A MD37", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹",
    odds: { home: 1.65, draw: 3.80, away: 5.50 },
  },
  {
    id: 306, home: "Pisa", away: "Napoli",
    date: "SUN 17.05", day: "sunday", time: "18:00", league: "Serie A MD37", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹",
    odds: { home: 3.50, draw: 3.40, away: 2.10 },
  },
  // La Liga MD36
  {
    id: 401, home: "Barcelona", away: "Real Betis",
    date: "SUN 17.05", day: "sunday", time: "19:00", league: "La Liga MD36", leagueShort: "La Liga", country: "Spain", flag: "🇪🇸",
    odds: { home: 1.33, draw: 5.00, away: 8.50 },
  },
  {
    id: 402, home: "Atletico Madrid", away: "Girona",
    date: "SUN 17.05", day: "sunday", time: "19:00", league: "La Liga MD36", leagueShort: "La Liga", country: "Spain", flag: "🇪🇸",
    odds: { home: 1.80, draw: 3.60, away: 4.80 },
  },
  {
    id: 403, home: "Athletic Bilbao", away: "Celta Vigo",
    date: "SUN 17.05", day: "sunday", time: "19:00", league: "La Liga MD36", leagueShort: "La Liga", country: "Spain", flag: "🇪🇸",
    odds: { home: 1.90, draw: 3.50, away: 4.20 },
  },
  {
    id: 404, home: "Rayo Vallecano", away: "Villarreal",
    date: "SUN 17.05", day: "sunday", time: "19:00", league: "La Liga MD36", leagueShort: "La Liga", country: "Spain", flag: "🇪🇸",
    odds: { home: 2.30, draw: 3.20, away: 3.10 },
  },
  // Eredivisie MD34
  {
    id: 501, home: "PSV Eindhoven", away: "FC Twente",
    date: "SUN 17.05", day: "sunday", time: "14:30", league: "Eredivisie MD34", leagueShort: "Eredivisie", country: "Netherlands", flag: "🇳🇱",
    odds: { home: 1.40, draw: 4.50, away: 8.00 },
  },
  {
    id: 502, home: "sc Heerenveen", away: "Ajax",
    date: "SUN 17.05", day: "sunday", time: "14:30", league: "Eredivisie MD34", leagueShort: "Eredivisie", country: "Netherlands", flag: "🇳🇱",
    odds: { home: 4.80, draw: 4.00, away: 1.72 },
  },
  {
    id: 503, home: "PEC Zwolle", away: "Feyenoord",
    date: "SUN 17.05", day: "sunday", time: "14:30", league: "Eredivisie MD34", leagueShort: "Eredivisie", country: "Netherlands", flag: "🇳🇱",
    odds: { home: 4.50, draw: 3.80, away: 1.80 },
  },
];

export const leagues = [...new Set(matches.map((m) => m.leagueShort))];
export const saturdays = matches.filter((m) => m.day === "saturday");
export const sundays = matches.filter((m) => m.day === "sunday");
