/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import {PersistGate} from 'redux-persist/integration/react';
import store from './src/redux/store';
import {Host} from 'react-native-portalize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StripeProvider} from '@stripe/stripe-react-native';
import messaging from '@react-native-firebase/messaging';
import {notificationNavigationHandler} from 'src/utils/NotificationNavigationHandler';
import notifee, {EventType} from '@notifee/react-native';

export const persister = persistStore(store);
async function checkUserLanguage() {
  if (!(await AsyncStorage.getItem('user-language'))) {
    await AsyncStorage.setItem('user-language', 'en');
  }
}
checkUserLanguage();
messaging().setBackgroundMessageHandler(async remoteMessage => {
  notificationNavigationHandler(remoteMessage?.data);
});
notifee.onBackgroundEvent(async ({type, detail}) => {
  switch (type) {
    case EventType.PRESS:
      await notificationNavigationHandler(detail.notification.data);
      break;
  }
});

// this is working when app is in background but while app in foreground notification is appear and then move app into background and click on notification console is showing "pressed" but not navigate to app

const RootApp = () => {
  return (
    <StripeProvider publishableKey="pk_test_51PDvJD07ZECLJyzZJb5hSsMTIXPT86zVPjGhpiIsbW11sozfiD5npUF4QxBOLKyj0RsBHi7qFjIX0u7xKfOTYU2n00ShD907Gs">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persister}>
          <Host>
            <App />
          </Host>
        </PersistGate>
      </Provider>
    </StripeProvider>
  );
};

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(RootApp));
