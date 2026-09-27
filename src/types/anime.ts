export interface Anime {
  id: number;
  title: string;
  score: number;
  imageUrl: string;
  comment?: string;
  startDate?: string;
  subtype?: string;
  episodeCount?: number;
  kitsuId?: string;
}

// 送信用のデータ（IDなし)
export type CreateAnimeInput = Omit<Anime, "id">;
