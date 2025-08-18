import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../interface/userInterface/userInterface";

export interface State{
    isAuthenticate:boolean | null,
    user:User | null
}

let userDetails:User | null=null

let userStored:string | null=localStorage.getItem('userDetails')
if(userStored){
    userDetails=JSON.parse(userStored)
}

const initialState:State={
    isAuthenticate:userStored ? true : null,
    user:userDetails ? userDetails : null
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        login:(state,action)=>{
            state.isAuthenticate=true
            state.user=action.payload
            localStorage.setItem('userDetails',JSON.stringify(action.payload))
        },
        logout:(state)=>{
            state.isAuthenticate=false
            state.user=null
            localStorage.removeItem('userDetails')
        }
    }
})

export const {login,logout} = authSlice.actions;
export default authSlice.reducer;