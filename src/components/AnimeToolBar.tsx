type AnimeToolBarProps = {
  searchTitle: string;
  onSearchTitleChange: (newTitle: string) => void;
  isFormOpen: boolean;
  onToggleOpen: () => void;
};

export function AnimeToolBar({
  searchTitle,
  onSearchTitleChange,
  isFormOpen,
  onToggleOpen,
}: AnimeToolBarProps) {
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
            placeholder="🔍 アニメ名で部分一致検索..."
            value={searchTitle}
            onChange={(e) => onSearchTitleChange(e.target.value)}
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
          onClick={() => onToggleOpen()}
          style={{
            padding: "8px 16px",
            backgroundColor: isFormOpen ? "#6b7280" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          {isFormOpen ? "✕ 閉じる" : "＋ アニメを追加"}
        </button>
      </div>
    </div>
  );
}
