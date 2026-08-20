---
description: Generate a type-safe form component combining react-hook-form, Zod schema validation, and Shadcn UI / Ant Design components in src/components/forms/<form_name>.tsx
---

Generate a type-safe form component in `src/components/forms/<form_name>.tsx` matching the project's React Hook Form + Zod pattern.

## Guidelines & Rules

1. **Imports**:
   - Use `useForm` from `react-hook-form`.
   - Use `zodResolver` from `@hookform/resolvers/zod`.
   - Import `z` from `'zod'`.
   - Use Shadcn UI (`@/components/ui/form`, `@/components/ui/input`, `@/components/ui/button`) or Ant Design Form primitives.

2. **Schema & Types**:
   - Define schema with `z.object({...})`.
   - Infer form data type: `type FormValues = z.infer<typeof formSchema>`.

3. **Coding Style**:
   - Use ES6 Arrow Functions.
   - Explicitly define props: `interface Props { onSubmit: (data: FormValues) => void | Promise<void>; initialValues?: Partial<FormValues>; isLoading?: boolean }`.

## Minimal Code Template

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const <formName>Schema = z.object({
  title: z.string().min(1, 'Title is required'),
  email: z.string().email('Invalid email address'),
})

export type <FormName>Values = z.infer<typeof <formName>Schema>

interface <FormName>FormProps {
  onSubmit: (data: <FormName>Values) => void | Promise<void>
  defaultValues?: Partial<<FormName>Values>
  isLoading?: boolean
}

export const <FormName>Form = ({
  onSubmit,
  defaultValues,
  isLoading = false,
}: <FormName>FormProps): React.ReactNode => {
  const form = useForm<<FormName>Values>({
    resolver: zodResolver(<formName>Schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      email: defaultValues?.email ?? '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
```
