-- CreateIndex
CREATE INDEX "activities_tags_idx" ON "activities" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "articles_tags_idx" ON "articles" USING GIN ("tags");
