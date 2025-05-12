
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type UserRole = 'student' | 'faculty' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: 'student1',
    email: 'student@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'student' as UserRole,
    profileImage: 'https://i.pravatar.cc/150?img=57'
  },
  {
    id: 'faculty1',
    email: 'faculty@example.com',
    password: 'password123',
    name: 'Dr. Sarah Thomas',
    role: 'faculty' as UserRole,
    profileImage: 'https://i.pravatar.cc/150?img=26'
  },
  {
    id: 'admin1',
    email: 'admin@example.com',
    password: 'password123',
    name: 'Admin User',
    role: 'admin' as UserRole,
    profileImage: 'https://i.pravatar.cc/150?img=3'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user info on app load
    const storedUser = localStorage.getItem('smartMentorUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse stored user data');
        localStorage.removeItem('smartMentorUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    // Mock authentication for demo purposes
    const foundUser = MOCK_USERS.find(user => 
      user.email === email && user.password === password && user.role === role
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('smartMentorUser', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      navigate(`/${role}-dashboard`);
    } else {
      toast.error('Invalid email, password, or role combination');
    }
    
    setLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smartMentorUser');
    toast.info('You have been logged out');
    navigate('/signin');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
