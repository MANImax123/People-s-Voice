import { useState, useEffect, useContext, createContext } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { type SignUpForm, type SignInForm } from '@/types/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (data: SignUpForm) => Promise<any>;
  signIn: (data: SignInForm) => Promise<any>;
  signOut: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
