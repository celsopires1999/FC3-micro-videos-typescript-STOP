# Full Cycle 3.0 - TypeScript (Back-end)

Esse microsserviço é parte do projeto prático do curso Full Cycle 3.0

# Como funciona

- Executar o projeto no Docker com dois containers do MySQL `(test e dev)`

```bash
docker-compose --profile dev up --build
```

- Para executar apenas os testes, usar o comando

```bash
docker-compose up --build
```

- Entrar no container da aplicação

```bash
docker-compose exec app bash
```

- Executar os testes com cobertura

```bash
npm run test:cov -- --runInBand --detectOpenHandles
```

- Subir a aplicação nestjs

```bash
npm run start:dev
```

- Executar migrações para criar tabelas no banco dev

```bash
npm run migrate -w nestjs up
npm run migrate -w nestjs down -- --to 0
```

- Endpoints disponíveis

```bash
# Categories #
http://localhost:3000/categories

# Cast Members #
http://localhost:3000/cast-members
```

- Exemplos de utilização da API podem ser encontrados no arquivo `api.http` na raiz do projeto

# Extras

- Criar os indices no core

```bash
npm run cti:make -w @fc/micro-videos
```

- Rodar os testes somente em um workspace

```bash
npm run test:cov -w @fc/micro-videos
npm run test:cov -w nestjs
```

- Fazer o build do core

```bash
npm run build -w @fc/micro-videos
```
