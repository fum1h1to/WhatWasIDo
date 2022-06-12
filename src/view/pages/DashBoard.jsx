import React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Toolbar,
  ViewSwitcher,
  Appointments,
  DateNavigator,
  TodayButton,
  AppointmentTooltip,
} from '@devexpress/dx-react-scheduler-material-ui';

const currentDate = '2022-06-06';
const schedulerData = [
  { startDate: '2022-06-06T09:45', endDate: '2022-06-06T11:00', title: 'Meeting' },
  { startDate: '2022-06-06T12:00', endDate: '2022-06-06T13:30', title: 'Go to a gym' },
];

export default function DashBoard() {

  return (
    <Paper>
      <Scheduler
        data={schedulerData}
      >
        <ViewState
          defaultCurrentDate={currentDate}
        />
         <DayView
          startDayHour={7}
          endDayHour={23}
        />
        <WeekView
          startDayHour={7}
          endDayHour={23}
        />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <Appointments />
        <AppointmentTooltip />
      </Scheduler>
    </Paper>
  );
}