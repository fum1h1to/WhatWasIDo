import { memo, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../functional/firebase/auth/AuthProvider";

/**
 * ユーザー認証済みでしかアクセスできないページの制御
 * - ユーザー認証済みでなければ、loginへリダイレクト
 */
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