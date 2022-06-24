import AppFrame from '../components/AppFrame';
import Dashboard from './DashBoard';
import Timer from './Timer';
import Stopwatch from './Stopwatch';
import LoginAndSignUp from './LoginAndSignUp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../firebase/auth/AuthProvider';
import { PrivateRoute } from '../../firebase/auth/PrivateRoute';
import { DBProvider } from '../../firebase/db/DBProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createContext, useContext,  useState } from 'react';

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
                <Route path="/login" element={<LoginAndSignUp isSignUp={false} />} />
                <Route path="/signup" element={<LoginAndSignUp isSignUp={true} />} />
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