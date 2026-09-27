import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// 1. インスタンスの初期化
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// 2. ミドルウェアの設定
// TODO: cors() と express.json() を app.use() を使って有効化しよう
app.use(express.json());
app.use(cors());

// 3. 【GET】 アニメ一覧を取得 (スコアの高い順)
app.get("/api/anime", async (req, res) => {
  try {
    // TODO: prisma.anime.findMany を使い、orderBy で score を 'desc' (降順) にして取得しよう
    const animeList = await prisma.anime.findMany({
      orderBy: { score: "desc" },
    });
    // TODO: 取得したデータを res.json() でクライアントに返そう
    res.json(animeList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "データの取得に失敗しました" });
  }
});

// 4. 【POST】 新しいアニメを追加
app.post("/api/anime", async (req, res) => {
  try {
    // req.body から送られてきたデータを受け取る
    const {
      title,
      score,
      imageUrl,
      comment,
      startDate,
      subtype,
      episodeCount,
      kitsuId,
    } = req.body;

    // TODO: prisma.anime.create を使ってDBに保存しよう
    const newAnime = await prisma.anime.create({
      data: {
        title,
        score: Number(score),
        imageUrl,
        comment,
        startDate,
        subtype,
        episodeCount: episodeCount ? Number(episodeCount) : null,
        kitsuId: kitsuId || null, // ← フロントから届いたkitsuIdをセット
        // idは自動採番
      },
    });

    // TODO: 保存できたデータを res.status(201).json(...) で返そう
    res.status(201).json(newAnime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "アニメの追加に失敗しました" });
  }
});

// 5. 【PUT】 アニメの評価・コメント等を更新
app.put("/api/anime/:id", async (req, res) => {
  try {
    // URLの末尾（:id）からIDを取得し、数値に変換する
    const id = Number(req.params.id);
    const {
      title,
      score,
      imageUrl,
      comment,
      startDate,
      subtype,
      episodeCount,
    } = req.body;

    // TODO: prisma.anime.update を使って指定した id のデータを更新しよう
    const updatedAnime = await prisma.anime.update({
      where: { id },
      data: {
        title,
        score: Number(score),
        imageUrl,
        comment,
        startDate,
        subtype,
        episodeCount: episodeCount ? Number(episodeCount) : null,
      },
    });

    // TODO: 更新後のデータを res.json(...) で返そう
    res.json(updatedAnime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "アニメの更新に失敗しました" });
  }
});

// 6. 【DELETE】 アニメを削除
app.delete("/api/anime/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    // TODO: prisma.anime.delete を使って指定した id のデータを削除しよう
    await prisma.anime.delete({
      where: { id },
    });

    // TODO: 成功メッセージを res.json({ message: '削除成功' }) などで返そう
    res.json({ message: "アニメの削除に成功しました" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "アニメの削除に失敗しました" });
  }
});

// 7. サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
