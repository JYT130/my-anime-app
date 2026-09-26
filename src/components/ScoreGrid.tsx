import type { Anime } from "../types/anime";

// スコア帯
const SCORE_RANGES = [
  { min: 90, max: 100, label: "90-100点" },
  { min: 80, max: 89, label: "80-89点" },
  { min: 70, max: 79, label: "70-79点" },
  { min: 60, max: 69, label: "60-69点" },
  { min: 50, max: 59, label: "50-59点" },
  { min: 0, max: 49, label: "0-49点" },
];

interface ScoreGridProps {
  animeList: Anime[];
  onSelectAnime: (anime: Anime) => void;
}

export function ScoreGrid({ animeList, onSelectAnime }: ScoreGridProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "16px",
      }}
    >
      {SCORE_RANGES.map((range) => {
        // 指定したスコア帯に当てはまるアニメだけを抽出
        const filteredAnime = animeList.filter(
          (anime) => anime.score >= range.min && anime.score <= range.max,
        );

        return (
          <div
            key={range.label}
            style={{ borderBottom: "1px solid #ccc", paddingBottom: "16px" }}
          >
            <h3 style={{ margin: "0 0 12px 0" }}>
              {range.label} ({filteredAnime.length})
            </h3>

            {/* サムネイルを並べるグリッドエリア */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {filteredAnime.length === 0 ? (
                <p style={{ color: "#888", fontSize: "0.9rem" }}>
                  該当する作品はありません
                </p>
              ) : (
                filteredAnime.map((anime) => (
                  <div
                    key={anime.id}
                    onClick={() => onSelectAnime(anime)} // 💡 カードクリック時に発火！
                    style={{
                      width: "100px",
                      textAlign: "center",
                      cursor: "pointer", // 💡 カーソルを指マークにする
                    }}
                  >
                    <img
                      src={anime.imageUrl}
                      alt={anime.title}
                      style={{
                        width: "100px",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "0.8rem",
                        marginTop: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={anime.title}
                    >
                      {anime.title}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
