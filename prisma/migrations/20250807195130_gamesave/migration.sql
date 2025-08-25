/*
  Warnings:

  - You are about to drop the column `proveedorAuth` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `proveedorId` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PuntoVerde" ADD COLUMN     "residuosAceptados" TEXT[];

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "proveedorAuth",
DROP COLUMN "proveedorId";

-- CreateTable
CREATE TABLE "Guardado" (
    "id" TEXT NOT NULL,
    "juegoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "datosDeGuardado" BYTEA NOT NULL,
    "fechaAlta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Guardado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guardado_juegoId_key" ON "Guardado"("juegoId");

-- AddForeignKey
ALTER TABLE "Guardado" ADD CONSTRAINT "Guardado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
