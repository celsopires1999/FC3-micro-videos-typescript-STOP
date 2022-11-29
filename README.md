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

- Endpoints disponíveis

```bash
# Categories #
http://localhost:3000/categories

# Cast Members #
http://localhost:3000/cast-members
```

- Exemplos de utilização da API podem ser encontrados no arquivo `api.http` na raiz do projeto
