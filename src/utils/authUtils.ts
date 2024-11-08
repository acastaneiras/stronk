import { supabase } from '@/utils/supabaseClient';

export const handleGoogleSignIn = async (setErrorMessage: (message: string | null) => void) => {
  setErrorMessage(null);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });

  if (error) {
    setErrorMessage('Failed to sign in with Google. Please try again.');
  }
};