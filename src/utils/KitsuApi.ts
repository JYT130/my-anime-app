export interface KitsuAnime {
  id: string;
  attributes: {
    canonicalTitle: string;
    titles?: { ja_jp?: string; en_jp?: string };
    posterImage?: { small?: string; medium?: string };
    startDate?: string;
    subtype?: string;
    episodeCount?: number;
}

/**
 * Kitsu API を使用してアニメを検索する（高速・高安定）
 */
export async function searchAnimeFromKitsu(
  query: string,
  timeoutMs = 5000,
): Promise<KitsuAnime[]> {
  if (!query.trim()) return [];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=10`,
      { signal: controller.signal },
    );

    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const json = await response.json();
    return json.data ?? [];
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`通信がタイムアウトしました (${timeoutMs / 1000}秒)`);
    }
    throw new Error(
      "アニメ検索に失敗しました。時間をおいて再試行してください。",
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
