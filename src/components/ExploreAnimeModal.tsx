import { useState, useEffect } from "react";
import type { KitsuAnime } from "../utils/KitsuApi";
import type { CreateAnimeInput } from "../types/anime";

interface ExploreAnimeModalProps {
  kitsuAnime: KitsuAnime | null;
  isOpen: boolean;
  onClose: () => void;
  onAddAnime: (newAnime: CreateAnimeInput) => void;
}

export function ExploreAnimeModal({
  kitsuAnime,
  isOpen,
  onClose,
  onAddAnime,
}: ExploreAnimeModalProps) {
  const [status, setStatus] = useState<"COMPLETED" | "PLAN_TO_WATCH">(
    "PLAN_TO_WATCH",
  );
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [score, setScore] = useState<number>(80);
  const [comment, setComment] = useState<string>("");

  if (!isOpen || !kitsuAnime) return null;

  const title =
    kitsuAnime.attributes.titles?.ja_jp ||
    kitsuAnime.attributes.titles?.en_jp ||
    kitsuAnime.attributes.canonicalTitle ||
    "無題";

  const imageUrl =
    kitsuAnime.attributes.posterImage?.medium ||
    kitsuAnime.attributes.posterImage?.small ||
    "";

  const startDate = kitsuAnime.attributes.startDate;
  const subtype = kitsuAnime.attributes.subtype;
  const episodeCount = kitsuAnime.attributes.episodeCount;

  const handleSave = () => {
    const newAnime: CreateAnimeInput = {
      title,
      score: status === "COMPLETED" ? score : undefined,
      imageUrl,
      comment: comment.trim() ? comment : undefined,
      startDate: startDate,
      subtype: subtype,
      episodeCount: episodeCount,
      status,
      priority: status === "PLAN_TO_WATCH" ? priority : undefined,
      kitsuId: kitsuAnime.id,
    };
    onAddAnime(newAnime);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "480px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* ヘッダー・タイトル表示 */}
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              style={{
                width: "80px",
                height: "112px",
                objectFit: "cover",
                borderRadius: "4px",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: "80px",
                height: "112px",
                backgroundColor: "#e9ecef",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                color: "#6c757d",
                flexShrink: 0,
              }}
            >
              No Image
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "1.1rem" }}>{title}</h2>

            {/* バッジ */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              {startDate && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#495057",
                    backgroundColor: "#e9ecef",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {startDate.split("-")[0]}年
                </span>
              )}
              {subtype && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#004085",
                    backgroundColor: "#cce5ff",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {subtype}
                </span>
              )}
              {episodeCount && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#155724",
                    backgroundColor: "#d4edda",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                  }}
                >
                  全{episodeCount}話
                </span>
              )}
            </div>
          </div>
        </div>

        <hr
          style={{ border: "none", borderTop: "1px solid #eee", margin: 0 }}
        />

        {/* フォームエリア */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {status === "PLAN_TO_WATCH" ? (
            <>
              {/* 優先度選択 */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>
                  優先度:
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                  {(["HIGH", "MEDIUM", "LOW"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      style={{
                        flex: 1,
                        padding: "6px",
                        borderRadius: "4px",
                        border: "none",
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        backgroundColor:
                          priority === p
                            ? p === "HIGH"
                              ? "#dc3545"
                              : p === "MEDIUM"
                                ? "#fd7e14"
                                : "#6c757d"
                            : "#e9ecef",
                        color: priority === p ? "#fff" : "#495057",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* メモ・感想 */}
              <div
                style={{
                  fontSize: "0.85rem",
                  display: "flex",
                  gap: "6px",
                  alignItems: "flex-start",
                }}
              >
                <label
                  htmlFor="add-comment"
                  style={{ whiteSpace: "nowrap", paddingTop: "4px" }}
                >
                  メモ・感想 (任意):
                </label>
                <textarea
                  id="add-comment"
                  placeholder="感想やメモを記述..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  style={{
                    flex: 1,
                    padding: "4px 6px",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* 視聴済みに切り替えるボタン */}
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "10px",
                  borderRadius: "6px",
                  textAlign: "center",
                  border: "1px dashed #ced4da",
                }}
              >
                <button
                  type="button"
                  onClick={() => setStatus("COMPLETED")}
                  style={{
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 12px",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  視聴済みとして登録する（評価入力）
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: "0.80rem",
                  color: "#28a745",
                  fontWeight: "bold",
                  backgroundColor: "#d4edda",
                  padding: "6px 10px",
                  borderRadius: "4px",
                }}
              >
                🎉 視聴済み作品として登録します
              </div>

              {/* マイ評価 */}
              <div
                style={{
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <label htmlFor="add-score">マイ評価 (0-100点):</label>
                <input
                  id="add-score"
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  style={{
                    width: "48px",
                    padding: "3px 6px",
                    textAlign: "right",
                    fontSize: "0.85rem",
                  }}
                />
                <span>点</span>
              </div>

              {/* メモ・感想 */}
              <div
                style={{
                  fontSize: "0.85rem",
                  display: "flex",
                  gap: "6px",
                  alignItems: "flex-start",
                }}
              >
                <label
                  htmlFor="add-comment"
                  style={{ whiteSpace: "nowrap", paddingTop: "4px" }}
                >
                  メモ・感想 (任意):
                </label>
                <textarea
                  id="add-comment"
                  placeholder="感想やメモを記述..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  style={{
                    flex: 1,
                    padding: "4px 6px",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => setStatus("PLAN_TO_WATCH")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  textAlign: "left",
                  padding: 0,
                }}
              >
                ◀ 視聴予定に戻す
              </button>
            </>
          )}
        </div>

        {/* ボタンエリア */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "6px 16px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            リストに追加
          </button>
        </div>
      </div>
    </div>
  );
}
