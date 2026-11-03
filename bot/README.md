# Instalation

## Requirements

- [PostgreSQL](https://www.postgresql.org/download/)
- [Node.js >= v22.21](https://nodejs.org/en/download)
- PNPM >= v11.0.0
- PM2

---

Install dependencies

```bash
cd bot
pnpm install
```

---

## How to run

### Development:

```bash
pnpm run dev
```

### Production:

Standalone:

```bash
pnpm run build
pnpm run start
```

With PM2

```bash
pnpm run start:prod
```
