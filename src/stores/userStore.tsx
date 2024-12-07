import { User } from '@/models/User';
import { indexedDBStorage } from '@/utils/indexedDBStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface UserState {
  user: User | null;
  isUserSetupComplete: boolean | null;
  setUser: (user: User) => void;
  setIsUserSetupComplete: (status: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isUserSetupComplete: null,
      setUser: (user) => set({ user }),
      setIsUserSetupComplete: (status) => set({ isUserSetupComplete: status }),
    }),
    {
      name: 'userStore',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);