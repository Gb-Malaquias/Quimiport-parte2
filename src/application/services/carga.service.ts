
import { cargaRepository } from "../../infrastructure/repositories/carga.repository.js";
import { produtoRepository } from "../../infrastructure/repositories/produto.repository.js";
import { AppError } from "../errors/app-error.js";
import type { CriarCargaInput } from "../validators/carga.schema.js";

type StatusCarga =
  | "REGISTRADA"
  | "EM_ANALISE"
  | "EM_INSPECAO"
  | "LIBERADA"
  | "BLOQUEADA"
  | "EM_MOVIMENTACAO"
  | "FINALIZADA"
  | "CANCELADA";

// Transições autorizadas
const transicoesPermitidas: Record<StatusCarga, StatusCarga[]> = {
  REGISTRADA: ["EM_ANALISE", "CANCELADA"],
  EM_ANALISE: ["EM_INSPECAO", "CANCELADA"],
  EM_INSPECAO: ["LIBERADA", "BLOQUEADA", "CANCELADA"],
  LIBERADA: ["EM_MOVIMENTACAO", "CANCELADA"],
  BLOQUEADA: ["CANCELADA"],
  EM_MOVIMENTACAO: ["FINALIZADA"],
  FINALIZADA: [],
  CANCELADA: [],
};

class CargaService {
  async listar() {
    return cargaRepository.listar();
  }

  async buscarPorId(id: string) {
    const carga = await cargaRepository.buscarPorId(id);

    if (!carga) {
      throw new AppError("Carga química não encontrada.", 404);
    }

    return carga;
  }

  async criar(dados: CriarCargaInput) {
    const produto = await produtoRepository.buscarPorId(dados.produtoId);

    if (!produto) {
      throw new AppError("O produto químico informado não existe.", 404);
    }

    if (produto.status !== "ATIVO") {
      throw new AppError(
        "Não é possível registrar uma carga com produto químico inativo.",
        400,
      );
    }

    return cargaRepository.criar({
      codigoCarga: dados.codigoCarga,
      produtoId: dados.produtoId,
      quantidade: dados.quantidade,
      unidade: dados.unidade,
      origem: dados.origem,
      destino: dados.destino,
      responsavelTecnico: dados.responsavelTecnico,
      temDocumentacao: dados.temDocumentacao,
      dataEntrada: dados.dataEntrada,
    });
  }

  async atualizarStatus(id: string, novoStatus: StatusCarga) {
    const carga = await this.buscarPorId(id);

    if (!transicoesPermitidas[carga.status].includes(novoStatus)) {
      throw new AppError(
        `Transição de ${carga.status} para ${novoStatus} não permitida.`,
        400,
      );
    }

    if (novoStatus === "LIBERADA" && !carga.temDocumentacao) {
      throw new AppError(
        "Não é possível liberar uma carga sem a documentação obrigatória.",
        400,
      );
    }

    return cargaRepository.atualizarStatus(id, novoStatus);
  }

  async bloquear(id: string) {
    return this.atualizarStatus(id, "BLOQUEADA");
  }

  async liberar(id: string) {
    return this.atualizarStatus(id, "LIBERADA");
  }

  async cancelar(id: string) {
    return this.atualizarStatus(id, "CANCELADA");
  }

  async atualizarDocumentacao(id: string, temDocumentacao: boolean) {
    const carga = await this.buscarPorId(id);

    if (carga.status === "FINALIZADA" || carga.status === "CANCELADA") {
      throw new AppError(
        "Não é possível alterar uma carga finalizada ou cancelada.",
        400,
      );
    }

    return cargaRepository.atualizarDocumentacao(id, temDocumentacao);
  }
}

export const cargaService = new CargaService();
