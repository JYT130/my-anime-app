import { useState } from "react";
import type { Anime } from "../types/anime";

type AnimeFormProps = {
  // 追加
  onAddAnime: (newAnime: Anime) => void;
};

export function AnimeForm({ onAddAnime }: AnimeFormProps) {
  const [inputTitle, setInputTitle] = useState("");
  const [inputStatus, setInputStatus] = useState<
    "視聴予定" | "視聴中" | "視聴済"
  >("視聴中");
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
    setInputYear("");
    setInputRating("");
    setInputComment("");
  };

  return (
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
            setInputStatus(e.target.value as "視聴予定" | "視聴中" | "視聴済")
          }
          style={{ padding: "6px" }}
        >
          <option value="視聴予定">視聴予定</option>
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
  );
}
