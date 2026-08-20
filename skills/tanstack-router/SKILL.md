---
name: tanstack-router
description: Standards and decision guide for TanStack Router in React SPA applications, type-safe routes, Zod search param validation, loaders, and code-splitting.
---

# TanStack Router (SPA Client-Side Routing)

Use this skill when building Single Page Applications (SPA) with `@tanstack/react-router`, defining type-safe file routes, validating search parameters with Zod, and integrating loaders.

## 1. Core Guidelines

- **File-Based Routing**: Use `createFileRoute('/path')` for routes in `src/routes/`.
- **Search Parameter Validation**: Always validate URL search parameters using Zod via `validateSearch`.
- **Type-Safety**: Leverage full type safety for `Link`, `useNavigate`, and `useParams`.
- **Preloading & Loaders**: Use route `loader` functions to preload data with oRPC Client or TanStack Query.

## 2. Standard Code Patterns

### File Route Definition (`src/routes/posts.tsx`)

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const postsSearchSchema = z.object({
  page: z.number().optional().default(1),
  filter: z.string().optional().default(''),
})

export const Route = createFileRoute('/posts')({
  validateSearch: postsSearchSchema,
  component: PostsComponent,
})

function PostsComponent() {
  const { page, filter } = Route.useSearch()

  return (
    <div>
      <h1>Posts (Page: {page})</h1>
      {filter && <p>Filtering by: {filter}</p>}
    </div>
  )
}
```

### Route with Data Loader (`src/routes/posts/$postId.tsx`)

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { orpcClient } from '@/lib/orpc'

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    return await orpcClient.posts.getById({ id: params.postId })
  },
  component: PostDetailComponent,
})

function PostDetailComponent() {
  const post = Route.useLoaderData()

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```
