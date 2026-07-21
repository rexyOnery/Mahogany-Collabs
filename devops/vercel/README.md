# Vercel Deployment Notes

## Frontend

The Next.js frontend deploys to Vercel from `frontend/`.

Required Vercel environment variable:

```text
NEXT_PUBLIC_API_GATEWAY_URL=https://your-api-gateway.vercel.app
```

Recommended GitHub repository secrets for CI deployment:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
DOCKER_USERNAME
DOCKER_PASSWORD
DOCKER_REGISTRY
```

---

## API Gateway (Separate Vercel Project)

The API Gateway is **deployed as its own Vercel project** from the `api-gateway/` directory.

It runs as a **Vercel Serverless Function** using `@vercel/node` runtime. The
Express app is exported via `api-gateway/api/index.js` and bundled with esbuild
to include the local `@archive/shared` dependency.

### 1. Create a new Vercel project

1. Go to [vercel.com](https://vercel.com) and create a new project.
2. Import your repository and set the **Root Directory** to `api-gateway`.
3. Vercel will auto-detect the `vercel.json` configuration.

### 2. Required Environment Variables in Vercel

Set these in the Vercel dashboard under **Settings → Environment Variables**:

| Variable            | Description                          | Example                             |
| ------------------- | ------------------------------------ | ----------------------------------- |
| `AUTH_SERVICE_URL`  | URL of the deployed Auth Service     | `https://auth-service.example.com`  |
| `USER_SERVICE_URL`  | URL of the deployed User Service     | `https://user-service.example.com`  |
| `ADMIN_SERVICE_URL` | URL of the deployed Admin Service    | `https://admin-service.example.com` |
| `JWT_SECRET`        | Secret for verifying JSON Web Tokens | _(production secret)_               |
| `FRONTEND_URL`      | Allowed CORS origin (your frontend)  | `https://your-frontend.vercel.app`  |
| `NODE_ENV`          | Environment mode                     | `production`                        |

These will be used by the serverless function at runtime.

### 3. CI/CD — GitHub Actions

A separate job `deploy-api-gateway-vercel` is included in the existing CI
workflow (`ci-vercel.yml`). It uses these additional secrets:

| Secret                      | Description                                         |
| --------------------------- | --------------------------------------------------- |
| `VERCEL_ORG_ID_GATEWAY`     | The Vercel Team/Personal ID for the gateway project |
| `VERCEL_PROJECT_ID_GATEWAY` | The Vercel Project ID for the gateway project       |

Find these with `vercel pull` or in your Vercel project **Settings**.

### 4. How the build works

```
npm run vercel-build   # runs node scripts/vercel-build.js
```

The script:

1. Copies the local `shared/` sources into `.vercel/shared/`
2. Bundles `api/index.js` + all imports (including `@archive/shared`) into
   `.vercel/output/static/api/index.js` via esbuild
3. External packages (Express, cors, etc.) are resolved from `node_modules`
   at runtime on Vercel's infrastructure

### 5. Local testing

```bash
cd api-gateway
npm install
npm run vercel-build   # verify the build succeeds
```

The bundled output will be at `.vercel/output/static/api/index.js`.

---

## Auth Service (Separate Vercel Project)

The Auth Service is **deployed as its own Vercel project** from the `services/auth-service/` directory.

It runs as a **Vercel Serverless Function** using `@vercel/node` runtime. The
Express app is wrapped with a MongoDB connection cache in
`services/auth-service/api/index.js` to maintain connection across serverless
invocations.

### 1. Create a new Vercel project

1. Go to [vercel.com](https://vercel.com) and create a new project.
2. Import your repository and set the **Root Directory** to `services/auth-service`.
3. Vercel will auto-detect the `vercel.json` configuration.

### 2. Required Environment Variables in Vercel

Set these in the Vercel dashboard under **Settings → Environment Variables**:

| Variable         | Description                        | Example                            |
| ---------------- | ---------------------------------- | ---------------------------------- |
| `AUTH_MONGO_URI` | MongoDB connection string          | `mongodb+srv://...`                |
| `JWT_SECRET`     | Secret for signing JSON Web Tokens | _(production secret)_              |
| `JWT_EXPIRES_IN` | Token expiration duration          | `7d`                               |
| `FRONTEND_URL`   | Allowed CORS origin                | `https://your-frontend.vercel.app` |
| `NODE_ENV`       | Environment mode                   | `production`                       |

### 3. CI/CD — GitHub Actions

A job `deploy-auth-service-vercel` is included in the CI workflow
(`ci-vercel.yml`). It uses these additional secrets:

| Secret                   | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| `VERCEL_ORG_ID_AUTH`     | The Vercel Team/Personal ID for the auth service project |
| `VERCEL_PROJECT_ID_AUTH` | The Vercel Project ID for the auth service project       |

Find these with `vercel pull` or in your Vercel project **Settings**.

### 4. How the build works

```
npm run vercel-build   # runs node scripts/vercel-build.js
```

The script:

1. Bundles `api/index.js` + all imports (including `@archive/shared` from `./shared`) into
   `.vercel/output/static/api/index.js` via esbuild
2. External packages (Express, mongoose, bcryptjs, etc.) are resolved from `node_modules`
   at runtime on Vercel's infrastructure

### 5. Local testing

```bash
cd services/auth-service
npm install
npm run vercel-build   # verify the build succeeds
```

The bundled output will be at `.vercel/output/static/api/index.js`.

---

## Backend Services

The backend services (auth-service, user-service, admin-service) are
containerized separately with Docker. In production they should be deployed
to a container platform (e.g. AWS ECS, Kubernetes, DigitalOcean) or
as individual Vercel projects using the same pattern as the auth-service.

The production API Gateway URL is used by the frontend via the
`NEXT_PUBLIC_API_GATEWAY_URL` environment variable.
