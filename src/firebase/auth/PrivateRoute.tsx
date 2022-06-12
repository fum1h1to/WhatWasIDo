import { memo, FC, ReactNode } from "react";
import { Navigate, Route, RouteProps } from "react-router-dom";
import { useAuthContext } from "./AuthProvider";

export const PrivateRoute = ({ children }: {
  children?: ReactNode;
}) => {
  const { loginUserId } = useAuthContext();
  console.log(loginUserId);
  return loginUserId ? (
    <>
      { children }
    </>
  ) : (
    <Navigate to="/" />
  );
}