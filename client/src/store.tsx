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
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      // define initial logged in state
      token: AuthService.getToken() || null,

      login: (token) => {
        console.log("logging in with token:", token);
        AuthService.login(token);
        set({ token: token, isAuthenticated: true });
        console.log(
          "updated state from login in store is",
          useAuthStore.getState()
        );
      },

      isAuthenticated: AuthService.loggedIn(),

      logout: () => {
        AuthService.logout();
        set({ isAuthenticated: false });
      },
    }),
    { name: "AuthStore-state" }
  )
);
