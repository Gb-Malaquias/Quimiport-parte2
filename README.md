# ⚗️ QuimiPort

## 📌 Contexto do problema
O gerenciamento de cargas químicas envolve informações relacionadas a produtos, documentação, classificação de risco, responsáveis técnicos, inspeções e movimentações.

Quando o registro dessas informações é realizado de forma manual ou descentralizada, podem ocorrer problemas como:

* Dificuldade na consulta de informações;
* Dispersão de dados;
* Falhas no acompanhamento do status das cargas;
* Dificuldade na validação das regras de segurança;
* Problemas relacionados à documentação;
* Risco de execução de operações incompatíveis com o estado da carga.

O QuimiPort foi proposto para centralizar essas informações e estabelecer regras para controlar o ciclo de vida de uma carga química.

## 📌 Descrição da solução

O **QuimiPort** é uma API backend desenvolvida para auxiliar no gerenciamento de cargas químicas portuárias, centralizando o cadastro de produtos e cargas, a consulta de informações e o acompanhamento de status.

Nesta fase, foram implementadas funcionalidades de gerenciamento e regras de negócio para controle de liberação, bloqueio e movimentação de cargas.

## 💻 Tecnologias utilizadas

- **Node.js:** ambiente de execução da aplicação.
- **TypeScript:** linguagem utilizada no desenvolvimento.
- **Express:** framework para construção da API REST.
- **PostgreSQL:** sistema gerenciador de banco de dados relacional.
- **Prisma ORM:** ferramenta de comunicação e gerenciamento dos dados.
- **Docker e Docker Compose:** utilizados para configuração e execução do ambiente.
- **Jest e Supertest:** ferramentas utilizadas nos testes automatizados.
- **GitHub Actions:** utilizado para automação do pipeline de integração contínua (CI).

## ⚙️ Como executar o projeto localmente

### Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- [Git](https://git-scm.com/): para clonar o reposirório.
- [Node.js (versão LTS)](https://nodejs.org/).
- [Docker Desktop](https://www.docker.com/products/docker-desktop/): para exectar o PostgreSQL em um contêiner.

Após instalado, abra o terminal e confira:
```
node --version
npm --version
git --version
docker --version
```
O Docker Desktop precisa estar aberto e em execução

### 1. Clonar o repositório

```
git clone URL_DO_REPOSITORIO
```

Acesse a pasta do projeto:

```
cd quimiport
```
> Substitua `URL_DO_REPOSITORIO` pelo endereço real do repositório Git.

### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes configurações:

```
DATABASE_URL="postgresql://quimiport:quimiport_dev_password@localhost:5432/quimiport?schema=public"

POSTGRES_USER=quimiport
POSTGRES_PASSWORD=quimiport_dev_password
POSTGRES_DB=quimiport
```

Substitua os valores pelos dados definidos na configuração do PostgreSQL do projeto.

*Importante:* não compartilhe o arquivo `.env` com credenciais reais. Ele não deve ser enviado ao GitHub.

### 3. Instalar as dependências

Na raiz do projeto, execute o comando:

```
npm install
```
Esse comando instala as dependências definidas no `package.json`.

### 4. Iniciar o banco de dados

Com o Docker Desktop aberto, execute:

```
docker compose up -d
```

Esse comando inicia os serviços definidos no `compose.yaml` ou `docker-compose.yml`.

Para conferir se os contêineres estão em execução:

```
docker compose ps
```
### 5. Executar as migrações

Para aplicar as migrações e preparar a estrutura do banco de dados, execute:

```
npx prisma migrate deploy
```
Esse comando aplica as migrações existentes ao banco de dados configurado.

Se o projeto exigir a geração do cliente Prisma no ambiente local, execute também:

```
npx prisma generate
```

### 6. Executar a API

Inicie o servidor em modo de desenvolvimento:

```
npm run dev
```

Mantenha esse terminal aberto enquanto utilizar a API.

A API estará disponível no endereço local configurado pelo projeto. Se estiver utilizando a porta 3000:

```
http://localhost:3000
```

### 7. Executar os testes

Em outro terminal, na pasta do projeto, execute:

```
npm test -- --runInBand
```
Para verificar se o projeto compila:

```
npm run build
```
### 8. Encerrar o ambiente

Para interromper o contêiner do banco de dados:

```
docker compose down
```
Esse comando interrompe e remove os contêineres criados pelo Compose, mas normalmente mantém os dados armazenados em volumes nomeados.

**Atenção:** evite utilizar `docker compose down -v`, pois esse comando remove os volumes e pode apagar os dados persistidos do banco de dados.

### Problemas comuns
**Erro de conexão com o banco de dados**
 * Confira se o Docker Descktop está em execução.
 * Execute Docker compose ps.
 * Confira a `DATABASE_URL` no arquivo `.env`.
 * Verifique se a porta e as credenciais correspondem à configuração do PostgreSQL.

**Comando `npm run dev` não encontrado**
 * Confira se está na pasta correta.
 * Execute `npm install` .
 * Verifique se o script dev existe no `package.json`.

**Erro ao executar as migrações**
- Confirme se o banco de dados está iniciado.
- Confira se as variáveis de ambiente estão corretas.
- Verifique se as migrações estão presentes no repositório.

**Testes falhando**
- Confira se o banco de dados está disponível e se o ambiente de testes está configurado corretamente.
- Consulte a mensagem de erro para identificar a causa.

### Observação

Os comandos acima pressupõem que os scripts do `package.json`, a configuração do Docker Compose e as migrações estejam disponíveis no repositório.

## ⚙️ Como executar o projeto com Docker

### Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

Após a instalação, abra o terminal e verifique:

```
git --version
docker --version
docker compose version
```
Certifique-se de que o Docker Desktop esteja aberto e em execução.

> Não é necessário instalar Node.js ou PostgreSQL diretamente na máquina para executar a aplicação pelo ambiente Docker.

### 1. Clonar o repositório

```
git clone URL_DO_REPOSITORIO
```

Acesse a pasta do projeto:

```
cd Quimiport-parte2
```
>Substitua URL_DO_REPOSITORIO pelo endereço real do repositório Git.

### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto.

Configure as variáveis de ambiente:

```
DATABASE_URL="postgresql://quimiport:quimiport_dev_password@db:5432/quimiport?schema=public"

POSTGRES_USER=quimiport
POSTGRES_PASSWORD=quimiport_dev_password
POSTGRES_DB=quimiport
PORT=3000
```
**Descrição das variáveis**

|Variável|Descrição|
|--|--|
|DATABASE_URL|String de conexão da aplicação com o PostgreSQL.|
|POSTGRES_USER|Usuário do banco de dados.|
|POSTGRES_PASSWORD|Senha do banco de dados.|
POSTGRES_DB|Nome do banco de dados.|
|PORT|Porta utilizada pela API.|

>**Importante**: dentro do Docker, a aplicação utiliza `db` como endereço do PostgreSQL, pois esse é o nome do serviço definido no Docker Compose.

>Não compartilhe o arquivo .env com credenciais reais. Ele não deve ser enviado ao GitHub.

### 3. Construir e iniciar o banco de dados

Na raiz do projeto, execute:

```
docker compose up -d --build db
```
Esse comando constrói a imagem necessária para a aplicação e inicia o serviço PostgreSQL.

O Docker Compose também configura automaticamente a rede de comunicação entre os containers.

Para verificar se o banco está em execução:

```
docker compose ps
```
### 4. Preparar o banco de dados
Com o PostgreSQL em execução, aplique as migrações  existentes do Prisma:

```
docker compose run --rm api npx prisma migrate deploy
```
Esse comando executa as migrações versionadas no diretório **prisma/migrations**, criando ou atualizando a estrutura do banco de dados.

O Docker Compose aguarda o banco estar saudável antes de executar o comando.

O Prisma Client já é gerado durante a construção da imagem da aplicação.

### 5. Iniciar a API

Após preparar o banco de dados, inicie a aplicação:
```
docker compose up -d api
```
Esse comando inicia a API em um container Docker.

Após a inicialização, a API estará disponível em:

```
http://localhost:3000
```
**Atenção:** evite utilizar `docker compose down -v`, pois esse comando remove os volumes e pode apagar os dados persistidos do banco de dados.

### 6. Verificar os containers
Para visualizar os serviços em execução:

```
docker compose ps
```
O ambiente deverá apresentar dois serviços:
- API QuimiPort.
- Banco de dados PostgreSQL.

Para consultar os logs de todos os serviços:
```
docker compose logs
```
### 7. Executar os testes
Com a API em execução, execute os testes automatizados:

```
docker compose exec api npm test -- --runInBand
```
Esse comando executa a suíte de testes utilizando Jest dentro do container da aplicação.
### 8. Encerrar o ambiente
Para interromper e remover os containers:

```
docker compose down
```
Esse comando encerra os serviços e remove os containers, mas mantém os dados armazenados no volume nomeado do PostgreSQL.

### Problemas comuns

**Erro de conexão com o banco de dados**

* Verifique se o Docker Desktop está em execução.
* Execute `docker compose ps` para conferir o estado dos serviços.
* Verifique se as variáveis de ambiente estão configuradas corretamente.
* Confirme se a `DATABASE_URL` utiliza o endereço `db` para a conexão entre containers.
- Consulte os logs do PostgreSQL:

```docker compose logs db```

**Erro ao executar as migrações**
* Confirme se o PostgreSQL está saudável.
* Verifique se as variáveis de ambiente estão corretas.
* Confirme se os arquivos de migração estão presentes em `prisma/migrations`
- Consulte os logs para identificar a origem do erro.

**Erro ao iniciar a API**
* Verifique se a imagem foi construída corretamente.
* Confira se a porta 3000 não está sendo utilizada por outro processo.
* Consulte os logs:
```
docker compose logs -f api
```
**Alterações no código não aparecem no container**

Se houver alterações no código ou nas dependências, reconstrua a imagem:
```
docker compose up -d --build api
```
**Problemas com os containers**

Para verificar os serviços:
```
docker compose ps
```
Se necessário, consulte os logs:
```
docker compose logs
```

## Documentação da API (Swagger)

O QuimiPort possui documentação interativa desenvolvida com Swagger e OpenAPI 3.0, permitindo consultar os endpoints disponíveis, visualizar parâmetros, verificar respostas e testar requisições diretamente pela interface.

### Como acessar a documentação

1. **Clone o repositório**, caso ainda não tenha feito:

   ```
   git clone URL_DO_REPOSITORIO
   cd QuimiPort
   ```

2. **Instale as dependências:**

   ```
   npm install
   ```

3. **Configure as variáveis de ambiente**, conforme as instruções.

4. **Inicie o banco de dados PostgreSQL** e execute as migrations, conforme as instruções de execução do projeto.

5. **Inicie a aplicação:**

   ```
   npm run dev
   ```

6. **Acesse a documentação** pelo navegador:

   http://localhost:3000/api-docs

### Recursos disponíveis

Por meio da interface Swagger, é possível:

* Consultar os endpoints de produtos químicos e cargas químicas.
* Visualizar os métodos HTTP disponíveis (GET, POST, PATCH etc.).
* Consultar parâmetros e informações das requisições.
* Visualizar os possíveis códigos de resposta.
* Testar os endpoints diretamente pela interface.

## 📌 Endpoints principais

A API disponibiliza endpoints para gerenciamento de produtos químicos e controle de cargas.

### 🖥️ Health Check

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Verifica se a API está funcionando. |

### 🧪 Produtos químicos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/produtos` | Lista os produtos cadastrados. |
| GET | `/produtos/:id` | Consulta um produto pelo ID. |
| POST | `/produtos` | Cadastra um novo produto químico. |
| PATCH | `/produtos/:id` | Atualiza os dados de um produto. |
| PATCH | `/produtos/:id/inativar` | Inativa um produto químico. |

### 🏷️ Cargas químicas

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/cargas` | Lista as cargas cadastradas. |
| GET | `/cargas/:id` | Consulta uma carga pelo ID. |
| POST | `/cargas` | Registra uma nova carga química. |
| PATCH | `/cargas/:id/status` | Atualiza o status de uma carga. |
| PATCH | `/cargas/:id/bloquear` | Bloqueia uma carga. |
| PATCH | `/cargas/:id/liberar` | Libera uma carga. |
| PATCH | `/cargas/:id/documentacao` | Atualiza a situação da documentação. |
| PATCH | `/cargas/:id/cancelar` | Cancela uma carga. |

## 🌐 Banco de dados utilizado

O QuimiPort utiliza o **PostgreSQL** como sistema gerenciador de banco de dados relacional, responsável pelo armazenamento das informações relacionadas aos produtos químicos e às cargas cadastradas.

A comunicação entre a aplicação e o banco de dados é realizada por meio do **Prisma ORM**, que facilita o acesso, a manipulação e a organização dos dados.


### 🏗️ Estrutura do banco de dados

O banco de dados possui duas entidades principais:

- **Produtos Químicos (`produtos_quimicos`):** armazena informações dos produtos, como nome, descrição, código ONU, classe de risco, grupo de compatibilidade e status.
- **Cargas Químicas (`cargas_quimicas`):** armazena informações das cargas, incluindo produto relacionado, quantidade, unidade, origem, destino, responsável técnico, documentação e status.

## 🏛️ Decisões arquiteturais
### ⚙️ Pipeline de integração continua (CI)

O projeto utiliza **GitHub Actions** para automatizar etapas do fluxo de desenvolvimento.

O pipeline é executado automaticamente a cada `push` ou abertura de Pull Request na branch `main`, realizando:

*  Validação dos arquivos essenciais do projeto;
* Instalação das dependências;
* Geração do Prisma Client;
* Verificação da compilação da aplicação;
* Execução das migrations;
* Execução dos testes automatizados.

O workflow está localizado em `.github/workflows/ci.yml`.

Essa automação permite identificar erros de compilação e falhas nos testes, contribuindo para a qualidade e confiabilidade do projeto.

## 👥 Integrantes do grupo
 * Gabriel Malaquias Tolentino
 * Rafael Alves Ribeiro
 * Lucas Willians Arrebola
 * Laura Akemi Alves Yagi
