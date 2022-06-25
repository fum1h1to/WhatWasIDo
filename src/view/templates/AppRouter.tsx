import AppFrame from './AppFrame/AppFrame';
import Dashboard from '../pages/DashBoard/DashBoard';
import Timer from '../pages/Timer/Timer';
import Stopwatch from '../pages/Stopwatch/Stopwatch';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../functional/firebase/auth/AuthProvider';
import { PrivateRoute } from '../../functional/firebase/auth/PrivateRoute';
import { DBProvider } from '../../functional/firebase/db/DBProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createContext, useContext,  useState } from 'react';
import Login from '../pages/Login/Login';
import SignUp from '../pages/SignUp/SignUpCont';

type ThemeContextType = {
  colorMode: "light" | "dark";
  setColorMode: (mode: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function useThemeContext() { 
  return useContext(ThemeContext);
}

export default function App() {
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");
  const mdTheme = createTheme({
    palette: {
      mode: colorMode,
    }
  });

  return (
    <ThemeContext.Provider
      value={{
        colorMode,
        setColorMode,
      }}
    >
      <ThemeProvider theme={mdTheme}>
        <BrowserRouter basename="/">
          <DBProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={
                  <PrivateRoute>
                    <AppFrame>
                      <Dashboard />
                    </AppFrame>
                  </PrivateRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/app" element={
                  <PrivateRoute>
                    <AppFrame>
                      <Dashboard />
                    </AppFrame>
                  </PrivateRoute>
                } />
                <Route path="/app/timer" element={
                  <PrivateRoute>
                    <AppFrame>
                      <Timer />
                    </AppFrame>
                  </PrivateRoute>
                } />
                 <Route path="/app/stopwatch" element={
                  <PrivateRoute>
                    <AppFrame>
                      <Stopwatch />
                    </AppFrame>
                  </PrivateRoute>
                } />
                <Route path="*" element={<h1>404</h1>} />
              </Routes>
            </AuthProvider>
          </DBProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}