
import { produtoRepository } from "../../infrastructure/repositories/produto.repository.js";
import { AppError } from "../errors/app-error.js";
import type {
  CriarProdutoInput,
  AtualizarProdutoInput,
} from "../validators/produto.schema.js";

class ProdutoService {
  async listar() {
    return produtoRepository.listar();
  }


  //buscar produto por id
  async buscarPorId(id: number) {
    const produto = await produtoRepository.buscarPorId(id);

    if (!produto) {
      throw new AppError("Produto químico não encontrado.", 404);
    }

    return produto;
  }


  //criar produto
  async criar(dados: CriarProdutoInput) {
    return produtoRepository.criar({
      nome: dados.nome,
      descricao: dados.descricao,
      codigoOnu: dados.codigoOnu,
      classeRisco: dados.classeRisco,
      grupoCompatibilidade: dados.grupoCompatibilidade,
    });
  }


  //atualizar produto
  async atualizar(id: number, dados: AtualizarProdutoInput) {
    await this.buscarPorId(id);

    return produtoRepository.atualizar(id, dados);
  }

  //inativar produto
  async inativar(id: number) {
    await this.buscarPorId(id);

    return produtoRepository.inativar(id);
  }
}

export const produtoService = new ProdutoService();
