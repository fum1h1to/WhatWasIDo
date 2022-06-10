import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';

function whichSigninSignup(isSignUp: boolean) {
  if (isSignUp) {
    return <SignUp />
  } else {
    return <SignIn />
  }
}

export default function SigninAndSignUp(props: any) {

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        {whichSigninSignup(props.isSignUp)}
      </Grid>
    </Grid>
  );
}