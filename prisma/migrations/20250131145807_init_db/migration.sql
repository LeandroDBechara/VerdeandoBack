-- CreateEnum
CREATE TYPE "TipoResiduo" AS ENUM ('ALUMINIO', 'PLASTICO', 'VIDRIO', 'PAPEL');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT,
    "apellido" TEXT,
    "email" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ecopunto" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "latitud" TEXT NOT NULL,
    "longitud" TEXT NOT NULL,

    CONSTRAINT "Ecopunto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intercambio" (
    "id" TEXT NOT NULL,
    "registro" TIMESTAMP(3) NOT NULL,
    "imagen" TEXT NOT NULL,
    "cantidad" TEXT NOT NULL,

    CONSTRAINT "Intercambio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Horario" (
    "id" TEXT NOT NULL,
    "dia" TIMESTAMP(3) NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "cierre" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoResiduoClase" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TipoResiduoClase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comunidad" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Comunidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "utilizado" INTEGER NOT NULL,
    "ecopuntoId" TEXT NOT NULL,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "precio" TEXT NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progreso" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Progreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nivel" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Nivel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pregunta" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logro" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Logro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recompensa" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Recompensa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Respuesta" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Respuesta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Compra_ecopuntoId_key" ON "Compra"("ecopuntoId");

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_ecopuntoId_fkey" FOREIGN KEY ("ecopuntoId") REFERENCES "Ecopunto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
