/*
  Warnings:

  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `checked` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_companyTosubject" DROP CONSTRAINT "_companyTosubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_companyTosubject" DROP CONSTRAINT "_companyTosubject_B_fkey";

-- DropForeignKey
ALTER TABLE "checked" DROP CONSTRAINT "checked_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "checked" DROP CONSTRAINT "checked_company_id_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_admin_id_fkey";

-- DropTable
DROP TABLE "admin";

-- DropTable
DROP TABLE "checked";

-- DropTable
DROP TABLE "company";

-- DropTable
DROP TABLE "session";

-- DropTable
DROP TABLE "subject";

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordhash" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checked" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "responded" BOOLEAN NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "admin_id" INTEGER,
    "proof" TEXT NOT NULL,

    CONSTRAINT "check_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "expires" DATE NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Checked_company_id_key" ON "Checked"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "Checked_proof_key" ON "Checked"("proof");

-- CreateIndex
CREATE UNIQUE INDEX "Session_key_key" ON "Session"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Session_admin_id_key" ON "Session"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- AddForeignKey
ALTER TABLE "Checked" ADD CONSTRAINT "Checked_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checked" ADD CONSTRAINT "Checked_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_companyTosubject" ADD CONSTRAINT "_companyTosubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_companyTosubject" ADD CONSTRAINT "_companyTosubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
