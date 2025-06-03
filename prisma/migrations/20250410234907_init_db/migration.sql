-- CreateEnum
CREATE TYPE "TipoResiduo" AS ENUM ('ALUMINIO', 'PLASTICO', 'VIDRIO', 'PAPEL');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "fechaAlta" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "proveedorAuth" TEXT NOT NULL,
    "proveedorId" TEXT NOT NULL,
    "fotoPerfil" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comercio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "foto" TEXT NOT NULL,

    CONSTRAINT "Comercio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "foto" TEXT NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Residuo" (
    "id" TEXT NOT NULL,
    "tipoResiduo" "TipoResiduo" NOT NULL,
    "valor" TEXT NOT NULL,
    "detalleIntercambioId" TEXT NOT NULL,

    CONSTRAINT "Residuo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BolsaResiduo" (
    "id" TEXT NOT NULL,
    "tipoBolsa" TEXT NOT NULL,
    "cantidad" TEXT NOT NULL,
    "detalleIntercambioId" TEXT NOT NULL,

    CONSTRAINT "BolsaResiduo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleIntercambio" (
    "id" TEXT NOT NULL,
    "pesoGramos" TEXT NOT NULL,
    "EcopuntosTotal" TEXT NOT NULL,
    "intercambioId" TEXT NOT NULL,

    CONSTRAINT "DetalleIntercambio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntoVerde" (
    "id" TEXT NOT NULL,
    "latitud" TEXT NOT NULL,
    "longitud" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "diasAtencion" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "PuntoVerde_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intercambio" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "pesoTotal" TEXT NOT NULL,
    "ecopuntosTotal" TEXT NOT NULL,

    CONSTRAINT "Intercambio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartisipacionEvento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaPartisipacion" TIMESTAMP(3) NOT NULL,
    "puntosObtenidos" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,

    CONSTRAINT "PartisipacionEvento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cupon" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "costoPuntos" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fechaExpiracion" TIMESTAMP(3) NOT NULL,
    "comercioId" TEXT NOT NULL,

    CONSTRAINT "Cupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Canje" (
    "id" TEXT NOT NULL,
    "fechaCanje" TIMESTAMP(3) NOT NULL,
    "cuponId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Canje_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DetalleIntercambio_intercambioId_key" ON "DetalleIntercambio"("intercambioId");

-- CreateIndex
CREATE UNIQUE INDEX "PuntoVerde_usuarioId_key" ON "PuntoVerde"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "PartisipacionEvento_usuarioId_key" ON "PartisipacionEvento"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "PartisipacionEvento_eventoId_key" ON "PartisipacionEvento"("eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "Cupon_comercioId_key" ON "Cupon"("comercioId");

-- CreateIndex
CREATE UNIQUE INDEX "Canje_cuponId_key" ON "Canje"("cuponId");

-- CreateIndex
CREATE UNIQUE INDEX "Canje_usuarioId_key" ON "Canje"("usuarioId");

-- AddForeignKey
ALTER TABLE "Residuo" ADD CONSTRAINT "Residuo_detalleIntercambioId_fkey" FOREIGN KEY ("detalleIntercambioId") REFERENCES "DetalleIntercambio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BolsaResiduo" ADD CONSTRAINT "BolsaResiduo_detalleIntercambioId_fkey" FOREIGN KEY ("detalleIntercambioId") REFERENCES "DetalleIntercambio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleIntercambio" ADD CONSTRAINT "DetalleIntercambio_intercambioId_fkey" FOREIGN KEY ("intercambioId") REFERENCES "Intercambio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntoVerde" ADD CONSTRAINT "PuntoVerde_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartisipacionEvento" ADD CONSTRAINT "PartisipacionEvento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartisipacionEvento" ADD CONSTRAINT "PartisipacionEvento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cupon" ADD CONSTRAINT "Cupon_comercioId_fkey" FOREIGN KEY ("comercioId") REFERENCES "Comercio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Canje" ADD CONSTRAINT "Canje_cuponId_fkey" FOREIGN KEY ("cuponId") REFERENCES "Cupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Canje" ADD CONSTRAINT "Canje_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
