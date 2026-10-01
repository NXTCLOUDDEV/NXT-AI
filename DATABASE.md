# Database

D1 is the relational source of truth. The initial migration establishes tenant-safe identity and audit primitives. Domain tables are added through forward-only migrations as runtime capabilities are implemented.

Use parameterized queries only. KV and Durable Object storage are not substitutes for relational state.