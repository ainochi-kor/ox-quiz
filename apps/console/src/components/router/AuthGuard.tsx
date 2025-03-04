import { useAuthStore } from "@/hooks/store/useAuthStore";
import React from "react";
import { Navigate, Outlet } from "react-router";

const AuthGuard: React.FC = () => {
  const token = useAuthStore((state) => state.token);

  if (token === null) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AuthGuard;
