import { useState } from "react";
import type { Anime } from "../types/anime";

interface AnimeDetailModalProps {
  anime: Anime;
  isOpen: boolean;
  onClose: () => void;
  onUpdateAnime: (updatedAnime: Anime) => void;
  onDeleteAnime: (id: number) => void;
}

export function AnimeDetailModal({
  anime,
  isOpen,
  onClose,
  onUpdateAnime,
  onDeleteAnime,
}: AnimeDetailModalProps) {
  // status ステートを軸にして、現在の状態を管理する
  const [status, setStatus] = useState<"COMPLETED" | "PLAN_TO_WATCH">(
    anime.status,
  );
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">(
    anime.priority || "MEDIUM",
  );
  const [score, setScore] = useState<number>(anime.score ?? 80);
  const [comment, setComment] = useState<string>(anime.comment ?? "");

  if (!isOpen || !anime) return null;

  const handleSave = () => {
    const updatedAnime: Anime = {
      ...anime,
      status,
      score: status === "COMPLETED" ? score : undefined,
      priority: status === "PLAN_TO_WATCH" ? priority : undefined,
      comment: comment.trim() ? comment : undefined,
    };
    onUpdateAnime(updatedAnime);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("本当に削除しますか？")) {
      onDeleteAnime(anime.id);
      onClose();
    }
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
          <img
            src={anime.imageUrl}
            alt={anime.title}
            style={{
              width: "80px",
              height: "112px",
              objectFit: "cover",
              borderRadius: "4px",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "1.1rem" }}>
              {anime.title}
            </h2>

            {/* バッジなど */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              {anime.startDate && (
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
                  {anime.startDate.split("-")[0]}年
                </span>
              )}
              {anime.subtype && (
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
                  {anime.subtype}
                </span>
              )}
              {anime.episodeCount && (
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
                  全{anime.episodeCount}話
                </span>
              )}
            </div>
          </div>
        </div>

        <hr
          style={{ border: "none", borderTop: "1px solid #eee", margin: 0 }}
        />

        {/* フォームエリア：status によって完全に表示を切り替える */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {status === "PLAN_TO_WATCH" ? (
            /* --- 視聴予定の場合 --- */
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
                  htmlFor="edit-comment"
                  style={{ whiteSpace: "nowrap", paddingTop: "4px" }}
                >
                  メモ・感想 (任意):
                </label>
                <textarea
                  id="edit-comment"
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

              {/* status を "COMPLETED" に書き換える */}
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "12px",
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
                    padding: "8px 16px",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  評価して視聴済みにする
                </button>
              </div>
            </>
          ) : (
            /* --- 視聴済みの場合（または昇格後） --- */
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
                <label htmlFor="edit-score">マイ評価 (0-100点):</label>
                <input
                  id="edit-score"
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
                  htmlFor="edit-comment"
                  style={{ whiteSpace: "nowrap", paddingTop: "4px" }}
                >
                  メモ・感想 (任意):
                </label>
                <textarea
                  id="edit-comment"
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

              {/* 視聴予定→視聴済みのキャンセル */}
              {anime.status === "PLAN_TO_WATCH" && (
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
              )}
            </>
          )}
        </div>

        {/* ボタンエリア */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "8px",
          }}
        >
          <button
            onClick={handleDelete}
            style={{
              padding: "6px 12px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            この作品を削除
          </button>

          <div style={{ display: "flex", gap: "8px" }}>
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
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              変更を保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
