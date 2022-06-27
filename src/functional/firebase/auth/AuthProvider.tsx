import { createContext, useState, useContext, useLayoutEffect, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User, deleteUser, browserLocalPersistence, browserSessionPersistence, setPersistence } from "firebase/auth";
import { firebaseAuth, firebaseDB } from '../index'
import { useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, getDoc, runTransaction, setDoc } from 'firebase/firestore';
import { useDBContext } from '../db/DBProvider';
import UserData from '../../../data/UserData';
import ScheduleData from '../../../data/ScheduleData';
import { useMediaQuery } from '@mui/material';

type AuthContextType = {
  loginUserId: string | null;
  scheduleId: string | null;
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
    const [ loginUserId, setLoginUserId ] = useState<string | null>(null);
    const [ scheduleId, setScheduleId ] = useState<string | null>(null);
    const [ authLoading, setAuthLoading ] = useState(true);
    const [ email, setEmail ] = useState("");
    const { 
      appointData, setAppointData,
      isDarkMode, setIsDarkMode,
      sharing, setSharing,
    } = useDBContext();

    const navigate = useNavigate();

    const initDatas = () => {
      setScheduleId(null);
      setLoginUserId(null);
      setEmail("");
      setAppointData(undefined);
      setIsDarkMode(false);
      setSharing(false);
    }

    const signup = async (email: string, password: string, confirmPassword: string) => {
      if (email === "" || password === "" || confirmPassword === "") {
        alert("未入力の項目があります。");
        return;
      }
  
      if (password !== confirmPassword) {
        alert("パスワードが一致しません。もう一度お試しください。");
        return;
      }

      await createUserWithEmailAndPassword(firebaseAuth, email, password)
        .then(async (result) => {
          try {
            await runTransaction(firebaseDB, async (transaction) => {
              const user = result.user;
              if (user) {
                const usersDocRef = doc(firebaseDB, "users", user.uid);
                const schedulesDocRef = doc(collection(firebaseDB, "schedules"));

                const userInitialData: UserData = {
                  uid: user.uid,
                  email: email,
                  scheduleId: schedulesDocRef.id,
                  isDarkMode: false,
                }
                const scheduleInitialData: ScheduleData = {
                  appointData: [],
                  uid: user.uid,
                  sharing: false,
                }
  
                transaction.set(usersDocRef, userInitialData);
                transaction.set(schedulesDocRef, scheduleInitialData);

                setLoginUserId(user.uid);
                setEmail(email);
                setScheduleId(schedulesDocRef.id);
                setAppointData([]);
                setIsDarkMode(false);
                setSharing(false);
              } else {
                throw 'user error';
              }
            });

            navigate("/app", { replace: true });
          } catch (e) {
            alert("ユーザー情報をデータベースに書き込む際にエラーが起きました。");
            console.log(e);
          }
        })
        .catch((e) => {
          alert("ユーザー追加時にエラーが起きました。");
          console.log(e);
        });
    };

    const login = async (email: string, password: string, remember: boolean) => {
      let however;
      if (remember) {
        however = browserLocalPersistence;
      } else {
        however = browserSessionPersistence;
      }
      await setPersistence(firebaseAuth, however).then(() => {
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
      initDatas();
      navigate("/login", { replace: true });
    }

    const deleteAccount = async () => {
      const user = firebaseAuth.currentUser;
      if (user && scheduleId) {
        try {
          await runTransaction(firebaseDB, async (transaction) => {
            const usersDocRef = doc(firebaseDB, "users", user.uid);
            const schedulesDocRef = doc(firebaseDB, "schedules", scheduleId);

            transaction.delete(usersDocRef);
            transaction.delete(schedulesDocRef);
          });

          await deleteUser(user).then(() => {
            initDatas();
          });
          
          navigate("/login", { replace: true });
        } catch(e) {
          alert("削除出来ませんでした。");
          console.log(e);
        }
      } else {
        alert("削除できませんでした。");
      }
    }

    useLayoutEffect(() => {
      onAuthStateChanged(firebaseAuth, async (user) => {
        setAuthLoading(true);
        if (user) {
          const userDocRef = doc(firebaseDB, "users", user.uid);
          await getDoc(userDocRef)
          .then(async (userDocSnap) => {
            if (userDocSnap.exists()) {
              setLoginUserId(user.uid);
              if (!scheduleId) {
                setScheduleId(userDocSnap.data().scheduleId);
              }
              if (email === "") {
                setEmail(userDocSnap.data().email);
              }
              setIsDarkMode(userDocSnap.data().isDarkMode);
              if (!appointData) {
                const schedulesDocRef = doc(firebaseDB, "schedules", userDocSnap.data().scheduleId);
                await getDoc(schedulesDocRef)
                .then((scheduleDosSnap) => {
                  if (scheduleDosSnap.exists()) {
                    setAppointData(scheduleDosSnap.data().appointData);
                    setSharing(scheduleDosSnap.data().sharing);
                  }
                });
              }
            }
          });
        }
        setAuthLoading(false);
      })
    }, [])
    
    return (
      <AuthContext.Provider 
        value={{
          loginUserId,
          scheduleId,
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