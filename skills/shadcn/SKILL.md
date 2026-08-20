---
name: shadcn-ui
description: Standards and decision guide for Shadcn UI component installation, Tailwind CSS v4 variables, theming with next-themes, and integration with the shadcn MCP server.
---

# Shadcn UI

Use this skill when installing components, configuring UI component primitives, implementing dark mode, or styling components with Shadcn UI and Tailwind CSS.

## 1. Core Guidelines

- **Component Installation**: Use `npx shadcn@latest add <component_name>` to add UI components into `components/ui/`.
- **MCP CLI Integration**: Utilize the local `shadcn` MCP server configured in `.mcp.json` (`npx shadcn@latest mcp`) for component lookup and discovery.
- **Styling Standards**: Use `cn()` helper function from `lib/utils` to merge `clsx` and `tailwind-merge` classes safely.
- **Dark Mode & Theming**: Use CSS variables with `next-themes` and `ThemeProvider` at root application level.

## 2. Standard Usage Patterns

### Installing Components

```bash
# Add core primitives
npx shadcn@latest add button input form dialog card table dropdown-menu
```

### Class Merging Helper (`src/lib/utils.ts`)

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}
```

### Component Structure Pattern

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const StatCard = ({ title, value }: { title: string; value: string }): React.ReactNode => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <Button className="mt-4" size="sm">View Details</Button>
      </CardContent>
    </Card>
  )
}
```
