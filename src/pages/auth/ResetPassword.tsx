'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import NotificationAlert from '@/shared/AlertMessage'
import PendingButton from '@/shared/PendingButton'
import { supabase } from '@/utils/supabaseClient'
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function ResetPasswordPage() {
  const [state, setState] = useState({ success: false, message: '' });
  const location = useLocation();
  const navigate = useNavigate();
  const [requestMessage, setRequestMessage] = useState<boolean | string>(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  });
  useEffect(() => {
    setRequestMessage(false);
    const params = new URLSearchParams(location.search || location.hash.replace('#', '?'));
    const urlError = params.get('error');
    const errorDescription = params.get('error_description');

    if (urlError) {
      setRequestMessage(decodeURIComponent(errorDescription || 'An unknown error occurred.'));
    }
  }, [location, navigate]);

  const handleResetPassword = async (data: z.infer<typeof schema>) => {
    setState({ success: false, message: '' });

    const { password } = data;

    const { error } = await supabase.auth.updateUser({
      password
    })

    if (error) {
      setState({ success: false, message: error.message });
    } else {
      setState({ success: true, message: 'Password reset successfully.' });
    }
  }

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle className="text-3xl">Reset your password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        {!requestMessage ? (
          <div>
            <div className='flex flex-col gap-4'>
              {state.message && (
                <NotificationAlert
                  message={
                    <>
                      {state.message} {state.success && <Link to="/sign-in">Sign in</Link>}
                    </>
                  }
                  success={state.success}
                  className="mb-4"
                />
              )}
            </div>

            <Form {...form}>
              <form className="grid w-full items-center gap-4" onSubmit={form.handleSubmit(handleResetPassword)}>
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
          </div>
        ) : (
          <NotificationAlert
            message={requestMessage}
            success={false}
            className="mb-4"
          />
        )}
      </CardContent>
      <CardFooter>
        <p className='text-sm'>
          Remember your password? <Link to="/sign-in">Sign in</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
