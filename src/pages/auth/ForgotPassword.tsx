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
  email: z.string().email(),
});

export default function ForgotPasswordPage() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
    }
  });

  const state = { message: '', success: false };
  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle className="text-3xl">Forgot your password?</CardTitle>
        <CardDescription>Enter your email to reset it</CardDescription>
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
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PendingButton text="Send reset link" />
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