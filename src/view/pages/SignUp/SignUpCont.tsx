import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MUILink from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import { useAuthContext } from '../../../functional/firebase/auth/AuthProvider';
import { memo } from 'react';
import { Divider } from '@mui/material';
import GoogleButton from 'react-google-button';
import { useRootContext } from '../../templates/App';

/**
 * サインアップページの本体（右側のやつ）
 */
const SignUpCont = memo(() => {
  const { colorMode } = useRootContext();
  const { signup, googleSignin } = useAuthContext();

  /**
   * サインアップボタンが押された時の処理。
   * @param event 
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email"));
    const password = String(data.get("password"));
    const confirmPassword = String(data.get("passwordAgain"))

    await signup(email, password, confirmPassword);
  };

  /**
   * googleでサインアップが押された時の処理。
   */
  const googleLoginHandleClick = async () => {
    await googleSignin(true);
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
        Sign up
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
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
        />
         <TextField
          margin="normal"
          required
          fullWidth
          name="passwordAgain"
          label="Password Again"
          type="password"
          id="passwordAgain"
          autoComplete="new-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
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
            <Link to="/login">
              <MUILink variant="body2">
                すでにアカウントを持っている方はこちら
              </MUILink>
            </Link> 
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
})
export default SignUpCont;