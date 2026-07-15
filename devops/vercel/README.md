# Vercel Deployment Notes

The production frontend deploys to Vercel from `frontend/`.

Required Vercel environment variable:

```text
NEXT_PUBLIC_API_GATEWAY_URL=https://your-production-api-gateway.example.com
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

The backend services are containerized separately and should be deployed behind
the production API Gateway URL used by the Vercel frontend.
