
import request from "supertest";
import app from "../src/app.ts";

describe("GET /", () => {
  it("deve retornar 200 e uma mensagem indicando que a API está funcionando", async () => {
    const resposta = await request(app).get("/");

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual({
      message: "QuimiPort API funcionando!",
    });
  });
});
