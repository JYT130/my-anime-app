import { useState } from "react";

function App() {
  // 1. アニメ1本の型定義
  type Anime = {
    id: number;
    title: string;
    status: "視聴中" | "視聴済";
    year: number; // 視聴年
    rating?: number; // 評価（1〜5）
    comment?: string; // コメント
  };

  // 2. アニメ一覧のState
  const [animeList, setAnimeList] = useState<Anime[]>([
    { id: 1, title: "ガールズ＆パンツァー", status: "視聴中", year: 2026 },
    {
      id: 2,
      title: "プリズマ☆イリヤ",
      status: "視聴済",
      year: 2025,
      rating: 3.8,
      comment: "Fate/SNを見たあと視聴するべきだったと後悔。",
    },
  ]);

  // 3. 入力フォームの文字列を保持するState
  const [inputTitle, setInputTitle] = useState("");
  const [inputStatus, setInputStatus] = useState<"視聴中" | "視聴済">("視聴中");
  const [inputYear, setInputYear] = useState("");
  const [inputRating, setInputRating] = useState("");
  const [inputComment, setInputComment] = useState("");

  // 4. アニメ追加処理
  const addAnime = () => {
    if (inputTitle.trim() === "" || inputYear.trim() === "") return;

    const newAnime: Anime = {
      id: Date.now(), // 簡易的な一意のID
      title: inputTitle,
      status: inputStatus,
      year: parseInt(inputYear),
      rating: parseFloat(inputRating) || undefined,
      comment: inputComment || undefined,
    };

    // 既存の配列に新しいアニメを追加して更新
    setAnimeList([...animeList, newAnime]);

    // 初期化
    setInputTitle("");
    setInputYear("");
    setInputStatus("視聴中");
    setInputRating("");
    setInputComment("");
  };

  return (
    <div
      style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "500px" }}
    >
      <h1>アニメ視聴管理アプリ</h1>

      {/* 追加フォーム */}
      <div
        style={{
          marginBottom: "20px",
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
            placeholder="視聴年度 (西暦)"
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
          <button onClick={addAnime} style={{ padding: "6px 12px" }}>
            追加
          </button>
        </div>
      </div>

      {/* UI */}
      <ul>
        {animeList.map((anime) => (
          <li key={anime.id} style={{ marginBottom: "6px" }}>
            <h3>{anime.title}</h3>
            <p>
              ステータス: {anime.status} / 視聴年度: {anime.year}年
            </p>
            {/* ratingが存在するときだけ表示 */}
            {anime.rating && <p>評価: ★{anime.rating}</p>}
            {/* commentが存在するときだけ表示 */}
            {anime.comment && <p>感想: {anime.comment}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
