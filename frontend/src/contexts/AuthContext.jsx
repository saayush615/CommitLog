import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios';

// Create the authentication context
const AuthContext = createContext(null);

// AuthProvider component that will wrap our app
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Function to check authentication status on app load
    const checkAuth = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`,{
            withCredentials: true // Ensures cookies/session credentials are sent with cross-origin requests for authentication
          });

          if (response.data.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          }
        } catch (error) {
          setUser(null);
          setIsAuthenticated(false);
        }finally {
          setIsLoading(false);

        }
    }

    // Function to handle login (call after succesful login)
    const login = (userData) => { 
      setUser(userData);
      setIsAuthenticated(true);
     };

    //  function to handle logout
    const logout = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`,{
          withCredentials: true
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        setUser(null);
        setIsAuthenticated(false);
      }
    }

      // Check authentication when the app loads
    useEffect(() => {
      checkAuth();
    }, []);

    // Context value that will be available to all children
    const value = {
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      checkAuth
    };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
