import { createSlice } from "@reduxjs/toolkit";

interface State {
    isAuthenticate: boolean;
}

const admin: string | null = localStorage.getItem('admin')
let adminDetails = null
if (admin) {
    adminDetails = JSON.parse(admin)
}

const initialState: State = {
    isAuthenticate: adminDetails ? true : false
}

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {

        adminLogin: (state, action) => {
            state.isAuthenticate = true
            localStorage.setItem('admin', JSON.stringify(action.payload))
        },
        adminLogout: (state) => {
            state.isAuthenticate = false
            localStorage.removeItem('admin')
        }
    }
})

export const { adminLogin, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;