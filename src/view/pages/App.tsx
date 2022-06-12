import * as React from 'react';
import AppFrame from '../components/AppFrame';
import Dashboard from './DashBoard';
import Timer from './Timer';
import LoginAndSignUp from './LoginAndSignUp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../firebase/auth/AuthProvider';
import { PrivateRoute } from '../../firebase/auth/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter basename="/">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginAndSignUp isSignUp={false} />} />
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
          <Route path="*" element={ <h1>404</h1> }/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}