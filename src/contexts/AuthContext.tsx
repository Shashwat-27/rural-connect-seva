import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  user_id: string;
  role: 'operator' | 'doctor' | 'admin';
  name: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userId: string, password: string, role: 'operator' | 'doctor') => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('telemedicine-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userId: string, password: string, role: 'operator' | 'doctor'): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Query user_auth table for login verification
      const { data: authData, error: authError } = await supabase
        .from('user_auth')
        .select('*')
        .eq('user_id', userId)
        .eq('role', role)
        .eq('is_active', true)
        .single();

      if (authError || !authData) {
        console.error('Authentication failed:', authError);
        return false;
      }

      // In a real app, you would hash and compare passwords
      // For demo purposes, we'll use simple comparison
      if (password === 'demo123') {
        // Get user details from appropriate table
        const tableName = role === 'operator' ? 'operators' : 'doctors';
        const columnName = role === 'operator' ? 'operator_id' : 'doctor_id';
        const { data: userData, error: userError } = await supabase
          .from(tableName)
          .select('*')
          .eq(columnName, userId)
          .single();

        if (userError || !userData) {
          console.error('User data fetch failed:', userError);
          return false;
        }

        const authenticatedUser: User = {
          id: userData.id,
          user_id: userId,
          role: role,
          name: userData.name,
          isAuthenticated: true,
        };

        setUser(authenticatedUser);
        localStorage.setItem('telemedicine-user', JSON.stringify(authenticatedUser));

        // Update last login
        await supabase
          .from('user_auth')
          .update({ last_login: new Date().toISOString() })
          .eq('user_id', userId);

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('telemedicine-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};