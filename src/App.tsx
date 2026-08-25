import { useState } from "react";
import type { Anime } from "./types/anime";
import { AnimeForm } from "./components/AnimeForm";
import { AnimeToolBar } from "./components/AnimeToolBar";
import { AnimeTable } from "./components/AnimeTable";

function App() {
  // アニメのState
  const [animeTable, setAnimeTable] = useState<Anime[]>([
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

  // 部分一致フィルタリング
  const [searchTitle, setSearchTitle] = useState("");
  const filteredAnimeList = animeTable.filter((anime) =>
    anime.title.toLowerCase().includes(searchTitle.toLowerCase()),
  );

  // アニメ追加処理
  const [isFormOpen, setIsFormOpen] = useState(false);
  const handleAddAnime = (newAnime: Anime) => {
    setAnimeTable([...animeTable, newAnime]);
  };

  return (
    <div style={{ fontFamily: "sans-serif", width: "100%" }}>
      <h1>アニメ視聴管理アプリ</h1>
      {/* ツールバー */}
      <AnimeToolBar
        searchTitle={searchTitle}
        onSearchTitleChange={setSearchTitle}
        isFormOpen={isFormOpen}
        onToggleOpen={() => setIsFormOpen(!isFormOpen)}
      />

      {/* アニメ追加フォーム */}
      {isFormOpen && <AnimeForm onAddAnime={handleAddAnime} />}

      {/* UI */}
      <AnimeTable animeList={filteredAnimeList} />
    </div>
  );
}

export default App;
