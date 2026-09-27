import { useState, useEffect } from "react";
import { ScoreGrid } from "./components/ScoreGrid";
import { AddAnimeModal } from "./components/AddAnimeModal";
import { AnimeDetailModal } from "./components/AnimeDetailModal";
import type { CreateAnimeInput, Anime } from "./types/anime";

export default function App() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // ★ 追加（初期値は true）

  // バックエンドからデータ一覧を取得する関数（自動でスコア降順で届く）
  const fetchAnimeList = () => {
    fetch("http://localhost:3001/api/anime")
      .then((res) => res.json())
      .then((data: Anime[]) => setAnimeList(data))
      .catch((err) => console.error("データの取得に失敗しました:", err))
      .finally(() => setIsLoading(false)); // ★ 成功しても失敗しても読み込み完了にする)
  };

  // 1. 初回読み込み時にデータベースから取得
  useEffect(() => {
    fetchAnimeList();
  }, []);

  // 2. 新しいアニメをデータベースに追加する関数
  const handleAddAnime = async (newAnime: CreateAnimeInput) => {
    const isDuplicate = animeList.some(
      (item) =>
        item.title.trim().toLowerCase() === newAnime.title.trim().toLowerCase(),
    );

    if (isDuplicate) {
      alert(`「${newAnime.title}」は既に登録されています！`);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/anime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnime),
      });

      if (response.ok) {
        // 追加成功後、バックエンドから最新の自動ソート済み一覧を再取得
        fetchAnimeList();
      } else {
        alert("アニメの保存に失敗しました");
      }
    } catch (error) {
      console.error("追加エラー:", error);
    }
  };

  // 3. アニメの評価・メモを更新する関数 (データベースも更新)
  const handleUpdateAnime = async (updatedAnime: Anime) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/anime/${updatedAnime.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAnime),
        },
      );

      if (response.ok) {
        // 更新成功後、自動再ソートされた一覧を取得
        fetchAnimeList();
      } else {
        alert("アニメの更新に失敗しました");
      }
    } catch (error) {
      console.error("更新エラー:", error);
    }
  };

  // 4. アニメを削除する関数 (データベースから削除)
  const handleDeleteAnime = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/anime/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAnimeList();
      } else {
        alert("アニメの削除に失敗しました");
      }
    } catch (error) {
      console.error("削除エラー:", error);
    }
  };

  // 平均点の計算（1つもない場合は 0.0）
  const averageScore = animeList.length
    ? (
        animeList.reduce((acc, cur) => acc + cur.score, 0) / animeList.length
      ).toFixed(1)
    : "0.0";

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

      {/* 2. サマリー ＆ アニメ追加ボタンエリア */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          padding: "12px 20px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {/* 左：作品数 */}
        <div style={{ fontSize: "0.95rem", color: "#495057" }}>
          総鑑賞数:{" "}
          <strong style={{ fontSize: "1.1rem", color: "#212529" }}>
            {animeList.length}
          </strong>{" "}
          作品
        </div>

        {/* 中央：平均点 */}
        <div style={{ fontSize: "0.95rem", color: "#495057" }}>
          平均スコア:{" "}
          <strong style={{ fontSize: "1.1rem", color: "#d97706" }}>
            {averageScore}
          </strong>{" "}
          点
        </div>

        {/* 右：アニメを追加ボタン */}
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 18px",
            fontSize: "0.95rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          ＋ アニメを追加
        </button>
      </div>

      {/* 3. 得点帯別グリッド */}
      <main style={{ width: "100%" }}>
        {isLoading ? (
          <div
            style={{ textAlign: "center", padding: "60px 0", color: "#666" }}
          >
            <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              データを読み込んでいます...
            </p>
          </div>
        ) : (
          <ScoreGrid
            animeList={animeList}
            onSelectAnime={(anime) => setSelectedAnime(anime)}
          />
        )}
      </main>

      {/* 4. アニメ追加モーダル */}
      <AddAnimeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAnime={handleAddAnime}
      />

      {/* 5. アニメ詳細・編集・削除モーダル */}
      {selectedAnime && (
        <AnimeDetailModal
          key={selectedAnime.id}
          anime={selectedAnime}
          isOpen={selectedAnime !== null}
          onClose={() => setSelectedAnime(null)}
          onUpdateAnime={handleUpdateAnime}
          onDeleteAnime={handleDeleteAnime}
        />
      )}
    </div>
  );
}
