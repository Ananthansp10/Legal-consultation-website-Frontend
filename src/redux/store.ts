import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import adminAuthSlice from "./slices/adminAuthSlice";
import lawyerAuthSlice from '../redux/slices/lawyerAuthSlice'

export const store=configureStore({
    reducer:{
        auth:authSlice,
        adminAuth:adminAuthSlice,
        lawyerAuth:lawyerAuthSlice
    }
})