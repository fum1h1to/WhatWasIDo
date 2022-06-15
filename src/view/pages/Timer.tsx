import { CircularProgress, Grid } from "@mui/material";
import StopwatchCont from "../components/StopwatchCont";
import TimerCont from "../components/TimerCont";

export default function Timer() {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 600);
  return (
    <Grid container alignItems="center" direction="column">
      <Grid item>
        <TimerCont expiryTimestamp={time} />
      </Grid>
      <Grid item>
        <StopwatchCont />
      </Grid>
    </Grid>
  );
}