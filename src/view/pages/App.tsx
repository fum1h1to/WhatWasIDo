import * as React from 'react';
import AppFrame from '../components/AppFrame';
import Dashboard from './DashBoard';
import Timer from './Timer';
import SigninAndSignUp from './SigninAndSignUp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<SigninAndSignUp isSignUp={false} />} />
        <Route path="/signup" element={<SigninAndSignUp isSignUp={true} />} />
        <Route path="/app" element={
          <AppFrame>
            <Dashboard />
          </AppFrame>
        } />
        <Route path="/app/timer" element={
           <AppFrame>
              <Timer />
            </AppFrame>
        } />
      </Routes>
    </BrowserRouter>
  );
}