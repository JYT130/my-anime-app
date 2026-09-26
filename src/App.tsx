import { useState } from "react";
import { ScoreGrid } from "./components/ScoreGrid";
import { AddAnimeModal } from "./components/AddAnimeModal";
import { AnimeDetailModal } from "./components/AnimeDetailModal";
import type { Anime } from "./types/anime";

// 💡 配列を点数の高い順（降順）にソートするヘルパー関数
const sortByScore = (list: Anime[]): Anime[] => {
  return [...list].sort((a, b) => b.score - a.score);
};

const INITIAL_ANIME_LIST: Anime[] = sortByScore([]);

export default function App() {
  const [animeList, setAnimeList] = useState<Anime[]>(INITIAL_ANIME_LIST);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 選択中のアニメState（null のときは詳細モーダルを閉じる）
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  // 新しいアニメをリストに追加する関数
  const handleAddAnime = (newAnime: Anime) => {
    // タイトルが一致するものがすでにリストにあるかチェック（大文字・小文字・空白の違いを考慮）
    const isDuplicate = animeList.some(
      (item) =>
        item.title.trim().toLowerCase() === newAnime.title.trim().toLowerCase(),
    );

    if (isDuplicate) {
      alert(`「${newAnime.title}」は既に登録されています！`);
      return; // 追加せずに終了
    }

    // 重複がなければ追加
    setAnimeList((prev) => sortByScore([newAnime, ...prev]));
  };

  // アニメの評価・メモを更新する関数 (AnimeDetailModal 用)
  const handleUpdateAnime = (updatedAnime: Anime) => {
    setAnimeList((prevList) => {
      const updatedList = prevList.map((item) =>
        item.id === updatedAnime.id ? updatedAnime : item,
      );
      // 💡 評価変更後も自動で再ソートされるように修整
      return sortByScore(updatedList);
    });
  };

  // アニメを削除する関数
  const handleDeleteAnime = (id: number) => {
    setAnimeList((prevList) => prevList.filter((item) => item.id !== id));
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "24px 32px",
        boxSizing: "border-box",
        fontFamily: "sans-serif",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* 1. タイトルエリア */}
      <header style={{ textAlign: "center", marginBottom: "16px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#212529",
          }}
        >
          アニメ評価ギャラリー
        </h1>
      </header>

      {/* 2. アニメ追加ボタンエリア（タイトルの下に独立配置） */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
        }}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 24px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          ＋ アニメを追加
        </button>
      </div>

      {/* 3. 得点帯別グリッド（画面幅 100% で広がる） */}
      <main style={{ width: "100%" }}>
        <ScoreGrid
          animeList={animeList}
          onSelectAnime={(anime) => setSelectedAnime(anime)}
        />
      </main>

      {/* 4. アニメ追加モーダル */}
      <AddAnimeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAnime={handleAddAnime}
      />

      {/* 5. アニメ詳細・編集・削除モーダル */}
      <AnimeDetailModal
        anime={selectedAnime}
        isOpen={selectedAnime !== null}
        onClose={() => setSelectedAnime(null)}
        onUpdateAnime={handleUpdateAnime}
        onDeleteAnime={handleDeleteAnime}
      />
    </div>
  );
}
