import type { Anime } from "../types/anime";

interface WatchlistGridProps {
  animeList: Anime[];
  onSelectAnime: (anime: Anime) => void;
}

export function WatchlistGrid({ animeList, onSelectAnime }: WatchlistGridProps) {
  return (
    <div style={{ width: "100%" }}>
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
          視聴予定アニメ一覧
        </h2>
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
        {animeList.map((anime) => (
          <div
            key={anime.id}
            className="anime-card"
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

            {/* タイトル＆優先度表示エリア */}
            <div style={{ padding: "8px 0" }}>
              {anime.priority && (
                <span
                  style={{
                    display: "inline-block",
                    fontWeight: "bold",
                    color: "#fff",
                    backgroundColor:
                      anime.priority === "HIGH"
                        ? "#dc3545"
                        : anime.priority === "MEDIUM"
                        ? "#fd7e14"
                        : "#6c757d",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    marginBottom: "4px",
                  }}
                >
                  {anime.priority}
                </span>
              )}
              <div
                style={{
                  color: "#212529",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  lineHeight: "1.4",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {anime.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}