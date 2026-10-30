
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "QuimiPort API",
      version: "1.0.0",
      description:
        "API para gerenciamento de produtos químicos e cargas químicas em ambiente portuário.",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],

    tags: [
      {
        name: "Produtos Químicos",
        description: "Operações de gerenciamento de produtos químicos",
      },
      {
        name: "Cargas Químicas",
        description: "Operações de gerenciamento de cargas químicas",
      },
    ],
  },

  apis: ["./src/presentation/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;