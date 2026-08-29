export type Anime = {
  id: number;
  title: string;
  status: "視聴予定" | "視聴中" | "視聴済";
  year?: number;
  rating?: number;
  comment?: string;
};
