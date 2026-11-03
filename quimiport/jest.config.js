
export default {
  testEnvironment: "node",

  // Permite que o Jest trate os arquivos TypeScript como módulos ES.
  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.[tj]s$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
          },
          target: "es2022",
        },
        module: {
          type: "es6",
        },
      },
    ],
  },

  // Resolve imports .js para os arquivos .ts durante os testes.
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  clearMocks: true,
};
