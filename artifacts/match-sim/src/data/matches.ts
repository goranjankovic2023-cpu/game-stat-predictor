export interface Match {
  id: number;
  home: string;
  away: string;
  date: string;
  time: string;
  league: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

export const matches: Match[] = [
  {
    id: 1,
    home: "Dunajska Streda",
    away: "Spartak Trnava",
    date: "SOB. 16.05",
    time: "17:00",
    league: "Slovensko · 1. liga",
    odds: { home: 2.20, draw: 3.10, away: 3.10 },
  },
  {
    id: 2,
    home: "Komarno",
    away: "Tatran Prešov",
    date: "SOB. 16.05",
    time: "17:00",
    league: "Slovensko · 1. liga",
    odds: { home: 2.30, draw: 3.00, away: 3.00 },
  },
  {
    id: 3,
    home: "Skalica",
    away: "Ružomberok",
    date: "SOB. 16.05",
    time: "17:00",
    league: "Slovensko · 1. liga",
    odds: { home: 1.64, draw: 3.55, away: 4.80 },
  },
  {
    id: 4,
    home: "Slovan Bratislava",
    away: "Zemplin Michalovce",
    date: "SOB. 16.05",
    time: "17:00",
    league: "Slovensko · 1. liga",
    odds: { home: 1.32, draw: 5.00, away: 7.00 },
  },
  {
    id: 5,
    home: "Trenčin",
    away: "FC Košice",
    date: "SOB. 16.05",
    time: "17:00",
    league: "Slovensko · 1. liga",
    odds: { home: 2.65, draw: 3.45, away: 2.30 },
  },
  {
    id: 6,
    home: "Žilina",
    away: "Podbrezova",
    date: "SOB. 16.05",
    time: "17:00",
    league: "Slovensko · 1. liga",
    odds: { home: 1.66, draw: 4.00, away: 4.05 },
  },
];
