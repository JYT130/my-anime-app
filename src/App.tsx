import { useState } from 'react'

function App() {
  // 1. アニメ1本の型定義
  type Anime = {
    id: number
    title: string
  }

  // 2. アニメ一覧のState
  const [animeList, setAnimeList] = useState<Anime[]>([
    { id: 1, title: 'ガールズ＆パンツァー' },
    { id: 2, title: 'SHIROBAKO' },
  ])

  // 3. 入力フォームの文字列を保持するState
  const [inputTitle, setInputTitle] = useState('')

  // 4. アニメ追加処理
  const handleAddAnime = () => {
    if (inputTitle.trim() === '') return

    const newAnime: Anime = {
      id: Date.now(), // 簡易的な一意のID
      title: inputTitle,
    }

    // 既存の配列に新しいアニメを追加して更新
    setAnimeList([...animeList, newAnime])
    setInputTitle('') // 入力欄をクリア
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h1>アニメ視聴管理アプリ</h1>

      {/* 追加フォーム */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          placeholder="アニメタイトルを入力"
          style={{ padding: '8px', marginRight: '8px', width: '250px' }}
        />
        <button onClick={handleAddAnime} style={{ padding: '8px 12px' }}>
          追加
        </button>
      </div>

      {/* 一覧表示 */}
      <ul>
        {animeList.map((anime) => (
          <li key={anime.id} style={{ marginBottom: '6px' }}>
            {anime.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App