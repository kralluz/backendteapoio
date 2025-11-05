-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('VIEW', 'CLICK', 'LIKE', 'BOOKMARK');

-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "article_interactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "type" "InteractionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_interactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "type" "InteractionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_stats" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "bookmarkCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_stats" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "bookmarkCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "article_interactions_userId_type_idx" ON "article_interactions"("userId", "type");

-- CreateIndex
CREATE INDEX "article_interactions_articleId_type_idx" ON "article_interactions"("articleId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "article_interactions_userId_articleId_type_key" ON "article_interactions"("userId", "articleId", "type");

-- CreateIndex
CREATE INDEX "activity_interactions_userId_type_idx" ON "activity_interactions"("userId", "type");

-- CreateIndex
CREATE INDEX "activity_interactions_activityId_type_idx" ON "activity_interactions"("activityId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "activity_interactions_userId_activityId_type_key" ON "activity_interactions"("userId", "activityId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "article_stats_articleId_key" ON "article_stats"("articleId");

-- CreateIndex
CREATE INDEX "article_stats_viewCount_idx" ON "article_stats"("viewCount");

-- CreateIndex
CREATE INDEX "article_stats_likeCount_idx" ON "article_stats"("likeCount");

-- CreateIndex
CREATE UNIQUE INDEX "activity_stats_activityId_key" ON "activity_stats"("activityId");

-- CreateIndex
CREATE INDEX "activity_stats_viewCount_idx" ON "activity_stats"("viewCount");

-- CreateIndex
CREATE INDEX "activity_stats_likeCount_idx" ON "activity_stats"("likeCount");

-- AddForeignKey
ALTER TABLE "article_interactions" ADD CONSTRAINT "article_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_interactions" ADD CONSTRAINT "article_interactions_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_interactions" ADD CONSTRAINT "activity_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_interactions" ADD CONSTRAINT "activity_interactions_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_stats" ADD CONSTRAINT "article_stats_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_stats" ADD CONSTRAINT "activity_stats_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
