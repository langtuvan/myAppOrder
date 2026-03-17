"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import axiosInstance, { endpoints } from "@/utils/axios";
import {
  IAuthContext,
  IAuthState,
  AuthAction,
  ILoginResponse,
  IRegisterRequest,
} from "@/types/auth.types";

const STORAGE_KEY = "accessToken";
const CURRENT_FACULTY = "currentFaculty";

// ----------------------------------------------------------------------

const initialState: IAuthState = {
  user: null,
  menu: [],
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
};

const authReducer = (state: IAuthState, action: AuthAction): IAuthState => {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        user: action.payload.user,
        menu: action.payload.menu,
        isAuthenticated: !!action.payload.user,
        isInitialized: true,
        isLoading: false,
      };
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        menu: action.payload.menu,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        menu: [],
        isAuthenticated: false,
        isLoading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        isLoading: false,
        user: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize - check if user is logged in
  const initialize = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const accessToken = await localStorage.getItem(STORAGE_KEY);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      const response = await axiosInstance.post<ILoginResponse>(
        endpoints.auth.me,
      );
      const { user, menu } = response.data;

      //const currentFaculty = await localStorage.getItem(CURRENT_FACULTY);

      dispatch({
        type: "INITIALIZE",
        payload: {
          user,
          menu,
        },
      });
    } catch (error) {
      dispatch({
        type: "INITIALIZE",
        payload: { user: null, menu: [] },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await axiosInstance.post<ILoginResponse>(
        endpoints.auth.login,
        [email, password],
      );

      const { user, menu, accessToken } = response.data;

      // Store token in local storage and set axios headers
      await localStorage.setItem(STORAGE_KEY, accessToken);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      dispatch({
        type: "LOGIN",
        payload: { user, menu },
      });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await axiosInstance.post(endpoints.auth.logout);
      // Remove token from local storage and axios headers
      await localStorage.removeItem(STORAGE_KEY);
      axiosInstance.defaults.headers.common.Authorization = `Bearer `;
    } catch (error) {
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  // Register
  const register = useCallback(async (data: IRegisterRequest) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await axiosInstance.post<ILoginResponse>(
        "/auth/register",
        data,
      );

      const { user, menu } = response.data;

      dispatch({
        type: "LOGIN",
        payload: { user, menu },
      });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  }, []);

  // Check Auth
  const checkAuth = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    const accessToken = await localStorage.getItem(STORAGE_KEY);

    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    try {
      const response = await axiosInstance.post<ILoginResponse>(
        endpoints.auth.me,
      );
      const { user, menu } = response.data;

      dispatch({
        type: "INITIALIZE",
        payload: { user, menu },
      });
    } catch (error) {
      dispatch({ type: "LOGOUT" });
      throw error;
    }
  }, []);

  // Permission Helpers
  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      if (!state.user?.role?.permissions) return false;

      return state.user.role.permissions.some(
        (permission: any) =>
          //permission.resource === resource &&
          permission.action === action && permission.isActive,
      );
    },
    [state.user],
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      if (!state.user?.role?.permissions) return false;

      return permissions.some((perm) => {
        const [resource, action] = perm.split(":");
        return hasPermission(resource, action);
      });
    },
    [state.user, hasPermission],
  );

  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      if (!state.user?.role?.permissions) return false;

      return permissions.every((perm) => {
        const [resource, action] = perm.split(":");
        return hasPermission(resource, action);
      });
    },
    [state.user, hasPermission],
  );

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      ...state,
      login,
      logout,
      register,
      checkAuth,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      //
    }),
    [
      state,
      login,
      logout,
      register,
      checkAuth,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      //
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
