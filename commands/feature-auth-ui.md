---
description: Generate standard Better-Auth UI components (SignIn, SignUp, Profile) using React Hook Form, Zod, and Shadcn Form fields in src/features/auth/
---

Generate an authentication feature module in `src/features/auth/` using Better-Auth client hooks (`authClient`), `react-hook-form`, `zod` validation, and Shadcn UI Form components.

## Guidelines & Rules

1. **Location**:
   - Component directory: `src/features/auth/components/`.
   - Page containers: `src/features/auth/pages/login.tsx`, `src/features/auth/pages/register.tsx`, `src/features/auth/pages/profile.tsx`.

2. **Form Validation & State**:
   - Use `react-hook-form` with `@hookform/resolvers/zod` and Zod schemas.
   - Use Shadcn `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` components.
   - Use `authClient.signIn.email({ email, password })` for login.
   - Use `authClient.signUp.email({ name, email, password })` for registration.
   - Handle loading states (`isSubmitting`) and server-returned error messages.

3. **Coding Style**:
   - ES6 Arrow functions only.
   - Explicit TypeScript annotations.

## Code Templates

### 1. Sign-In Form (`src/features/auth/components/sign-in-card.tsx`)

```tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

type SignInValues = z.infer<typeof signInSchema>

export const SignInCard = (): React.ReactNode => {
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: SignInValues): Promise<void> => {
    setServerError(null)

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    })

    if (error) {
      setServerError(error.message ?? 'Failed to sign in')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="p-2 text-sm text-red-500 bg-red-50 rounded border border-red-200">
                {serverError}
              </div>
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
```

### 2. User Profile Card (`src/features/auth/components/profile-card.tsx`)

```tsx
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const ProfileCard = (): React.ReactNode => {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()

  if (isLoading) return <div>Loading profile...</div>
  if (!isAuthenticated || !user) return <div>Not authenticated</div>

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <Button
          variant="destructive"
          onClick={() => signOut()}
          className="w-full"
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  )
}
```
