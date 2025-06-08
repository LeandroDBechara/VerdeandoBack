/*
  Warnings:

  - You are about to drop the `EventoOnPuntoVerde` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventoOnPuntoVerde" DROP CONSTRAINT "EventoOnPuntoVerde_eventoId_fkey";

-- DropForeignKey
ALTER TABLE "EventoOnPuntoVerde" DROP CONSTRAINT "EventoOnPuntoVerde_puntoVerdeId_fkey";

-- AlterTable
ALTER TABLE "Evento" ADD COLUMN     "puntosVerdesPermitidos" TEXT[],
ALTER COLUMN "imagen" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Recompensa" ADD COLUMN     "foto" TEXT;

-- DropTable
DROP TABLE "EventoOnPuntoVerde";
