import { createContext, useState, useContext, useCallback, useLayoutEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, UserCredential } from "firebase/auth";
import { firebaseAuth } from '../index'

type AuthContextType = {
  loginUserId: string | null;
  authLoading: boolean;
  signup: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuthContext() { 
  return useContext(AuthContext);
}

export function AuthProvider({ children }: {
    children?: React.ReactNode;
  }) {
    const [loginUserId, setLoginUserId] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const signup = useCallback((email: string, password: string) => {
      return createUserWithEmailAndPassword(firebaseAuth, email, password);
    }, []);

    const login = useCallback((email: string, password: string) => {
      return signInWithEmailAndPassword(firebaseAuth, email, password);
    }, []);

    useLayoutEffect(() => {
      onAuthStateChanged(firebaseAuth, (user) => {
        setAuthLoading(true);
        if (user) {
          setLoginUserId(user.uid);
        }
        setAuthLoading(false);
      })
    }, [])
    
    return (
      <AuthContext.Provider 
        value={{
          loginUserId,
          authLoading,
          signup,
          login
        }}
      >
        {!authLoading && children}
      </AuthContext.Provider>
    );
}