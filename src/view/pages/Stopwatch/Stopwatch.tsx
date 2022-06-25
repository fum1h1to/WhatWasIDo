import { Grid } from "@mui/material";
import StopwatchCont from "./StopwatchCont";

export default function Stopwatch() {
  return (
    <Grid container alignItems="center" direction="column">
      <Grid item>
        <StopwatchCont />
      </Grid>
    </Grid>
  );
}