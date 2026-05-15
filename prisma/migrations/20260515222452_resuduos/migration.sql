-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Tag" ADD VALUE 'Eventos';
ALTER TYPE "Tag" ADD VALUE 'Ecologia';
ALTER TYPE "Tag" ADD VALUE 'MedioAmbiente';
ALTER TYPE "Tag" ADD VALUE 'Reciclaje';

-- AlterTable
ALTER TABLE "Residuo" ALTER COLUMN "puntosKg" SET DATA TYPE DOUBLE PRECISION;
