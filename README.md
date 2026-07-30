# Car Dealership Inventory System

A full-stack inventory and purchasing platform for car dealerships. The repository is organised as an npm workspace monorepo:

- `client/` — React, TypeScript, Vite, and Tailwind application.
- `server/` — Express, TypeScript, Prisma, and PostgreSQL API.
- `docs/` — architecture, API, database, deployment, and developer documentation.

## Prerequisites

- Node.js 22 or newer (see `.nvmrc`)
- npm 10 or newer
- PostgreSQL 16 or newer

## Getting started

1. Copy `server/.env.example` to `server/.env` and set secure local values.
2. Copy `client/.env.example` to `client/.env` if the default API address differs.
3. Install workspace dependencies with `npm.cmd install` on Windows PowerShell (or `npm install` in shells that allow the npm PowerShell shim).

Application implementation begins in the subsequent, deliberately gated phases.

## Architecture

The layered-architecture contract, component ownership, dependency rules, and request flow are documented in [docs/architecture.md](docs/architecture.md).

The normalized PostgreSQL schema design, ER diagram, indexes, constraints, and transaction rules are documented in [docs/database-design.md](docs/database-design.md).

Prisma schema and reviewed migrations live in `server/prisma/`. After dependencies are installed, validate the schema with `npm run db:validate --workspace=@car-dealership/server`.

## Planned phases

1. Project initialization — complete
2. Architecture
3. Database design
4. Prisma models
5. Authentication
6. Vehicle CRUD
7. Inventory operations
8. Search
9. Frontend
10. Integration
11. Testing
12. Documentation
13. Deployment
