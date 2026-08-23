import type { Anime } from "../types/anime";

type AnimeListProps = {
  animeList: Anime[];
};

export function AnimeList({ animeList }: AnimeListProps) {
  return (
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
  );
}
