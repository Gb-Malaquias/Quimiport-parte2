
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/infrastructure/database/prisma.js";

// Guarda somente os IDs criados por esta suíte.
const idsCriados: number[] = [];

let sequencia = 0;

function gerarDadosProduto() {
  sequencia++;

  const identificador = `${Date.now()}-${sequencia}`;

  return {
    nome: `TESTE - Produto químico ${identificador}`,
    descricao: `Produto criado automaticamente pelo teste ${identificador}`,
    codigoOnu: `TESTE-${identificador}`,
    classeRisco: "3",
    grupoCompatibilidade: "TESTE",
  };
}

// Cadastra um produto pela API e registra seu ID para limpeza.
async function cadastrarProduto() {
  const resposta = await request(app)
    .post("/produtos")
    .send(gerarDadosProduto());

  // Registra o ID antes de verificar o status, para permitir
  // a limpeza mesmo se alguma expectativa do teste falhar.
  if (Number.isInteger(resposta.body?.id)) {
    idsCriados.push(resposta.body.id);
  }

  expect(resposta.status).toBe(201);

  return resposta;
}

afterAll(async () => {
  try {
    // Remove somente produtos criados por esta suíte.
    if (idsCriados.length > 0) {
      await prisma.produtoQuimico.deleteMany({
        where: {
          id: {
            in: idsCriados,
          },
        },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
});

describe("API de produtos químicos", () => {
  describe("GET /produtos", () => {
    it("deve retornar 200 e uma lista de produtos", async () => {
      const resposta = await request(app).get("/produtos");

      expect(resposta.status).toBe(200);
      expect(Array.isArray(resposta.body)).toBe(true);
    });

    it("deve incluir um produto recém-cadastrado na listagem", async () => {
      const criado = await cadastrarProduto();

      const resposta = await request(app).get("/produtos");

      expect(resposta.status).toBe(200);
      expect(resposta.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: criado.body.id,
            nome: criado.body.nome,
          }),
        ]),
      );
    });
  });

  describe("POST /produtos", () => {
    it("deve cadastrar um produto válido e retornar 201", async () => {
      const dados = gerarDadosProduto();

      const resposta = await request(app)
        .post("/produtos")
        .send(dados);

      if (Number.isInteger(resposta.body?.id)) {
        idsCriados.push(resposta.body.id);
      }

      expect(resposta.status).toBe(201);
      expect(resposta.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          nome: dados.nome,
          descricao: dados.descricao,
          codigoOnu: dados.codigoOnu,
          classeRisco: dados.classeRisco,
          grupoCompatibilidade: dados.grupoCompatibilidade,
        }),
      );
    });

    it("deve rejeitar o cadastro sem nome", async () => {
      const dados = {
        ...gerarDadosProduto(),
        nome: "   ",
      };

      const resposta = await request(app)
        .post("/produtos")
        .send(dados);

      expect(resposta.status).toBe(400);
    });

    it("deve rejeitar o cadastro sem classe de risco", async () => {
      const dados = {
        ...gerarDadosProduto(),
        classeRisco: "",
      };

      const resposta = await request(app)
        .post("/produtos")
        .send(dados);

      expect(resposta.status).toBe(400);
    });

    it("deve rejeitar o cadastro sem descrição", async () => {
      const dados = {
        ...gerarDadosProduto(),
        descricao: "",
      };

      const resposta = await request(app)
        .post("/produtos")
        .send(dados);

      expect(resposta.status).toBe(400);
    });

    it("deve rejeitar o cadastro sem código ONU", async () => {
      const dados = {
        ...gerarDadosProduto(),
        codigoOnu: "",
      };

      const resposta = await request(app)
        .post("/produtos")
        .send(dados);

      expect(resposta.status).toBe(400);
    });

    it("deve rejeitar o cadastro sem grupo de compatibilidade", async () => {
      const dados = {
        ...gerarDadosProduto(),
        grupoCompatibilidade: "",
      };

      const resposta = await request(app)
        .post("/produtos")
        .send(dados);

      expect(resposta.status).toBe(400);
    });

    it("deve rejeitar um status inválido", async () => {
      const dados = {
        ...gerarDadosProduto(),
        status: "STATUS_INVALIDO",
      };

      const resposta = await request(app)
        .post("/produtos")
        .send(dados);

      expect(resposta.status).toBe(400);
    });
  });

  describe("GET /produtos/:id", () => {
    it("deve retornar um produto existente", async () => {
      const criado = await cadastrarProduto();

      const resposta = await request(app).get(
        `/produtos/${criado.body.id}`,
      );

      expect(resposta.status).toBe(200);
      expect(resposta.body.id).toBe(criado.body.id);
      expect(resposta.body.nome).toBe(criado.body.nome);
    });

    it("deve retornar 404 para um produto inexistente", async () => {
      const resposta = await request(app).get("/produtos/2000000000");

      expect(resposta.status).toBe(404);
    });

    it.each(["abc", "1.5", "0", "-1"])(
      "deve rejeitar o ID inválido %s",
      async (id) => {
        const resposta = await request(app).get(`/produtos/${id}`);

        expect(resposta.status).toBe(400);
      },
    );
  });

  describe("PATCH /produtos/:id", () => {
    it("deve atualizar os dados de um produto existente", async () => {
      const criado = await cadastrarProduto();

      const novosDados = {
        nome: `TESTE - Produto atualizado ${Date.now()}`,
        descricao: "Descrição atualizada pelo teste",
      };

      const resposta = await request(app)
        .patch(`/produtos/${criado.body.id}`)
        .send(novosDados);

      expect(resposta.status).toBe(200);
      expect(resposta.body.nome).toBe(novosDados.nome);
      expect(resposta.body.descricao).toBe(novosDados.descricao);

      const consulta = await request(app).get(
        `/produtos/${criado.body.id}`,
      );

      expect(consulta.status).toBe(200);
      expect(consulta.body.nome).toBe(novosDados.nome);
    });

    it("deve rejeitar uma atualização com status inválido", async () => {
      const criado = await cadastrarProduto();

      const resposta = await request(app)
        .patch(`/produtos/${criado.body.id}`)
        .send({ status: "STATUS_INVALIDO" });

      expect(resposta.status).toBe(400);
    });

    it("deve retornar 404 ao atualizar um produto inexistente", async () => {
      const resposta = await request(app)
        .patch("/produtos/2000000000")
        .send({ nome: "TESTE - Produto inexistente" });

      expect(resposta.status).toBe(404);
    });

    it("deve rejeitar um ID inválido na atualização", async () => {
      const resposta = await request(app)
        .patch("/produtos/abc")
        .send({ nome: "TESTE - Nome" });

      expect(resposta.status).toBe(400);
    });
  });

  describe("PATCH /produtos/:id/inativar", () => {
    it("deve inativar um produto existente", async () => {
      const criado = await cadastrarProduto();

      const resposta = await request(app).patch(
        `/produtos/${criado.body.id}/inativar`,
      );

      expect(resposta.status).toBe(200);
      expect(resposta.body.status).toBe("INATIVO");

      const consulta = await request(app).get(
        `/produtos/${criado.body.id}`,
      );

      expect(consulta.status).toBe(200);
      expect(consulta.body.status).toBe("INATIVO");
    });

    it("deve retornar 404 ao inativar um produto inexistente", async () => {
      const resposta = await request(app).patch(
        "/produtos/2000000000/inativar",
      );

      expect(resposta.status).toBe(404);
    });

    it("deve rejeitar um ID inválido na inativação", async () => {
      const resposta = await request(app).patch(
        "/produtos/abc/inativar",
      );

      expect(resposta.status).toBe(400);
    });
  });
});
