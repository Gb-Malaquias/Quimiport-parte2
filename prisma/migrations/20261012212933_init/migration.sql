-- CreateEnum
CREATE TYPE "StatusProduto" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusCarga" AS ENUM ('REGISTRADA', 'EM_ANALISE', 'EM_INSPECAO', 'LIBERADA', 'BLOQUEADA', 'EM_MOVIMENTACAO', 'FINALIZADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "produtos_quimicos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "codigoOnu" TEXT NOT NULL,
    "classeRisco" TEXT NOT NULL,
    "grupoCompatibilidade" TEXT NOT NULL,
    "status" "StatusProduto" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtos_quimicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargas_quimicas" (
    "id" TEXT NOT NULL,
    "codigoCarga" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL,
    "unidade" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "responsavelTecnico" TEXT NOT NULL,
    "temDocumentacao" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusCarga" NOT NULL DEFAULT 'REGISTRADA',
    "dataEntrada" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargas_quimicas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cargas_quimicas_codigoCarga_key" ON "cargas_quimicas"("codigoCarga");

-- AddForeignKey
ALTER TABLE "cargas_quimicas" ADD CONSTRAINT "cargas_quimicas_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos_quimicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
