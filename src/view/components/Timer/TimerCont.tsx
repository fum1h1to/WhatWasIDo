import { Box, Button, Dialog, DialogActions, DialogTitle, Divider, Fade, Modal, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useTimer } from "use-timer";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useAuthContext } from "../../../firebase/auth/AuthProvider";
import { useDBContext } from "../../../firebase/db/DBProvider";
import { zeroPadding } from "../../../utils";
import TimerUsing from "./TimerUsing";

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function TimerCont() {

  const [second, setSecound] = useState(0)
  const [minute, setMinute] = useState(3)
  const [hour, setHour] = useState(0)

  const [openTimerModal, setOpenTimerModal] = useState(false);
  const timerModalHandleClose = () => {
    setOpenTimerModal(false);
  }
  const timerModalHandleOpen = () => {
    setOpenTimerModal(true);
  }

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
    checkDialogHandleClose();
    timerModalHandleClose();
  }

  const startTimer = () => {
    timerModalHandleOpen();
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "100px" }}>
        <span>{zeroPadding(hour, 2)}</span>:<span>{zeroPadding(minute, 2)}</span>:<span>{zeroPadding(second, 2)}</span>
      </div>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button 
          onClick={startTimer}
          variant="contained"
          startIcon={<PlayCircleOutlineIcon />}
        >
          Start
        </Button>
      </Stack>
      <Box
        sx={{mt: 5}}
      >
        <Stack
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <TextField 
            id="text-hour"
            label="hour"
            defaultValue="0"
            variant="outlined" 
            type="number" 
            inputProps={{ max: 23, min: 0, step: 1, pattern: "[0-9]*" }}
            onChange={(event) => setHour(Number(event.target.value))}
          />
          <TextField 
            id="text-minute" 
            label="minute"
            defaultValue="3"
            variant="outlined" 
            type="number" 
            inputProps={{ max: 59, min: 0, step: 1, pattern: "[0-9]*" }}
            onChange={(event) => setMinute(Number(event.target.value))}
          />
          <TextField 
            id="text-secound"
            label="secound" 
            defaultValue="0"
            variant="outlined" 
            type="number" 
            inputProps={{ max: 59, min: 0, step: 1, pattern: "[0-9]*" }}
            onChange={(event) => setSecound(Number(event.target.value))}
          />
        </Stack>
        <Modal
          open={openTimerModal}
          onClose={checkDialogHandleOpen}
        >
          <Box
            sx={modalStyle}
          >
            <TimerUsing
              initialTime={ (hour * 3600) + (minute * 60) + second }
              timerOrStop="Timer"
              onEnd={timerModalHandleClose}
            />
            <Dialog
              open={openCheckDialog}
              onClose={checkDialogHandleClose}
              aria-labelledby="alert-dialog-title"
            >
              <DialogTitle id="alert-dialog-title">
                {"本当に終わりますか？データは保存されません。"}
              </DialogTitle>
              <DialogActions>
                <Button onClick={checkDialogDisagree} autoFocus>Disagree</Button>
                <Button onClick={checkDialogAgree} >Agree</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Modal>
      </Box>
    </div>
  );
}