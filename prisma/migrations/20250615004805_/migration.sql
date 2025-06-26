/*
  Warnings:

  - A unique constraint covering the columns `[equipmentId]` on the table `Equipment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `equipmentId` to the `Equipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Equipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Equipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "equipmentId" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_equipmentId_key" ON "Equipment"("equipmentId");
