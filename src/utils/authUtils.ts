import { useUserStore } from '@/stores/userStore';
import { supabase } from '@/utils/supabaseClient';

export const handleGoogleSignIn = async (setErrorMessage: (message: string | null) => void) => {
  setErrorMessage(null);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: `${import.meta.env.VITE_APP_URL}/oauth-callback`,
    }
  });
  
  if (error) {
    setErrorMessage('Failed to sign in with Google. Please try again.');
  }
};

export const handleSignIn = async ( email: string, password: string, setErrorMessage: (message: string | null) => void) => {
  setErrorMessage(null);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    setErrorMessage(error.message);
  } else {
    const user = await getCurrentUser();
    if (user) {
      useUserStore.getState().setUser(user);
      return true;
    }
  }
  return false;
};

export const getCurrentUser = async () => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!authData || !authData.user) {
      console.warn("User is not logged in");
      return null;
    }

    const userId = authData.user.id;

    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    return userData;
  } catch (error) {
    console.error("Error while fetching user", error);
    throw error;
  }
};