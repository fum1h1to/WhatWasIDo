import { Grid } from "@mui/material";
import { memo } from "react";
import TimerCont from "./TimerCont";

const Timer = memo(() => {
  return (
    <Grid container alignItems="center" direction="column">
      <Grid item>
        <TimerCont />
      </Grid>
    </Grid>
  );
})
export default Timer;