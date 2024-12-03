import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import NotificationAlert from '@/shared/AlertMessage';
import PendingButton from '@/shared/PendingButton';
import { handleGoogleSignIn, handleSignIn } from '@/utils/authUtils';
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    if (state?.oauthError) {
      setErrorMessage(`${state.oauthError} ${state.oauthErrorDescription}`);
    }
  }, [state]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const success = await handleSignIn(data.email, data.password, setErrorMessage);
    if (success) {
      navigate('/training');
    }
  };

  return (
    <Card className="w-full md:w-1/3 m-2">
      <CardHeader>
        <CardTitle className="text-3xl">Sign in</CardTitle>
        <CardDescription>to continue to Stronk</CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <NotificationAlert
            message={errorMessage}
            success={false}
            className="mb-4"
          />
        )}
        <div className='flex flex-col gap-4 '>
          <Button className='flex w-full justify-center gap-3' onClick={() => handleGoogleSignIn(setErrorMessage)}>
            <img src="/google_logo.png" alt="Google logo" width={20} height={20} />
            Continue with Google
          </Button>
        </div>

        <div className="flex items-center justify-center flex-row">
          <div className="flex items-stretch justify-start h-[1px] border w-full"></div>
          <p className="text-center my-3 mx-3">or</p>
          <div className="flex items-stretch justify-start h-[1px] border w-full"></div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full items-center gap-4">
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
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm hover:underline">
                Forgot password?
              </Link>
            </div>
            <PendingButton text="Sign in" />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className='text-sm'>
          You don&apos;t have an account? <Link to="/sign-up">Sign up</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
