import { z } from "zod";

// Dados aceitos no cadastro.
// ALTERADO: .strict() rejeita campos não declarados, como "status".
export const criarProdutoSchema = z
  .object({
    nome: z.string().trim().min(1, "O nome do produto é obrigatório"),

    descricao: z.string().trim().min(1, "A descrição é obrigatória"),

    codigoOnu: z.string().trim().min(1, "O código ONU é obrigatório"),

    classeRisco: z
      .string()
      .trim()
      .min(1, "A classe de risco é obrigatória"),

    grupoCompatibilidade: z
      .string()
      .trim()
      .min(1, "O grupo de compatibilidade é obrigatório"),
  })
  .strict();

// Dados aceitos na atualização.
// O ID continua sendo informado pela URL, não pelo corpo da requisição.
// ALTERADO: .strict() também rejeita campos desconhecidos na atualização.
export const atualizarProdutoSchema = criarProdutoSchema
  .partial()
  .extend({
    status: z.enum(["ATIVO", "INATIVO"]).optional(),
  })
  .strict();

export type CriarProdutoInput = z.infer<typeof criarProdutoSchema>;

export type AtualizarProdutoInput = z.infer<
  typeof atualizarProdutoSchema
>;