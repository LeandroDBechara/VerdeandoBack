/*
  Warnings:

  - You are about to drop the `RecompensaOnCanje` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `recompensaId` to the `Canje` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `latitud` on the `PuntoVerde` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `longitud` on the `PuntoVerde` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `cantidad` to the `Recompensa` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoIntercambio" AS ENUM ('PENDIENTE', 'REALIZADO', 'CANCELADO');

-- DropForeignKey
ALTER TABLE "DetalleIntercambio" DROP CONSTRAINT "DetalleIntercambio_intercambioId_fkey";

-- DropForeignKey
ALTER TABLE "Intercambio" DROP CONSTRAINT "Intercambio_colaboradorId_fkey";

-- DropForeignKey
ALTER TABLE "Intercambio" DROP CONSTRAINT "Intercambio_puntoVerdeId_fkey";

-- DropForeignKey
ALTER TABLE "RecompensaOnCanje" DROP CONSTRAINT "RecompensaOnCanje_canjeId_fkey";

-- DropForeignKey
ALTER TABLE "RecompensaOnCanje" DROP CONSTRAINT "RecompensaOnCanje_recompensaId_fkey";

-- AlterTable
ALTER TABLE "Canje" ADD COLUMN     "recompensaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DetalleIntercambio" ALTER COLUMN "intercambioId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Intercambio" ADD COLUMN     "estado" "EstadoIntercambio" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "fechaLimite" TIMESTAMP(3),
ADD COLUMN     "fechaRealizado" TIMESTAMP(3),
ADD COLUMN     "token" TEXT,
ALTER COLUMN "colaboradorId" DROP NOT NULL,
ALTER COLUMN "puntoVerdeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PuntoVerde" DROP COLUMN "latitud",
ADD COLUMN     "latitud" DOUBLE PRECISION NOT NULL,
DROP COLUMN "longitud",
ADD COLUMN     "longitud" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Recompensa" ADD COLUMN     "cantidad" INTEGER NOT NULL;

-- DropTable
DROP TABLE "RecompensaOnCanje";

-- AddForeignKey
ALTER TABLE "Canje" ADD CONSTRAINT "Canje_recompensaId_fkey" FOREIGN KEY ("recompensaId") REFERENCES "Recompensa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intercambio" ADD CONSTRAINT "Intercambio_puntoVerdeId_fkey" FOREIGN KEY ("puntoVerdeId") REFERENCES "PuntoVerde"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intercambio" ADD CONSTRAINT "Intercambio_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleIntercambio" ADD CONSTRAINT "DetalleIntercambio_intercambioId_fkey" FOREIGN KEY ("intercambioId") REFERENCES "Intercambio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
