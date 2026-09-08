import { useState } from "react";
import type { Anime } from "../types/anime";

type AnimeListProps = {
  animeList: Anime[];
  searchTitle: string;
  statusFilter: "すべて" | "視聴予定" | "視聴中" | "視聴済";
};

// 評価星描画コンポーネント
const StarRating = ({ rating }: { rating: number }) => {
  const percentage = (rating / 5) * 100;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        fontSize: "1rem",
        color: "#ccc",
      }}
    >
      ★★★★★
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${percentage}%`,
          overflow: "hidden",
          color: "#f59e0b",
          whiteSpace: "nowrap",
        }}
      >
        ★★★★★
      </div>
    </div>
  );
};

// ステータスに応じた背景色と文字色のマッピング
const STATUS_STYLE = {
  視聴予定: { bg: "#fff3e0", color: "#df8714" },
  視聴中: { bg: "#e3f2fd", color: "#0d47a1" },
  視聴済: { bg: "#e8f5e9", color: "#1b5e20" },
} as const;

// アニメリストが空の場合のメッセージ表示分岐
const EMPTY_MESSAGES = {
  FILTERED: {
    title: "該当するアニメが見つかりません",
    description:
      "検索キーワードやフィルター条件を変更して、再度お試しください。",
  },
  INITIAL: {
    title: "登録されているアニメがありません",
    description: "新しいアニメを追加してみましょう。",
  },
} as const;

export function AnimeTable({
  animeList,
  searchTitle,
  statusFilter,
}: AnimeListProps) {
  // ヘッダーソートコンポーネント
  const [sortKey, setSortKey] = useState<"title" | "year" | "rating" | null>(
    null,
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const handleSort = (clickedKey: typeof sortKey) => {
    if (sortKey !== clickedKey) {
      setSortKey(clickedKey);
      setSortOrder("asc");
      return;
    }

    if (sortOrder === "asc") {
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      setSortOrder("asc");
      setSortKey(null);
    }
  };
  const sortedAnimeList = [...animeList].sort((a, b) => {
    if (!sortKey) return 0;

    const multiplier = sortOrder === "asc" ? 1 : -1;

    if (sortKey === "title") {
      return a.title.localeCompare(b.title) * multiplier;
    }

    if (sortKey === "year") {
      const aYear = a.year ?? 0;
      const bYear = b.year ?? 0;
      return (aYear - bYear) * multiplier;
    }

    if (sortKey === "rating") {
      const aRating = a.rating ?? 0;
      const bRating = b.rating ?? 0;
      return (aRating - bRating) * multiplier;
    }

    return 0;
  });
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
        textAlign: "left",
      }}
    >
      <thead>
        <tr
          style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}
        >
          <th
            onClick={() => handleSort("title")}
            style={{ padding: "12px 8px", whiteSpace: "nowrap" }}
          >
            タイトル{" "}
            {sortKey === "title" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
          </th>
          <th style={{ padding: "12px 8px", whiteSpace: "nowrap" }}>
            ステータス
          </th>
          <th
            onClick={() => handleSort("year")}
            style={{ padding: "12px 8px", whiteSpace: "nowrap" }}
          >
            視聴年度{" "}
            {sortKey === "year" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
          </th>
          <th
            onClick={() => handleSort("rating")}
            style={{ padding: "12px 8px", whiteSpace: "nowrap" }}
          >
            評価(1~5){" "}
            {sortKey === "rating" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
          </th>
          <th style={{ padding: "12px 8px" }}>備考</th>
        </tr>
      </thead>
      <tbody>
        {/* アニメリストが空の場合はメッセージ そうでない場合はアニメリストを表示 */}
        {animeList.length === 0 ? (
          <tr>
            <td
              colSpan={5}
              style={{
                padding: "12px 8px",
                whiteSpace: "pre-line",
                textAlign: "center",
              }}
            >
              {searchTitle || statusFilter !== "すべて"
                ? `${EMPTY_MESSAGES.FILTERED.title}\n${EMPTY_MESSAGES.FILTERED.description}`
                : `${EMPTY_MESSAGES.INITIAL.title}\n${EMPTY_MESSAGES.INITIAL.description}`}
            </td>
          </tr>
        ) : (
          sortedAnimeList.map((anime) => {
            // ステータスに応じた背景色を取得
            const style = STATUS_STYLE[anime.status];

            return (
              <tr key={anime.id} style={{ borderBottom: "1px solid #eee" }}>
                {/* タイトル */}
                <td style={{ padding: "12px 8px", fontWeight: "bold" }}>
                  {anime.title}
                </td>

                {/* ステータスバッジ */}
                <td style={{ padding: "12px 8px" }}>
                  <span
                    style={{
                      backgroundColor: style.bg,
                      color: style.color,
                      padding: "6px 12px",
                      borderRadius: "16px",
                      fontSize: "0.9em",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {anime.status}
                  </span>
                </td>

                {/* 視聴年度（未入力ならハイフン） */}
                <td style={{ padding: "12px 8px" }}>
                  {anime.year !== undefined ? `${anime.year}年` : "-"}
                </td>

                {/* 評価（未入力ならハイフン） */}
                <td style={{ padding: "12px 8px" }}>
                  {anime.rating ? <StarRating rating={anime.rating} /> : "-"}
                </td>

                {/* 備考（未入力ならハイフン） */}
                <td style={{ padding: "12px 8px", color: "#666" }}>
                  {anime.comment || "-"}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
