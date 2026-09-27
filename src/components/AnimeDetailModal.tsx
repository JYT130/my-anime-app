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
  const [score, setScore] = useState<number>(anime.score);
  const [comment, setComment] = useState<string>(anime.comment ?? "");

  if (!isOpen || !anime) return null;

  const handleSave = () => {
    const updatedAnime: Anime = {
      ...anime,
      score,
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

  const handleClose = () => {
    onClose();
  };

  return (
    <div
      onClick={handleClose}
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

            {/* 💡 タグ（バッジ）表示エリア */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              {/* 放送年 */}
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

              {/* メディア種別 */}
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

              {/* 全〇話 */}
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

        {/* 編集フォームエリア */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
              onClick={handleClose}
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
