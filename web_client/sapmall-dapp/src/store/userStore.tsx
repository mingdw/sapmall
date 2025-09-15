import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: string;
  isConnected: boolean;
  isLoggedIn: boolean;
  address: string;
  token: string;
}

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}));
