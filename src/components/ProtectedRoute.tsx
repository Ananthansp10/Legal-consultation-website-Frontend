import { useEffect, useState } from "react";
import { isValidUser } from "../services/protectionService";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";
import { useDispatch } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";
import { lawyerLogout } from "../redux/slices/lawyerAuthSlice";
import { useSelector } from "react-redux";
import { getGoogleAuthDetails } from "../services/user/authService";
import { User } from "../interface/userInterface/userInterface";
import { RootState } from "../redux/store";
import { AxiosError, AxiosResponse } from "axios";

interface ProtectRouteProps {
  allowedRoles: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectRouteProps) {
  const [isAuth, setIsAuth] = useState<boolean | null | string>(null);
  const dispatch=useDispatch()


  const user:User | null=useSelector((state:RootState)=>state.auth.user)

  useEffect(()=>{
    if(!user){
      getGoogleAuthDetails().then((response)=>{
        if(response.data.result){
          let obj={
            id:response.data.result.id,
            googleId:response.data.result.googleId,
            email:response.data.result.email,
            name:response.data.result.name
          }
          dispatch(login(obj))
        }
      })
    }
  },[])

  interface CheckAuthResponse{
    success:boolean;
    message:string;
  }

  interface CheckAuthErrorResponse{
    success:boolean;
    message:string;
    isUnAuth:boolean;
    isBlock:string;
  }


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response:AxiosResponse<CheckAuthResponse> = await isValidUser(allowedRoles[0]);
        if (response.data.success) {
          setIsAuth(true);
        }else{
          setIsAuth(false)
        }
      } catch (error) {
        const axiosError=error as AxiosError<CheckAuthErrorResponse>
        const errorData=axiosError.response?.data
        if(errorData?.isUnAuth){
          localStorage.removeItem('user')
          setIsAuth("unAuth");
        }else if(errorData?.isBlock){
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
