import { memo, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../functional/firebase/auth/AuthProvider";

export const PrivateRoute = memo(({ children }: {
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
      <Navigate to={`/login`} />
    )
  }
});