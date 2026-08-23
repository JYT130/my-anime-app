import { useState } from "react";
import type { Anime } from "./types/anime";
import { AnimeForm } from "./components/AnimeForm";
import { AnimeTable } from "./components/AnimeTable";

function App() {
  // アニメのState
  const [animeList, setAnimeList] = useState<Anime[]>([
    { id: 1, title: "ガールズ＆パンツァー", status: "視聴中", year: 2026 },
    {
      id: 2,
      title: "プリズマ☆イリヤ",
      status: "視聴済",
      year: 2025,
      rating: 3.8,
      comment: "Fate/SNを見たあと視聴するべきだったと後悔。",
    },
  ]);

  // アニメ追加処理
  const handleAddAnime = (newAnime: Anime) => {
    setAnimeList([...animeList, newAnime]);
  };

  return (
    <div style={{ fontFamily: "sans-serif", width: "100%" }}>
      <h1>アニメ視聴管理アプリ</h1>

      {/* アニメ追加フォーム */}
      <AnimeForm onAddAnime={handleAddAnime} />

      {/* UI */}
      <AnimeTable animeList={animeList} />
    </div>
  );
}

export default App;
