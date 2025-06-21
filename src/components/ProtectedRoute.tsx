import { useEffect, useState } from "react";
import { isValidUser } from "../services/protectionService";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectRouteProps {
  allowedRoles: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectRouteProps) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response:any = await isValidUser();
        if (response.data.success) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);
   
  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/auth/signin" />;
}

export default ProtectedRoute;
