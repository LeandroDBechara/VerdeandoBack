/*
  Warnings:

  - You are about to drop the column `cuponId` on the `Canje` table. All the data in the column will be lost.
  - You are about to drop the column `fechaCanje` on the `Canje` table. All the data in the column will be lost.
  - You are about to drop the column `EcopuntosTotal` on the `DetalleIntercambio` table. All the data in the column will be lost.
  - You are about to drop the column `foto` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `ecopuntosTotal` on the `Intercambio` table. All the data in the column will be lost.
  - The `pesoTotal` column on the `Intercambio` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `usuarioId` on the `PuntoVerde` table. All the data in the column will be lost.
  - You are about to drop the column `detalleIntercambioId` on the `Residuo` table. All the data in the column will be lost.
  - You are about to drop the column `tipoResiduo` on the `Residuo` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `Residuo` table. All the data in the column will be lost.
  - You are about to drop the column `contrasena` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `fechaNacimiento` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `BolsaResiduo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comercio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cupon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PartisipacionEvento` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[comunidadId]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `puntosTotal` to the `DetalleIntercambio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `residuoId` to the `DetalleIntercambio` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `pesoGramos` on the `DetalleIntercambio` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `codigo` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagen` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colaboradorId` to the `Intercambio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puntoVerdeId` to the `Intercambio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Intercambio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colaboradorId` to the `PuntoVerde` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direccion` to the `PuntoVerde` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `PuntoVerde` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material` to the `Residuo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puntosKg` to the `Residuo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contrasenia` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaActualizacion` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaDeNacimiento` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USUARIO', 'COLABORADOR');

-- DropForeignKey
ALTER TABLE "BolsaResiduo" DROP CONSTRAINT "BolsaResiduo_detalleIntercambioId_fkey";

-- DropForeignKey
ALTER TABLE "Canje" DROP CONSTRAINT "Canje_cuponId_fkey";

-- DropForeignKey
ALTER TABLE "Cupon" DROP CONSTRAINT "Cupon_comercioId_fkey";

-- DropForeignKey
ALTER TABLE "PartisipacionEvento" DROP CONSTRAINT "PartisipacionEvento_eventoId_fkey";

-- DropForeignKey
ALTER TABLE "PartisipacionEvento" DROP CONSTRAINT "PartisipacionEvento_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "PuntoVerde" DROP CONSTRAINT "PuntoVerde_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Residuo" DROP CONSTRAINT "Residuo_detalleIntercambioId_fkey";

-- DropIndex
DROP INDEX "Canje_cuponId_key";

-- DropIndex
DROP INDEX "Canje_usuarioId_key";

-- DropIndex
DROP INDEX "DetalleIntercambio_intercambioId_key";

-- DropIndex
DROP INDEX "PuntoVerde_usuarioId_key";

-- AlterTable
ALTER TABLE "Canje" DROP COLUMN "cuponId",
DROP COLUMN "fechaCanje",
ADD COLUMN     "fechaDeCanjeo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalPuntos" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "DetalleIntercambio" DROP COLUMN "EcopuntosTotal",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "puntosTotal" INTEGER NOT NULL,
ADD COLUMN     "residuoId" TEXT NOT NULL,
DROP COLUMN "pesoGramos",
ADD COLUMN     "pesoGramos" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Evento" DROP COLUMN "foto",
DROP COLUMN "nombre",
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "imagen" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "multiplicador" DOUBLE PRECISION NOT NULL DEFAULT 1.2,
ADD COLUMN     "titulo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Intercambio" DROP COLUMN "ecopuntosTotal",
ADD COLUMN     "colaboradorId" TEXT NOT NULL,
ADD COLUMN     "eventoId" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "puntoVerdeId" TEXT NOT NULL,
ADD COLUMN     "totalPuntos" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usuarioId" TEXT NOT NULL,
ALTER COLUMN "fecha" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "pesoTotal",
ADD COLUMN     "pesoTotal" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PuntoVerde" DROP COLUMN "usuarioId",
ADD COLUMN     "colaboradorId" TEXT NOT NULL,
ADD COLUMN     "direccion" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nombre" TEXT NOT NULL,
ALTER COLUMN "descripcion" DROP NOT NULL,
ALTER COLUMN "imagen" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Residuo" DROP COLUMN "detalleIntercambioId",
DROP COLUMN "tipoResiduo",
DROP COLUMN "valor",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "material" TEXT NOT NULL,
ADD COLUMN     "puntosKg" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "contrasena",
DROP COLUMN "fechaNacimiento",
ADD COLUMN     "comunidadId" TEXT,
ADD COLUMN     "contrasenia" TEXT NOT NULL,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "fechaActualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaDeNacimiento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "puntos" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rol" "Role" NOT NULL DEFAULT 'USUARIO',
ALTER COLUMN "fechaAlta" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "proveedorAuth" DROP NOT NULL,
ALTER COLUMN "proveedorId" DROP NOT NULL,
ALTER COLUMN "fotoPerfil" DROP NOT NULL;

-- DropTable
DROP TABLE "BolsaResiduo";

-- DropTable
DROP TABLE "Comercio";

-- DropTable
DROP TABLE "Cupon";

-- DropTable
DROP TABLE "PartisipacionEvento";

-- DropEnum
DROP TYPE "TipoResiduo";

-- CreateTable
CREATE TABLE "Colaborador" (
    "id" TEXT NOT NULL,
    "cvu" TEXT NOT NULL,
    "domicilioFiscal" TEXT NOT NULL,
    "cuitCuil" TEXT NOT NULL,
    "fechaAlta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Colaborador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comunidad" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "puntos" INTEGER NOT NULL DEFAULT 0,
    "historial" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Comunidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recompensa" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "puntos" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Recompensa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecompensaOnCanje" (
    "canjeId" TEXT NOT NULL,
    "recompensaId" TEXT NOT NULL,
    "fechaDeCanjeo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RecompensaOnCanje_pkey" PRIMARY KEY ("canjeId","recompensaId")
);

-- CreateTable
CREATE TABLE "EventoOnPuntoVerde" (
    "eventoId" TEXT NOT NULL,
    "puntoVerdeId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventoOnPuntoVerde_pkey" PRIMARY KEY ("eventoId","puntoVerdeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Colaborador_usuarioId_key" ON "Colaborador"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_comunidadId_key" ON "Usuario"("comunidadId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_comunidadId_fkey" FOREIGN KEY ("comunidadId") REFERENCES "Comunidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colaborador" ADD CONSTRAINT "Colaborador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecompensaOnCanje" ADD CONSTRAINT "RecompensaOnCanje_canjeId_fkey" FOREIGN KEY ("canjeId") REFERENCES "Canje"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecompensaOnCanje" ADD CONSTRAINT "RecompensaOnCanje_recompensaId_fkey" FOREIGN KEY ("recompensaId") REFERENCES "Recompensa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intercambio" ADD CONSTRAINT "Intercambio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intercambio" ADD CONSTRAINT "Intercambio_puntoVerdeId_fkey" FOREIGN KEY ("puntoVerdeId") REFERENCES "PuntoVerde"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intercambio" ADD CONSTRAINT "Intercambio_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intercambio" ADD CONSTRAINT "Intercambio_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleIntercambio" ADD CONSTRAINT "DetalleIntercambio_residuoId_fkey" FOREIGN KEY ("residuoId") REFERENCES "Residuo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntoVerde" ADD CONSTRAINT "PuntoVerde_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoOnPuntoVerde" ADD CONSTRAINT "EventoOnPuntoVerde_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoOnPuntoVerde" ADD CONSTRAINT "EventoOnPuntoVerde_puntoVerdeId_fkey" FOREIGN KEY ("puntoVerdeId") REFERENCES "PuntoVerde"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
