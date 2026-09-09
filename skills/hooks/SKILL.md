---
name: hooks
description: Essential custom React hooks guidelines for authentication, UI disclosure, input debouncing, mobile detection, and clipboard utilities in src/hooks/.
---

# Custom React Hooks Guidelines (`src/hooks/`)

Use this skill when implementing reusable custom React hooks for state management, UI utilities, media queries, and authentication shortcuts.

## 1. Core Guidelines

- **Location**: Store reusable hooks in `src/hooks/use-<name>.ts`.
- **Naming**: Always prefix hook names with `use` (e.g. `useAuth`, `useDebounce`, `useIsMobile`).
- **Return Types**: Use explicit TypeScript return types or tuple const assertions (`as const`).

---

## 2. Essential Custom Hooks

### 🛡️ 1. Authentication Hook (`src/hooks/use-auth.ts`)
Wraps Better-Auth `authClient.useSession()` with intuitive boolean helpers and actions.

```ts
import { authClient } from '@/lib/auth-client'

export function useAuth() {
  const { data: session, isPending, error, refetch } = authClient.useSession()

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: Boolean(session?.user),
    isLoading: isPending,
    error,
    refetch,
    signOut: authClient.signOut,
  }
}
```

---

### 🔍 2. Debounce Value Hook (`src/hooks/use-debounce.ts`)
Debounces fast-changing values (e.g. search inputs for TanStack Query or TanStack Table).

```ts
import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

---

### 📱 3. Mobile Screen Detection Hook (`src/hooks/use-mobile.ts`)
Detects mobile viewport width for responsive Shadcn Dialogs / Drawers / Sidebars.

```ts
import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}
```

---

### 🔓 4. UI Disclosure / Modal State Hook (`src/hooks/use-disclosure.ts`)
Simplifies managing modal, drawer, or dropdown toggle states.

```ts
import { useCallback, useState } from 'react'

export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, open, close, toggle, setIsOpen }
}
```

---

### 📋 5. Copy to Clipboard Hook (`src/hooks/use-copy-to-clipboard.ts`)
Copies text or tokens to the clipboard with a temporary success indicator.

```ts
import { useState, useCallback } from 'react'

export function useCopyToClipboard(timeout = 2000) {
  const [isCopied, setIsCopied] = useState(false)

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) return false

      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), timeout)
        return true
      } catch (error) {
        setIsCopied(false)
        return false
      }
    },
    [timeout]
  )

  return { isCopied, copy }
}
```
