import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimerIcon from '@mui/icons-material/Timer';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import { Link } from "react-router-dom";

export const mainListItems = (
  <React.Fragment>
    <ListItemButton 
      component={Link}
      to="/app"
    >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton
      component={Link}
      to="/app/timer"
    >
      <ListItemIcon>
        <TimerIcon />
      </ListItemIcon>
      <ListItemText primary="Timer" />
    </ListItemButton>
    <ListItemButton
      component={Link}
      to="/app/stopwatch"
    >
      <ListItemIcon>
        <AvTimerIcon />
      </ListItemIcon>
      <ListItemText primary="StopWatch" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Share
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
  </React.Fragment>
);