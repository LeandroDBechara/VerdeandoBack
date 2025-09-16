/*
  Warnings:

  - You are about to drop the column `juegoId` on the `Guardado` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[material]` on the table `Residuo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `juego` to the `Guardado` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Juego" AS ENUM ('CLICKER', 'IDLE');

-- DropIndex
DROP INDEX "Guardado_juegoId_key";

-- AlterTable
ALTER TABLE "Guardado" DROP COLUMN "juegoId",
ADD COLUMN     "juego" "Juego" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Residuo_material_key" ON "Residuo"("material");
