import { createSlice } from "@reduxjs/toolkit";
import { Lawyer } from "../../interface/lawyerInterface/lawyerInterface";

interface State {
  isAuthenticate: boolean;
  lawyer: Lawyer | null;
}

const lawyer: string | null = localStorage.getItem("lawyer");
let lawyerDetails;
if (lawyer) {
  lawyerDetails = JSON.parse(lawyer);
}

const initialState: State = {
  isAuthenticate: lawyerDetails ? true : false,
  lawyer: lawyerDetails ? lawyerDetails : null,
};

const lawyerAuthSlice = createSlice({
  name: "lawyerAuth",
  initialState,
  reducers: {
    lawyerLogin: (state, action) => {
      state.isAuthenticate = true;
      state.lawyer = action.payload;
      localStorage.setItem("lawyer", JSON.stringify(action.payload));
    },

    lawyerLogout: (state) => {
      state.isAuthenticate = false;
      state.lawyer = null;
      localStorage.removeItem("lawyer");
    },
  },
});

export const { lawyerLogin, lawyerLogout } = lawyerAuthSlice.actions;
export default lawyerAuthSlice.reducer;
