import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeightUnit } from '@/models/ExerciseSet';
import { Intensity } from '@/models/Intensity';
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal';
import { useUserStore } from '@/stores/userStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { supabase } from '@/utils/supabaseClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader, LogOut, SaveIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  alias: z.string().optional(),
  unitPreference: z.enum(['kg', 'lb']),
  intensitySetting: z.enum(['rpe', 'rir', 'none']),
});

type UserFormInputs = z.infer<typeof schema>;

interface UserSettingsModalProps {
  isOpen: boolean;
  setShowUserSettingsModal: (show: boolean) => void;
}

function UserSettingsModal({ isOpen, setShowUserSettingsModal }: UserSettingsModalProps) {
  const { user, setUser } = useUserStore();
  const { workout, convertAllWorkoutUnits } = useWorkoutStore();
  const { setTheme, theme } = useTheme();
  const queryClient = useQueryClient();


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
    if (user) {
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('alias', user.alias || '');
      setValue('unitPreference', user.unitPreference || 'kg');
      setValue('intensitySetting', user.intensitySetting as Intensity || 'none');
    }
  }, [user, setValue]);

  const onSubmit = async (data: UserFormInputs) => {
    const { data: updatedUser, error } = await supabase
      .from('Users')
      .update(data)
      .eq('id', user?.id)
      .select();

    if (error) {
      toast.error('An error occurred while saving your settings.');
      return;
    }

    setUser(updatedUser?.[0]);
    toast.success('Settings updated successfully!');
    setShowUserSettingsModal(false);

    //Check if user has a ongoing workout and update it's units
    if (workout) {
      convertAllWorkoutUnits();
    }
  };

  const handleLogOut = async () => {
    const {error } = await supabase.auth.signOut();
    if (error) {
      toast.error('An error occurred while logging out.');
      return;
    }
    queryClient.clear();
  };

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setShowUserSettingsModal}
      dismissable={true}
      title="Settings"
      description="Update your preferences below."
      footer={
        <div className="flex flex-col md:flex-row gap-4">
          <Button type="submit" form="userSettingsForm" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader className="animate-spin h-16 w-16 text-gray-700 text-center dark:text-gray-300" />}
            <SaveIcon />
            Save settings
          </Button>
          <Button variant="destructive" className="w-full flex items-center gap-2" onClick={handleLogOut}>
            <LogOut />
            Log out
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form
          id="userSettingsForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full items-center gap-4"
        >
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
                <FormLabel>
                  Unit System <span className="text-red-600">*</span>
                </FormLabel>
                <Tabs
                  defaultValue={form.getValues('unitPreference')}
                  onValueChange={(value) => form.setValue('unitPreference', value as WeightUnit)}
                >
                  <TabsList>
                    <TabsTrigger value="kg">Kilograms</TabsTrigger>
                    <TabsTrigger value="lb">Pounds</TabsTrigger>
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
                <Tabs
                  defaultValue={form.getValues('intensitySetting')}
                  onValueChange={(value) => form.setValue('intensitySetting', value as Intensity)}
                >
                  <TabsList>
                    <TabsTrigger value="rpe">RPE</TabsTrigger>
                    <TabsTrigger value="rir">RIR</TabsTrigger>
                    <TabsTrigger value="none">None</TabsTrigger>
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
                <FormLabel>Theme</FormLabel>
                <Tabs defaultValue={theme}>
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

export default UserSettingsModal;
