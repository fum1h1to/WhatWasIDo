import { createContext, useState, useContext, useLayoutEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User, deleteUser, browserLocalPersistence, browserSessionPersistence, setPersistence } from "firebase/auth";
import { firebaseAuth, firebaseDB } from '../index'
import { useNavigate } from 'react-router-dom';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { useDBContext } from '../db/DBProvider';
import UserScheduleData from '../../../data/UserScheduleData';

type AuthContextType = {
  loginUserId: string | null;
  email: string;
  authLoading: boolean;
  signup: (email: string, password: string, confirmPassword: string) => void;
  login: (email: string, password: string, remember: boolean) => void;
  logout: () => void;
  deleteAccount: () => void;
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
    const [email, setEmail] = useState("");
    const { appointData, setAppointData } = useDBContext();

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
            setEmail(email);

            const userInitialData: UserScheduleData = {
              appointData: [],
              email: email,
              uid: user.uid
            }
          
            setDoc(doc(firebaseDB, "users", user.uid), userInitialData)
              .then(() => {
                navigate("/app", { replace: true});
              })
              .catch((error) => {
                alert("DBでエラーがおきました。")
              });
          }
        })
        .catch((error) => {
          alert("エラーが起きました。");
          console.log(error);
        });
    };

    const login = (email: string, password: string, remember: boolean) => {
      let however;
      if (remember) {
        however = browserLocalPersistence;
      } else {
        however = browserSessionPersistence;
      }
      setPersistence(firebaseAuth, however).then(() => {
        signInWithEmailAndPassword(firebaseAuth, email, password)
          .then(() => {
            navigate("/app", { replace: true});
          })
          .catch(() => {
            alert("エラーが起きました。");
          });
        });
    };

    const logout = async () => {
      await signOut(firebaseAuth);
      navigate("/login", { replace: true });
    }

    const deleteAccount =  () => {
      const user = firebaseAuth.currentUser;
      if (user) {
        deleteDoc(doc(firebaseDB, "users", user.uid));
        deleteUser(user).then(() => {
          navigate("/login", { replace: true });
        }).catch((error) => {
          alert("errorがおきました。");
        })
      }
    }

    useLayoutEffect(() => {
      onAuthStateChanged(firebaseAuth, async (user) => {
        setAuthLoading(true);
        if (user) {
          setLoginUserId(user.uid);
          if (!appointData) {
            const docRef = doc(firebaseDB, "users", user.uid);
            await getDoc(docRef)
            .then((docSnap) => {
              if (docSnap.exists()) {
                setAppointData(docSnap.data().appointData);
                setEmail(docSnap.data().email);
              }
            });
          }
        }
        setAuthLoading(false);
      })
    }, [])
    
    return (
      <AuthContext.Provider 
        value={{
          loginUserId,
          authLoading,
          email,
          signup,
          login,
          logout,
          deleteAccount,
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