import { createContext, useState, useContext } from 'react';
import { firebaseDB } from '../index';
import { collection, doc, getDoc, getDocs, query, runTransaction, updateDoc, where } from 'firebase/firestore';
import { AppointmentModel } from '@devexpress/dx-react-scheduler';
import { useThemeContext } from '../../../view/templates/AppRouter';

type DBContextType = {
  appointData: AppointmentModel[] | undefined;
  isDarkMode: boolean;
  sharing: boolean;
  setAppointData: (data: AppointmentModel[] | undefined) => void;
  setIsDarkMode: (darkMode: boolean) => void;
  setSharing: (sharing: boolean) => void;
  updateIsDarkMode: (userId: string | null, data: boolean) => void;
  updateSharing: (scheduleId: string | null, data: boolean) => void;
  updateAppointData: (useId: string | null, data: AppointmentModel[]) => void;
  searchUser: (email: string) => Promise<{ uid: string | null, scheduleId: string | null } | null>;
  getOtherUserAppointData: (otherScheduleId: string | null) => Promise<AppointmentModel[]>;
}

const DBContext = createContext<DBContextType>({} as DBContextType);

export function useDBContext() { 
  return useContext(DBContext);
}

export function DBProvider({ children }: {
    children?: React.ReactNode;
  }) {
    const { setColorMode } = useThemeContext();

    const [appointData, setAppointData] = useState<AppointmentModel[] | undefined>(undefined);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [sharing, setSharing] = useState<boolean>(false);

    const updateSharing = (scheduleId: string | null, data: boolean) => {
      if (scheduleId === "" || !scheduleId) {
        alert("エラー");
        return;
      }
      updateDoc(doc(firebaseDB, "schedules", scheduleId), {sharing: data})
        .then(() => {
          setSharing(data);
        })
        .catch((error) => {
          alert("DBでエラーがおきました。");
          console.log(error);
        });
    }

    const updateIsDarkMode = (userId: string | null, data: boolean) => {
      if (userId === "" || !userId) {
        alert("エラー");
        return;
      }
      updateDoc(doc(firebaseDB, "users", userId), {isDarkMode: data})
        .then(() => {
          setIsDarkMode(data);
        })
        .catch((error) => {
          alert("DBでエラーがおきました。");
          console.log(error);
        });
      setColorMode(data ? 'dark' : 'light');
    }

    const getOtherUserAppointData = async (otherScheduleId: string | null) => {
      if (otherScheduleId === "" || !otherScheduleId) {
        throw 'otherScheduleIdの中身が空です。';
      }
      const otherUserDocRef = doc(firebaseDB, 'schedules', otherScheduleId);
      const otherUserDocSnap = await getDoc(otherUserDocRef);
      if (!otherUserDocSnap.exists()) {
        throw 'DBでエラーが起こりました。';
      }

      return otherUserDocSnap.data().appointData;
    }

    const updateAppointData = (scheduleId: string | null, data: AppointmentModel[]) => {
      if (scheduleId === "" || !scheduleId) {
        alert("エラー");
        return;
      }
      data.map(appointment => {
        appointment.startDate = new Date(appointment.startDate).toISOString();
        if (appointment.endDate) {
          appointment.endDate = new Date(appointment.endDate).toISOString();
        }
      });
      updateDoc(doc(firebaseDB, "schedules", scheduleId), {appointData: data})
        .then(() => {
          setAppointData(data);
        })
        .catch((error) => {
          alert("DBでエラーがおきました。");
          console.log(error);
        });
    }

    const searchUser = async (email: string) => {
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