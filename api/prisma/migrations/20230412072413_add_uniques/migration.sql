/*
  Warnings:

  - A unique constraint covering the columns `[company_id]` on the table `checked` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[admin_id]` on the table `session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `subject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "checked_company_id_key" ON "checked"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_admin_id_key" ON "session"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "subject_name_key" ON "subject"("name");
