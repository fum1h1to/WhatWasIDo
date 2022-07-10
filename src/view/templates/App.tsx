import AppFrame from './AppFrame/AppFrame';
import Dashboard from '../pages/DashBoard/DashBoard';
import Timer from '../pages/Timer/Timer';
import Stopwatch from '../pages/Stopwatch/Stopwatch';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../functional/firebase/auth/AuthProvider';
import { PrivateRoute } from './PrivateRoute';
import { DBProvider } from '../../functional/firebase/db/DBProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createContext, memo, useContext, useEffect, useState } from 'react';
import Login from '../pages/Login/Login';
import SignUp from '../pages/SignUp/SignUp';
import FindCalender from '../pages/FindCalender/FindCalender';
import { Layout } from './Layout';
import { Box, LinearProgress, useMediaQuery } from '@mui/material';
import { blue } from '@mui/material/colors';

type RootContextType = {
  colorMode: "light" | "dark";
  setColorMode: (mode: "light" | "dark") => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const RootContext = createContext<RootContextType>({} as RootContextType);

export function useRootContext() { 
  return useContext(RootContext);
}

declare module '@mui/material/styles' {
  interface Palette {
    progress: Palette['primary'];
  }
  interface PaletteOptions {
    progress: PaletteOptions['primary'];
  }
}
declare module '@mui/material/LinearProgress' {
  interface LinearProgressPropsColorOverrides {
    progress: true;
  }
}

const AppRouter = memo(() => {
  return (
    <BrowserRouter basename="/">
      <DBProvider>
        <AuthProvider>
          <Routes>
            <Route path="" element={
              <PrivateRoute>
                <Navigate to={`/app`} />
              </PrivateRoute>
            } />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="app" element={
              <PrivateRoute>
                <AppFrame>
                  <Layout />
                </AppFrame>
              </PrivateRoute>
            } >
              <Route path="" element={ <Dashboard /> } />
              <Route path="timer" element={ <Timer /> } />
              <Route path="stopwatch" element={ <Stopwatch /> } />
              <Route path="findCalender" element={ <FindCalender /> } />
            </Route>
            <Route path="*" element={<h1>404</h1>} />
          </Routes>
        </AuthProvider>
      </DBProvider>
    </BrowserRouter>
  );
});

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [colorMode, setColorMode] = useState<"light" | "dark">(prefersDarkMode ? "dark" : "light");
  const [ isLoading, setIsLoading ] = useState(true);

  const mdTheme = createTheme({
    palette: {
      mode: colorMode,
      progress: {
        main: blue[500]
      }
    }
  });

  return (
    <RootContext.Provider
      value={{
        colorMode,
        setColorMode,
        isLoading,
        setIsLoading,
      }}
    >
      <ThemeProvider theme={mdTheme}>
        <Box 
          sx={{
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 9999,
            display: (isLoading ? 'block' : 'none'),
          }}
        >
          <LinearProgress 
            color='progress'
            sx={{
              bgcolor: 'transparent'
            }}
          />
        </Box>
        <AppRouter />
      </ThemeProvider>
    </RootContext.Provider>
  );
}