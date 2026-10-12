import {Prisma} from "../../generated/prisma/client.js";
import {prisma} from "../database/prisma.js";

class ProdutoRepository {
    async listar(){
        return prisma.produtoQuimico.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async buscarPorId(id: string){
        return prisma.produtoQuimico.findUnique({
            where: {id},
        });
    } 

    async criar(produto: Prisma.ProdutoQuimicoCreateInput){
        return prisma.produtoQuimico.create({
            data: produto,
        });
    }

    async atualizar(id: string, produto: Prisma.ProdutoQuimicoUpdateInput){
        return prisma.produtoQuimico.update({
            where: {id},
            data: produto,
        });
    }

    async inativar(id: string){
        return prisma.produtoQuimico.update({
            where: {id},
            data: {status: "INATIVO"},
        });
    }




    



}

export const produtoRepository = new ProdutoRepository();