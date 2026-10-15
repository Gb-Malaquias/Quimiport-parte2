/*
  Warnings:

  - The primary key for the `produtos_quimicos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `produtos_quimicos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `produtoId` on the `cargas_quimicas` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "cargas_quimicas" DROP CONSTRAINT "cargas_quimicas_produtoId_fkey";

-- AlterTable
ALTER TABLE "cargas_quimicas" DROP COLUMN "produtoId",
ADD COLUMN     "produtoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "produtos_quimicos" DROP CONSTRAINT "produtos_quimicos_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "produtos_quimicos_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "cargas_quimicas" ADD CONSTRAINT "cargas_quimicas_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos_quimicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
