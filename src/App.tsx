import { useState, useEffect } from "react";
import { ScoreGrid } from "./components/ScoreGrid";
import { WatchlistGrid } from "./components/WatchlistGrid";
import { AddAnimeModal } from "./components/AddAnimeModal";
import { AnimeDetailModal } from "./components/AnimeDetailModal";
import { ExploreAnimeModal } from "./components/ExploreAnimeModal";
import {
  fetchExploreAnimeFromKitsu,
  type AnimeSortType,
  type KitsuAnime,
} from "./utils/KitsuApi";
import type { CreateAnimeInput, Anime } from "./types/anime";

export default function App() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 初期画面を "home" に設定
  const [activeTab, setActiveTab] = useState<"home" | "completed" | "plan">(
    "home",
  );

  // ホーム（探索）画面用のステート
  const [exploreAnimeList, setExploreAnimeList] = useState<KitsuAnime[]>([]);
  const [currentSort, setCurrentSort] = useState<AnimeSortType>("-userCount");
  const [selectedYear, setSelectedYear] = useState<string>(""); // 初期値「すべて」
  const [searchQuery, setSearchQuery] = useState<string>(""); // キーワード検索用ステート
  const [isExploreLoading, setIsExploreLoading] = useState<boolean>(false);

  // ホーム画面から個別追加するための選択中Kitsuアニメ
  const [kitsuTargetForAdd, setKitsuTargetForAdd] = useState<KitsuAnime | null>(
    null,
  );

  // 無限スクロール用ステート（20件ずつに統一）
  const PAGE_LIMIT = 20;
  const [exploreOffset, setExploreOffset] = useState(0);
  const [hasMoreExplore, setHasMoreExplore] = useState(true);
  const [isExploreLoadingMore, setIsExploreLoadingMore] = useState(false);

  // 動的に現在年〜2000年までの年度リストを生成
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1999 + 1 },
    (_, i) => currentYear - i,
  );

  // バックエンドからデータ一覧を取得する関数
  const fetchAnimeList = () => {
    fetch("http://localhost:3001/api/anime")
      .then((res) => res.json())
      .then((data: Anime[]) => setAnimeList(data))
      .catch((err) => console.error("データの取得に失敗しました:", err))
      .finally(() => setIsLoading(false));
  };

  // 1. 初回読み込み時にデータベースから取得
  useEffect(() => {
    fetchAnimeList();
  }, []);

  // 2. タブ、ソート、年度、検索ワードのいずれかが変わったときに自動で統合APIから取得
  useEffect(() => {
    if (activeTab !== "home") return;

    const loadExploreAnime = async () => {
      setIsExploreLoading(true);
      setExploreOffset(0);
      try {
        const data = await fetchExploreAnimeFromKitsu(
          currentSort,
          selectedYear,
          searchQuery,
          0,
          PAGE_LIMIT,
        );
        setExploreAnimeList(data);
        setHasMoreExplore(data.length >= PAGE_LIMIT);
      } catch (err) {
        console.error("アニメ取得エラー:", err);
      } finally {
        setIsExploreLoading(false);
      }
    };

    loadExploreAnime();
  }, [activeTab, currentSort, selectedYear, searchQuery]);

  // スクロールによる追加読み込み（20件ずつ自動加算）
  const handleLoadMoreExplore = async () => {
    if (!hasMoreExplore || isExploreLoading || isExploreLoadingMore) return;

    setIsExploreLoadingMore(true);
    const nextOffset = exploreOffset + PAGE_LIMIT;

    try {
      const moreData = await fetchExploreAnimeFromKitsu(
        currentSort,
        selectedYear,
        searchQuery,
        nextOffset,
        PAGE_LIMIT,
      );
      if (moreData.length < PAGE_LIMIT) {
        setHasMoreExplore(false);
      }
      setExploreAnimeList((prev) => [...prev, ...moreData]);
      setExploreOffset(nextOffset);
    } catch (err) {
      console.error("追加読み込みエラー:", err);
    } finally {
      setIsExploreLoadingMore(false);
    }
  };

  const handleExploreScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      handleLoadMoreExplore();
    }
  };

  // アニメをデータベースに追加する共通関数
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
        fetchAnimeList();
        setIsModalOpen(false);
        setKitsuTargetForAdd(null);
        alert(`「${newAnime.title}」を追加しました！`);
      } else {
        alert("アニメの保存に失敗しました");
      }
    } catch (error) {
      console.error("追加エラー:", error);
    }
  };

  // 3. アニメの評価・メモを更新する関数
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
        fetchAnimeList();
      } else {
        alert("アニメの更新に失敗しました");
      }
    } catch (error) {
      console.error("更新エラー:", error);
    }
  };

  // 4. アニメを削除する関数
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

  // ステータスごとにデータをフィルタリング
  const completedList = animeList.filter((a) => a.status === "COMPLETED");
  const planList = animeList.filter((a) => a.status === "PLAN_TO_WATCH");

  // 平均点の計算
  const averageScore = completedList.length
    ? (
        completedList.reduce((acc, cur) => acc + (cur.score as number), 0) /
        completedList.length
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
          僕のライフステージ
        </h1>
      </header>

      {/* タブ切り替えエリア */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <button
          onClick={() => setActiveTab("home")}
          style={{
            padding: "8px 24px",
            fontWeight: "bold",
            backgroundColor: activeTab === "home" ? "#007bff" : "#e9ecef",
            color: activeTab === "home" ? "#fff" : "#495057",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          🏠 ホーム（探索）
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          style={{
            padding: "8px 24px",
            fontWeight: "bold",
            backgroundColor: activeTab === "completed" ? "#007bff" : "#e9ecef",
            color: activeTab === "completed" ? "#fff" : "#495057",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          視聴済みアニメ ({completedList.length})
        </button>
        <button
          onClick={() => setActiveTab("plan")}
          style={{
            padding: "8px 24px",
            fontWeight: "bold",
            backgroundColor: activeTab === "plan" ? "#007bff" : "#e9ecef",
            color: activeTab === "plan" ? "#fff" : "#495057",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          視聴予定リスト ({planList.length})
        </button>
      </div>

      {/* --- ホーム（探索）タブの中身 --- */}
      {activeTab === "home" && (
        <>
          {/* キーワード検索 ＆ ソート ＆ 年度フィルターエリア */}
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
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            {/* ★ 1. 名前検索（並び替えの左に配置） */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: 1,
                minWidth: "200px",
              }}
            >
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#495057",
                }}
              >
                検索:
              </span>
              <input
                type="text"
                placeholder="アニメ名を入力..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ced4da",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            {/* 2. 並び替え */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#495057",
                }}
              >
                並び替え:
              </span>
              <select
                value={currentSort}
                onChange={(e) =>
                  setCurrentSort(e.target.value as AnimeSortType)
                }
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ced4da",
                  fontSize: "0.9rem",
                }}
              >
                <option value="-userCount">🔥 トレンド（人気順）</option>
                <option value="-averageRating">⭐ 高評価順</option>
                <option value="-startDate">🆕 最新作順</option>
              </select>
            </div>

            {/* 3. 放送年度 */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#495057",
                }}
              >
                放送年度:
              </span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ced4da",
                  fontSize: "0.9rem",
                }}
              >
                <option value="">すべて</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 1行1アニメのリスト表示エリア（スクロールで20件ずつ自動追加） */}
          <main
            onScroll={handleExploreScroll}
            style={{
              width: "100%",
              maxHeight: "70vh",
              overflowY: "auto",
              paddingRight: "4px",
            }}
          >
            {isExploreLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "#666",
                }}
              >
                <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                  アニメを探索中...
                </p>
              </div>
            ) : exploreAnimeList.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "#666",
                }}
              >
                <p style={{ fontSize: "1.1rem" }}>
                  該当するアニメが見つかりませんでした。
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {exploreAnimeList.map((anime) => {
                  const title =
                    anime.attributes.titles?.ja_jp ||
                    anime.attributes.canonicalTitle ||
                    "無題";
                  const poster =
                    anime.attributes.posterImage?.small ||
                    anime.attributes.posterImage?.medium ||
                    "";
                  const startDate = anime.attributes.startDate || "不明";
                  const subtype = anime.attributes.subtype || "TV";
                  const episodes = anime.attributes.episodeCount
                    ? `${anime.attributes.episodeCount}話`
                    : "不明";

                  return (
                    <div
                      key={anime.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        gap: "16px",
                      }}
                    >
                      {/* ポスター画像 */}
                      {poster ? (
                        <img
                          src={poster}
                          alt={title}
                          style={{
                            width: "50px",
                            height: "75px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "50px",
                            height: "75px",
                            backgroundColor: "#e9ecef",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.7rem",
                            color: "#6c757d",
                          }}
                        >
                          No Image
                        </div>
                      )}

                      {/* 情報エリア */}
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            margin: "0 0 4px 0",
                            fontSize: "1rem",
                            color: "#212529",
                          }}
                        >
                          {title}
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.85rem",
                            color: "#6c757d",
                          }}
                        >
                          放送開始: {startDate} / 形式: {subtype} / 話数:{" "}
                          {episodes}
                        </p>
                      </div>

                      {/* 追加ボタン */}
                      <div>
                        <button
                          onClick={() => setKitsuTargetForAdd(anime)}
                          style={{
                            padding: "6px 14px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                          }}
                        >
                          ＋ リストに追加
                        </button>
                      </div>
                    </div>
                  );
                })}

                {isExploreLoadingMore && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "16px",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    さらに読み込み中...
                  </div>
                )}

                {!hasMoreExplore && exploreAnimeList.length > 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "16px",
                      fontSize: "0.85rem",
                      color: "#6c757d",
                    }}
                  >
                    すべての作品を読み込みました
                  </div>
                )}
              </div>
            )}
          </main>
        </>
      )}

      {/* --- 視聴済みタブの中身 --- */}
      {activeTab === "completed" && (
        <>
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
            <div style={{ fontSize: "0.95rem", color: "#495057" }}>
              総視聴数:{" "}
              <strong style={{ fontSize: "1.1rem", color: "#212529" }}>
                {completedList.length}
              </strong>{" "}
              作品
            </div>
            <div style={{ fontSize: "0.95rem", color: "#495057" }}>
              平均スコア:{" "}
              <strong style={{ fontSize: "1.1rem", color: "#d97706" }}>
                {averageScore}
              </strong>{" "}
              点
            </div>
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

          <main style={{ width: "100%" }}>
            {isLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "#666",
                }}
              >
                <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                  データを読み込んでいます...
                </p>
              </div>
            ) : (
              <ScoreGrid
                animeList={completedList}
                onSelectAnime={(anime) => setSelectedAnime(anime)}
              />
            )}
          </main>
        </>
      )}

      {/* --- 視聴予定タブの中身 --- */}
      {activeTab === "plan" && (
        <>
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
            <div>
              視聴予定数:{" "}
              <strong style={{ fontSize: "1.1rem", color: "#212529" }}>
                {planList.length}
              </strong>{" "}
              作品
            </div>
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
              ＋ 視聴予定に追加
            </button>
          </div>

          <main style={{ width: "100%" }}>
            {isLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "#666",
                }}
              >
                <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                  データを読み込んでいます...
                </p>
              </div>
            ) : (
              <WatchlistGrid
                animeList={planList}
                onSelectAnime={(anime) => setSelectedAnime(anime)}
              />
            )}
          </main>
        </>
      )}

      {/* 既存の検索・追加用モーダル */}
      <AddAnimeModal
        key={activeTab}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAnime={handleAddAnime}
        defaultStatus={
          activeTab === "completed" ? "COMPLETED" : "PLAN_TO_WATCH"
        }
      />

      {/* ホーム画面からの個別追加用モーダル */}
      <ExploreAnimeModal
        key={kitsuTargetForAdd?.id || "closed"} // ★ kitsuTargetが変わるたびに再マウントされてリセットされる
        kitsuAnime={kitsuTargetForAdd}
        isOpen={kitsuTargetForAdd !== null}
        onClose={() => setKitsuTargetForAdd(null)}
        onAddAnime={handleAddAnime}
      />

      {/* アニメ詳細・編集・削除モーダル */}
      {selectedAnime && (
        <AnimeDetailModal
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
