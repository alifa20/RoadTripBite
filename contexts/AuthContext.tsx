import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextData {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInAnonymously: () => Promise<FirebaseAuthTypes.UserCredential>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Verify Firebase is initialized
    if (!auth().app) {
      console.error("Firebase not initialized!");
    }

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signInAnonymously =
    async (): Promise<FirebaseAuthTypes.UserCredential> => {
      try {
        return await auth().signInAnonymously();
      } catch (error) {
        throw error;
      }
    };

  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        forgotPassword,
        signInAnonymously,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
