import { createSlice } from "@reduxjs/toolkit";

export interface State{
    isAuthenticate:boolean | null,
    user:any
}

let userDetails:any=localStorage.getItem('userDetails')
if(userDetails){
    userDetails=JSON.parse(userDetails)
}

const initialState:State={
    isAuthenticate:userDetails ? true : null,
    user:userDetails ? userDetails : null
}

const authSlice:any=createSlice({
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