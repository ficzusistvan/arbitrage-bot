import { LOGIN, REGISTER, LOGOUT } from "../actions/types";

export default function authReducer(state = { isLoggedIn: false, user: null }, action) {
  switch (action.type) {
    case LOGIN: {
      return { isLoggedIn: action.isLoggedIn, user: action.user };
    }
    case REGISTER: {
      return { isLoggedIn: action.isLoggedIn, user: action.user };
    }
    case LOGOUT: {
      return { isLoggedIn: action.isLoggedIn, user: null };
    }
    default:
      return state;
  }
}