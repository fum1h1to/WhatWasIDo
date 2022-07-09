import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MUILink from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import { useAuthContext } from '../../../functional/firebase/auth/AuthProvider';
import {  Divider } from '@mui/material';
import GoogleButton from 'react-google-button';
import { useThemeContext } from '../../templates/AppRouter';

const LogInCont = React.memo(() => {
  const { login, googleSignin } = useAuthContext();
  const { colorMode } = useThemeContext();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email"));
    const password = String(data.get("password"));
    const remember = Boolean(data.get("remember"));
    login(email, password, remember);
  };

  const googleLoginHandleClick = () => {
    googleSignin(true);
  }

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          name="remember"
          label="Remember me"
          id="remember"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
        <Divider sx={{ my: 2 }}>OR</Divider>
        <Grid container spacing={2} sx={{ mb: 5 }}>
          <Grid item xs={6}>
            <GoogleButton style={{width: "auto"}}
              type={colorMode}
              onClick={googleLoginHandleClick}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link to="/signup">
              <MUILink variant="body2">
                アカウントを持っていない方はこちら
              </MUILink>
            </Link> 
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
});

export default LogInCont;