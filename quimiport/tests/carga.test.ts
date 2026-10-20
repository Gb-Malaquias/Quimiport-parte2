
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/infrastructure/database/prisma.js";

// Guarda os IDs criados por esta suíte para limpar os dados ao final.
const idsCargasCriadas: string[] = [];
const idsProdutosCriados: number[] = [];

let sequencia = 0;

// Gera identificadores únicos para evitar conflitos no banco.
function gerarIdentificador() {
  sequencia++;
  return `${Date.now()}-${sequencia}`;
}

// Cria os dados de um produto válido para os testes.
function gerarDadosProduto() {
  const identificador = gerarIdentificador();

  return {
    nome: `TESTE - Produto ${identificador}`,
    descricao: `Produto criado pela suíte de cargas ${identificador}`,
    codigoOnu: `ONU-${identificador}`,
    classeRisco: "3",
    grupoCompatibilidade: "TESTE",
  };
}

// Cadastra um produto pela API e guarda seu ID para limpeza.
async function cadastrarProduto() {
  const resposta = await request(app)
    .post("/produtos")
    .send(gerarDadosProduto());

  if (Number.isInteger(resposta.body?.id)) {
    idsProdutosCriados.push(resposta.body.id);
  }

  expect(resposta.status).toBe(201);

  return resposta.body;
}

// Monta os dados padrão de uma carga.
// Cada chamada usa um código único.
function gerarDadosCarga(
  produtoId: number,
  sobrescritos: Record<string, unknown> = {},
) {
  const identificador = gerarIdentificador();

  return {
    codigoCarga: `CARGA-${identificador}`,
    produtoId,
    quantidade: 500,
    unidade: "kg",
    origem: "Terminal A",
    destino: "Area de armazenamento B",
    responsavelTecnico: "Joao da Silva",
    temDocumentacao: true,
    dataEntrada: "2026-10-18T12:00:00.000Z",
    ...sobrescritos,
  };
}

// Cadastra uma carga válida e guarda seu ID para limpeza.
async function cadastrarCarga(
  produtoId: number,
  sobrescritos: Record<string, unknown> = {},
) {
  const resposta = await request(app)
    .post("/cargas")
    .send(gerarDadosCarga(produtoId, sobrescritos));

  // Registra o ID antes das expectativas para facilitar a limpeza.
  if (typeof resposta.body?.id === "string") {
    idsCargasCriadas.push(resposta.body.id);
  }

  expect(resposta.status).toBe(201);

  return resposta.body;
}

// Avança uma carga pela sequência principal de status.
async function avancarAteInspecao(id: string) {
  const paraAnalise = await request(app)
    .patch(`/cargas/${id}/status`)
    .send({ status: "EM_ANALISE" });

  expect(paraAnalise.status).toBe(200);

  const paraInspecao = await request(app)
    .patch(`/cargas/${id}/status`)
    .send({ status: "EM_INSPECAO" });

  expect(paraInspecao.status).toBe(200);
  return paraInspecao.body;
}

afterAll(async () => {
  try {
    // Exclui primeiro as cargas, pois elas dependem dos produtos.
    if (idsCargasCriadas.length > 0) {
      await prisma.cargaQuimica.deleteMany({
        where: {
          id: {
            in: idsCargasCriadas,
          },
        },
      });
    }

    // Depois remove somente os produtos criados por esta suíte.
    if (idsProdutosCriados.length > 0) {
      await prisma.produtoQuimico.deleteMany({
        where: {
          id: {
            in: idsProdutosCriados,
          },
        },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
});

describe("API de cargas químicas", () => {
  let produtoId: number;

  // Cada teste recebe um produto ativo criado pela API.
  beforeEach(async () => {
    const produto = await cadastrarProduto();
    produtoId = produto.id;
  });

  describe("GET /cargas", () => {
    it("deve retornar 200 e uma lista de cargas", async () => {
      const resposta = await request(app).get("/cargas");

      expect(resposta.status).toBe(200);
      expect(Array.isArray(resposta.body)).toBe(true);
    });

    it("deve incluir uma carga recém-cadastrada na listagem", async () => {
      const criada = await cadastrarCarga(produtoId);

      const resposta = await request(app).get("/cargas");

      expect(resposta.status).toBe(200);
      expect(resposta.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: criada.id,
            codigoCarga: criada.codigoCarga,
          }),
        ]),
      );
    });
  });

  describe("POST /cargas", () => {
    it("deve cadastrar uma carga válida e retornar 201", async () => {
      const dados = gerarDadosCarga(produtoId);

      const resposta = await request(app)
        .post("/cargas")
        .send(dados);

      if (typeof resposta.body?.id === "string") {
        idsCargasCriadas.push(resposta.body.id);
      }

      expect(resposta.status).toBe(201);
      expect(resposta.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          codigoCarga: dados.codigoCarga,
          produtoId,
          quantidade: expect.anything(),
          unidade: dados.unidade,
          origem: dados.origem,
          destino: dados.destino,
          responsavelTecnico: dados.responsavelTecnico,
          temDocumentacao: true,
          status: "REGISTRADA",
        }),
      );
    });

    it("deve rejeitar uma quantidade igual a zero", async () => {
      const resposta = await request(app)
        .post("/cargas")
        .send(gerarDadosCarga(produtoId, { quantidade: 0 }));

      expect(resposta.status).toBe(400);
    });

    it("deve rejeitar uma quantidade negativa", async () => {
      const resposta = await request(app)
        .post("/cargas")
        .send(gerarDadosCarga(produtoId, { quantidade: -10 }));

      expect(resposta.status).toBe(400);
    });

    it("deve rejeitar uma carga sem código", async () => {
      const dados = gerarDadosCarga(produtoId);
      const { codigoCarga: _codigoCarga, ...dadosSemCodigo } = dados;

      const resposta = await request(app)
        .post("/cargas")
        .send(dadosSemCodigo);

      expect(resposta.status).toBe(400);
    });

    it("deve rejeitar uma carga sem responsável técnico", async () => {
      const resposta = await request(app)
        .post("/cargas")
        .send(
          gerarDadosCarga(produtoId, {
            responsavelTecnico: " ",
          }),
        );

      expect(resposta.status).toBe(400);
    });

    it("deve retornar 404 quando o produto não existe", async () => {
      const resposta = await request(app)
        .post("/cargas")
        .send(gerarDadosCarga(2000000000));

      expect(resposta.status).toBe(404);
    });

    it("deve rejeitar uma carga vinculada a produto inativo", async () => {
      const produto = await cadastrarProduto();

      const inativacao = await request(app).patch(
        `/produtos/${produto.id}/inativar`,
      );

      expect(inativacao.status).toBe(200);

      const resposta = await request(app)
        .post("/cargas")
        .send(gerarDadosCarga(produto.id));

      expect(resposta.status).toBe(400);
    });
  });

  describe("GET /cargas/:id", () => {
    it("deve retornar uma carga existente", async () => {
      const criada = await cadastrarCarga(produtoId);

      const resposta = await request(app).get(
        `/cargas/${criada.id}`,
      );

      expect(resposta.status).toBe(200);
      expect(resposta.body.id).toBe(criada.id);
      expect(resposta.body.codigoCarga).toBe(criada.codigoCarga);
    });

    it("deve retornar 404 para uma carga inexistente", async () => {
      const resposta = await request(app).get(
        "/cargas/id-que-nao-existe",
      );

      expect(resposta.status).toBe(404);
    });
  });

  describe("PATCH /cargas/:id/status", () => {
    it("deve avançar de REGISTRADA para EM_ANALISE", async () => {
      const criada = await cadastrarCarga(produtoId);

      const resposta = await request(app)
        .patch(`/cargas/${criada.id}/status`)
        .send({ status: "EM_ANALISE" });

      expect(resposta.status).toBe(200);
      expect(resposta.body.status).toBe("EM_ANALISE");
    });

    it("deve rejeitar uma transição direta de REGISTRADA para FINALIZADA", async () => {
      const criada = await cadastrarCarga(produtoId);

      const resposta = await request(app)
        .patch(`/cargas/${criada.id}/status`)
        .send({ status: "FINALIZADA" });

      expect(resposta.status).toBe(400);
      expect(resposta.body.message ?? resposta.body.mensagem).toContain(
        "Transição",
      );
    });

    it("deve rejeitar um status inválido", async () => {
      const criada = await cadastrarCarga(produtoId);

      const resposta = await request(app)
        .patch(`/cargas/${criada.id}/status`)
        .send({ status: "STATUS_INVALIDO" });

      expect(resposta.status).toBe(400);
    });

    it("deve permitir concluir o fluxo principal", async () => {
      const criada = await cadastrarCarga(produtoId);

      const status = [
        "EM_ANALISE",
        "EM_INSPECAO",
        "LIBERADA",
        "EM_MOVIMENTACAO",
        "FINALIZADA",
      ];

      for (const proximoStatus of status) {
        const resposta = await request(app)
          .patch(`/cargas/${criada.id}/status`)
          .send({ status: proximoStatus });

        expect(resposta.status).toBe(200);
        expect(resposta.body.status).toBe(proximoStatus);
      }
    });
  });

  describe("PATCH /cargas/:id/bloquear", () => {
    it("deve bloquear uma carga em inspeção", async () => {
      const criada = await cadastrarCarga(produtoId);
      await avancarAteInspecao(criada.id);

      const resposta = await request(app).patch(
        `/cargas/${criada.id}/bloquear`,
      );

      expect(resposta.status).toBe(200);
      expect(resposta.body.status).toBe("BLOQUEADA");
    });

    it("deve rejeitar o bloqueio de uma carga recém-registrada", async () => {
      const criada = await cadastrarCarga(produtoId);

      const resposta = await request(app).patch(
        `/cargas/${criada.id}/bloquear`,
      );

      expect(resposta.status).toBe(400);
    });
  });

  describe("PATCH /cargas/:id/liberar", () => {
    it("deve liberar uma carga em inspeção com documentação", async () => {
      const criada = await cadastrarCarga(produtoId);
      await avancarAteInspecao(criada.id);

      const resposta = await request(app).patch(
        `/cargas/${criada.id}/liberar`,
      );

      expect(resposta.status).toBe(200);
      expect(resposta.body.status).toBe("LIBERADA");
    });

    it("deve rejeitar a liberação sem documentação obrigatória", async () => {
      const criada = await cadastrarCarga(produtoId, {
        temDocumentacao: false,
      });

      await avancarAteInspecao(criada.id);

      const resposta = await request(app).patch(
        `/cargas/${criada.id}/liberar`,
      );

      expect(resposta.status).toBe(400);
      expect(
        resposta.body.message ?? resposta.body.mensagem,
      ).toContain("documentação obrigatória");
    });
  });

  describe("PATCH /cargas/:id/documentacao", () => {
    it("deve atualizar a documentação da carga", async () => {
      const criada = await cadastrarCarga(produtoId, {
        temDocumentacao: false,
      });

      const resposta = await request(app)
        .patch(`/cargas/${criada.id}/documentacao`)
        .send({ temDocumentacao: true });

      expect(resposta.status).toBe(200);
      expect(resposta.body.temDocumentacao).toBe(true);
    });

    it("deve rejeitar uma atualização sem o campo temDocumentacao", async () => {
      const criada = await cadastrarCarga(produtoId);

      const resposta = await request(app)
        .patch(`/cargas/${criada.id}/documentacao`)
        .send({});

      expect(resposta.status).toBe(400);
    });
  });

  describe("PATCH /cargas/:id/cancelar", () => {
    it("deve cancelar uma carga registrada", async () => {
      const criada = await cadastrarCarga(produtoId);

      const resposta = await request(app).patch(
        `/cargas/${criada.id}/cancelar`,
      );

      expect(resposta.status).toBe(200);
      expect(resposta.body.status).toBe("CANCELADA");
    });

    it("deve rejeitar uma mudança de status após o cancelamento", async () => {
      const criada = await cadastrarCarga(produtoId);

      const cancelamento = await request(app).patch(
        `/cargas/${criada.id}/cancelar`,
      );

      expect(cancelamento.status).toBe(200);

      const resposta = await request(app)
        .patch(`/cargas/${criada.id}/status`)
        .send({ status: "EM_ANALISE" });

      expect(resposta.status).toBe(400);
    });
  });
});
