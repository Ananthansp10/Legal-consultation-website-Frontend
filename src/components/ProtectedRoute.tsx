import { useEffect, useState } from "react";
import { isValidUser } from "../services/protectionService";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";

interface ProtectRouteProps {
  allowedRoles: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectRouteProps) {
  const [isAuth, setIsAuth] = useState<boolean | null | string>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response:any = await isValidUser({role:allowedRoles[0]});
        if (response.data.success) {
          setIsAuth(true);
        }else{
          setIsAuth(false)
        }
      } catch (error:any) {
        if(error.response.data.isUnAuth){
          localStorage.removeItem('user')
          setIsAuth("unAuth");
        }
        else{
          setIsAuth(false);
        }
      }
    };

    checkAuth();
  }, [allowedRoles[0]]);
   
  if (isAuth === null) {
    return <Loader/>
  }

  if(isAuth=="unAuth"){
    return <Navigate to="/unAuthorized" state={{role:allowedRoles[0]}}/>
  }

  if(isAuth){
    return <Outlet/>;
  }
}

export default ProtectedRoute;
