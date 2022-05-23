import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetails: {},
};


export const userSlice = createSlice({
  name: "userProps",
  initialState,
  reducers: {
    addToUser: (state, action) => {
      state.userDetails = { ...action.payload };

    },
  },
});


export const { addToUser } = userSlice.actions;

export const selectUser = (state) => state.user.userDetails;


export default userSlice.reducer;
