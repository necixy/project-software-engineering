import {combineReducers} from '@reduxjs/toolkit';
import store from 'src/redux/store';
import userReducer from './userReducer';
import serverReducer from './serverReducer';
import menuListReducer from './menuListReducer';
import searchFilterReducer from './searchFilterReducer';
import likeCountReducer from './likeCountReducer';
import countryReducer from './countryReducer';

const rootReducer = combineReducers({
  countryReducer,
  userReducer,
  serverReducer,
  menuListReducer,
  searchFilterReducer,
  likeCountReducer,
});
export type RootState = ReturnType<typeof store.getState>;
export default rootReducer;
export type AppDispatch = typeof store.dispatch;
