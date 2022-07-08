import { ViewState } from "@devexpress/dx-react-scheduler";
import { AllDayPanel, Appointments, AppointmentTooltip, DateNavigator, DayView, MonthView, Resources, Scheduler, TodayButton, Toolbar, ViewSwitcher, WeekView } from "@devexpress/dx-react-scheduler-material-ui";
import { Paper } from "@mui/material";

const CalenderView = (props) => {

  return (
    <Paper>
      <Scheduler
        data={props.appointData}
      >
        <ViewState />
        <DayView
          startDayHour={0}
          endDayHour={24}
        />
        <WeekView
          startDayHour={0}
          endDayHour={24}
        />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <Appointments />
        <AllDayPanel />
        <AppointmentTooltip />
        <Resources 
          data={props.resources}
        />
      </Scheduler>
    </Paper>
  );
}

export default CalenderView;