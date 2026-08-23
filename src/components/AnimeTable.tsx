import type { Anime } from "../types/anime";

type AnimeListProps = {
  animeList: Anime[];
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

export function AnimeTable({ animeList }: AnimeListProps) {
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
          <th style={{ padding: "12px 8px", whiteSpace: "nowrap" }}>
            タイトル
          </th>
          <th style={{ padding: "12px 8px", whiteSpace: "nowrap" }}>
            ステータス
          </th>
          <th style={{ padding: "12px 8px", whiteSpace: "nowrap" }}>
            視聴年度
          </th>
          <th style={{ padding: "12px 8px", whiteSpace: "nowrap" }}>
            評価(1~5)
          </th>
          <th style={{ padding: "12px 8px" }}>備考</th>
        </tr>
      </thead>
      <tbody>
        {animeList.map((anime) => {
          // ステータスに応じてバッジの色を変更
          const badgeColor = anime.status === "視聴中" ? "#e3f2fd" : "#e8f5e9";
          const badgeTextColor =
            anime.status === "視聴中" ? "#0d47a1" : "#1b5e20";

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
                    backgroundColor: badgeColor,
                    color: badgeTextColor,
                    padding: "6px 12px",
                    borderRadius: "16px",
                    fontSize: "0.9em",
                    fontWeight: "bold",
                  }}
                >
                  {anime.status}
                </span>
              </td>

              {/* 視聴年度 */}
              <td style={{ padding: "12px 8px" }}>{anime.year}年</td>

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
        })}
      </tbody>
    </table>
  );
}
