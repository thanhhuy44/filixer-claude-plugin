---
name: zustand
description: Standards and decision guide for client-side state management using Zustand, persistent stores with localStorage, and modular store patterns.
---

# Zustand State Management (Client-Side SPA)

Use this skill when managing client-side global state, persistent storage, modal states, or UI preferences in Single Page Applications.

## 1. Core Guidelines

- **Store Location**: Place global stores in `src/stores/<store-name>.ts`.
- **Modular Stores**: Keep stores focused on a single domain (e.g. `useUIStore`, `useAuthStore`).
- **Atomic Selectors**: Always use selector functions (e.g. `useUIStore((state) => state.isSidebarOpen)`) to prevent unnecessary component re-renders.
- **Persistence**: Use `persist` middleware for state that needs to survive page refreshes (e.g. user theme preferences, sidebar collapsed status).

## 2. Standard Code Patterns

### Standard Store with Persistent Storage (`src/stores/ui-store.ts`)

```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UIState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'ui-storage', // localStorage key name
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

### Component Consumption Pattern

```tsx
import { useUIStore } from '@/stores/ui-store'

export const SidebarToggle = (): React.ReactNode => {
  // Use atomic selector for optimal performance
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  return (
    <button onClick={toggleSidebar}>
      {sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
    </button>
  )
}
```
