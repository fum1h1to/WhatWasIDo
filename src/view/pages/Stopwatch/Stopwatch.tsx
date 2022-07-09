import { Grid } from "@mui/material";
import { memo } from "react";
import StopwatchCont from "./StopwatchCont";

const Stopwatch = memo(() => {
  return (
    <Grid container alignItems="center" direction="column">
      <Grid item>
        <StopwatchCont />
      </Grid>
    </Grid>
  );
});
export default Stopwatch;