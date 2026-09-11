import { useState } from "react";
import { ScoreGrid } from "./components/ScoreGrid";
import type { Anime } from "./types/anime";

// 1. 新UI用のダミーデータ（スコアと画像URL付き）
const DUMMY_ANIME_LIST: Anime[] = [
  {
    id: 1,
    title: "ガールズ＆パンツァー",
    score: 95,
    imageUrl: "https://placehold.co/100x140?text=Garupan",
  },
  {
    id: 2,
    title: "ガルパン 劇場版",
    score: 88,
    imageUrl: "https://placehold.co/100x140?text=Der+Film",
  },
  {
    id: 3,
    title: "サンプルアニメA",
    score: 72,
    imageUrl: "https://placehold.co/100x140?text=Anime+A",
  },
  {
    id: 4,
    title: "サンプルアニメB",
    score: 45,
    imageUrl: "https://placehold.co/100x140?text=Anime+B",
  },
];

export default function App() {
  const [animeList] = useState<Anime[]>(DUMMY_ANIME_LIST);

  return (
    <div
      style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}
    >
      <h1 style={{ textAlign: "center", padding: "16px 0" }}>
        アニメ評価ギャラリー
      </h1>
      {/* 作成した ScoreGrid コンポーネントを呼び出す */}
      <ScoreGrid animeList={animeList} />
    </div>
  );
}
