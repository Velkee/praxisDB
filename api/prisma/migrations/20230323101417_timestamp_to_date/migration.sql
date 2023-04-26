/*
  Warnings:

  - You are about to drop the column `timestamp` on the `checked` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "checked" DROP COLUMN "timestamp",
ADD COLUMN     "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP;
