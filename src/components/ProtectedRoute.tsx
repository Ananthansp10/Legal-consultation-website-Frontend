import { useEffect, useState } from "react";
import { isValidUser } from "../services/protectionService";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { lawyerLogout } from "../redux/slices/lawyerAuthSlice";

interface ProtectRouteProps {
  allowedRoles: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectRouteProps) {
  const [isAuth, setIsAuth] = useState<boolean | null | string>(null);
  const dispatch=useDispatch()


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
        console.log(error.response.data)
        if(error.response.data.isUnAuth){
          localStorage.removeItem('user')
          setIsAuth("unAuth");
        }else if(error.response.data.isBlock){
          if(allowedRoles[0]=='user'){
            dispatch(logout())
            setIsAuth('blocked')
          }else{
            dispatch(lawyerLogout())
            setIsAuth('blocked')
          }
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

  if(isAuth=='blocked'){
    return <Navigate to={`/block-page?role=${allowedRoles[0]}`}/>
  }

  if(isAuth=="unAuth"){
    return <Navigate to={`/unauthorized?role=${allowedRoles[0]}`} />
  }

  if(isAuth){
    return <Outlet/>;
  }
}

export default ProtectedRoute;
