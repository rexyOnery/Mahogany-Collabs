# Deploy API Gateway to Vercel Separately

## Steps ✅

### ✅ Step 1: Create `api-gateway/api/gateway.js`

- Vercel serverless entry point that exports the Express app
- Vercel's Node.js runtime will handle the HTTP lifecycle

### ✅ Step 2: Create `api-gateway/scripts/vercel-build.js`

- Build script that copies shared package sources so esbuild can bundle them
- Bundles the gateway into a single serverless function file

### ✅ Step 3: Create `api-gateway/vercel.json`

- Vercel configuration: build command, install command, rewrites, runtime settings

### ✅ Step 4: Update `api-gateway/package.json`

- Added esbuild dev dependency
- Added `vercel-build` script

### ✅ Step 5: Update `devops/github-actions/ci-vercel.yml`

- Added new job `deploy-api-gateway-vercel` for deploying the API Gateway separately

### ✅ Step 6: Update `devops/vercel/README.md`

- Documented the API Gateway Vercel deployment setup
- Listed required environment variables and project settings
