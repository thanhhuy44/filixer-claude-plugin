---
name: ui-module
description: Architecture standards and generator pattern for building feature-driven UI modules in src/features/<feature-name> adaptable for Ant Design and Shadcn UI with React, TanStack Query, Context action state machine, and Component composition.
---

# UI Module Architecture & Standards

Use this skill when designing, building, or refactoring feature components in `src/features/<feature-name>/`.

This architecture is **fully adaptable** for both **Ant Design (`antd`)** and **Shadcn UI (`shadcn`)**, sharing the exact same state machine, schema, and query factory.

---

## 1. Feature Architecture Pattern

All UI features must be self-contained in `src/features/<feature-name>/`:

```
src/features/<feature_name>/
├── index.tsx                  # Feature Page component — wraps content in ContextProvider
├── schema.ts                  # Zod validation schemas & body types (Shared Core)
├── query.ts                   # TanStack Query & Mutation options factory (Shared Core)
├── context/
│   └── index.tsx              # Feature Context Provider & custom hook (Shared Core)
└── components/                # Focused sub-components consuming feature context
    ├── table.tsx              # Data Table component (AntD Table OR Shadcn Table)
    ├── columns.tsx            # Column definitions (AntD TableColumnsType OR TanStack ColumnDef)
    ├── actions-cell.tsx       # Dropdown menu (AntD Dropdown OR Shadcn DropdownMenu)
    └── modals/
        └── upsert.tsx         # Unified Create/Edit Modal (AntD Modal OR Shadcn Dialog)
```

---

## 2. Core Guidelines & Non-Negotiable Rules

1. **Library Detection Strategy**:
   - **Ant Design**: Select when `antd` or `@ant-design/icons` is installed in `package.json`.
   - **Shadcn UI**: Select when `@/components/ui/` components, `tailwindcss`, and `lucide-react` are used.

2. **Universal Shared Core Pattern (Library-Agnostic)**:
   - `schema.ts`: Defines entity interface, Zod creation schema (`create<Entity>Schema`), and inferred types (`Create<Entity>Body`, `Edit<Entity>Body`).
   - `query.ts`: Encapsulates all query and mutation definitions in a clean `<Entity>Queries` object factory (`getAll`, `getOne`, `create`, `edit`, `delete`) using `@tanstack/react-query`.
   - `context/index.tsx`:
     - Manages `action: "create" | "edit" | "delete" | null`.
     - Manages `current: <Entity> | null`.
     - Binds TanStack queries and mutations.
     - Custom hook `use<FeatureName>Context()` with strict error guard.

3. **Component Isolation & Derived State**:
   - Keep page-level components clean in `index.tsx` by delegating views to modular components in `components/`.
   - All state sharing across sub-components passes through `use<FeatureName>Context()`.
   - **Anti-Pattern Prevention**: Do NOT use `useState` + `useEffect` for derived state. Compute values inline or via `useMemo`, reset state with React `key` props, and handle user events inside event handlers.

4. **ES6 Arrow Functions & Strict Typing**:
   - Always use `export const Component = (): ReactNode => ...`. No `function` declarations.
   - Explicit TypeScript annotations for props, parameters, and return types. Never use `any`.

5. **Mandatory Playwright E2E Tests**:
   - Author accompanying Playwright E2E test in `e2e/<feature_name>.spec.ts` testing mounting, table rendering, action dropdowns, modal open/close, form submission, and error display.

---

## 3. Code Templates

### 📦 Part 1: Shared Core (Library-Agnostic)

#### 1. Zod Schema & Types (`src/features/<feature-name>/schema.ts`)

```tsx
import z from "zod";

export interface <Entity> {
  id: string;
  code: string;
  name: string;
  vendor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const create<Entity>Schema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  vendor: z.string().min(1, "Vendor is required"),
});

export type Create<Entity>Body = z.infer<typeof create<Entity>Schema>;

export type Edit<Entity>Body = Partial<Create<Entity>Body>;
```

#### 2. Query Options Factory (`src/features/<feature-name>/query.ts`)

```tsx
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import type { Create<Entity>Body, Edit<Entity>Body, <Entity> } from "./schema";

export const <Entity>Queries = {
  getAll: (params?: Record<string, unknown>): UseQueryOptions<<Entity>[]> => ({
    queryKey: ["<entities>", params],
    queryFn: async (): Promise<<Entity>[]> => {
      // Connect to your oRPC or API endpoint:
      // return await orpc.<entity>.getAll(params);
      return [];
    },
  }),
  getOne: (id?: string): UseQueryOptions<<Entity>> => ({
    queryKey: ["<entities>", id],
    queryFn: async (): Promise<<Entity>> => {
      // return await orpc.<entity>.getById({ id: id! });
      return {} as <Entity>;
    },
    enabled: !!id,
  }),
  create: (): UseMutationOptions<
    <Entity>,
    Error,
    { body: Create<Entity>Body },
    unknown
  > => ({
    mutationKey: ["<entities>", "create"],
    mutationFn: async ({ body }: { body: Create<Entity>Body }): Promise<<Entity>> => {
      // return await orpc.<entity>.create(body);
      return {} as <Entity>;
    },
  }),
  edit: (
    id?: string,
  ): UseMutationOptions<
    <Entity>,
    Error,
    { id: string; body: Edit<Entity>Body },
    unknown
  > => ({
    mutationKey: ["<entities>", "edit", id],
    mutationFn: async ({
      id: targetId,
      body,
    }: {
      id: string;
      body: Edit<Entity>Body;
    }): Promise<<Entity>> => {
      // return await orpc.<entity>.update({ id: targetId, ...body });
      return {} as <Entity>;
    },
  }),
  delete: (
    id?: string,
  ): UseMutationOptions<string, Error, { id: string }, unknown> => ({
    mutationKey: ["<entities>", "delete", id],
    mutationFn: async ({ id: targetId }: { id: string }): Promise<string> => {
      // await orpc.<entity>.delete({ id: targetId });
      return targetId;
    },
  }),
};
```

#### 3. Feature Context (`src/features/<feature-name>/context/index.tsx`)

```tsx
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react";

import {
  useMutation,
  type UseMutationResult,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

import { <Entity>Queries } from "../query";
import type { Create<Entity>Body, Edit<Entity>Body, <Entity> } from "../schema";

export type Action = "create" | "edit" | "delete" | null;

export type ContextType = {
  <entities>: UseQueryResult<<Entity>[]>;
  <entity>: UseQueryResult<<Entity>, Error>;
  create<Entity>: UseMutationResult<
    <Entity>,
    Error,
    { body: Create<Entity>Body },
    unknown
  >;
  edit<Entity>: UseMutationResult<
    <Entity>,
    Error,
    { id: string; body: Edit<Entity>Body },
    unknown
  >;
  delete<Entity>: UseMutationResult<
    string,
    Error,
    { id: string },
    unknown
  >;
  action: Action;
  setAction: Dispatch<SetStateAction<Action>>;
  current: <Entity> | null;
  setCurrent: Dispatch<SetStateAction<<Entity> | null>>;
};

const Context = createContext<ContextType>({} as ContextType);

export const ContextProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const [action, setAction] = useState<Action>(null);
  const [current, setCurrent] = useState<<Entity> | null>(null);

  const <entities> = useQuery({
    ...<Entity>Queries.getAll(),
  });

  const <entity> = useQuery({
    ...<Entity>Queries.getOne(current?.id),
  });

  const create<Entity> = useMutation({
    ...<Entity>Queries.create(),
  });

  const edit<Entity> = useMutation({
    ...<Entity>Queries.edit(current?.id),
  });

  const delete<Entity> = useMutation({
    ...<Entity>Queries.delete(current?.id),
  });

  return (
    <Context.Provider
      value={{
        action,
        current,
        setAction,
        setCurrent,
        <entities>,
        <entity>,
        create<Entity>,
        edit<Entity>,
        delete<Entity>,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const use<FeatureName>Context = (): ContextType => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("use<FeatureName>Context must be used within ContextProvider");
  }
  return context;
};
```

---

### 🅰️ Part 2A: Ant Design (`antd`) UI Implementation

#### 1. Page (`src/features/<feature-name>/index.tsx`)

```tsx
import type { ReactNode } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";

import { Container } from "@/components/container";
import { PageHeader } from "@/components/layout/page-header";
import { colors } from "@/constants/style";

import UpsertModal from "./components/modals/upsert";
import { <FeatureName>Table } from "./components/table";
import { ContextProvider, use<FeatureName>Context } from "./context";

const <FeatureName>Content = (): ReactNode => {
  const { setAction } = use<FeatureName>Context();

  return (
    <Flex vertical style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <PageHeader
        title="<Entity> list"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAction("create")}
            style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
          >
            New <entity>
          </Button>
        }
      />
      <Container style={{ overflow: "hidden" }}>
        <<FeatureName>Table />
        <UpsertModal />
      </Container>
    </Flex>
  );
};

export const <FeatureName>Page = (): ReactNode => {
  return (
    <ContextProvider>
      <<FeatureName>Content />
    </ContextProvider>
  );
};
```

#### 2. Columns (`src/features/<feature-name>/components/columns.tsx`)

```tsx
import type { TableColumnsType } from "antd";
import type { <Entity> } from "../schema";
import { ActionCell } from "./actions-cell";

export const columns = (): TableColumnsType<<Entity>> => [
  { title: "ID", dataIndex: "id" },
  { title: "Code", dataIndex: "code" },
  { title: "Name", dataIndex: "name" },
  { title: "Vendor", dataIndex: "vendor" },
  {
    title: "",
    fixed: "end",
    width: 48,
    render: (_, data) => <ActionCell {...data} />,
  },
];
```

#### 3. Actions Cell (`src/features/<feature-name>/components/actions-cell.tsx`)

```tsx
import type { ReactNode } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";

import { use<FeatureName>Context } from "../context";
import type { <Entity> } from "../schema";

export const ActionCell = (data: <Entity>): ReactNode => {
  const { setAction, setCurrent } = use<FeatureName>Context();

  const items: MenuProps["items"] = [
    {
      label: "Edit",
      key: "edit",
      onClick: () => {
        setCurrent(data);
        setAction("edit");
      },
    },
    {
      label: "Delete",
      key: "delete",
      onClick: () => {
        setCurrent(data);
        setAction("delete");
      },
    },
  ];

  return (
    <Dropdown trigger={["click"]} menu={{ items }}>
      <Button size="small" icon={<MoreOutlined />} />
    </Dropdown>
  );
};
```

#### 4. Table (`src/features/<feature-name>/components/table.tsx`)

```tsx
import type { ReactNode } from "react";
import DataTable from "@/components/data-table";

import { use<FeatureName>Context } from "../context";
import { columns } from "./columns";

export const <FeatureName>Table = (): ReactNode => {
  const { <entities> } = use<FeatureName>Context();

  return (
    <DataTable
      table={{
        columns: columns(),
        dataSource: <entities>.data,
        virtual: true,
        bordered: true,
      }}
    />
  );
};
```

#### 5. Upsert Modal (`src/features/<feature-name>/components/modals/upsert.tsx`)

```tsx
import type { ReactNode } from "react";
import { Modal } from "antd";

import { use<FeatureName>Context } from "../../context";

export const UpsertModal = (): ReactNode => {
  const { current, action, setAction, setCurrent } = use<FeatureName>Context();

  const onCancel = (): void => {
    setAction(null);
    setCurrent(null);
  };

  return (
    <Modal
      open={action === "create" || action === "edit"}
      title={action === "create" ? "Create <entity>" : "Edit <entity>"}
      onCancel={onCancel}
    >
      {/* Form content */}
      {current?.id}
    </Modal>
  );
};

export default UpsertModal;
```

---

### 🅱️ Part 2B: Shadcn UI (`shadcn`) UI Implementation

#### 1. Page (`src/features/<feature-name>/index.tsx`)

```tsx
import type { ReactNode } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import UpsertModal from "./components/modals/upsert";
import { <FeatureName>Table } from "./components/table";
import { ContextProvider, use<FeatureName>Context } from "./context";

const <FeatureName>Content = (): ReactNode => {
  const { setAction } = use<FeatureName>Context();

  return (
    <div className="flex flex-col w-full h-full overflow-hidden p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight"><Entity> list</h1>
          <p className="text-sm text-muted-foreground">
            Manage your <entity> records and configurations
          </p>
        </div>
        <Button onClick={() => setAction("create")}>
          <Plus className="w-4 h-4 mr-2" />
          New <entity>
        </Button>
      </div>

      <div className="flex-1 overflow-auto rounded-md border">
        <<FeatureName>Table />
        <UpsertModal />
      </div>
    </div>
  );
};

export const <FeatureName>Page = (): ReactNode => {
  return (
    <ContextProvider>
      <<FeatureName>Content />
    </ContextProvider>
  );
};
```

#### 2. Columns (`src/features/<feature-name>/components/columns.tsx`)

```tsx
import type { ColumnDef } from "@tanstack/react-table";

import type { <Entity> } from "../schema";
import { ActionCell } from "./actions-cell";

export const columns: ColumnDef<<Entity>>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "code", header: "Code" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "vendor", header: "Vendor" },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell data={row.original} />,
  },
];
```

#### 3. Actions Cell (`src/features/<feature-name>/components/actions-cell.tsx`)

```tsx
import type { ReactNode } from "react";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { use<FeatureName>Context } from "../context";
import type { <Entity> } from "../schema";

export const ActionCell = ({ data }: { data: <Entity> }): ReactNode => {
  const { setAction, setCurrent } = use<FeatureName>Context();

  const onEdit = (): void => {
    setCurrent(data);
    setAction("edit");
  };

  const onDelete = (): void => {
    setCurrent(data);
    setAction("delete");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

#### 4. Table (`src/features/<feature-name>/components/table.tsx`)

```tsx
import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { use<FeatureName>Context } from "../context";
import { columns } from "./columns";

export const <FeatureName>Table = (): ReactNode => {
  const { <entities> } = use<FeatureName>Context();

  const table = useReactTable({
    data: <entities>.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
```

#### 5. Upsert Modal (`src/features/<feature-name>/components/modals/upsert.tsx`)

```tsx
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { use<FeatureName>Context } from "../../context";

export const UpsertModal = (): ReactNode => {
  const { current, action, setAction, setCurrent } = use<FeatureName>Context();

  const isOpen = action === "create" || action === "edit";

  const onOpenChange = (open: boolean): void => {
    if (!open) {
      setAction(null);
      setCurrent(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {action === "create" ? "Create <entity>" : "Edit <entity>"}
          </DialogTitle>
          <DialogDescription>
            {action === "create"
              ? "Add a new <entity> record."
              : "Update existing <entity> details."}
          </DialogDescription>
        </DialogHeader>

        {/* Form fields */}
        <div className="py-4">
          {current?.id && (
            <p className="text-xs text-muted-foreground">ID: {current.id}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertModal;
```
