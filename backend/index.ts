import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// 1. インスタンスの初期化
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// 2. ミドルウェアの設定
app.use(express.json());
app.use(cors());

// 3. 【GET】 アニメ一覧を取得 (スコアの高い順)
app.get("/api/anime", async (req, res) => {
  try {
    const animeList = await prisma.anime.findMany({
      orderBy: { score: "desc" },
    });
    res.json(animeList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "データの取得に失敗しました" });
  }
});

// 4. 【POST】 新しいアニメを追加
app.post("/api/anime", async (req, res) => {
  try {
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

    const newAnime = await prisma.anime.create({
      data: {
        title,
        score: Number(score),
        imageUrl,
        comment,
        startDate,
        subtype,
        episodeCount: episodeCount ? Number(episodeCount) : null,
        kitsuId: kitsuId || null,
        // idは自動採番
      },
    });

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

    await prisma.anime.delete({
      where: { id },
    });

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
