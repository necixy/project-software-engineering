import React, {useEffect} from 'react';
import {Alert, Linking, Platform, StatusBar} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {SCREEN_HEIGHT} from './src/constants/deviceInfo';
import Navigation from './src/navigation';
import {useAppSelector} from './src/redux/reducer/reducer';
import CustomText from './src/shared/components/customText/CustomText';
import ModalProvider from './src/shared/components/modalProvider/ModalProvider';
import auth from '@react-native-firebase/auth';
import {databaseRef} from './src/utils/useFirebase/useFirebase';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  // SPLASH SCREEN
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const serverType = useAppSelector(
    state => state?.serverReducer?.baseUrl?.serverType,
  );

  // FOR ONLINE OR OFFLINE CONNECTION
  useEffect(() => {
    const userId = auth()?.currentUser?.uid;
    if (userId) {
      const reference = databaseRef(`users/${userId}/isOnline`);

      // Set the /users/:userId value to true
      reference.set(true).then(() => {});

      // Remove the node whenever the client disconnects
      reference
        .onDisconnect()
        .remove()
        .then(() => {});
    }
  }, []);

  return (
    <ModalProvider>
      <SafeAreaProvider style={{flex: 1}}>
        {/* <SafeAreaView style={{flex: 1}}> */}
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <Navigation />
        {/* </SafeAreaView> */}
        {/* <CustomText
          style={{
            position: 'absolute',
            top: SCREEN_HEIGHT * 0.04,
            right: 10,
            backgroundColor: 'rgba(242, 71, 38, 0.5)',
            color: '#FFF',
            fontSize: 9,
            padding: 5,
            opacity: 0.5,
            zIndex: 0,
          }}>
          {serverType} v_0.4
        </CustomText> */}
      </SafeAreaProvider>
    </ModalProvider>
  );
};

export default App;
