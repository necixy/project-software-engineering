import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackParam} from './params/AuthStackParam';
import Welcome from 'src/screens/auth/welcome/Welcome';
import {AuthStackRouteName} from './constant/authStackRouteName';
import Login from 'src/screens/auth/login/Login';
import SignUp from 'src/screens/auth/signUp/SignUp';
import WaitForVerification from 'src/screens/auth/waitForVerification/WaitForVerification';
import ForgotPassword from 'src/screens/auth/forgotPassword/ForgotPassword';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import NewPassword from 'src/screens/auth/newPassword/NewPassword';
import Pdf from 'react-native-pdf';
import PdfViewer from 'src/screens/auth/components/PdfViewer';

export default function AuthNavigation() {
  const AuthStack = createNativeStackNavigator<AuthStackParam>();
  const {Navigator, Screen} = AuthStack;
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
      }}
      initialRouteName={
        true ? AuthStackRouteName.WELCOME : AuthStackRouteName.SIGN_UP
      }>
      <Screen name={AuthStackRouteName.WELCOME} component={Welcome} />
      <Screen name={AuthStackRouteName.LOGIN} component={Login} />
      <Screen name={AuthStackRouteName.SIGN_UP} component={SignUp} />
      <Screen
        name={AuthStackRouteName.WAIT_FOR_VERIFICATION}
        component={WaitForVerification}
      />
      <Screen
        name={AuthStackRouteName.FORGOT_PASSWORD}
        component={ForgotPassword}
      />
      <Screen name={AuthStackRouteName.NEW_PASSWORD} component={NewPassword} />
      <Screen name={AuthStackRouteName.PDF_VIEWER} component={PdfViewer} />
    </Navigator>
  );
}
