---
description: Setup Better-Auth server, client, Drizzle adapter, and oRPC auth procedure middleware in src/lib/auth.ts and src/orpc/procedure.ts
---

Setup Better-Auth with Drizzle ORM adapter and oRPC `protectedProcedure` authentication middleware.

## Guidelines & Rules

1. **Server Auth (`src/lib/auth.ts`)**:
   - Initialize `betterAuth` with `drizzleAdapter`.
   - Enable `emailAndPassword` auth provider.

2. **Client Auth (`src/lib/auth-client.ts`)**:
   - Initialize `createAuthClient` for React UI components.

3. **oRPC Protected Middleware (`src/orpc/procedure.ts`)**:
   - Create `protectedProcedure` middleware that checks `ctx.session`.
   - Throw `ORPCError` with code `UNAUTHORIZED` if user is unauthenticated.

## Code Templates

### 1. Server Auth (`src/lib/auth.ts`)

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
```

### 2. Client Auth (`src/lib/auth-client.ts`)

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { useSession, signIn, signUp, signOut } = authClient;
```

### 3. oRPC Auth Middleware (`src/orpc/procedure.ts`)

```ts
import { os, ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth";

export const publicProcedure = os;

export const protectedProcedure = os.use(async ({ context, next }) => {
  // Assume context includes incoming request headers
  const session = await auth.api.getSession({
    headers: (context as { headers?: Headers }).headers ?? new Headers(),
  });

  if (!session) {
    throw new ORPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action",
    });
  }

  return next({
    context: {
      ...context,
      user: session.user,
      session: session.session,
    },
  });
});
```
