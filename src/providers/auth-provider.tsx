
"use client";

import { useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthContext, type AuthContextType } from '@/hooks/use-auth';
import { type SignUpForm, type SignInForm } from '@/types/auth';


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = (data: SignUpForm) => {
    return createUserWithEmailAndPassword(auth, data.email, data.password);
  };

  const signIn = (data: SignInForm) => {
    return signInWithEmailAndPassword(auth, data.email, data.password);
  };

  const logOut = () => {
    return signOut(auth);
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut: logOut,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
