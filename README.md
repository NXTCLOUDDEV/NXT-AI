# NXT AI

NXT AI is a Cloudflare-native AI operating layer built around reliable agent execution, tools, memory, durable tasks, model abstraction, and verification.

## Current implementation

- TypeScript + Cloudflare Workers + Hono
- D1 relational persistence with forward migrations
- Agents SDK / Durable Object boundary
- Queue-backed asynchronous task execution + dead-letter queue
- Provider abstraction with OpenAI and Anthropic HTTP adapters
- Provider fallback routing
- Iterative bounded agent loop with explicit verification
- Permission-enforced tool registry
- Conversation and memory APIs
- Usage and configurable cost accounting
- Production API-key + tenant boundary
- Request IDs, structured errors, security headers, request-size limits
- OpenAPI specification
- Product UI shell
- GitHub Actions CI

## Cloudflare resources

- D1: nxt-ai-db
- Queue: nxt-ai-tasks
- DLQ: nxt-ai-tasks-dlq
- Durable Object class: NxtAgent, configured for deployment
- R2: deferred because the account currently requires dashboard enablement

## Development

    npm install
    npm run dev
    npm run typecheck
    npm test
    npm run build

## Production

Before deployment, verify the Cloudflare account email and configure provider/API secrets. See DEPLOYMENT.md.

The project deliberately does not claim production completion until live Worker deployment and end-to-end task execution have been verified.
