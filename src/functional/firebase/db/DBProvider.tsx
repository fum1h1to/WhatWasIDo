import { createContext, useState, useContext } from 'react';
import { firebaseDB } from '../index';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { AppointmentModel } from '@devexpress/dx-react-scheduler';

type DBContextType = {
  appointData: AppointmentModel[] | undefined;
  setAppointData: (data: AppointmentModel[]) => void;
  updateAppointData: (useId: string | null, data: AppointmentModel[]) => void;
  searchUser: (email: string) => Promise<string | null>;
}

const DBContext = createContext<DBContextType>({} as DBContextType);

export function useDBContext() { 
  return useContext(DBContext);
}

export function DBProvider({ children }: {
    children?: React.ReactNode;
  }) {
    const [appointData, setAppointData] = useState<AppointmentModel[] | undefined>(undefined);

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
          alert("DBでエラーがおきました。")
        });
    }

    const searchUser = async (email: string) => {
      const usersRef = collection(firebaseDB, "users");
      let result = null;
      await getDocs(query(usersRef, where('email', '==', email)))
      .then(snapshot => {
        snapshot.forEach(doc => {
          result = doc.id;
        });
      });
      
      return result;
    }
    
    return (
      <DBContext.Provider 
        value={{
          appointData,
          setAppointData,
          updateAppointData,
          searchUser,
        }}
      >
        { 
          children
        }
      </DBContext.Provider>
    );
}