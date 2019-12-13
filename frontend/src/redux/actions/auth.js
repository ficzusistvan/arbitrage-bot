import { LOGIN, REGISTER, LOGOUT } from "./types";

export const login = (user) => ({
  type: LOGIN,
  isLoggedIn: true,
  user
});

export const register = (user) => ({
  type: REGISTER,
  isLoggedIn: true,
  user
});

export const logout = () => ({
  type: LOGOUT,
  isLoggedIn: false
});