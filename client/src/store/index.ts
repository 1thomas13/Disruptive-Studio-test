import { create } from 'zustand';

export interface IUser {
  id: string;
  email: string;
  username: string;
  role: string;
  token: string;
}

interface UserState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;
