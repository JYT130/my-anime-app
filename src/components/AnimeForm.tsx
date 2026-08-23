import { useState } from "react";
import type { Anime } from "../types/anime";

type AnimeFormProps = {
  onAddAnime: (newAnime: Anime) => void;
};

export function AnimeForm({ onAddAnime }: AnimeFormProps) {
  const [inputTitle, setInputTitle] = useState("");
  const [inputStatus, setInputStatus] = useState<"視聴中" | "視聴済">("視聴中");
  const [inputYear, setInputYear] = useState("");
  const [inputRating, setInputRating] = useState("");
  const [inputComment, setInputComment] = useState("");

  const handleSubmit = () => {
    if (inputTitle.trim() === "" || inputYear.trim() === "") return;

    const newAnime: Anime = {
      id: Date.now(),
      title: inputTitle,
      status: inputStatus,
      year: parseInt(inputYear),
      rating: parseFloat(inputRating) || undefined,
      comment: inputComment || undefined,
    };

    onAddAnime(newAnime);

    setInputTitle("");
    setInputStatus("視聴中");
    setInputYear(new Date().getFullYear().toString());
    setInputRating("");
    setInputComment("");
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ marginBottom: "20px" }}>
      {/* ツールバーエリア（検索・フィルター・追加ボタンを1行に配置） */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        {/* 検索領域 */}
        <div style={{ display: "flex", gap: "8px", flex: 1 }}>
          <input
            type="text"
            placeholder="🔍 アニメ名で検索..."
            disabled // まだ未実装のため disabled 指定
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "100%",
              maxWidth: "240px",
              backgroundColor: "#f9f9f9",
            }}
          />
          <select
            disabled
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
            }}
          >
            <option>すべて</option>
          </select>
        </div>

        {/* アコーディオントグルボタン */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "8px 16px",
            backgroundColor: isOpen ? "#6b7280" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          {isOpen ? "✕ 閉じる" : "＋ アニメを追加"}
        </button>
      </div>

      {/* 開閉する入力フォーム領域 */}
      {isOpen && (
        <div
          style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            backgroundColor: "#f8fafc",
          }}
        >
          {/* <form> */}
          <div
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <input
                type="text"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                placeholder="アニメタイトル"
                style={{ padding: "6px", marginRight: "8px" }}
              />
              <select
                value={inputStatus}
                onChange={(e) =>
                  setInputStatus(e.target.value as "視聴中" | "視聴済")
                }
                style={{ padding: "6px" }}
              >
                <option value="視聴中">視聴中</option>
                <option value="視聴済">視聴済</option>
              </select>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <input
                type="number"
                value={inputYear}
                onChange={(e) => setInputYear(e.target.value)}
                placeholder="視聴年度 (例: 2026)"
                style={{ padding: "6px", marginRight: "8px", width: "140px" }}
              />
              <input
                type="number"
                step="0.1"
                value={inputRating}
                onChange={(e) => setInputRating(e.target.value)}
                placeholder="評価 (例: 4.5)"
                style={{ padding: "6px", width: "120px" }}
              />
            </div>

            <div>
              <input
                type="text"
                value={inputComment}
                onChange={(e) => setInputComment(e.target.value)}
                placeholder="感想（任意）"
                style={{ padding: "6px", width: "280px", marginRight: "8px" }}
              />
              <button onClick={handleSubmit} style={{ padding: "6px 12px" }}>
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
