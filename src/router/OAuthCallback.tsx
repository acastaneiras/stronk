import { useUserStore } from '@/stores/userStore';
import { getCurrentUser } from '@/utils/authUtils';
import { Navigate } from 'react-router-dom';

const OAuthCallback = () => {
  const fetchUser = async () => {
    const user = await getCurrentUser();
    if (user) {
      useUserStore.getState().setUser(user);
    }
  }
  fetchUser();
  return <>
    <Navigate to="/training" />;
  </>
}

export default OAuthCallback