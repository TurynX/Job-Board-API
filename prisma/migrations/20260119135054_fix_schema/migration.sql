/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Companies_userId_key" ON "Companies"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");
