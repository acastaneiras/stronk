'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import NotificationAlert from '@/shared/AlertMessage'
import PendingButton from '@/shared/PendingButton'
import { supabase } from '@/utils/supabaseClient'
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
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
  const [state, setState] = useState({ success: false, message: '' });

  const handleForgotPassword = async (data: z.infer<typeof schema>) => {
    const { email } = data;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${import.meta.env.VITE_APP_URL}/reset-password`
    });

    if (error) {
      setState({ success: false, message: error.message });
    } else {
      setState({ success: true, message: 'An email has been sent to reset your password' });
    }
  }


  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle className="text-3xl">Forgot your password?</CardTitle>
        <CardDescription>Enter your email to reset it</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          {(state.message) && (
            <NotificationAlert
              message={state.message}
              success={state.success}
              className="mb-4"
            />
          )}
        </div>

        <Form {...form}>
          <form className="grid w-full items-center gap-4" onSubmit={form.handleSubmit(handleForgotPassword)}>
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