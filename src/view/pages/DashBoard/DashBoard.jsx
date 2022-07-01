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
  AllDayPanel,
} from '@devexpress/dx-react-scheduler-material-ui';
import { Box, Modal } from '@mui/material';
import { useDBContext } from '../../../functional/firebase/db/DBProvider';
import { useAuthContext } from '../../../functional/firebase/auth/AuthProvider';
import style from './style.module.scss';

const FormOverlay = ({ visible, children, onHide }) => {
  return (
    <Modal 
      open={visible}
      onClose={onHide}
    >
      <Box sx={{bgcolor: 'background.paper'}} className={style.modal}>
        <Paper>
          { children }
        </Paper>
      </Box>
    </Modal>
  );
};

export default function DashBoard() {
  const { email, scheduleId } = useAuthContext()
  const { appointData, updateAppointData } = useDBContext();
  
  const commitChanges = ({ added, changed, deleted }) => {
    let data = Object.create(appointData);
    if (added) {
      const serialNum = data.length > 0 ? data[data.length - 1].serialNum + 1 : 0;
      const addedId = scheduleId + serialNum;
      data = [...data, { id: addedId, userName: email, serialNum: serialNum ,...added }];
    }
    if (changed) {
      data = data.map(appointment => (
        changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
    }
    if (deleted !== undefined) {
      data = data.filter(appointment => appointment.id !== deleted);
    }
    
    updateAppointData(scheduleId, data);
  }

  return (
    <Paper>
      <Scheduler
        data={appointData}
      >
        <ViewState
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
        <AllDayPanel />
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