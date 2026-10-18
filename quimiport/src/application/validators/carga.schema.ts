
import { z } from "zod";

// Dados obrigatórios carga.
export const criarCargaSchema = z
  .object({
    codigoCarga: z.string().trim().min(1, "O código da carga é obrigatório."),
    produtoId: z.number().int().positive("O ID do produto deve ser positivo."),
    quantidade: z.number().finite().positive("A quantidade deve ser maior que zero."),
    unidade: z.string().trim().min(1, "A unidade é obrigatória."),
    origem: z.string().trim().min(1, "A origem é obrigatória."),
    destino: z.string().trim().min(1, "O destino é obrigatório."),
    responsavelTecnico: z.string().trim().min(1, "O responsável técnico é obrigatório."),
    temDocumentacao: z.boolean().optional().default(false),
    dataEntrada: z.coerce.date(),
  })
  .strict();

// atualizar o status.
export const atualizarStatusCargaSchema = z
  .object({
    status: z.enum([
      "REGISTRADA",
      "EM_ANALISE",
      "EM_INSPECAO",
      "LIBERADA",
      "BLOQUEADA",
      "EM_MOVIMENTACAO",
      "FINALIZADA",
      "CANCELADA",
    ]),
  })
  .strict();

export type CriarCargaInput = z.infer<typeof criarCargaSchema>;
export type AtualizarStatusCargaInput = z.infer<
  typeof atualizarStatusCargaSchema
>;


export const atualizarDocumentacaoSchema = z
  .object({
    temDocumentacao: z.boolean(),
  })
  .strict();

export type AtualizarDocumentacaoInput = z.infer<
  typeof atualizarDocumentacaoSchema
>;

