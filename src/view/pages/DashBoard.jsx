import { useEffect, useState } from 'react';
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
import { useAuthContext } from '../../firebase/auth/AuthProvider';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { firebaseDB } from '../../firebase/index';

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
  const { loginUserId, userScheduleData } = useAuthContext();
  const [scheduleData, setScheduleData] = useState(userScheduleData.appointData);
  
  const commitChanges = ({ added, changed, deleted }) => {
    setScheduleData(() => {
      let data = Object.create(scheduleData);
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
      
      data.map(appointment => {
        appointment.startDate = new Date(appointment.startDate).toISOString();
        if (appointment.endDate) {
          appointment.endDate = new Date(appointment.endDate).toISOString();
        }
      });
      updateDoc(doc(firebaseDB, "users", loginUserId), {appointData: data})
        .then(() => {
          alert("更新成功！");
        })
        .catch((error) => {
          alert("DBでエラーがおきました。")
        });
      return data;
    });
  }

  return (
    <Paper>
      <Scheduler
        data={scheduleData}
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