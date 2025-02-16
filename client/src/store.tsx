import { create } from "zustand";
import { persist } from "zustand/middleware";
import AuthService from "./utils/auth.js";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  isAdmin: false;
  password: string;
  email: string;
};

type SessionState = {
  user: User | null;
  userFromToken: (token: string) => void;
  clearSession: () => void;
};

export const useUserSession = create(
  persist<SessionState>(
    (set) => ({
      // initial user state
      user: null,

      // function to get the latest user data from the decoded token
      userFromToken: () => {
        const token = AuthService.getToken();
        if (token) {
          const userFromToken = AuthService.getProfile();
          set({ user: userFromToken });
        }
      },

      // clear user session
      clearSession: () => {
        AuthService.logout();
        set({ user: null });
      },
    }),
    { name: "User Session" }
  )
);

type AuthStore = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};
export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      // define initial logged in state
      isLoggedIn: false,

      login: () => {
        const token = AuthService.getToken();
        AuthService.login(token);
        set({ isLoggedIn: true });
      },
      logout: () => {
        AuthService.logout();
      },
    }),
    { name: "AuthStore-state" }
  )
);
