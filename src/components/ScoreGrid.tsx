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
      {/* ★ ホバー時にテキストを流すスタイルの定義 */}
      <style>{`
  .anime-card-title-box {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    margin-top: 6px;
    font-size: 0.8rem;
  }

  .anime-card-title-inner {
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
  }

  /* 親カードにカーソルが乗った時だけ動かす */
  .anime-card:hover .anime-card-title-inner {
    text-overflow: clip;
    overflow: visible;
    max-width: none;
    animation: scroll-title 3.5s linear infinite alternate;
  }

  /* 一定速度で左へスライドし、両端で少しだけ静止する設定 */
  @keyframes scroll-title {
    0%, 15% {
      transform: translateX(0); /* 最初は少し止まる */
    }
    85%, 100% {
      transform: translateX(calc(-100% + 100px)); /* 一定速度で左端まで流れて止まる */
    }
  }
`}</style>

      {SCORE_RANGES.map((range) => {
        const filteredList = animeList.filter(
          (anime) => anime.score >= range.min && anime.score <= range.max,
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
                    width: "126px",
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
                      width: "126px",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}
                  />

                  {/* ★ 流れるタイトルエリア */}
                  <div className="anime-card-title-box">
                    <div className="anime-card-title-inner">
                      <span
                        style={{
                          fontWeight: "bold",
                          color: range.color,
                          marginRight: "4px",
                        }}
                      >
                        [{anime.score}点]
                      </span>
                      <span style={{ color: "#212529" }}>{anime.title}</span>
                    </div>
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
