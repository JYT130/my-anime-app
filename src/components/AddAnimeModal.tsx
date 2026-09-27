import { useState } from "react";
import { searchAnimeFromKitsu, type KitsuAnime } from "../utils/KitsuApi";
import type { CreateAnimeInput } from "../types/anime";

interface AddAnimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAnime: (newAnime: CreateAnimeInput) => void;
}

export function AddAnimeModal({
  isOpen,
  onClose,
  onAddAnime,
}: AddAnimeModalProps) {
  const [query, setQuery] = useState(""); // 検索窓に入力された文字列
  const [searchResults, setSearchResults] = useState<KitsuAnime[]>([]); // APIから返ってきた検索結果の配列
  const [selectedAnime, setSelectedAnime] = useState<KitsuAnime | null>(null); // 現在ユーザーが選択中のアニメ1件
  const [userScore, setUserScore] = useState<number>(80); // ユーザーが入力した評価点数（初期値80）
  const [userComment, setUserComment] = useState(""); // ユーザーが入力したメモ・感想
  const [isLoading, setIsLoading] = useState(false); // 検索通信中かどうか（ボタンの二重押し防止・表示切り替え用）
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // エラーメッセージの文字列

  if (!isOpen) return null;

  // 1. Kitsu API 検索処理
  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const results = await searchAnimeFromKitsu(query);
      if (results.length === 0) {
        setErrorMessage("該当する作品が見つかりませんでした。");
      }
      setSearchResults(results);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("予期せぬエラーが発生しました。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. アニメ登録処理
  const handleAdd = () => {
    if (!selectedAnime) return;

    const title =
      selectedAnime.attributes.titles?.ja_jp ||
      selectedAnime.attributes.titles?.en_jp ||
      selectedAnime.attributes.canonicalTitle;

    const imageUrl =
      selectedAnime.attributes.posterImage?.small ||
      selectedAnime.attributes.posterImage?.medium ||
      "https://placehold.co/100x140?text=No+Image";

    const newAnime: CreateAnimeInput = {
      title,
      score: userScore,
      imageUrl,
      comment: userComment.trim() ? userComment : undefined,
      startDate: selectedAnime.attributes.startDate,
      subtype: selectedAnime.attributes.subtype,
      episodeCount: selectedAnime.attributes.episodeCount,
      kitsuId: selectedAnime.kitsuId,
    };

    onAddAnime(newAnime);

    // リセット処理
    setSelectedAnime(null);
    setSearchResults([]);
    setQuery("");
    setUserScore(80);
    setUserComment("");
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "520px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        {/* 固定ヘッダー領域 */}
        <div style={{ padding: "16px 20px 8px 20px" }}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "1.25rem" }}>
            アニメを追加 (Kitsu API)
          </h2>

          {errorMessage && (
            <div
              style={{
                backgroundColor: "#f8d7da",
                color: "#721c24",
                padding: "8px 12px",
                borderRadius: "4px",
                marginBottom: "8px",
                fontSize: "0.85rem",
                border: "1px solid #f5c6cb",
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          {/* 検索入力エリア */}
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="タイトルを入力"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              style={{ padding: "8px 16px", cursor: "pointer" }}
            >
              {isLoading ? "検索中..." : "検索"}
            </button>
          </div>
        </div>

        {/* 可変スクロール領域（検索候補一覧） */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            minHeight: "150px",
          }}
        >
          {searchResults.map((anime) => {
            const isSelected = selectedAnime?.kitsuId === anime.kitsuId;
            const displayTitle =
              anime.attributes.titles?.ja_jp ||
              anime.attributes.titles?.en_jp ||
              anime.attributes.canonicalTitle;

            return (
              <div
                key={anime.kitsuId}
                onClick={() => setSelectedAnime(anime)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "6px 10px",
                  border: isSelected ? "2px solid #007bff" : "1px solid #ddd",
                  backgroundColor: isSelected ? "#e6f2ff" : "#fff",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                <img
                  src={
                    anime.attributes.posterImage?.small ||
                    "https://placehold.co/40x56"
                  }
                  alt={displayTitle}
                  style={{
                    width: "36px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "2px",
                  }}
                />
                <div
                  style={{ fontWeight: "bold", fontSize: "0.85rem", flex: 1 }}
                >
                  {displayTitle}
                </div>
              </div>
            );
          })}
        </div>

        {/* 固定フッター（選択中アニメの入力・登録領域） */}
        <div
          style={{
            borderTop: "1px solid #ddd",
            backgroundColor: "#f9f9f9",
            padding: "12px 20px",
          }}
        >
          {selectedAnime ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                選択中:{" "}
                <strong>
                  {selectedAnime.attributes.titles?.ja_jp ||
                    selectedAnime.attributes.canonicalTitle}
                </strong>
              </div>

              {/* マイ評価行（インライン配置・コンパクト化） */}
              <div
                style={{
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <label htmlFor="user-score">マイ評価 (0-100点):</label>
                <input
                  id="user-score"
                  type="number"
                  min="0"
                  max="100"
                  value={userScore}
                  onChange={(e) => setUserScore(Number(e.target.value))}
                  style={{
                    width: "48px",
                    padding: "3px 6px",
                    textAlign: "right",
                    fontSize: "0.85rem",
                  }}
                />
                <span>点</span>
              </div>

              {/* メモ行（インラインラベル＋textarea） */}
              <div
                style={{
                  fontSize: "0.85rem",
                  display: "flex",
                  gap: "6px",
                  alignItems: "flex-start",
                }}
              >
                <label
                  htmlFor="user-comment"
                  style={{ whiteSpace: "nowrap", paddingTop: "4px" }}
                >
                  メモ・感想 (任意):
                </label>
                <textarea
                  id="user-comment"
                  placeholder="感想やメモを記述..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  rows={2}
                  style={{
                    flex: 1,
                    padding: "4px 6px",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* 下部ボタンエリア */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "2px",
                }}
              >
                <button
                  onClick={onClose}
                  style={{ padding: "6px 12px", cursor: "pointer" }}
                >
                  キャンセル
                </button>
                <button
                  onClick={handleAdd}
                  style={{
                    padding: "6px 16px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  この内容で登録
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "#666" }}>
                リストから作品を選択してください
              </span>
              <button
                onClick={onClose}
                style={{ padding: "6px 12px", cursor: "pointer" }}
              >
                キャンセル
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
