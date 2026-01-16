-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USUARIO', 'COLABORADOR');

-- CreateEnum
CREATE TYPE "EstadoIntercambio" AS ENUM ('PENDIENTE', 'REALIZADO', 'CANCELADO', 'EXPIRADO');

-- CreateEnum
CREATE TYPE "Juego" AS ENUM ('CLICKER', 'IDLE');

-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('Noticias', 'Manualidades');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fechaDeNacimiento" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fotoPerfil" TEXT,
    "puntos" INTEGER NOT NULL DEFAULT 0,
    "direccion" TEXT,
    "rol" "Role" NOT NULL DEFAULT 'USUARIO',
    "fechaAlta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guardado" (
    "id" TEXT NOT NULL,
    "nombre" "Juego" NOT NULL,
    "datosDeGuardado" BYTEA NOT NULL,
    "fechaAlta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Guardado_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Canje" (
    "id" TEXT NOT NULL,
    "fechaDeCanjeo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" TEXT NOT NULL,
    "recompensaId" TEXT NOT NULL,

    CONSTRAINT "Canje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recompensa" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "foto" TEXT,
    "puntos" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Recompensa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intercambio" (
    "id" TEXT NOT NULL,
    "pesoTotal" INTEGER NOT NULL DEFAULT 0,
    "totalPuntos" INTEGER NOT NULL DEFAULT 0,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaLimite" TIMESTAMP(3),
    "fechaRealizado" TIMESTAMP(3),
    "estado" "EstadoIntercambio" NOT NULL DEFAULT 'PENDIENTE',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT,
    "usuarioId" TEXT NOT NULL,
    "puntoVerdeId" TEXT,
    "colaboradorId" TEXT,
    "eventoId" TEXT,

    CONSTRAINT "Intercambio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Residuo" (
    "id" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "puntosKg" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Residuo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleIntercambio" (
    "id" TEXT NOT NULL,
    "pesoGramos" INTEGER NOT NULL,
    "puntosTotal" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "residuoId" TEXT NOT NULL,
    "intercambioId" TEXT,

    CONSTRAINT "DetalleIntercambio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntoVerde" (
    "id" TEXT NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "direccion" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "imagen" TEXT,
    "diasHorarioAtencion" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "residuosAceptados" TEXT[],
    "colaboradorId" TEXT NOT NULL,

    CONSTRAINT "PuntoVerde_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagen" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "codigo" TEXT,
    "multiplicador" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "puntosVerdesPermitidos" TEXT[],
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tag" "Tag" NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "views" INTEGER NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterUsuario" (
    "id" TEXT NOT NULL,
    "newsletterId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "NewsletterUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Colaborador_usuarioId_key" ON "Colaborador"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Residuo_material_key" ON "Residuo"("material");

-- AddForeignKey
ALTER TABLE "Guardado" ADD CONSTRAINT "Guardado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colaborador" ADD CONSTRAINT "Colaborador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Canje" ADD CONSTRAINT "Canje_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Canje" ADD CONSTRAINT "Canje_recompensaId_fkey" FOREIGN KEY ("recompensaId") REFERENCES "Recompensa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intercambio" ADD CONSTRAINT "Intercambio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intercambio" ADD CONSTRAINT "Intercambio_puntoVerdeId_fkey" FOREIGN KEY ("puntoVerdeId") REFERENCES "PuntoVerde"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intercambio" ADD CONSTRAINT "Intercambio_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intercambio" ADD CONSTRAINT "Intercambio_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleIntercambio" ADD CONSTRAINT "DetalleIntercambio_residuoId_fkey" FOREIGN KEY ("residuoId") REFERENCES "Residuo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleIntercambio" ADD CONSTRAINT "DetalleIntercambio_intercambioId_fkey" FOREIGN KEY ("intercambioId") REFERENCES "Intercambio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntoVerde" ADD CONSTRAINT "PuntoVerde_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterUsuario" ADD CONSTRAINT "NewsletterUsuario_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "Newsletter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterUsuario" ADD CONSTRAINT "NewsletterUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
