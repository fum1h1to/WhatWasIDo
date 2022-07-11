import { AppointmentModel } from "@devexpress/dx-react-scheduler"

type ScheduleData = {
  // スケジュールのデータ
  appointData: AppointmentModel[];

  // ユーザーID
  uid: string;

  //共有しても良いか銅か
  sharing: boolean;
}

export default ScheduleData;