import { User } from '@/types/user.type';
import { create } from 'zustand';

export interface UserState {
  user: User,
  getUser: () => User,
  setUser: (userData: User) => void,
}

const userStore = create<UserState>((set, get) => ({
  user: {},
  getUser: () => get().user,
  setUser: (userData: User) => set((state) => ({ user: userData }))
}));

export default userStore;