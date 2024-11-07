'use client'
import PendingButton from '@/shared/PendingButton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from "@hookform/resolvers/zod"
import { TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function ResetPasswordPage() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  });

  const state = { message: '', success: false };
  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle className="text-3xl">Reset your password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          {(state.message) && (
            <Alert variant={state.success ? `success` : `destructive`}>
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>{state.success ? `Success!` : `Error`}</AlertTitle>
              <AlertDescription>
                {state.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Form {...form}>
          <form className="grid w-full items-center gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PendingButton text="Reset password" />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className='text-sm'>
          Remember your password? <Link to="/sign-in">Sign in</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
