import { createContext, useState, useContext, useCallback, useLayoutEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, UserCredential, signOut } from "firebase/auth";
import { firebaseAuth } from '../index'
import { Navigate, useNavigate } from 'react-router-dom';

type AuthContextType = {
  loginUserId: string | null;
  authLoading: boolean;
  signup: (email: string, password: string, confirmPassword: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
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

    const navigate = useNavigate();

    const signup = (email: string, password: string, confirmPassword: string) => {
      if (email === "" || password === "" || confirmPassword === "") {
        alert("未入力の項目があります。");
        return;
      }
  
      if (password !== confirmPassword) {
        alert("パスワードが一致しません。もう一度お試しください。");
        return;
      }

      createUserWithEmailAndPassword(firebaseAuth, email, password)
        .then((result) => {
          const user = result.user;
          if (user) {
            setLoginUserId(user.uid);
            navigate("/app", { replace: true});
          }
        })
        .catch((error) => {
          alert("エラーが起きました。");
        });
    };

    const login = (email: string, password: string) => {
      signInWithEmailAndPassword(firebaseAuth, email, password)
        .then(() => {
          navigate("/app", { replace: true});
        })
        .catch(() => {
          alert("エラーが起きました。");
        });
    };

    const logout = async () => {
      await signOut(firebaseAuth);
      navigate("/", { replace: true });
    }

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
          login,
          logout
        }}
      >
        { authLoading ? (
            <></>
          ) : (
            children
          )
        }
      </AuthContext.Provider>
    );
}