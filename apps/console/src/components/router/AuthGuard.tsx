import { useAuthStore } from "@/hooks/store/useAuthStore";
import React, { PropsWithChildren } from "react";
import { Navigate } from "react-router";

const AuthGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const token = useAuthStore((state) => state.userCredential);

  if (token === null) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
