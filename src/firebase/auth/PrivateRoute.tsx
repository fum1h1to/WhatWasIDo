import { ReactNode } from "react";
import { Navigate, } from "react-router-dom";
import { useAuthContext } from "./AuthProvider";

export const PrivateRoute = ({ children }: {
  children?: ReactNode;
}) => {
  const { loginUserId } = useAuthContext();
  if (loginUserId) {
    return (
      <>
        { children }
      </>
    )
  } else {
    return (
      <Navigate to={`/`} />
    )
  }
}