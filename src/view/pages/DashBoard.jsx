import { useState } from 'react';
import Paper from '@mui/material/Paper';
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
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
  ConfirmationDialog,
  AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';
import { Box, Modal } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
};

const FormOverlay = ({ visible, children, onHide }) => {
  return (
    <Modal 
      open={visible}
      onClose={onHide}
    >
      <Box sx={style}>
        <Paper>
          { children }
        </Paper>
      </Box>
    </Modal>
  );
};

export default function DashBoard() {
  const currentDate = '2022-06-06';
  const [schedulerData, setSchedulerData] = useState([
    { id: 0, startDate: '2022-06-06T09:45', endDate: '2022-06-06T11:00', title: 'Meeting' },
    { id: 1, startDate: '2022-06-06T12:00', endDate: '2022-06-06T13:30', title: 'Go to a gym' },
  ]);

  const commitChanges = ({ added, changed, deleted }) => {
    setSchedulerData(() => {
      let data = Object.create(schedulerData);
      if (added) {
        const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);
      }
      return data;
    });
  }

  return (
    <Paper>
      <Scheduler
        data={schedulerData}
      >
        <ViewState
          defaultCurrentDate={currentDate}
        />
        <EditingState
          onCommitChanges={commitChanges}
        />
        <IntegratedEditing />
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
        <ConfirmationDialog />
        <Appointments />
        <AppointmentTooltip
          showOpenButton
          showDeleteButton
        />
        <AppointmentForm
          overlayComponent={FormOverlay}
        />
      </Scheduler>
    </Paper>
  );
}