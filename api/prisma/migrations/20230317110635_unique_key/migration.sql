/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "session_key_key" ON "session"("key");
