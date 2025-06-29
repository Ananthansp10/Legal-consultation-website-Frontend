import { createSlice } from "@reduxjs/toolkit";

interface State{

    isAuthenticate:boolean;
    lawyer:any;
}

const lawyer:any=localStorage.getItem('lawyer')
let lawyerDetails:any
if(lawyer){
    lawyerDetails=JSON.parse(lawyer)
}

const initialState:State={
    isAuthenticate:lawyerDetails ? true : false,
    lawyer:lawyerDetails ? lawyerDetails : null
}

const lawyerAuthSlice:any=createSlice({
    name:'lawyerAuth',
    initialState,
    reducers:{

        lawyerLogin:(state,action)=>{
            state.isAuthenticate=true
            state.lawyer=action.payload
            localStorage.setItem('lawyer',JSON.stringify(action.payload))
        },

        lawyerLogout:(state)=>{
            state.isAuthenticate=false
            state.lawyer=null
            localStorage.removeItem('lawyer')
        }
    }
})

export const {lawyerLogin,lawyerLogout}=lawyerAuthSlice.actions;
export default lawyerAuthSlice.reducer;