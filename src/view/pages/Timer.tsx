import { Grid } from "@mui/material";
import TimerCont from "../components/Timer/TimerCont";

export default function Timer() {
  return (
    <Grid container alignItems="center" direction="column">
      <Grid item>
        <TimerCont />
      </Grid>
      {/* <Grid item>
        <StopwatchCont />
      </Grid> */}
    </Grid>
  );
}