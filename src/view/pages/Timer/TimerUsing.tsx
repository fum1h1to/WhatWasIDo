import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useTimer } from "use-timer";
import { zeroPadding } from "../../../utils";

import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { useAuthContext } from "../../../functional/firebase/auth/AuthProvider";
import { useDBContext } from "../../../functional/firebase/db/DBProvider";


export default function TimerUsing(props: {
  initialTime: number,
  timerOrStop: "Timer" | "Stopwatch",
  onEnd: () => void,
}) {
  const { loginUserId } = useAuthContext()
  const { appointData, updateAppointData } = useDBContext();
  const [ startTime, setStartTime ] = useState<Date>(new Date());
  const [ endTime, setEndTime ] = useState<Date | null>(null);
  const [ title, setTitle] = useState("無題");
  const [ memo, setMemo ] = useState("");

  const {
    time, start, pause, reset, status, advanceTime
  } = useTimer({
    autostart: true,
    initialTime: props.timerOrStop === "Timer" ? props.initialTime : 0,
    interval: 1000,
    endTime: props.timerOrStop === "Timer" ? 0 : null,
    timerType: props.timerOrStop === "Timer" ? 'DECREMENTAL' : "INCREMENTAL",
    onTimeOver: () => {
      setEndTime(new Date());
      alert("終了しました。");
      dataInputDialogHandleOpen();
    },
  });

  const [second, setSecound] = useState(0)
  const [minute, setMinute] = useState(0)
  const [hour, setHour] = useState(0)

  useEffect(() => {
    setSecound(time % 60);
    setMinute((time / 60 | 0) % 60);
    setHour(time / 3600 | 0);
  }, [time]);

  const [openCheckDialog, setOpenCheckDialog] = useState(false);
  const checkDialogHandleOpen = () => {
    setOpenCheckDialog(true);
  }
  const checkDialogHandleClose = () => {
    setOpenCheckDialog(false);
  }
  const checkDialogDisagree = () => {
    checkDialogHandleClose();
  }
  const checkDialogAgree = () => {
    setEndTime(new Date());
    pause();
    checkDialogHandleClose();
    dataInputDialogHandleOpen();
  }

  const [openDataInputDialog, setOpenDataInputDialog] = useState(false);
  const dataInputDialogHandleOpen = () => {
    setOpenDataInputDialog(true);
  }
  const dataInputDialogHandleClose = () => {
    setOpenDataInputDialog(false);
  }
  const dataInputDialogDisagree = () => {
    dataInputDialogHandleClose();
    props.onEnd();
  }
  const dataInputDialogAgree = () => {
    console.log(startTime, endTime);
    let data = Object.create(appointData);
    const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
    data = [...data, { id: startingAddedId, title: title, startDate: startTime, endDate: endTime, notes: memo }];
    updateAppointData(loginUserId, data);
    dataInputDialogHandleClose();
    props.onEnd();
  }

  const stopTimer = () => {
    checkDialogHandleOpen();
  }

  return (
    <div>
      <div style={{ fontSize: "100px" }}>
        <span>{zeroPadding(hour, 2)}</span>:<span>{zeroPadding(minute, 2)}</span>:<span>{zeroPadding(second, 2)}</span>
      </div>
      <Button 
          onClick={stopTimer} 
          variant="contained" 
          startIcon={<DoDisturbIcon />}
        >
          Stop
      </Button>
      <Dialog
        open={openCheckDialog}
        onClose={checkDialogHandleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {"本当に終わりますか？"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={checkDialogDisagree} autoFocus>Disagree</Button>
          <Button onClick={checkDialogAgree} >Agree</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDataInputDialog}
        onClose={dataInputDialogHandleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {"データを入力してください。"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="title"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => setTitle(event.target.value)}
          />
          <TextField
            margin="dense"
            id="memo"
            label="memo"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => setMemo(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={dataInputDialogDisagree} autoFocus>破棄する</Button>
          <Button onClick={dataInputDialogAgree} >OK!</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}