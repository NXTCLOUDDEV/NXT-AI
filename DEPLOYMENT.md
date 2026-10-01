# Deployment

## Current account prerequisite

Cloudflare currently rejects Worker deployment for this account until the account email address is verified. This is an account-level prerequisite; code cannot bypass it.

## Prerequisites
- Verify the Cloudflare account email.
- Configure provider secrets in Cloudflare.
- Configure NXT_API_KEY for production API authentication.
- Enable R2 before enabling file/artifact storage.

## Local

    npm install
    npm run dev

## Checks

    npm run typecheck
    npm test
    npm run build

## Secrets

Use Wrangler/Cloudflare secrets for production values; never commit them.

Typical values:
- NXT_API_KEY
- OPENAI_API_KEY and/or ANTHROPIC_API_KEY
- NXT_DEFAULT_PROVIDER
- NXT_DEFAULT_MODEL
- optional fallback provider and cost configuration

## Infrastructure

- D1: nxt-ai-db
- Queue: nxt-ai-tasks
- Dead-letter queue: nxt-ai-tasks-dlq
- Durable Object class: NxtAgent (created during Worker deployment)
- R2 intentionally deferred until the account enables it.

## Deployment

After the account prerequisite is cleared:

    npx wrangler deploy

Then verify /health, /api/v1/health, D1 connectivity, task enqueueing, queue execution, dead-letter behavior, authentication, and tenant isolation.

Do not treat a successful upload as a successful deployment until the live endpoint and task path are verified.