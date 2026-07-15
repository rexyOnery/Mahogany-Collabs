# Mahogany Archives Microservices Starter

A production-minded starter for a heritage archive platform built with Next.js,
Express microservices, MongoDB, JWT authentication, Docker, GitHub Actions, and
Vercel production deployment.

The application is inspired by a Mahogany Archives-style interface: featured
collections, advanced search, learning resources, community stories, protected
member dashboards, and an admin workspace.

## Architecture

This is a MERN-style application with Next.js replacing a plain React/Vite
frontend. The frontend only talks to the API Gateway. The gateway verifies JWTs,
forwards trusted identity headers, and routes requests to independent services.

```text
Browser
  |
  v
Next.js frontend on Vercel
  |
  v
Express API Gateway
  |-- /api/auth/*  -> Auth Service  -> Auth MongoDB
  |-- /api/users/* -> User Service  -> User MongoDB
  |-- /api/admin/* -> Admin Service -> Admin MongoDB
```

## Folder Structure

```text
nextjs-archive-microservices-app/
├── frontend/
├── api-gateway/
├── services/
│   ├── auth-service/
│   ├── user-service/
│   └── admin-service/
├── shared/
├── devops/
│   ├── github-actions/
│   └── vercel/
├── .github/workflows/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Services

- Auth Service: registration, login, password hashing, JWT generation, `/auth/me`.
- User Service: protected profile read/update endpoints.
- Admin Service: public archive collection APIs plus admin-only collection and
  submission management.
- API Gateway: CORS, Helmet, rate limiting, request logging, JWT verification,
  proxy routing, and identity header forwarding.

## Local Setup

Copy the example environment files first:

```bash
cp .env.example .env
cp frontend/.env.local.example frontend/.env.local
cp api-gateway/.env.example api-gateway/.env
cp services/auth-service/.env.example services/auth-service/.env
cp services/user-service/.env.example services/user-service/.env
cp services/admin-service/.env.example services/admin-service/.env
```

Install dependencies from the monorepo root:

```bash
npm install
```

Run individual apps during development:

```bash
npm run dev:frontend
npm run dev:gateway
npm --workspace auth-service run dev
npm --workspace user-service run dev
npm --workspace admin-service run dev
```

## Docker

Run the full local system with Docker and Next.js hot reloading:

```bash
npm run dev
```

This uses `docker-compose.dev.yml` to run the frontend with `next dev`, bind
syncs `frontend/` into the container with Docker Compose Watch, keeps
`node_modules` and `.next` in Docker volumes, and enables polling so changes
from Windows reliably trigger Fast Refresh.

You can also run the same setup directly:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --watch --build
```

Run the production-style Docker build:

```bash
npm run prod:docker
```

Useful URLs:

```text
Frontend:      http://localhost:3000
API Gateway:   http://localhost:8080/health
Auth Service:  http://localhost:4001/health
User Service:  http://localhost:4002/health
Admin Service: http://localhost:4003/health
```

MongoDB runs as three separate containers to model database-per-service
ownership:

```text
auth-mongo  -> archive_auth
user-mongo  -> archive_users
admin-mongo -> archive_admin
```

## Authentication

The frontend posts credentials to the API Gateway:

```text
POST /api/auth/register
POST /api/auth/login
```

The Auth Service hashes passwords with bcrypt and returns a JWT. Protected
frontend pages store the token in local storage for this starter. The gateway
verifies the JWT and forwards identity headers to protected services:

```text
x-user-id
x-user-email
x-user-role
```

For a real production system, move token storage to secure HTTP-only cookies and
lock down admin creation behind an invitation or back-office process.

## Vercel Production Deployment

The production frontend deploys to Vercel from `frontend/`.

1. Create a Vercel project with `frontend` as the root directory.
2. Set the production environment variable:

```text
NEXT_PUBLIC_API_GATEWAY_URL=https://your-production-api-gateway.example.com
```

3. Deploy manually:

```bash
cd frontend
npm install
npx vercel pull --yes --environment=production
npx vercel build --prod
npx vercel deploy --prebuilt --prod
```

The backend services are containerized and can run on any container platform.
Expose the API Gateway publicly, then point Vercel to that URL.

## GitHub Actions

The workflow at `.github/workflows/ci-vercel.yml`:

- installs dependencies
- runs linting
- runs tests
- builds the frontend and backend packages
- builds and pushes backend Docker images
- deploys the production frontend to Vercel

Required repository secrets:

```text
DOCKER_USERNAME
DOCKER_PASSWORD
DOCKER_REGISTRY
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

No alternate production deployment target is configured in this starter.

## Verification

After `docker compose up --build`, verify:

```bash
curl http://localhost:8080/health
curl http://localhost:4001/health
curl http://localhost:4002/health
curl http://localhost:4003/health
```

Then open `http://localhost:3000` and confirm:

- the home page renders archive sections
- collections and collection detail pages render
- sign-up and login call the API Gateway
- the member dashboard is protected
- the admin dashboard is protected and calls Admin Service through the gateway
- public archive APIs work at `/api/admin/collections`

## Troubleshooting

- If frontend API calls fail, confirm `NEXT_PUBLIC_API_GATEWAY_URL`.
- If protected routes fail, confirm the same `JWT_SECRET` is used by gateway and services.
- If Docker builds fail for backend services, run from the monorepo root because
  Dockerfiles depend on the local `shared` package.
- If Vercel builds public pages while the API Gateway is unavailable, the
  frontend falls back to local archive data so the build can still complete.
