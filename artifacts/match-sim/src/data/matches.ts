import type { Sport } from "@/lib/simulation";

export interface Match {
  id: number;
  sport: Sport;
  home: string;
  away: string;
  date: string; // YYYY-MM-DD
  time: string;
  league: string;
  leagueShort: string;
  country: string;
  flag: string;
  odds: { home: number; draw?: number; away: number };
  context?: string;
  leagueAvgTotal?: number; // for basketball
}

const F = "football" as Sport;
const BB = "basketball" as Sport;
const HB = "handball" as Sport;
const VB = "volleyball" as Sport;

export const matches: Match[] = [
  // ── MAY 13 (Wednesday) ──────────────────────────────────────────────────
  // Ligue 1 MD33
  { id: 1001, sport: F, home: "PSG", away: "Brest", date: "2026-05-13", time: "21:00", league: "Ligue 1 MD33", leagueShort: "Ligue 1", country: "France", flag: "🇫🇷", odds: { home: 1.28, draw: 5.50, away: 10.00 } },
  { id: 1002, sport: F, home: "Le Havre", away: "Marseille", date: "2026-05-13", time: "21:00", league: "Ligue 1 MD33", leagueShort: "Ligue 1", country: "France", flag: "🇫🇷", odds: { home: 3.40, draw: 3.20, away: 2.15 } },
  { id: 1003, sport: F, home: "Toulouse", away: "Lyon", date: "2026-05-13", time: "21:00", league: "Ligue 1 MD33", leagueShort: "Ligue 1", country: "France", flag: "🇫🇷", odds: { home: 2.80, draw: 3.20, away: 2.55 } },
  { id: 1004, sport: F, home: "Monaco", away: "Lille", date: "2026-05-13", time: "21:00", league: "Ligue 1 MD33", leagueShort: "Ligue 1", country: "France", flag: "🇫🇷", odds: { home: 2.00, draw: 3.40, away: 3.80 } },
  { id: 1005, sport: F, home: "Auxerre", away: "Nice", date: "2026-05-13", time: "21:00", league: "Ligue 1 MD33", leagueShort: "Ligue 1", country: "France", flag: "🇫🇷", odds: { home: 2.40, draw: 3.30, away: 2.90 } },
  // Scottish MD37
  { id: 1010, sport: F, home: "Hearts", away: "Falkirk", date: "2026-05-13", time: "19:45", league: "Scottish Prem MD37", leagueShort: "Scottish Prem", country: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", odds: { home: 1.60, draw: 3.80, away: 6.00 } },
  { id: 1011, sport: F, home: "Motherwell", away: "Celtic", date: "2026-05-13", time: "19:45", league: "Scottish Prem MD37", leagueShort: "Scottish Prem", country: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", odds: { home: 5.50, draw: 4.00, away: 1.55 } },
  { id: 1012, sport: F, home: "Rangers", away: "Hibernian", date: "2026-05-13", time: "19:45", league: "Scottish Prem MD37", leagueShort: "Scottish Prem", country: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", odds: { home: 1.65, draw: 3.80, away: 5.00 } },
  // NBA Playoffs
  { id: 1020, sport: BB, home: "Cleveland Cavaliers", away: "Detroit Pistons", date: "2026-05-13", time: "20:00", league: "NBA Playoffs R2", leagueShort: "NBA Playoffs", country: "USA", flag: "🇺🇸", odds: { home: 1.65, away: 2.25 }, context: "Game 5", leagueAvgTotal: 218 },
  { id: 1021, sport: BB, home: "Minnesota Timberwolves", away: "San Antonio Spurs", date: "2026-05-13", time: "22:30", league: "NBA Playoffs R2", leagueShort: "NBA Playoffs", country: "USA", flag: "🇺🇸", odds: { home: 1.50, away: 2.60 }, context: "Game 5", leagueAvgTotal: 215 },

  // ── MAY 14 (Thursday) ──────────────────────────────────────────────────
  // Turkish Süper Lig
  { id: 1030, sport: F, home: "Galatasaray", away: "Fenerbahçe", date: "2026-05-14", time: "20:00", league: "Süper Lig MD37", leagueShort: "Süper Lig", country: "Turkey", flag: "🇹🇷", odds: { home: 2.10, draw: 3.30, away: 3.60 } },
  { id: 1031, sport: F, home: "Beşiktaş", away: "Trabzonspor", date: "2026-05-14", time: "20:00", league: "Süper Lig MD37", leagueShort: "Süper Lig", country: "Turkey", flag: "🇹🇷", odds: { home: 1.85, draw: 3.50, away: 4.40 } },
  { id: 1032, sport: F, home: "Başakşehir", away: "Kasımpaşa", date: "2026-05-14", time: "20:00", league: "Süper Lig MD37", leagueShort: "Süper Lig", country: "Turkey", flag: "🇹🇷", odds: { home: 2.00, draw: 3.30, away: 3.80 } },
  // Portuguese Liga
  { id: 1035, sport: F, home: "Benfica", away: "Braga", date: "2026-05-14", time: "20:30", league: "Liga Portugal MD33", leagueShort: "Liga Portugal", country: "Portugal", flag: "🇵🇹", odds: { home: 1.60, draw: 3.80, away: 5.50 } },
  { id: 1036, sport: F, home: "Porto", away: "Sporting CP", date: "2026-05-14", time: "20:30", league: "Liga Portugal MD33", leagueShort: "Liga Portugal", country: "Portugal", flag: "🇵🇹", odds: { home: 2.30, draw: 3.30, away: 3.10 } },
  // NBA
  { id: 1040, sport: BB, home: "Oklahoma City Thunder", away: "Denver Nuggets", date: "2026-05-14", time: "21:00", league: "NBA Playoffs R2", leagueShort: "NBA Playoffs", country: "USA", flag: "🇺🇸", odds: { home: 1.72, away: 2.10 }, context: "Game 5", leagueAvgTotal: 220 },

  // ── MAY 15 (Friday) ────────────────────────────────────────────────────
  // Greek Super League
  { id: 1050, sport: F, home: "Olympiakos", away: "Panathinaikos", date: "2026-05-15", time: "20:00", league: "Super League MD36", leagueShort: "Super League", country: "Greece", flag: "🇬🇷", odds: { home: 1.90, draw: 3.40, away: 4.00 } },
  { id: 1051, sport: F, home: "PAOK", away: "AEK Athens", date: "2026-05-15", time: "20:00", league: "Super League MD36", leagueShort: "Super League", country: "Greece", flag: "🇬🇷", odds: { home: 2.10, draw: 3.30, away: 3.50 } },
  // Belgian Pro League
  { id: 1055, sport: F, home: "Club Brugge", away: "Anderlecht", date: "2026-05-15", time: "20:45", league: "Pro League MD33", leagueShort: "Pro League", country: "Belgium", flag: "🇧🇪", odds: { home: 1.80, draw: 3.50, away: 4.50 } },
  { id: 1056, sport: F, home: "Gent", away: "Standard Liège", date: "2026-05-15", time: "20:45", league: "Pro League MD33", leagueShort: "Pro League", country: "Belgium", flag: "🇧🇪", odds: { home: 1.70, draw: 3.70, away: 5.00 } },
  // EHF Champions League Handball - Quarterfinal 2nd legs
  { id: 1060, sport: HB, home: "SC Magdeburg", away: "Barcelona", date: "2026-05-15", time: "18:45", league: "EHF Champions League", leagueShort: "EHF CL", country: "Europe", flag: "🇪🇺", odds: { home: 1.85, draw: 6.00, away: 2.10 } },
  { id: 1061, sport: HB, home: "Paris Saint-Germain HB", away: "THW Kiel", date: "2026-05-15", time: "20:45", league: "EHF Champions League", leagueShort: "EHF CL", country: "Europe", flag: "🇪🇺", odds: { home: 1.70, draw: 7.00, away: 2.25 } },

  // ── MAY 16 (Saturday) ──────────────────────────────────────────────────
  // Bundesliga MD34
  { id: 101, sport: F, home: "Bayern Munich", away: "FC Köln", date: "2026-05-16", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪", odds: { home: 1.18, draw: 7.50, away: 15.00 } },
  { id: 102, sport: F, home: "Borussia Dortmund", away: "Wolfsburg", date: "2026-05-16", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪", odds: { home: 1.55, draw: 4.20, away: 6.00 } },
  { id: 103, sport: F, home: "Bayer Leverkusen", away: "Heidenheim", date: "2026-05-16", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪", odds: { home: 1.45, draw: 4.50, away: 7.00 } },
  { id: 104, sport: F, home: "RB Leipzig", away: "Werder Bremen", date: "2026-05-16", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪", odds: { home: 1.60, draw: 4.00, away: 5.50 } },
  { id: 105, sport: F, home: "Eintracht Frankfurt", away: "Mainz", date: "2026-05-16", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪", odds: { home: 1.80, draw: 3.60, away: 4.50 } },
  { id: 106, sport: F, home: "Hamburger SV", away: "Stuttgart", date: "2026-05-16", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪", odds: { home: 2.20, draw: 3.30, away: 3.40 } },
  { id: 107, sport: F, home: "Augsburg", away: "Freiburg", date: "2026-05-16", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪", odds: { home: 2.55, draw: 3.20, away: 2.80 } },
  { id: 108, sport: F, home: "Hoffenheim", away: "Union Berlin", date: "2026-05-16", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪", odds: { home: 2.20, draw: 3.30, away: 3.40 } },
  { id: 109, sport: F, home: "Borussia M'gladbach", away: "St. Pauli", date: "2026-05-16", time: "15:30", league: "Bundesliga MD34", leagueShort: "Bundesliga", country: "Germany", flag: "🇩🇪", odds: { home: 1.90, draw: 3.50, away: 4.20 } },
  // Slovensko 1. liga
  { id: 1, sport: F, home: "Dunajska Streda", away: "Spartak Trnava", date: "2026-05-16", time: "17:00", league: "Slovensko 1. Liga", leagueShort: "1. Liga SK", country: "Slovakia", flag: "🇸🇰", odds: { home: 2.20, draw: 3.10, away: 3.10 } },
  { id: 2, sport: F, home: "Komarno", away: "Tatran Prešov", date: "2026-05-16", time: "17:00", league: "Slovensko 1. Liga", leagueShort: "1. Liga SK", country: "Slovakia", flag: "🇸🇰", odds: { home: 2.30, draw: 3.00, away: 3.00 } },
  { id: 3, sport: F, home: "Skalica", away: "Ružomberok", date: "2026-05-16", time: "17:00", league: "Slovensko 1. Liga", leagueShort: "1. Liga SK", country: "Slovakia", flag: "🇸🇰", odds: { home: 1.64, draw: 3.55, away: 4.80 } },
  { id: 4, sport: F, home: "Slovan Bratislava", away: "Zemplin Michalovce", date: "2026-05-16", time: "17:00", league: "Slovensko 1. Liga", leagueShort: "1. Liga SK", country: "Slovakia", flag: "🇸🇰", odds: { home: 1.32, draw: 5.00, away: 7.00 } },
  { id: 5, sport: F, home: "Trenčin", away: "FC Košice", date: "2026-05-16", time: "17:00", league: "Slovensko 1. Liga", leagueShort: "1. Liga SK", country: "Slovakia", flag: "🇸🇰", odds: { home: 2.65, draw: 3.45, away: 2.30 } },
  { id: 6, sport: F, home: "Žilina", away: "Podbrezova", date: "2026-05-16", time: "17:00", league: "Slovensko 1. Liga", leagueShort: "1. Liga SK", country: "Slovakia", flag: "🇸🇰", odds: { home: 1.66, draw: 4.00, away: 4.05 } },
  // Ligue 1 MD34 (final day)
  { id: 1070, sport: F, home: "Paris FC", away: "PSG", date: "2026-05-16", time: "21:00", league: "Ligue 1 MD34", leagueShort: "Ligue 1", country: "France", flag: "🇫🇷", odds: { home: 6.50, draw: 4.50, away: 1.38 } },
  { id: 1071, sport: F, home: "Lens", away: "Strasbourg", date: "2026-05-16", time: "21:00", league: "Ligue 1 MD34", leagueShort: "Ligue 1", country: "France", flag: "🇫🇷", odds: { home: 1.75, draw: 3.60, away: 4.80 } },
  // Scottish Prem MD38
  { id: 1075, sport: F, home: "Celtic", away: "Hearts", date: "2026-05-16", time: "12:00", league: "Scottish Prem MD38", leagueShort: "Scottish Prem", country: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", odds: { home: 1.45, draw: 4.50, away: 7.50 } },
  // CEV Volleyball Final Four - Men's Semis
  { id: 1080, sport: VB, home: "Jastrzębski Węgiel", away: "Perugia", date: "2026-05-16", time: "17:00", league: "CEV CL Final Four", leagueShort: "CEV CL", country: "Europe", flag: "🇪🇺", odds: { home: 2.10, away: 1.75 }, context: "Semifinal" },
  { id: 1081, sport: VB, home: "Zawiercie", away: "Zenit Kazan", date: "2026-05-16", time: "20:30", league: "CEV CL Final Four", leagueShort: "CEV CL", country: "Europe", flag: "🇪🇺", odds: { home: 1.85, away: 1.95 }, context: "Semifinal" },
  // NBA Playoffs
  { id: 1090, sport: BB, home: "Cleveland Cavaliers", away: "Detroit Pistons", date: "2026-05-16", time: "20:30", league: "NBA Playoffs R2", leagueShort: "NBA Playoffs", country: "USA", flag: "🇺🇸", odds: { home: 1.60, away: 2.35 }, context: "Game 6", leagueAvgTotal: 218 },

  // ── MAY 17 (Sunday) ────────────────────────────────────────────────────
  // Premier League MW37
  { id: 201, sport: F, home: "Aston Villa", away: "Liverpool", date: "2026-05-17", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 3.10, draw: 3.90, away: 2.05 } },
  { id: 202, sport: F, home: "Arsenal", away: "Burnley", date: "2026-05-17", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 1.22, draw: 6.50, away: 12.00 } },
  { id: 203, sport: F, home: "Manchester United", away: "Nottm Forest", date: "2026-05-17", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 1.62, draw: 4.40, away: 5.00 } },
  { id: 204, sport: F, home: "Chelsea", away: "Tottenham", date: "2026-05-17", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 1.90, draw: 3.60, away: 4.00 } },
  { id: 205, sport: F, home: "Newcastle United", away: "West Ham", date: "2026-05-17", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 1.75, draw: 3.70, away: 4.80 } },
  { id: 206, sport: F, home: "Bournemouth", away: "Manchester City", date: "2026-05-17", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 4.50, draw: 3.80, away: 1.85 } },
  { id: 207, sport: F, home: "Leeds United", away: "Brighton", date: "2026-05-17", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 2.40, draw: 3.30, away: 2.90 } },
  { id: 208, sport: F, home: "Crystal Palace", away: "Brentford", date: "2026-05-17", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 2.20, draw: 3.40, away: 3.30 } },
  { id: 209, sport: F, home: "Everton", away: "Sunderland", date: "2026-05-17", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 2.10, draw: 3.30, away: 3.60 } },
  { id: 210, sport: F, home: "Wolves", away: "Fulham", date: "2026-05-17", time: "16:00", league: "Premier League MW37", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 2.50, draw: 3.30, away: 2.75 } },
  // Serie A MD37
  { id: 301, sport: F, home: "AS Roma", away: "Lazio", date: "2026-05-17", time: "18:00", league: "Serie A MD37", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹", odds: { home: 1.75, draw: 3.50, away: 4.80 } },
  { id: 302, sport: F, home: "Juventus", away: "Fiorentina", date: "2026-05-17", time: "18:00", league: "Serie A MD37", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹", odds: { home: 1.65, draw: 4.00, away: 5.50 } },
  { id: 303, sport: F, home: "Genoa", away: "AC Milan", date: "2026-05-17", time: "18:00", league: "Serie A MD37", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹", odds: { home: 3.20, draw: 3.40, away: 2.10 } },
  { id: 304, sport: F, home: "Inter Milan", away: "Verona", date: "2026-05-17", time: "18:00", league: "Serie A MD37", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹", odds: { home: 1.28, draw: 5.50, away: 10.00 } },
  { id: 305, sport: F, home: "Atalanta", away: "Bologna", date: "2026-05-17", time: "18:00", league: "Serie A MD37", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹", odds: { home: 1.65, draw: 3.80, away: 5.50 } },
  { id: 306, sport: F, home: "Pisa", away: "Napoli", date: "2026-05-17", time: "18:00", league: "Serie A MD37", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹", odds: { home: 3.50, draw: 3.40, away: 2.10 } },
  // La Liga MD36
  { id: 401, sport: F, home: "Barcelona", away: "Real Betis", date: "2026-05-17", time: "19:00", league: "La Liga MD36", leagueShort: "La Liga", country: "Spain", flag: "🇪🇸", odds: { home: 1.33, draw: 5.00, away: 8.50 } },
  { id: 402, sport: F, home: "Atletico Madrid", away: "Girona", date: "2026-05-17", time: "19:00", league: "La Liga MD36", leagueShort: "La Liga", country: "Spain", flag: "🇪🇸", odds: { home: 1.80, draw: 3.60, away: 4.80 } },
  { id: 403, sport: F, home: "Athletic Bilbao", away: "Celta Vigo", date: "2026-05-17", time: "19:00", league: "La Liga MD36", leagueShort: "La Liga", country: "Spain", flag: "🇪🇸", odds: { home: 1.90, draw: 3.50, away: 4.20 } },
  { id: 404, sport: F, home: "Rayo Vallecano", away: "Villarreal", date: "2026-05-17", time: "19:00", league: "La Liga MD36", leagueShort: "La Liga", country: "Spain", flag: "🇪🇸", odds: { home: 2.30, draw: 3.20, away: 3.10 } },
  { id: 405, sport: F, home: "Real Sociedad", away: "Valencia", date: "2026-05-17", time: "19:00", league: "La Liga MD36", leagueShort: "La Liga", country: "Spain", flag: "🇪🇸", odds: { home: 1.80, draw: 3.50, away: 4.60 } },
  { id: 406, sport: F, home: "Osasuna", away: "Espanyol", date: "2026-05-17", time: "19:00", league: "La Liga MD36", leagueShort: "La Liga", country: "Spain", flag: "🇪🇸", odds: { home: 1.95, draw: 3.40, away: 4.00 } },
  // Eredivisie MD34
  { id: 501, sport: F, home: "PSV Eindhoven", away: "FC Twente", date: "2026-05-17", time: "14:30", league: "Eredivisie MD34", leagueShort: "Eredivisie", country: "Netherlands", flag: "🇳🇱", odds: { home: 1.40, draw: 4.50, away: 8.00 } },
  { id: 502, sport: F, home: "sc Heerenveen", away: "Ajax", date: "2026-05-17", time: "14:30", league: "Eredivisie MD34", leagueShort: "Eredivisie", country: "Netherlands", flag: "🇳🇱", odds: { home: 4.80, draw: 4.00, away: 1.72 } },
  { id: 503, sport: F, home: "PEC Zwolle", away: "Feyenoord", date: "2026-05-17", time: "14:30", league: "Eredivisie MD34", leagueShort: "Eredivisie", country: "Netherlands", flag: "🇳🇱", odds: { home: 4.50, draw: 3.80, away: 1.80 } },
  { id: 504, sport: F, home: "NEC Nijmegen", away: "Go Ahead Eagles", date: "2026-05-17", time: "14:30", league: "Eredivisie MD34", leagueShort: "Eredivisie", country: "Netherlands", flag: "🇳🇱", odds: { home: 2.10, draw: 3.30, away: 3.50 } },
  // CEV Volleyball Final - 3rd place + Final
  { id: 1082, sport: VB, home: "3rd Place Team A", away: "3rd Place Team B", date: "2026-05-17", time: "17:00", league: "CEV CL Final Four", leagueShort: "CEV CL", country: "Europe", flag: "🇪🇺", odds: { home: 1.85, away: 2.00 }, context: "3rd Place" },
  { id: 1083, sport: VB, home: "CEV Final: Winner SF1", away: "CEV Final: Winner SF2", date: "2026-05-17", time: "20:00", league: "CEV CL Final Four", leagueShort: "CEV CL", country: "Europe", flag: "🇪🇺", odds: { home: 1.90, away: 1.95 }, context: "Final" },
  // NBA Playoffs
  { id: 1095, sport: BB, home: "Detroit Pistons", away: "Cleveland Cavaliers", date: "2026-05-17", time: "19:00", league: "NBA Playoffs R2", leagueShort: "NBA Playoffs", country: "USA", flag: "🇺🇸", odds: { home: 2.40, away: 1.58 }, context: "Game 7 (if needed)", leagueAvgTotal: 218 },

  // ── MAY 18 (Monday) ────────────────────────────────────────────────────
  // Austrian Bundesliga
  { id: 1100, sport: F, home: "Red Bull Salzburg", away: "LASK", date: "2026-05-18", time: "18:30", league: "Austrian BL MD32", leagueShort: "Austrian BL", country: "Austria", flag: "🇦🇹", odds: { home: 1.55, draw: 4.00, away: 5.50 } },
  { id: 1101, sport: F, home: "Rapid Wien", away: "Sturm Graz", date: "2026-05-18", time: "18:30", league: "Austrian BL MD32", leagueShort: "Austrian BL", country: "Austria", flag: "🇦🇹", odds: { home: 2.10, draw: 3.30, away: 3.50 } },
  // Swiss Super League
  { id: 1105, sport: F, home: "Young Boys", away: "Basel", date: "2026-05-18", time: "20:30", league: "Swiss Super League MD35", leagueShort: "Swiss SL", country: "Switzerland", flag: "🇨🇭", odds: { home: 2.00, draw: 3.30, away: 3.70 } },
  { id: 1106, sport: F, home: "Zürich", away: "Lugano", date: "2026-05-18", time: "20:30", league: "Swiss Super League MD35", leagueShort: "Swiss SL", country: "Switzerland", flag: "🇨🇭", odds: { home: 1.85, draw: 3.50, away: 4.20 } },
  // NBA
  { id: 1110, sport: BB, home: "Oklahoma City Thunder", away: "Denver Nuggets", date: "2026-05-18", time: "21:30", league: "NBA Playoffs R2", leagueShort: "NBA Playoffs", country: "USA", flag: "🇺🇸", odds: { home: 1.65, away: 2.25 }, context: "Game 6", leagueAvgTotal: 220 },

  // ── MAY 19 (Tuesday) ───────────────────────────────────────────────────
  // Scandinavian leagues
  { id: 1120, sport: F, home: "Malmö FF", away: "IFK Göteborg", date: "2026-05-19", time: "19:00", league: "Allsvenskan MD12", leagueShort: "Allsvenskan", country: "Sweden", flag: "🇸🇪", odds: { home: 1.75, draw: 3.70, away: 4.80 } },
  { id: 1121, sport: F, home: "AIK", away: "Djurgårdens IF", date: "2026-05-19", time: "19:00", league: "Allsvenskan MD12", leagueShort: "Allsvenskan", country: "Sweden", flag: "🇸🇪", odds: { home: 2.20, draw: 3.30, away: 3.30 } },
  { id: 1122, sport: F, home: "Brøndby", away: "Copenhagen", date: "2026-05-19", time: "19:00", league: "Superliga MD29", leagueShort: "Superliga", country: "Denmark", flag: "🇩🇰", odds: { home: 2.80, draw: 3.20, away: 2.50 } },
  { id: 1123, sport: F, home: "Bodø/Glimt", away: "Rosenborg", date: "2026-05-19", time: "19:00", league: "Eliteserien MD12", leagueShort: "Eliteserien", country: "Norway", flag: "🇳🇴", odds: { home: 1.80, draw: 3.50, away: 4.50 } },
  // Turkish Süper Lig
  { id: 1125, sport: F, home: "Trabzonspor", away: "Galatasaray", date: "2026-05-19", time: "20:00", league: "Süper Lig MD38", leagueShort: "Süper Lig", country: "Turkey", flag: "🇹🇷", odds: { home: 3.20, draw: 3.30, away: 2.25 } },
  // NBA
  { id: 1130, sport: BB, home: "Minnesota Timberwolves", away: "San Antonio Spurs", date: "2026-05-19", time: "21:00", league: "NBA Playoffs R2", leagueShort: "NBA Playoffs", country: "USA", flag: "🇺🇸", odds: { home: 1.55, away: 2.45 }, context: "Game 6", leagueAvgTotal: 215 },

  // ── MAY 20 (Wednesday) ─────────────────────────────────────────────────
  // Europa League Final
  { id: 1140, sport: F, home: "SC Freiburg", away: "Aston Villa", date: "2026-05-20", time: "21:00", league: "UEFA Europa League Final", leagueShort: "UEL Final", country: "Europe", flag: "🇪🇺", odds: { home: 2.80, draw: 3.20, away: 2.55 }, context: "Istanbul · Beşiktaş Stadium" },
  // NBA
  { id: 1145, sport: BB, home: "Oklahoma City Thunder", away: "Denver Nuggets", date: "2026-05-20", time: "21:30", league: "NBA Playoffs R2", leagueShort: "NBA Playoffs", country: "USA", flag: "🇺🇸", odds: { home: 1.60, away: 2.35 }, context: "Game 7 (if needed)", leagueAvgTotal: 220 },
  // Portuguese Liga
  { id: 1148, sport: F, home: "Sporting CP", away: "Porto", date: "2026-05-20", time: "20:30", league: "Liga Portugal MD34", leagueShort: "Liga Portugal", country: "Portugal", flag: "🇵🇹", odds: { home: 2.20, draw: 3.30, away: 3.30 } },

  // ── MAY 21 (Thursday) ──────────────────────────────────────────────────
  // Danish / Norwegian
  { id: 1150, sport: F, home: "Copenhagen", away: "Midtjylland", date: "2026-05-21", time: "19:00", league: "Superliga MD30", leagueShort: "Superliga", country: "Denmark", flag: "🇩🇰", odds: { home: 1.65, draw: 3.80, away: 5.20 } },
  { id: 1151, sport: F, home: "Molde", away: "Viking", date: "2026-05-21", time: "19:00", league: "Eliteserien MD13", leagueShort: "Eliteserien", country: "Norway", flag: "🇳🇴", odds: { home: 1.90, draw: 3.50, away: 4.20 } },
  // Greek Super League play-offs
  { id: 1155, sport: F, home: "Olympiakos", away: "PAOK", date: "2026-05-21", time: "20:30", league: "Super League MD37", leagueShort: "Super League", country: "Greece", flag: "🇬🇷", odds: { home: 2.00, draw: 3.40, away: 3.70 } },
  // NBA
  { id: 1160, sport: BB, home: "Eastern CF Semifinalist", away: "Eastern CF Opponent", date: "2026-05-21", time: "20:30", league: "NBA Playoffs CF", leagueShort: "NBA Playoffs", country: "USA", flag: "🇺🇸", odds: { home: 1.72, away: 2.10 }, context: "ECF Game 1", leagueAvgTotal: 216 },

  // ── MAY 22 (Friday) ────────────────────────────────────────────────────
  // EuroLeague Final Four – Semis
  { id: 1170, sport: BB, home: "EL Semi 1 Home", away: "EL Semi 1 Away", date: "2026-05-22", time: "18:00", league: "EuroLeague Final Four", leagueShort: "EuroLeague", country: "Europe", flag: "🇪🇺", odds: { home: 1.80, away: 2.00 }, context: "Semifinal · Athens", leagueAvgTotal: 155 },
  { id: 1171, sport: BB, home: "EL Semi 2 Home", away: "EL Semi 2 Away", date: "2026-05-22", time: "21:00", league: "EuroLeague Final Four", leagueShort: "EuroLeague", country: "Europe", flag: "🇪🇺", odds: { home: 1.90, away: 1.92 }, context: "Semifinal · Athens", leagueAvgTotal: 155 },
  // Belgian Pro League playoff
  { id: 1175, sport: F, home: "Club Brugge", away: "Union SG", date: "2026-05-22", time: "20:45", league: "Pro League Playoff", leagueShort: "Pro League", country: "Belgium", flag: "🇧🇪", odds: { home: 1.90, draw: 3.40, away: 4.00 } },

  // ── MAY 23 (Saturday) ──────────────────────────────────────────────────
  // EFL Championship Play-Off Final
  { id: 1180, sport: F, home: "Championship PO: Team A", away: "Championship PO: Team B", date: "2026-05-23", time: "15:00", league: "EFL Championship Final", leagueShort: "Championship", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 2.10, draw: 3.30, away: 3.50 }, context: "Wembley · Playoff Final" },
  // EuroLeague Final Four – 3rd place + Final
  { id: 1185, sport: BB, home: "EL 3rd Place A", away: "EL 3rd Place B", date: "2026-05-23", time: "18:00", league: "EuroLeague Final Four", leagueShort: "EuroLeague", country: "Europe", flag: "🇪🇺", odds: { home: 1.85, away: 1.97 }, context: "3rd Place · Athens", leagueAvgTotal: 155 },
  { id: 1186, sport: BB, home: "EL Finalist A", away: "EL Finalist B", date: "2026-05-23", time: "21:00", league: "EuroLeague Final Four", leagueShort: "EuroLeague", country: "Europe", flag: "🇪🇺", odds: { home: 1.88, away: 1.94 }, context: "Final · Athens", leagueAvgTotal: 155 },
  // Swedish / Nordic
  { id: 1190, sport: F, home: "Hammarby", away: "Malmö FF", date: "2026-05-23", time: "15:00", league: "Allsvenskan MD13", leagueShort: "Allsvenskan", country: "Sweden", flag: "🇸🇪", odds: { home: 2.50, draw: 3.20, away: 2.80 } },
  // NBA
  { id: 1195, sport: BB, home: "Eastern CF Game 2 Home", away: "Eastern CF Game 2 Away", date: "2026-05-23", time: "20:30", league: "NBA Playoffs CF", leagueShort: "NBA Playoffs", country: "USA", flag: "🇺🇸", odds: { home: 1.68, away: 2.18 }, context: "ECF Game 2", leagueAvgTotal: 216 },

  // ── MAY 24 (Sunday) ────────────────────────────────────────────────────
  // Premier League MD38 – Final Day
  { id: 1200, sport: F, home: "Arsenal", away: "Chelsea", date: "2026-05-24", time: "16:00", league: "Premier League MD38", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 1.75, draw: 3.70, away: 4.80 }, context: "Final Day" },
  { id: 1201, sport: F, home: "Manchester City", away: "Wolves", date: "2026-05-24", time: "16:00", league: "Premier League MD38", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 1.45, draw: 4.50, away: 7.00 }, context: "Title Race" },
  { id: 1202, sport: F, home: "Liverpool", away: "Southampton", date: "2026-05-24", time: "16:00", league: "Premier League MD38", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 1.35, draw: 5.00, away: 9.00 }, context: "Final Day" },
  { id: 1203, sport: F, home: "Tottenham", away: "Man United", date: "2026-05-24", time: "16:00", league: "Premier League MD38", leagueShort: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: { home: 2.00, draw: 3.40, away: 3.80 }, context: "Final Day" },
  // La Liga MD37 – Final Day
  { id: 1210, sport: F, home: "Real Madrid", away: "Villarreal", date: "2026-05-24", time: "19:00", league: "La Liga MD37", leagueShort: "La Liga", country: "Spain", flag: "🇪🇸", odds: { home: 1.50, draw: 4.20, away: 7.50 }, context: "Final Day" },
  { id: 1211, sport: F, home: "Barcelona", away: "Sevilla", date: "2026-05-24", time: "19:00", league: "La Liga MD37", leagueShort: "La Liga", country: "Spain", flag: "🇪🇸", odds: { home: 1.40, draw: 4.80, away: 8.50 }, context: "Title Celebration" },
  { id: 1212, sport: F, home: "Atletico Madrid", away: "Getafe", date: "2026-05-24", time: "19:00", league: "La Liga MD37", leagueShort: "La Liga", country: "Spain", flag: "🇪🇸", odds: { home: 1.55, draw: 4.00, away: 6.50 } },
  // Serie A MD38 – Final Day
  { id: 1215, sport: F, home: "Napoli", away: "Inter Milan", date: "2026-05-24", time: "20:45", league: "Serie A MD38", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹", odds: { home: 2.80, draw: 3.20, away: 2.60 }, context: "Title Decider?" },
  { id: 1216, sport: F, home: "AC Milan", away: "Juventus", date: "2026-05-24", time: "20:45", league: "Serie A MD38", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹", odds: { home: 2.40, draw: 3.30, away: 2.95 } },
  { id: 1217, sport: F, home: "Lazio", away: "AS Roma", date: "2026-05-24", time: "20:45", league: "Serie A MD38", leagueShort: "Serie A", country: "Italy", flag: "🇮🇹", odds: { home: 2.40, draw: 3.30, away: 2.90 } },
  // NBA
  { id: 1220, sport: BB, home: "WCF Game 1 Home", away: "WCF Game 1 Away", date: "2026-05-24", time: "20:30", league: "NBA Playoffs CF", leagueShort: "NBA Playoffs", country: "USA", flag: "🇺🇸", odds: { home: 1.75, away: 2.08 }, context: "WCF Game 1", leagueAvgTotal: 218 },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

export const SPORTS: { key: Sport; label: string; emoji: string }[] = [
  { key: "football",   label: "Football",   emoji: "⚽" },
  { key: "basketball", label: "Basketball", emoji: "🏀" },
  { key: "handball",   label: "Handball",   emoji: "🤾" },
  { key: "volleyball", label: "Volleyball", emoji: "🏐" },
];

export function getDateRange(): string[] {
  const dates: string[] = [];
  const base = new Date("2026-05-12");
  for (let i = 0; i < 14; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export function formatDate(iso: string): { short: string; long: string; day: string } {
  const d = new Date(iso + "T12:00:00Z");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return {
    short: `${d.getUTCDate()} ${months[d.getUTCMonth()]}`,
    long: `${days[d.getUTCDay()]} ${d.getUTCDate()} ${months[d.getUTCMonth()]}`,
    day: days[d.getUTCDay()],
  };
}

export const leaguesForSport = (sport: Sport): string[] =>
  [...new Set(matches.filter((m) => m.sport === sport).map((m) => m.leagueShort))];
