---
description: Generate a client-only Better-Auth setup for SPA React applications in src/lib/auth-client.ts
---

Generate a Better-Auth client configuration in `src/lib/auth-client.ts` optimized for Single Page Applications (Vite + React).

## Guidelines & Rules

1. **Imports**:
   - Use `createAuthClient` from `better-auth/react`.

2. **Base URL**:
   - Resolve backend URL dynamically using `import.meta.env.VITE_API_URL` with a fallback to `http://localhost:3000`.

3. **Exports**:
   - Export `authClient` and destructure core helper hooks (`useSession`, `signIn`, `signUp`, `signOut`).

## Minimal Code Template

```ts
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

export const { useSession, signIn, signUp, signOut } = authClient
```
