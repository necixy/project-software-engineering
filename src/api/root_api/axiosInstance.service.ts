import { firebase } from '@react-native-firebase/auth';
import axios from 'axios';
import { getModel, getVersion } from 'react-native-device-info';
import { getTimeZone } from 'react-native-localize';
import { axiosError } from './axiosError.service';
import { useAppSelector } from 'src/redux/reducer/reducer';
import React from 'react';
import store from 'src/redux/store';

const axiosInstance = axios.create({
  timeout: 30000,
  timeoutErrorMessage:
    'Network request timed out. The app could not connect to the server. Please make sure you are connected with a good network.',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'App-Version': getVersion(),
    Timezone: getTimeZone(),
    'Device-Model': getModel(),
    Language: 'en',
    // server_type: useServerType(),
  },
});
axiosInstance.interceptors.request.use(
  async config => {
    // Retrieve the token from your storage mechanism
    const token = await firebase.auth().currentUser?.getIdToken(); // Replace with your token retrieval logic
    config.baseURL = `https://us-central1-vita-abe0f.cloudfunctions.net/api/`;
    // config.baseURL = `https://54fd-2402-e280-230c-597-457c-6f20-b229-2ae.ngrok-free.app/vita-abe0f/us-central1/api/`;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    let reduxStore = store.getState();
    let serverType = reduxStore?.serverReducer?.baseUrl?.serverType;

    if (serverType) {
      config.headers['server_type'] = serverType;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
axiosInstance.interceptors.response.use(
  res => {
    return res;
  },
  err => axiosError(err),
);
export { axiosInstance };
