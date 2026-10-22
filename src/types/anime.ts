export interface Anime {
  id: number;
  title: string;
  score?: number;
  imageUrl: string;
  comment?: string;
  startDate?: string;
  subtype?: string;
  episodeCount?: number;
  status: "COMPLETED" | "PLAN_TO_WATCH";
  priority?: "HIGH" | "MEDIUM" | "LOW";
  kitsuId?: string;
}

// 送信用のデータ（IDなし)
export type CreateAnimeInput = Omit<Anime, "id">;
