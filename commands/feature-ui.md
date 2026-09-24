---
description: Generate a standard feature module in src/features/<feature-name> adaptable for either Ant Design or Shadcn UI with schema, query factory, Context action machine, Table, Columns, ActionCell, and UpsertModal
---

Generate a feature module in `src/features/<feature_name>/` following the project's standard feature pattern architecture.

This pattern is **fully adaptable** for both **Ant Design (`antd`)** and **Shadcn UI (`shadcn`)**, sharing the exact same state machine, schema, and query factory.

---

## 🧭 UI Library Selection & Detection

Before generating code, detect the target UI library:

1. **Auto-Detect**:
   - Check `package.json` dependencies:
     - If `antd` is installed / `@/components/layout/page-header` or `colors` exist ➔ Use **Ant Design (`antd`)**.
     - If `@/components/ui/` / `@tanstack/react-table` / `lucide-react` exist ➔ Use **Shadcn UI (`shadcn`)**.
2. **Explicit User Flag**:
   - Respect user request (e.g. `/feature-ui <name> --antd` or `/feature-ui <name> --shadcn`).

---

## 🏛️ Non-Negotiable Architecture & Base Guidelines

### 1. Architectural Principles

- **State Machine in Feature Context (Shared Core)**:
  - `type Action = "create" | "edit" | "delete" | null;`
  - `action`: Tracks active modal/drawer/operation.
  - `current`: Tracks currently selected entity (`<Entity> | null`).
  - Context orchestrates TanStack Queries (`getAll`, `getOne`) and Mutations (`create`, `edit`, `delete`).
- **Query Options Factory (`query.ts`) (Shared Core)**:
  - Factory object `<Entity>Queries` defining `getAll`, `getOne`, `create`, `edit`, and `delete` using `UseQueryOptions` and `UseMutationOptions`.
- **Validation & Typing (`schema.ts`) (Shared Core)**:
  - Zod schemas for entity creation and editing (`create<Entity>Schema`).
  - Inferred body types (`Create<Entity>Body`, `Edit<Entity>Body`) and the `<Entity>` interface.
- **Adaptive UI Composition**:
  - **Ant Design**: Uses `Flex`, `PageHeader`, `Button` (`PlusOutlined`), AntD `Table`/`DataTable`, `Dropdown` (`MoreOutlined`), and `Modal`.
  - **Shadcn UI**: Uses Tailwind layout, `@/components/ui/button` (`Plus`), TanStack Table with `@/components/ui/table`, `@/components/ui/dropdown-menu` (`MoreHorizontal`), and `@/components/ui/dialog`.
- **Strict Coding Rules**:
  - **ES6 Arrow Functions Only**: `export const Component = (): ReactNode => ...`. No `function` declarations.
  - **Explicit TypeScript Typing**: Explicit prop types, state types, and return types (`ReactNode`). Never use `any`.
  - **Anti-Pattern Prevention**: Do NOT use `useState` + `useEffect` for derived state. Compute derived values inline or via `useMemo`. Reset state with React `key` props, not effects.

---

### 2. Standard Directory & Files

```
src/features/<feature_name>/
├── index.tsx                  # Feature Page — wraps content in ContextProvider
├── schema.ts                  # Zod validation schemas & body types (Shared)
├── query.ts                   # TanStack Query & Mutation options factory (Shared)
├── context/
│   └── index.tsx              # Feature Context Provider & hook (Shared)
└── components/                # Focused sub-components consuming feature context
    ├── table.tsx              # Data Table component (AntD Table OR Shadcn Table)
    ├── columns.tsx            # Column definitions (AntD TableColumnsType OR TanStack ColumnDef)
    ├── actions-cell.tsx       # Dropdown menu (AntD Dropdown OR Shadcn DropdownMenu)
    └── modals/
        └── upsert.tsx         # Unified Create/Edit Modal (AntD Modal OR Shadcn Dialog)
```

---

## 📦 Part 1: Shared Core (Identical for Both AntD & Shadcn)

### 1. `src/features/<feature_name>/schema.ts`

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

### 2. `src/features/<feature_name>/query.ts`

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

### 3. `src/features/<feature_name>/context/index.tsx`

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

## 🅰️ Part 2A: Ant Design (`antd`) UI Implementation

Use these templates when the project uses **Ant Design**:

#### `src/features/<feature_name>/index.tsx` (AntD)

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
    <Flex
      vertical
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <PageHeader
        title="<Entity> list"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAction("create")}
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
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

#### `src/features/<feature_name>/components/columns.tsx` (AntD)

```tsx
import type { TableColumnsType } from "antd";

import type { <Entity> } from "../schema";
import { ActionCell } from "./actions-cell";

export const columns = (): TableColumnsType<<Entity>> => [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Code",
    dataIndex: "code",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Vendor",
    dataIndex: "vendor",
  },
  {
    title: "",
    fixed: "end",
    width: 48,
    render: (_, data) => <ActionCell {...data} />,
  },
];
```

#### `src/features/<feature_name>/components/actions-cell.tsx` (AntD)

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

#### `src/features/<feature_name>/components/table.tsx` (AntD)

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

#### `src/features/<feature_name>/components/modals/upsert.tsx` (AntD)

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

## 🅱️ Part 2B: Shadcn UI (`shadcn`) UI Implementation

Use these templates when the project uses **Shadcn UI** (Tailwind CSS + `@/components/ui/` + Lucide Icons + TanStack Table):

#### `src/features/<feature_name>/index.tsx` (Shadcn)

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

#### `src/features/<feature_name>/components/columns.tsx` (Shadcn)

```tsx
import type { ColumnDef } from "@tanstack/react-table";

import type { <Entity> } from "../schema";
import { ActionCell } from "./actions-cell";

export const columns: ColumnDef<<Entity>>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell data={row.original} />,
  },
];
```

#### `src/features/<feature_name>/components/actions-cell.tsx` (Shadcn)

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

#### `src/features/<feature_name>/components/table.tsx` (Shadcn)

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

#### `src/features/<feature_name>/components/modals/upsert.tsx` (Shadcn)

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
