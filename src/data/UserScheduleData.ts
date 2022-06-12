import { AppointmentModel } from "@devexpress/dx-react-scheduler"

export type UserScheduleData = {
  appointData: AppointmentModel[];
  email: String;
  uid: String;
}