import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';

const indexedDBStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

interface UserState {
  user: object | null;
  isUserSetupComplete: boolean;
  setUser: (user: object) => void;
  setIsUserSetupComplete: (status: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isUserSetupComplete: false,
      setUser: (user) => set({ user }),
      setIsUserSetupComplete: (status) => set({ isUserSetupComplete: status }),
    }),
    {
      name: 'userStore',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
