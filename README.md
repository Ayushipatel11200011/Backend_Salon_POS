# Salon POS Backend API

REST API backend for a Salon POS system built with **Node.js**, **Express**, **Prisma 7**, and **PostgreSQL 18**.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js v24 |
| Framework | Express.js |
| ORM | Prisma 7 |
| Database | PostgreSQL 18 (port 5432) |
| Validation | express-validator |

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env → set DATABASE_URL with your PG password

# 3. Run migrations
npm run db:migrate

# 4. Seed default data
npm run db:seed

# 5. Start development server
npm run dev
```

---

## NPM Scripts

```bash
npm run dev          # Start with nodemon (hot reload)
npm run start        # Start production server
npm run db:generate  # Re-generate Prisma client
npm run db:migrate   # Run pending migrations
npm run db:push      # Push schema without migration file
npm run db:seed      # Seed default data
npm run db:studio    # Open Prisma Studio (DB GUI)
npm run db:reset     # Reset DB and re-run all migrations
```
