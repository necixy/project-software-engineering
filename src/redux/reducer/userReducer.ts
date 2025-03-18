import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: URProps = {
  token: '',
  userDetails: null,
  userType: 'client',
  baseUrl: 'Staging',
  language: 'en',
  searchedPlaces: [],
  follow: {
    followings: [],
    followers: [],
  },
};

const userSlice = createSlice({
  initialState,
  name: 'user',
  reducers: {
    updateDetails(
      state: any,
      action: PayloadAction<TUserDetails | FirebaseAuthTypes.User | null>,
    ) {
      state.userDetails = {
        ...state?.userDetails,
        ...action?.payload,
      };
    },
    updateFollow(
      state,
      action: PayloadAction<{followers: string[]; followings: string[]}>,
    ) {
      state.follow = {
        ...action?.payload,
      };
    },
    updateToken(state, action: PayloadAction<string>) {
      state.token = action?.payload;
    },
    updateSearchedPlaces(state, action) {
      state.searchedPlaces = [
        action?.payload,
        ...state.searchedPlaces.filter(
          (elem: any) =>
            elem.completeAddress !== action.payload.completeAddress,
        ),
      ];
    },
    updateUserType(state, action: PayloadAction<'client' | 'pro'>) {
      state.userType = action?.payload;
    },
    updateBaseUrl(state, action: PayloadAction<'Staging' | 'Production'>) {
      state.baseUrl = action?.payload;
    },
    updateUserLanguage(state, action: PayloadAction<'en' | 'fr'>) {
      state.language = action?.payload;
    },
    clearSearchedPlaces(state) {
      state.searchedPlaces = [];
    },
  },
});

export const {
  updateDetails,
  updateToken,
  updateSearchedPlaces,
  updateUserType,
  updateUserLanguage,
  updateBaseUrl,
  clearSearchedPlaces,
  updateFollow,
} = userSlice?.actions;
export default userSlice?.reducer;
