
import { produtoRepository } from "../../infrastructure/repositories/produto.repository.js";
import type {
  CriarProdutoInput,
  AtualizarProdutoInput,
} from "../validators/produto.schema.js";

class ProdutoService {
  async listar() {
    return produtoRepository.listar();
  }

  async buscarPorId(id: string) {
    const produto = await produtoRepository.buscarPorId(id);

    if (!produto) {
      throw new Error("Produto químico não encontrado.");
    }

    return produto;
  }

  async criar(dados: CriarProdutoInput) {
    return produtoRepository.criar({
      nome: dados.nome,
      descricao: dados.descricao,
      codigoOnu: dados.codigoOnu,
      classeRisco: dados.classeRisco,
      grupoCompatibilidade: dados.grupoCompatibilidade,
    });
  }

  async atualizar(id: string, dados: AtualizarProdutoInput) {
    await this.buscarPorId(id);

    return produtoRepository.atualizar(id, dados);
  }

  async inativar(id: string) {
    await this.buscarPorId(id);

    return produtoRepository.inativar(id);
  }
}

export const produtoService = new ProdutoService();
