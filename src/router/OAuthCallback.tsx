import { useUserStore } from '@/stores/userStore';
import { getCurrentUser } from '@/utils/authUtils';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        useUserStore.getState().setUser(user);
        navigate('/training');
      } else {
        navigate('/sign-in', { state: { oauthError: 'Failed to sign in with Google. Please try again.' } });
      }
    };

    const urlParams = new URLSearchParams(location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    if (error) {
      navigate('/sign-in', { state: { oauthError: error, oauthErrorDescription: errorDescription } });
      return;
    }

    fetchUser();
  }, [location, navigate]);

  return null;
}

export default OAuthCallback;
