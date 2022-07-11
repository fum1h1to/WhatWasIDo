import { createContext, useState, useContext, useLayoutEffect, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User, deleteUser, browserLocalPersistence, browserSessionPersistence, setPersistence, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth, firebaseDB } from '../index'
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, runTransaction, } from 'firebase/firestore';
import { useDBContext } from '../db/DBProvider';
import UserData from '../../../data/UserData';
import ScheduleData from '../../../data/ScheduleData';
import { useRootContext } from '../../../view/templates/App';

/**
 * AuthContextのタイプとそれを子コンポーネントで使えるようにするための処理
 */
type AuthContextType = {
  loginUserId: string | null;
  scheduleId: string | null;
  email: string;
  signup: (email: string, password: string, confirmPassword: string) => Promise<void>;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
  googleSignin: (remember: boolean) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuthContext() { 
  return useContext(AuthContext);
}

/**
 * ユーザー認証周りの機能を子コンポーネントに提供
 * 
 * @param children
 * @returns 
 */
export function AuthProvider({ children }: {
    children?: React.ReactNode;
  }) {
    const { isAuthLoading, setIsAuthLoading } = useRootContext();
    const { setColorMode } = useRootContext();
    const { appointData, setAppointData, setIsDarkMode, setSharing } = useDBContext();
    const navigate = useNavigate();

    // ログインしているユーザのID
    const [ loginUserId, setLoginUserId ] = useState<string | null>(null);

    // ログインしているユーザーのスケジュールID
    const [ scheduleId, setScheduleId ] = useState<string | null>(null);

    // ログインしているユーザーのemail
    const [ email, setEmail ] = useState("");

    /**
     * 各stateの初期化
     */
    const initDatas = () => {
      setScheduleId(null);
      setLoginUserId(null);
      setEmail("");
      setAppointData(undefined);
      setIsDarkMode(false);
      setSharing(false);
    }

    /**
     * サインアップ処理
     * @param email 
     * @param password 
     * @param confirmPassword 
     * @returns 
     */
    const signup = async (email: string, password: string, confirmPassword: string) => {
      if (email === "" || password === "" || confirmPassword === "") {
        alert("未入力の項目があります。");
        return;
      }
  
      if (password !== confirmPassword) {
        alert("パスワードが一致しません。もう一度お試しください。");
        return;
      }
      
      setIsAuthLoading(true);
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
            alert("サインアップ出来ませんでした。");
            console.error(e);
            setIsAuthLoading(false);
          }
        })
        .catch((e) => {
          alert("サインアップ出来ませんでした。");
          console.error(e);
          setIsAuthLoading(false);
        });
    };

    /**
     * ログイン処理
     * @param email 
     * @param password 
     * @param remember 
     * @returns 
     */
    const login = async (email: string, password: string, remember: boolean) => {
      if (email === "" || password === "") {
        alert("未入力の項目があります。");
        return;
      }

      setIsAuthLoading(true);
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
          .catch((e) => {
            alert("ログインできませんでした。");
            console.error(e);
            setIsAuthLoading(false);
          });
        });
    };

    /**
     * ログアウト処理
     */
    const logout = async () => {
      setIsAuthLoading(true);
      await signOut(firebaseAuth);
      initDatas();
      navigate("/login", { replace: true });
    }

    /**
     * アカウントの削除処理
     */
    const deleteAccount = async () => {
      setIsAuthLoading(true);
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
          console.error(e);
          setIsAuthLoading(false);
        }
      } else {
        alert("削除できませんでした。");
        setIsAuthLoading(false);
      }
    }

    /**
     * googleでのサインアップ
     */
    const googleProvider = new GoogleAuthProvider();
    const googleSignin = async (remember: boolean) => {
      setIsAuthLoading(true);
      let however;
      if (remember) {
        however = browserLocalPersistence;
      } else {
        however = browserSessionPersistence;
      }

      await setPersistence(firebaseAuth, however).then(async () => {
        await signInWithPopup(firebaseAuth, googleProvider)
        .then(async (result) => {
          // const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential.accessToken;
          try {
            await runTransaction(firebaseDB, async (transaction) => {
              const user = result.user;
              if (user) {
                const isUserCreatedRef = doc(firebaseDB, "users", user.uid);
                const isUserCreatedDoc = await transaction.get(isUserCreatedRef);
                if (isUserCreatedDoc.exists()) {
  
                } else {
                  const usersDocRef = doc(firebaseDB, "users", user.uid);
                  const schedulesDocRef = doc(collection(firebaseDB, "schedules"));
  
                  const userInitialData: UserData = {
                    uid: user.uid,
                    email: (user.email ? user.email : ""),
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
                  setEmail((user.email ? user.email : ""));
                  setScheduleId(schedulesDocRef.id);
                  setAppointData([]);
                  setIsDarkMode(false);
                  setSharing(false);
                }
              } else {
                throw 'user error';
              }
            });
  
            navigate("/app", { replace: true });
          } catch (e) {
            alert("googleでサインアップできませんでした。");
            console.error(e);
            setIsAuthLoading(false);
          }
        }).catch((e) => {
          alert('googleでサインアップできませんでした。');
          console.error(e);
          setIsAuthLoading(false);
        });
      });
      
    }

    /**
     * ユーザがログインしているかどうかチェックし、
     * ログインしていたら、それに応じた処理をする。
     */
    useEffect(() => {
      onAuthStateChanged(firebaseAuth, async (user) => {

        setIsAuthLoading(true);
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
              setColorMode(userDocSnap.data().isDarkMode ? 'dark' : 'light');

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
        setIsAuthLoading(false);
      });
    }, []);
    
    return (
      <AuthContext.Provider 
        value={{
          loginUserId,
          scheduleId,
          email,
          signup,
          login,
          logout,
          googleSignin,
          deleteAccount,
        }}
      >
        { isAuthLoading ? (
          <></>
        ) : (
          children
        )}
      </AuthContext.Provider>
    );
}