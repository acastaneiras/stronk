import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveModal } from '@/shared/ResponsiveModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSession } from '@/context/SessionContext';

const schema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  alias: z.string().optional(),
  unitSystem: z.enum(['kilograms', 'pounds']),
  intensitySetting: z.enum(['rpe', 'rir', 'none']),
  theme: z.enum(['light', 'dark', 'system']),
});

type UserFormInputs = z.infer<typeof schema>;

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const { session } = useSession();
  const form = useForm<UserFormInputs>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      alias: '',
      unitSystem: 'kilograms',
      intensitySetting: 'none',
      theme: 'light',
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

  const onSubmit = (data: UserFormInputs) => {
    console.log('Form Data:', data);
    onClose();
    // ToDo: Save user data to the database
  };

  return (
    <ResponsiveModal
      open={false}
      onOpenChange={onClose}
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
            name="unitSystem"
            render={() => (
              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel>
                  Unit System <span className="text-red-600">*</span>
                </FormLabel>
                <Tabs defaultValue="kilograms" className="w-[400px]">
                  <TabsList>
                    <TabsTrigger value="kilograms" onClick={() => form.setValue('unitSystem', 'kilograms')}>
                      Kilograms
                    </TabsTrigger>
                    <TabsTrigger value="pounds" onClick={() => form.setValue('unitSystem', 'pounds')}>
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
                <FormLabel>Intensity Setting</FormLabel>
                <Tabs defaultValue="none" className="w-[400px]">
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
            control={form.control}
            name="theme"
            render={() => (
              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel>Theme</FormLabel>
                <Tabs defaultValue="light" className="w-[400px]">
                  <TabsList>
                    <TabsTrigger value="light" onClick={() => form.setValue('theme', 'light')}>
                      Light
                    </TabsTrigger>
                    <TabsTrigger value="dark" onClick={() => form.setValue('theme', 'dark')}>
                      Dark
                    </TabsTrigger>
                    <TabsTrigger value="system" onClick={() => form.setValue('theme', 'system')}>
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
