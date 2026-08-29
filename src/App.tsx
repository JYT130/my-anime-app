import { useState } from "react";
import type { Anime } from "./types/anime";
import { AnimeForm } from "./components/AnimeForm";
import { AnimeToolBar } from "./components/AnimeToolBar";
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
    { id: 1, title: "ガールズ＆パンツァー", status: "視聴予定" },
  ]);

  // アニメテーブルフィルタリング
  // タイトル部分一致
  const [searchTitle, setSearchTitle] = useState("");

  // ステータス
  const [statusFilter, setStatusFilter] = useState<
    "すべて" | "視聴予定" | "視聴中" | "視聴済"
  >("すべて");

  // フィルタリングされたアニメリスト
  const filteredAnimeList = animeList.filter((anime) => {
    const matchesTitle = anime.title
      .toLowerCase()
      .includes(searchTitle.toLowerCase());
    const matchesStatus =
      statusFilter === "すべて" || anime.status === statusFilter;

    return matchesTitle && matchesStatus;
  });

  // フィルターリセット処理
  const handleResetFilters = () => {
    // searchTitle を "" に戻す
    setSearchTitle("");
    // statusFilter を "すべて" に戻す
    setStatusFilter("すべて");
  };

  // アニメ追加処理
  const [OnToggleOpen, setOnToggleOpen] = useState(false);
  const handleAddAnime = (newAnime: Anime) => {
    setAnimeList([...animeList, newAnime]);
  };

  return (
    <div style={{ fontFamily: "sans-serif", width: "100%" }}>
      <h1>アニメ視聴管理アプリ</h1>
      {/* ツールバー */}
      <AnimeToolBar
        searchTitle={searchTitle}
        statusFilter={statusFilter}
        setSearchTitle={setSearchTitle}
        setStatusFilter={setStatusFilter}
        handleResetFilters={handleResetFilters}
        isFormOpen={OnToggleOpen}
        onToggleOpen={() => setOnToggleOpen(!OnToggleOpen)}
      />

      {/* アニメ追加フォーム */}
      {OnToggleOpen && <AnimeForm onAddAnime={handleAddAnime} />}

      {/* UI */}
      <AnimeTable animeList={filteredAnimeList} />
    </div>
  );
}

export default App;
