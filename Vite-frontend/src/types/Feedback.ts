// ── Feedback types ───────────────────────────────────────────────────────────

/** Payload trimis la POST /api/feedback */
export interface FeedbackCreateDto {
  userId: number;
  rating: number;        // 1–5
  title: string;
  message: string;
  categories: string[];  // ex: ["Interfață (UX)", "Performanță"]
}

/** O recenzie returnată de GET /api/feedback */
export interface FeedbackInfoDto {
  id: number;
  userId: number;
  rating: number;
  title: string;
  message: string;
  categories: string[];
  status: 'vizibil' | 'ascuns';
  isPinned: boolean;
  createdAt: string;  // ISO 8601
}

/** Statistici globale returnate de GET /api/feedback/stats */
export interface FeedbackStatsDto {
  averageRating: number;
  totalCount: number;
  satisfactionPct: number;        // % recenzii cu 4-5 stele
  distribution: { star: number; count: number; pct: number }[];
}
