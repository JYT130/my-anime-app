type AnimeToolBarProps = {
  searchTitle: string;
  statusFilter: string;
  setSearchTitle: (newTitle: string) => void;
  setStatusFilter: (
    newStatus: "すべて" | "視聴予定" | "視聴中" | "視聴済",
  ) => void;
  handleResetFilters: () => void;
  isFormOpen: boolean;
  onToggleOpen: () => void;
};

export function AnimeToolBar({
  searchTitle,
  statusFilter,
  setSearchTitle,
  setStatusFilter,
  handleResetFilters,
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
            onChange={(e) => setSearchTitle(e.target.value)}
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
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
            }}
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "すべて" | "視聴予定" | "視聴中" | "視聴済",
              )
            }
          >
            <option value="すべて">すべて</option>
            <option value="視聴予定">視聴予定</option>
            <option value="視聴中">視聴中</option>
            <option value="視聴済">視聴済</option>
          </select>

          <button
            onClick={() => handleResetFilters()}
            style={{
              padding: "8px 12px",
              backgroundColor: "#161718",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            検索をリセット
          </button>
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
