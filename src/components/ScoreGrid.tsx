import type { Anime } from "../types/anime";

interface ScoreGridProps {
  animeList: Anime[];
  onSelectAnime: (anime: Anime) => void;
}

const SCORE_RANGES = [
  { min: 90, max: 100, label: "90-100点", color: "#d97706" },
  { min: 80, max: 89, label: "80-89点", color: "#2563eb" },
  { min: 70, max: 79, label: "70-79点", color: "#059669" },
  { min: 60, max: 69, label: "60-69点", color: "#7c3aed" },
  { min: 0, max: 59, label: "0-59点", color: "#6b7280" },
];

export function ScoreGrid({ animeList, onSelectAnime }: ScoreGridProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {SCORE_RANGES.map((range) => {
        const filteredList = animeList.filter(
          (anime) =>
            (anime.score as number) >= range.min &&
            (anime.score as number) <= range.max, // 視聴済みアニメにスコアは必ず存在する。
        );

        return (
          <section key={range.label}>
            {/* セクションヘッダー */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                paddingBottom: "8px",
                borderBottom: "2px solid #e9ecef",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#343a40",
                }}
              >
                {range.label}
              </h2>
              <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                ({filteredList.length})
              </span>
            </div>

            {/* アニメカード一覧 */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                justifyContent: "flex-start",
              }}
            >
              {filteredList.map((anime) => (
                <div
                  key={anime.id}
                  className="anime-card" /* ★ アニメーション連動用のクラス */
                  onClick={() => onSelectAnime(anime)}
                  style={{
                    width: "147px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <img
                    src={anime.imageUrl}
                    alt={anime.title}
                    style={{
                      width: "147px",
                      height: "210px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}
                  />

                  {/* ★ 折り返し全文表示タイトルエリア */}
                  <div style={{ padding: "8px 0" }}>
                    <span
                      style={{
                        fontWeight: "bold",
                        color: range.color,
                        marginRight: "6px",
                        fontSize: "1rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      [{anime.score}点]
                    </span>
                    <span
                      style={{
                        color: "#212529",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        lineHeight: "1.4",
                        wordBreak: "break-word", // 長いタイトルや英単語でも溢れずに折り返す
                        whiteSpace: "normal", // 折り返しを許可
                      }}
                    >
                      {anime.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
