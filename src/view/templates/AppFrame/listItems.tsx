import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import { Link } from "react-router-dom";

/**
 * どこに遷移させるか
 */
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
        <AvTimerIcon />
      </ListItemIcon>
      <ListItemText primary="Timer" />
    </ListItemButton>
    <ListItemButton
      component={Link}
      to="/app/stopwatch"
    >
      <ListItemIcon>
        <TimerOutlinedIcon />
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
    <ListItemButton
      component={Link}
      to="/app/findCalender"
    >
      <ListItemIcon>
        <ContentPasteSearchIcon />
      </ListItemIcon>
      <ListItemText primary="Find Calendar" />
    </ListItemButton>
  </React.Fragment>
);