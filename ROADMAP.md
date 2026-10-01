# NXT AI Roadmap

## Implemented foundation

- Cloudflare Worker edge API
- D1 relational persistence
- Durable Object Agents SDK boundary
- Queue-backed asynchronous task execution
- Model provider abstraction with OpenAI and Anthropic adapters
- Iterative agent loop with bounded execution
- Permission-enforced tool registry
- Conversation and memory persistence
- Usage tracking
- Structured errors and request IDs
- Production tenant/authentication boundary
- Security headers and request-size limits
- Professional single-page product shell
- CI/typecheck/test/build configuration

## Next production integrations

1. Verify the Cloudflare account email and deploy the Worker.
2. Configure provider secrets through Wrangler/Cloudflare secrets.
3. Add a real web-search provider/tool with SSRF and egress controls.
4. Add R2 after the account enables R2; implement file/artifact lifecycle.
5. Add KV only for concrete caching/rate-limit workloads.
6. Add richer Durable Object state/event streaming and resumable agent streams.
7. Add authentication backed by Cloudflare Access/OIDC or a dedicated identity service for multi-user production deployments.
8. Add E2E tests against a deployed staging environment.
9. Add cost-aware model routing and provider fallback policies.
10. Perform external security review before commercial launch.
