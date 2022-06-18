import { Box, Button, Dialog, DialogActions, DialogTitle, Divider, Grid, Modal, Slider, Stack, TextField } from "@mui/material";
import { useState } from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
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

  const [second, setSecound] = useState(0);
  const [minute, setMinute] = useState(3);
  const [hour, setHour] = useState(0);

  const checkSecond = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const check = Number(event.target.value);
    if (check < 0) {
      setSecound(0);
      return;
    }
    if (check > 59) {
      setSecound(59);
      return;
    }
    setSecound(Math.floor(check));
  }

  const checkMinute = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const check = Number(event.target.value);
    if (check < 0) {
      setMinute(0);
      return;
    }
    if (check > 59) {
      setMinute(59);
      return;
    }
    setMinute(Math.floor(check));
  }

  const checkHour = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const check = Number(event.target.value);
    if (check < 0) {
      setHour(0);
      return;
    }
    if (check > 23) {
      setHour(23);
      return;
    }
    setHour(Math.floor(check));
  }

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
      <Grid container spacing={2} columns={8} sx={{mt: 5}} alignItems="center" >
        <Grid item xs={2} >
          <TextField
            fullWidth
            id="text-hour"
            label="hour"
            variant="outlined"
            type="number"
            value={hour}
            onChange={checkHour}
          />
        </Grid>
        <Grid item xs={6} >
          <Slider
            defaultValue={hour}
            valueLabelDisplay="auto"
            min={0}
            step={1}
            max={23}
            onChange={(e, value) => setHour(Number(value))}
          />
        </Grid>
        <Grid item xs={2} >
          <TextField
            fullWidth
            id="text-minute"
            label="minute"
            variant="outlined"
            type="number"
            value={minute}
            onChange={checkMinute}
          />
        </Grid>
        <Grid item xs={6} >
          <Slider
            defaultValue={minute}
            valueLabelDisplay="auto"
            min={0}
            step={1}
            max={59}
            onChange={(e, value) => setMinute(Number(value))}
          />
        </Grid>
        <Grid item xs={2} >
          <TextField
            fullWidth
            id="text-secound"
            label="secound"
            variant="outlined"
            type="number"
            value={second}
            onChange={checkSecond}
          />
        </Grid>
        <Grid item xs={6} >
          <Slider
            defaultValue={second}
            valueLabelDisplay="auto"
            min={0}
            step={1}
            max={59}
            onChange={(e, value) => setSecound(Number(value))}
          />
        </Grid>
      </Grid>
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
    </div>
  );
}