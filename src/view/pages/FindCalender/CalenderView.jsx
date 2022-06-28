import { ViewState } from "@devexpress/dx-react-scheduler";
import { AllDayPanel, Appointments, AppointmentTooltip, DateNavigator, DayView, MonthView, Scheduler, TodayButton, Toolbar, ViewSwitcher, WeekView } from "@devexpress/dx-react-scheduler-material-ui";
import { Paper } from "@mui/material";


const CalenderView = (props) => {

  return (
    <Paper>
      <Scheduler
        data={props.appointData}
      >
        <ViewState />
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
        <AllDayPanel />
        <AppointmentTooltip />
      </Scheduler>
    </Paper>
  );
}

export default CalenderView;