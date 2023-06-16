import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  token: "",
  isAuth: "false",
  userId: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuth = true;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },
    logout(state, action) {
      state.isAuth = false;
      state.userId = "";
      state.token = "";

      localStorage.removeItem("userData");
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
