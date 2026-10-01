# topaz

Monorepo com Bun workspaces.

```
apps/api             Elysia
apps/web             Next.js
packages/db          Drizzle, migrations e seeds — só a API importa
packages/shared      contratos públicos entre API e web
infra/compose.yaml   PostgreSQL local
```

O Next fala com a API pelo cliente tipado do Eden. Ele não acessa o banco.

```bash
cp .env.example .env
bun install
bun run db:up
bun run db:migrate
bun run db:seed
bun run dev
```

Se o volume local já tiver schema de um `db:push` antigo, `db:migrate` falha com tabelas existentes. Reset limpo:

```bash
bun run db:reset
bun run db:migrate
```
