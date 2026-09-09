---
name: ui-module
description: Architecture standards and generator pattern for building feature-driven UI modules in src/features/<feature-name> using React, TypeScript, Context, and Component composition.
---

# UI Module Architecture & Standards

Use this skill when designing, building, or refactoring feature components in `src/features/<feature-name>/`.

## 1. Feature Architecture Pattern

All UI features must be self-contained in `src/features/<feature-name>/`:

```
src/features/<feature_name>/
├── index.tsx                  # Feature Page component — wraps view in ContextProvider
├── context/
│   └── index.tsx              # Feature Context Provider & custom use<FeatureName>Context hook
└── components/                # Focused sub-components consuming feature context
    ├── list.tsx               # Minimal Data List / Table component
    ├── card.tsx               # Minimal Detail View / Card component
    ├── create-form.tsx        # Minimal Create Form component
    └── delete.tsx             # Minimal Delete Confirmation component
```

## 2. Core Guidelines & Non-Negotiable Rules

1. **ES6 Arrow Functions**:
   - Always use `export const Component = (): React.ReactNode => ...`.
   - Do NOT use `function` declarations.

2. **Explicit Type Annotations**:
   - Annotate props, parameters, and explicit return types (`React.ReactNode`).

3. **Empty Base Context Pattern**:
   - `ContextType` starts minimal/empty (`interface ContextType {}`).
   - Throw an explicit error if custom context hook is used outside Provider:
     `throw new Error('use<FeatureName>Context must be used within ContextProvider')`.

4. **Component Isolation**:
   - Keep page-level components clean in `index.tsx` by delegating actual view rendering to modular components in `components/`.
   - All state sharing across sub-components should pass through `use<FeatureName>Context()`.

5. **Mandatory Playwright E2E Tests**:
   - When creating or modifying a feature module, author an accompanying Playwright E2E test in `e2e/<feature_name>.spec.ts` to test mounting, interactions, form submission, and error display.

## 3. Code Templates

### Context Template (`src/features/<feature-name>/context/index.tsx`)

```tsx
import { createContext, useContext, type ReactNode } from 'react'

type ContextType = {}

const Context = createContext<ContextType>({} as ContextType)

export const ContextProvider = ({
  children,
}: {
  children: ReactNode
}): React.ReactNode => {
  return <Context.Provider value={{}}>{children}</Context.Provider>
}

export const useFeatureContext = (): ContextType => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useFeatureContext must be used within ContextProvider')
  }
  return context
}
```

### Feature Page Template (`src/features/<feature-name>/index.tsx`)

```tsx
import { ContextProvider } from './context'
import { List } from './components/list'
import { DetailCard } from './components/card'
import { CreateForm } from './components/create-form'
import { DeleteModal } from './components/delete'

export const FeaturePage = (): React.ReactNode => {
  return (
    <ContextProvider>
      <div>
        <List />
        <DetailCard />
        <CreateForm />
        <DeleteModal />
      </div>
    </ContextProvider>
  )
}
```
