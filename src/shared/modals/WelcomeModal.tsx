import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/context/SessionContext';
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal';
import { useUserStore } from '@/stores/userStore';
import { supabase } from '@/utils/supabaseClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  alias: z.string().optional(),
  unitPreference: z.enum(['kg', 'lb']),
  intensitySetting: z.enum(['rpe', 'rir', 'none']),
});

type UserFormInputs = z.infer<typeof schema>;

interface WelcomeModalProps {
  isOpen: boolean;
}

function WelcomeModal({ isOpen }: WelcomeModalProps) {
  const { setTheme } = useTheme();
  const { setIsUserSetupComplete, setUser } = useUserStore();
  const { session } = useSession();
  const form = useForm<UserFormInputs>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      alias: '',
      unitPreference: 'kg',
      intensitySetting: 'none',
    },
  });
  const { setValue } = form;

  useEffect(() => {
    if (session?.user.identities?.length) {
      const provider = session.user.identities[0].provider;
      if (provider === 'google') {
        const fullName = session.user.user_metadata?.full_name || '';
        const alias = session.user.user_metadata?.alias || fullName;

        if (fullName) {
          const [firstName, ...lastNameParts] = fullName.split(' ');
          const lastName = lastNameParts.join(' ');

          setValue('firstName', firstName);
          setValue('lastName', lastName);
          setValue('alias', alias);
        }
      }
    }
  }, [session, setValue]);

  const onSubmit = async (userData: UserFormInputs) => {
    if (!session?.user.id) return;

    const { data, error } = await supabase
      .from('Users')
      .update({ ...userData })
      .eq('id', session.user.id).select();

    if (error) {
      toast.error('An error occurred while saving user details');
      return;
    }
    setIsUserSetupComplete(true);
    setUser(data?.[0]);
    form.reset();
    toast.success('User details saved successfully!');
  };

  return (
    <ResponsiveModal
      open={isOpen}
      dismissable={false}
      title={`Welcome to Stronk!`}
      description={`Please fill out the following details to get started.`}
      footer={
        <Button type="submit" form="userForm" className="w-full">
          <SaveIcon />
          Save
        </Button>
      }
    >
      <Form {...form}>
        <form id="userForm" onSubmit={form.handleSubmit(onSubmit)} className="grid w-full items-center gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel>
                  First Name <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your first name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel>
                  Last Name <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your last name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alias"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel>Alias (optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your alias" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unitPreference"
            render={() => (
              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel asChild>
                  <div>
                    Unit System <span className="text-red-600">*</span>
                  </div>
                </FormLabel>
                <Tabs defaultValue="kg">
                  <TabsList>
                    <TabsTrigger value="kg" onClick={() => form.setValue('unitPreference', 'kg')}>
                      Kilograms
                    </TabsTrigger>
                    <TabsTrigger value="lb" onClick={() => form.setValue('unitPreference', 'lb')}>
                      Pounds
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="intensitySetting"
            render={() => (
              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel asChild>Intensity Setting</FormLabel>
                <Tabs defaultValue="none">
                  <TabsList>
                    <TabsTrigger value="rpe" onClick={() => form.setValue('intensitySetting', 'rpe')}>
                      RPE
                    </TabsTrigger>
                    <TabsTrigger value="rir" onClick={() => form.setValue('intensitySetting', 'rir')}>
                      RIR
                    </TabsTrigger>
                    <TabsTrigger value="none" onClick={() => form.setValue('intensitySetting', 'none')}>
                      None
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="theme"
            render={() => (
              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel asChild>Theme</FormLabel>
                <Tabs defaultValue="system">
                  <TabsList>
                    <TabsTrigger value="light" onClick={() => setTheme('light')}>
                      Light
                    </TabsTrigger>
                    <TabsTrigger value="dark" onClick={() => setTheme('dark')}>
                      Dark
                    </TabsTrigger>
                    <TabsTrigger value="system" onClick={() => setTheme('system')}>
                      System
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </ResponsiveModal>
  );
}

export default WelcomeModal;
