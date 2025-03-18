// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {configureStore} from '@reduxjs/toolkit';
// import {persistReducer} from 'redux-persist';
// import rootReducer from './reducer/RootReducer';

// // Configuration for Redux Persist
// const persistConfig = {
//   key: 'vita',
//   storage: AsyncStorage,
//   whitelist: ['serverReducer'], // Only persist this reducer
// };

// // Custom root reducer to handle logout action
// const rootReducerWithLogout = (state: any, action: any) => {
//   if (action.type === 'LOGOUT') {
//     // Preserve state for 'serverReducer' only
//     state = {
//       serverReducer: state.serverReducer,
//     };
//   }
//   return rootReducer(state, action);
// };

// // Create a persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducerWithLogout);

// // Configure the Redux store
// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       immutableCheck: false,
//       serializableCheck: false,
//     }),
// });

// export default store;

import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import rootReducer from './reducer/RootReducer';

const persistStore = {
  key: 'vita',
  storage: AsyncStorage,
};

// const root_reducer = (state: any, action: any) => {
//   let reduxState: any = state;
//   if (action?.type === 'LOGOUT' && state) {
//     for (let [key, value] of Object.entries(reduxState)) {
//       if (key === 'serverReducer') {
//         reduxState[key] = value;
//       } else {
//         reduxState[key] = undefined;
//       }
//     }
//     state = reduxState;
//   }
//   return rootReducer(state, action);
// };

// Custom root reducer to handle logout action
const rootReducerWithLogout = (state: any, action: any) => {
  if (action.type === 'LOGOUT') {
    // Preserve state for 'serverReducer' only
    state = {
      serverReducer: state.serverReducer,
    };
  }
  return rootReducer(state, action);
};

const persistedReducer = persistReducer(persistStore, rootReducerWithLogout);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({immutableCheck: false, serializableCheck: false}),
});

export default store;
