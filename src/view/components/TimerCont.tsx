import { Box, Button, Dialog, DialogTitle, Divider, Fade, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useTimer } from "use-timer";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SettingsIcon from '@mui/icons-material/Settings';

function zeroPadding(num: number, digit: number): string {
  return ('0'.repeat(digit) + String(num)).slice( (-1 * digit) );
}

export default function TimerCont() {
  const [baseTime, setBaseTime] = useState(180);

  const {
    time, start, pause, reset, status
  } = useTimer({
    initialTime: baseTime,
    interval: 1000,
    endTime: 0,
    timerType: 'DECREMENTAL',
    onTimeOver: () => {
      alert("終了しました。");
    },
  });

  const [second, setSecound] = useState(0)
  const [minute, setMinute] = useState(3)
  const [hour, setHour] = useState(0)

  useEffect(() => {
    setSecound(time % 60);
    setMinute((time / 60 | 0) % 60);
    setHour(time / 3600 | 0);
  }, [time]);

  const [openSettingComp, setOpenSettingComp] = useState(false);
  const settingCompHandleToggle = () => {
    setOpenSettingComp(!openSettingComp);
  };

  const startTimer = () => {
    setBaseTime((hour * 3600) + (minute * 60) + second);
    start();
  }

  return (
    <div style={{ textAlign: "center" }}>
      <p>Timer Demo</p>
      <div style={{ fontSize: "100px" }}>
        <span>{zeroPadding(hour, 2)}</span>:<span>{zeroPadding(minute, 2)}</span>:<span>{zeroPadding(second, 2)}</span>
      </div>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button 
          onClick={startTimer}
          variant="contained"
          startIcon={<PlayCircleOutlineIcon />}
          disabled={status === 'RUNNING'}
        >
          Start
        </Button>
        <Button 
          onClick={reset} 
          variant="contained" 
          startIcon={<RestartAltIcon />}
        >
          Reset
        </Button>
        <Button
          onClick={settingCompHandleToggle}
          size="small"
          variant="contained"
          startIcon={<SettingsIcon />}
          disabled={status === 'RUNNING'}
        >
          setting
        </Button>
      </Stack>
      <Fade 
        in={openSettingComp} 
        style={{display: openSettingComp ? 'block' : 'none'}}
      >
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
        </Box>
      </Fade>
    </div>
  );
}