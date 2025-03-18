import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IRememberMeReducer {
  baseUrl: serverReducerType;
}

const initialState: IRememberMeReducer = {
  baseUrl: {
    serverType: 'LIVE',
  },
};

const serverReducerSlice = createSlice({
  name: 'rememberMe',
  initialState,
  reducers: {
    setBaseUrl(state, action: PayloadAction<serverReducerType>) {
      state.baseUrl = action.payload;
    },
  },
});

export const {setBaseUrl} = serverReducerSlice.actions;
export default serverReducerSlice.reducer;
