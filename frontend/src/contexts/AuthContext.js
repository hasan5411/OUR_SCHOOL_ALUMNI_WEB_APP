import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

// Auth context
const AuthContext = createContext(null);

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null
      };
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null
};

// Auth provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      dispatch({
        type: 'SET_USER',
        payload: JSON.parse(user)
      });
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authService.login(credentials);
      const { user, token } = response;
      
      authService.setCurrentUser(user, token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      const response = await authService.register(userData);
      
      dispatch({
        type: 'REGISTER_SUCCESS'
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: errorMessage
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check user role
  const hasRole = (role) => {
    return state.user?.roles?.name === role;
  };

  // Check if user is admin or authority
  const isAdmin = () => {
    const userRole = state.user?.roles?.name;
    return userRole === 'admin' || userRole === 'authority';
  };

  // Check if user is authority
  const isAuthority = () => {
    return state.user?.roles?.name === 'authority';
  };

  // Check if user is approved
  const isApproved = () => {
    return state.user?.is_approved === true;
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    hasRole,
    isAdmin,
    isAuthority,
    isApproved
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
