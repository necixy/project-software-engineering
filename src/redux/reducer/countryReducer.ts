import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {currency} from 'src/theme/currency';

const initialState: {
  country: countryCodeT;
  flag: string;
  currency: string;
} = {
  country: {name: 'United States', dial_code: '+1', code: 'US'},
  flag: currency.DOLLAR_SIGN,
  currency: '',
};

const countrySlice = createSlice({
  initialState,
  name: 'country',
  reducers: {
    updateCountry(state: any, action: PayloadAction<countryCodeT>) {
      state.country = action?.payload;
    },
    updateFlag(state, action: PayloadAction<string>) {
      state.flag = action?.payload;
    },
  },
});

export const {updateCountry, updateFlag} = countrySlice?.actions;
export default countrySlice?.reducer;
