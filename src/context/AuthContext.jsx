import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('aegis_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('aegis_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock API call for login
  const login = async (email, password) => {
    setError(null);
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (email && password.length >= 6) {
      const userData = {
        id: Date.now(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      };

      setUser(userData);
      localStorage.setItem('aegis_user', JSON.stringify(userData));
      localStorage.setItem('aegis_token', 'mock_token_' + Date.now());
      setIsLoading(false);
      return { success: true };
    } else {
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
      return { success: false, error: 'Invalid credentials' };
    }
  };

  // Mock API call for registration
  const register = async (userData) => {
    setError(null);
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (userData.email && userData.password.length >= 6 && userData.password === userData.confirmPassword) {
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        createdAt: new Date().toISOString()
      };

      setUser(newUser);
      localStorage.setItem('aegis_user', JSON.stringify(newUser));
      localStorage.setItem('aegis_token', 'mock_token_' + Date.now());
      setIsLoading(false);
      return { success: true };
    } else {
      if (userData.password !== userData.confirmPassword) {
        setError('Passwords do not match.');
      } else {
        setError('Registration failed. Please check your information.');
      }
      setIsLoading(false);
      return { success: false, error: error };
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('aegis_user');
    localStorage.removeItem('aegis_token');
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
