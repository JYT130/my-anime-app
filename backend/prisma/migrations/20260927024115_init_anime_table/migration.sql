-- CreateTable
CREATE TABLE "Anime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "comment" TEXT,
    "startDate" TEXT,
    "subtype" TEXT,
    "episodeCount" INTEGER,
    "kitsuId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Anime_kitsuId_key" ON "Anime"("kitsuId");
