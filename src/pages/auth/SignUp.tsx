import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import NotificationAlert from '@/shared/AlertMessage';
import PendingButton from '@/shared/PendingButton';
import { handleGoogleSignIn } from '@/utils/authUtils';
import { supabase } from '@/utils/supabaseClient';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function SignUpPage() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const [state, setState] = useState({ success: false, message: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signup = async (data: z.infer<typeof schema>) => {
    setState({ success: false, message: '' });

    const { email, password } = data;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/stronk/confirm-email`,
      }
    });

    if (error) {
      setState({ success: false, message: error.message });
    } else {
      setState({ success: true, message: 'An email has been sent to verify your account' });
    }
  };

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle className="text-3xl">Create your account</CardTitle>
        <CardDescription>to continue to Stronk</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4 '>
          {state.message && (
            <NotificationAlert
              message={state.message}
              success={state.success}
            />
          )}
          {errorMessage && (
            <NotificationAlert
              message={errorMessage}
              success={false}
              className="mb-4"
            />
          )}
          <Button variant={`secondary`} className='flex w-full justify-center gap-3' onClick={() => handleGoogleSignIn(setErrorMessage)}>
            <img src="google_logo.png" alt="Google logo" width={20} height={20} />
            Continue with Google
          </Button>
        </div>

        <div className="flex items-center justify-center flex-row">
          <div className="flex items-stretch justify-start h-[1px] border w-full"></div>
          <p className="text-center my-3 mx-3">or</p>
          <div className="flex items-stretch justify-start h-[1px] border w-full"></div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(signup)} className="grid w-full items-center gap-4">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>Password</FormLabel>
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PendingButton text="Sign up" />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className='text-sm'>
          Do you already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
