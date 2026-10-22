export interface KitsuAnime {
  id: string;
  attributes: {
    canonicalTitle: string;
    titles?: { ja_jp?: string; en_jp?: string };
    posterImage?: { small?: string; medium?: string };
    startDate?: string;
    subtype?: string;
    episodeCount?: number;
  };
}

export type AnimeSortType = "-userCount" | "-averageRating" | "-startDate";

/**
 * ソート、放送年度、名前検索（テキスト）を同時に指定してアニメ一覧を取得する統合関数
 */
export async function fetchExploreAnimeFromKitsu(
  sort: AnimeSortType = "-userCount",
  year?: string,
  textQuery?: string,
  offset = 0,
  limit = 20,
  timeoutMs = 5000,
): Promise<KitsuAnime[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let url = `https://kitsu.io/api/edge/anime?page[limit]=${limit}&page[offset]=${offset}&sort=${sort}`;

    // 放送年度フィルターが指定されている場合
    if (year && year.trim() !== "") {
      url += `&filter[seasonYear]=${encodeURIComponent(year.trim())}`;
    }

    // 名前検索（テキスト）が指定されている場合
    if (textQuery && textQuery.trim() !== "") {
      url += `&filter[text]=${encodeURIComponent(textQuery.trim())}`;
    }

    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`通信がタイムアウトしました (${timeoutMs / 1000}秒)`, {
        cause: error,
      });
    }
    throw new Error(
      "アニメの取得に失敗しました。時間をおいて再試行してください。",
      { cause: error },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
