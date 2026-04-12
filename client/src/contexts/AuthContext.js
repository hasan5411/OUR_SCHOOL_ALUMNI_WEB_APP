import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_START = 'AUTH_START';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAILURE = 'AUTH_FAILURE';
const LOGOUT = 'LOGOUT';
const CLEAR_ERROR = 'CLEAR_ERROR';
const UPDATE_USER = 'UPDATE_USER';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AUTH_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set token in API headers
  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (state.token) {
        try {
          const response = await api.get('/auth/profile');
          dispatch({
            type: AUTH_SUCCESS,
            payload: {
              user: response.data.user,
              token: state.token,
            },
          });
        } catch (error) {
          dispatch({
            type: AUTH_FAILURE,
            payload: 'Session expired. Please login again.',
          });
        }
      } else {
        dispatch({
          type: AUTH_FAILURE,
          payload: null,
        });
      }
    };

    checkAuth();
  }, []); // Only run on mount

  // Login
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_START });
      const response = await api.post('/auth/login', credentials);
      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: message,
      });
      throw error;
    }
  };

  // Register
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_START });
      const response = await api.post('/auth/register', userData);
      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: message,
      });
      throw error;
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  // Update user profile
  const updateUser = (userData) => {
    dispatch({
      type: UPDATE_USER,
      payload: userData,
    });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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
