-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Anime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "comment" TEXT,
    "startDate" TEXT,
    "subtype" TEXT,
    "episodeCount" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "priority" TEXT,
    "kitsuId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Anime" ("comment", "createdAt", "episodeCount", "id", "imageUrl", "kitsuId", "score", "startDate", "subtype", "title", "updatedAt") SELECT "comment", "createdAt", "episodeCount", "id", "imageUrl", "kitsuId", "score", "startDate", "subtype", "title", "updatedAt" FROM "Anime";
DROP TABLE "Anime";
ALTER TABLE "new_Anime" RENAME TO "Anime";
CREATE UNIQUE INDEX "Anime_kitsuId_key" ON "Anime"("kitsuId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
