import { createContext, useState, useContext } from 'react';
import { firebaseDB } from '../index';
import { doc, updateDoc } from 'firebase/firestore';
import { AppointmentModel } from '@devexpress/dx-react-scheduler';

type DBContextType = {
  appointData: AppointmentModel[] | undefined;
  setAppointData: (data: AppointmentModel[]) => void;
  updateAppointData: (useId: string | null, data: AppointmentModel[]) => void; 
}

const DBContext = createContext<DBContextType>({} as DBContextType);

export function useDBContext() { 
  return useContext(DBContext);
}

export function DBProvider({ children }: {
    children?: React.ReactNode;
  }) {
    const [appointData, setAppointData] = useState<AppointmentModel[] | undefined>(undefined);

    const updateAppointData = (userId: string | null, data: AppointmentModel[]) => {
      if (userId === "" || !userId) {
        alert("エラー");
        return;
      }
      data.map(appointment => {
        appointment.startDate = new Date(appointment.startDate).toISOString();
        if (appointment.endDate) {
          appointment.endDate = new Date(appointment.endDate).toISOString();
        }
      });
      updateDoc(doc(firebaseDB, "users", userId), {appointData: data})
        .then(() => {
          setAppointData(data);
        })
        .catch((error) => {
          alert("DBでエラーがおきました。")
        });
    }
    
    return (
      <DBContext.Provider 
        value={{
          appointData,
          setAppointData,
          updateAppointData
        }}
      >
        { 
          children
        }
      </DBContext.Provider>
    );
}