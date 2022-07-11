import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Modal, Slider, Stack, TextField } from "@mui/material";
import { memo, useEffect, useState } from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { zeroPadding } from "../../../utils";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { useAuthContext } from "../../../functional/firebase/auth/AuthProvider";
import { useDBContext } from "../../../functional/firebase/db/DBProvider";
import { useTimer } from "use-timer";

/**
 * ストップウォッチ本体
 */
const StopwatchCont = memo(() => {
  const { email, scheduleId } = useAuthContext()
  const { appointData, updateAppointData } = useDBContext();
  const {
    time, start, pause, reset, status
  } = useTimer({
    autostart: false,
    initialTime: 0,
    interval: 1000,
    endTime: null,
    timerType: "INCREMENTAL",
    onTimeOver: () => {
      setEndTime(new Date());
      dataInputDialogHandleOpen();
    },
  });

  // スタートした時間
  const [ startTime, setStartTime ] = useState<Date>(new Date());

  // 終了した時間
  const [ endTime, setEndTime ] = useState<Date | null>(null);

  // スケジュールのタイトル
  const [ title, setTitle] = useState("無題");

  // スケジュールのメモ
  const [ memo, setMemo ] = useState("");

  // 秒数
  const [ second, setSecound ] = useState(0);

  // 分数
  const [ minute, setMinute ] = useState(0);

  // 時間
  const [ hour, setHour ] = useState(0);

  /**
   * timeが更新されたら、表示する時間を更新
   */
  useEffect(() => {
    setSecound(time % 60);
    setMinute((time / 60 | 0) % 60);
    setHour(time / 3600 | 0);
  }, [time]);

  /**
   * ストップウォッチを止めるときに、本当に止めてよいかチェックする。
   */
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

  /**
   * スケジュールのタイトルとメモを入力させ、firestoreに今回の記録を反映。
   */
  const [openDataInputDialog, setOpenDataInputDialog] = useState(false);
  const dataInputDialogHandleOpen = () => {
    setOpenDataInputDialog(true);
  }
  const dataInputDialogHandleClose = () => {
    setOpenDataInputDialog(false);
  }
  const dataInputDialogDisagree = () => {
    dataInputDialogHandleClose();
    reset()
  }
  const dataInputDialogAgree = async () => {
    if (appointData) {
      let data = Object.create(appointData);
      const serialNum = data.length > 0 ? data[data.length - 1].serialNum + 1 : 0;
      const addedId = scheduleId + String(serialNum);
      data = [...data, { id: addedId, userName: email, serialNum: serialNum, title: title, startDate: startTime, endDate: endTime, notes: memo }];
      await updateAppointData(scheduleId, data);
    }
    dataInputDialogHandleClose();
    reset()
  }

  /**
   * ストップウォッチをスタート
   */
  const startStopwatch = () => {
    setStartTime(new Date())
    start();
  }

  /**
   * ストップウォッチを止める
   */
  const stopStopwatch = () => {
    checkDialogHandleOpen();
  }

  return (
    <div>
      <div style={{ fontSize: "100px" }}>
        <span>{zeroPadding(hour, 2)}</span>:<span>{zeroPadding(minute, 2)}</span>:<span>{zeroPadding(second, 2)}</span>
      </div>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button 
          onClick={startStopwatch}
          variant="contained"
          startIcon={<PlayCircleOutlineIcon />}
          disabled={status === 'RUNNING' ? true : false }
        >
          Start
        </Button>
        <Button 
          onClick={stopStopwatch} 
          variant="contained" 
          startIcon={<DoDisturbIcon />}
          disabled={status === 'RUNNING' ? false : true }
        >
          Stop
      </Button>
      </Stack>
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
});

export default StopwatchCont;