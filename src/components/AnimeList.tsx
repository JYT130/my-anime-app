import type { Anime } from "../types/anime";

type AnimeListProps = {
  animeList: Anime[];
};

export function AnimeList({ animeList }: AnimeListProps) {
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
                {anime.rating ? `★${anime.rating}` : "-"}
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
