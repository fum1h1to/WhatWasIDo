import { memo } from 'react';
import { Outlet } from 'react-router-dom';

export const Layout = memo(() => (
  <div>
    <Outlet />
  </div>
));