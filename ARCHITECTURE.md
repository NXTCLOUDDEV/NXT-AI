# NXT AI Architecture

## Principles

NXT AI separates request handling, context assembly, agent execution, tools, persistence, and model providers. Provider SDKs must not become the application architecture.

## Runtime

Client -> API boundary -> validation -> context assembly -> agent runtime -> tools -> observation/replanning -> verification -> structured result.

Workers provide the HTTP edge. The Agents SDK / Durable Objects provide stateful agent coordination and real-time connections. D1 is the relational source of truth. Long-running work will use durable execution primitives instead of keeping HTTP requests open.

## Boundaries

- `src/api`: versioned HTTP surface
- `src/core`: domain types and errors
- `src/agents`: agent runtime boundary
- `src/models`: provider/model abstraction
- `src/tools`: tool registry and permissions
- `src/context`: context assembly
- `src/memory`: memory interfaces
- `src/tasks`: task lifecycle
- `src/db`: persistence adapters
- `migrations`: D1 migrations

## Security

External content is untrusted. Model output is not authorization. Secrets never enter model context. Tool execution is permission-gated and validated at the boundary.

Cloudflare services are introduced only when a concrete requirement justifies them.