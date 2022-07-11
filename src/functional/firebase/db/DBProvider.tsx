import { createContext, useState, useContext } from 'react';
import { firebaseDB } from '../index';
import { collection, doc, getDoc, getDocs, query, runTransaction, updateDoc, where } from 'firebase/firestore';
import { AppointmentModel } from '@devexpress/dx-react-scheduler';
import { useRootContext } from '../../../view/templates/App';

/**
 * DBContextのタイプとそれを子コンポーネントで使えるようにするための処理
 */
type DBContextType = {
  appointData: AppointmentModel[] | undefined;
  isDarkMode: boolean;
  sharing: boolean;
  setAppointData: (data: AppointmentModel[] | undefined) => void;
  setIsDarkMode: (darkMode: boolean) => void;
  setSharing: (sharing: boolean) => void;
  updateIsDarkMode: (userId: string | null, data: boolean) => Promise<void>;
  updateSharing: (scheduleId: string | null, data: boolean) => Promise<void>;
  updateAppointData: (useId: string | null, data: AppointmentModel[]) => Promise<void>;
  searchUser: (email: string) => Promise<{ uid: string | null, scheduleId: string | null } | null>;
  getOtherUserAppointData: (otherScheduleId: string | null) => Promise<AppointmentModel[]>;
}

const DBContext = createContext<DBContextType>({} as DBContextType);

export function useDBContext() { 
  return useContext(DBContext);
}

/**
 * firestoreとの処理周りを子コンポーネントに提供
 * @param children
 * @returns 
 */
export function DBProvider({ children }: {
    children?: React.ReactNode;
  }) {
    const { setColorMode, setIsLoading } = useRootContext();

    // ユーザーのスケジュールデータ
    const [appointData, setAppointData] = useState<AppointmentModel[] | undefined>(undefined);

    // ユーザーのモードがダークモードかそうじゃないか
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    // ユーザー自信のデータを共有しても良いかダメか。
    const [sharing, setSharing] = useState<boolean>(false);

    /**
     * データの共有の更新についてfirestoreに反映
     * @param scheduleId 
     * @param data 
     * @returns 
     */
    const updateSharing = async (scheduleId: string | null, data: boolean) => {
      if (scheduleId === "" || !scheduleId) {
        alert("DBに反映できませんでした。");
        console.error('scheduleIdがありません。');
        return;
      }
      setIsLoading(true);
      await updateDoc(doc(firebaseDB, "schedules", scheduleId), {sharing: data})
        .then(() => {
          setSharing(data);
        })
        .catch((error) => {
          alert("DBに反映できませんでした。");
          console.error(error);
        });

      setIsLoading(false);
    }

    /**
     * ダークモードかどうかをfirestoreに反映
     * @param userId 
     * @param data 
     * @returns 
     */
    const updateIsDarkMode = async (userId: string | null, data: boolean) => {
      if (userId === "" || !userId) {
        alert("DBに反映できませんでした。");
        console.error('userIdがありません。');
        return;
      }

      setIsLoading(true);
      await updateDoc(doc(firebaseDB, "users", userId), {isDarkMode: data})
        .then(() => {
          setIsDarkMode(data);
        })
        .catch((error) => {
          alert("DBに反映できませんでした。");
          console.error(error);
        });
      setColorMode(data ? 'dark' : 'light');
      setIsLoading(false);
    }

    /**
     * 他のユーザーのスケジュールデータをfirestoreから取得する
     * @param otherScheduleId 
     * @returns 
     */
    const getOtherUserAppointData = async (otherScheduleId: string | null) => {
      if (otherScheduleId === "" || !otherScheduleId) {
        throw 'otherScheduleIdの中身が空です。';
      }

      setIsLoading(true);
      const otherUserDocRef = doc(firebaseDB, 'schedules', otherScheduleId);
      const otherUserDocSnap = await getDoc(otherUserDocRef);
      setIsLoading(false);
      if (!otherUserDocSnap.exists()) {
        throw 'DBでエラーが起こりました。';
      }

      return otherUserDocSnap.data().appointData;
    }

    /**
     * スケジュールデータの更新
     * @param scheduleId 
     * @param data 
     * @returns 
     */
    const updateAppointData = async (scheduleId: string | null, data: AppointmentModel[]) => {
      if (scheduleId === "" || !scheduleId) {
        alert("DBに反映できませんでした。");
        console.error('scheduleIdがありません。');
        return;
      }

      setIsLoading(true);
      data.map(appointment => {
        appointment.startDate = new Date(appointment.startDate).toISOString();
        if (appointment.endDate) {
          appointment.endDate = new Date(appointment.endDate).toISOString();
        }
      });
      await updateDoc(doc(firebaseDB, "schedules", scheduleId), {appointData: data})
        .then(() => {
          setAppointData(data);
        })
        .catch((error) => {
          alert("DBに反映できませんでした。");
          console.error(error);
        });

      setIsLoading(false);
    }

    /**
     * emailからユーザーを検索
     * @param email 
     * @returns 
     */
    const searchUser = async (email: string) => {
      setIsLoading(true);

      const usersRef = collection(firebaseDB, "users");
      let result = null;
      await getDocs(query(usersRef, where('email', '==', email)))
      .then(snapshot => {
        snapshot.forEach(doc => {
          result = {
            uid: doc.id,
            scheduleId: doc.data().scheduleId,
          };
        });
      });
      
      setIsLoading(false);
      return result;
    }
    
    return (
      <DBContext.Provider 
        value={{
          appointData,
          isDarkMode,
          sharing,
          setAppointData,
          setIsDarkMode,
          setSharing,
          updateIsDarkMode,
          updateSharing,
          updateAppointData,
          searchUser,
          getOtherUserAppointData,
        }}
      >
        { 
          children
        }
      </DBContext.Provider>
    );
}