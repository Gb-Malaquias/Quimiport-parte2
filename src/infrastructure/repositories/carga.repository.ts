
import { prisma } from "../database/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

class CargaRepository {
  async listar() {
    return prisma.cargaQuimica.findMany({
      include: { produto: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async buscarPorId(id: string) {
    return prisma.cargaQuimica.findUnique({
      where: { id },
      include: { produto: true },
    });
  }

  async criar(dados: Prisma.CargaQuimicaUncheckedCreateInput) {
    return prisma.cargaQuimica.create({
      data: dados,
      include: { produto: true },
    });
  }

  async atualizarStatus(
    id: string,
    status: Prisma.CargaQuimicaUpdateInput["status"],
  ) {
    return prisma.cargaQuimica.update({
      where: { id },
      data: { status },
      include: { produto: true },
    });
  }

  async atualizarDocumentacao(id: string, temDocumentacao: boolean) {
    return prisma.cargaQuimica.update({
      where: { id },
      data: { temDocumentacao },
      include: { produto: true },
    });
  }
}

export const cargaRepository = new CargaRepository();
