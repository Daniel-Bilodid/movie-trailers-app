import { configureStore, createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    value: "",
  },
  reducers: {
    setData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setData } = dataSlice.actions;

const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
  },
});

export default store;
