import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer, getStateFromPath} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {isReadyRef, navigationRef} from 'react-navigation-helpers';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import {updateDetails, updateUserLanguage} from 'src/redux/reducer/userReducer';
import Booking from 'src/screens/booking/Booking';
import SharePost from 'src/screens/newPost/SharePost';
import {notificationNavigationHandler} from 'src/utils/NotificationNavigationHandler';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import AuthNavigation from './AuthNavigation';
import HomeDrawerNavigation from './HomeDrawerNavigation';
import ScreenStackNavigation from './ScreenStackNavigation';
import SearchStackNavigation from './SearchStackNavigation';
import BottomTabNavigation from './TabNavigation';
import TopTabNavigation from './TopTabNavigation';
import UserProfileStackNavigation from './UserProfileStackNavigation';
import {rootStackName} from './constant/rootStackName';
import {searchStackName} from './constant/searchStackRouteName';
import {tabStackRouteName} from './constant/tabNavRouteName';
import {userProfileStackName} from './constant/userProfileStackName';
import {rootStackParams} from './params/rootStackParams';
import {bookingSackRouteName} from './constant/bookingStackRouteName';
import {topTabNavRouteName} from './constant/topTabNavRouteName';
import {IS_IOS} from 'src/constants/deviceInfo';

const Stack = createNativeStackNavigator<rootStackParams>();
const {Navigator, Screen} = Stack;
function Navigation() {
  React.useEffect(
    () => () => {
      isReadyRef.current = false;
    },
    [],
  );
  const dispatch = useAppDispatch();
  async function checkUserLanguage() {
    let language = await AsyncStorage.getItem('user-language');
    dispatch(updateUserLanguage(language == 'en' ? 'en' : 'fr'));

    if (!(await AsyncStorage.getItem('user-language'))) {
      await AsyncStorage.setItem('user-language', 'fr');
    }
  }

  const details = useAppSelector(state => state.userReducer.userDetails);

  const linking = {
    prefixes: ['vita://', 'https://vita-abe0f.web.app'],
    config: {
      screens: {
        [rootStackName.BOTTOM_TABS]: {
          screens: {
            [tabStackRouteName.EXPLORER]: {
              screens: {
                [searchStackName.VIEW_PROFILE]: {
                  path: 'viewUser',
                  parse: {
                    userId: (userId: any) => {
                      return `${userId}`;
                    },
                  },
                },
              },
            },
            [tabStackRouteName.USER_PROFILE_STACK]: {
              screens: {
                [userProfileStackName.VIEW_POST]: {
                  path: 'viewPost',
                  parse: {
                    postId: (postId: any) => {
                      return `${postId}`;
                    },
                    type: 'test',
                  },
                },
              },
            },
            [tabStackRouteName.USER_PROFILE]: {
              screens: {
                [userProfileStackName.USER_PROFILE]: {
                  path: 'userProfile',
                  parse: {
                    postId: (userId: any) => {
                      return `${userId}`;
                    },
                  },
                },
              },
            },
            [tabStackRouteName.BOOKING]: {
              screens: {
                [bookingSackRouteName.TOP_TAB_NAVIGATION]: {
                  screens: {
                    [topTabNavRouteName.REQUESTS]: {
                      path: 'request',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    getStateFromPath: (path: any, config: any) => {
      const state = getStateFromPath(path, config);

      // Example condition: show different screen based on userId
      const userId =
        state?.routes?.[0]?.state?.routes?.[0]?.state?.routes?.[0]?.params
          ?.userId;
      if (userId === details?.uid && path.includes('viewUser')) {
        //   ...state?.routes[0]?.state?.routes?.[0],
        //   name: 'user_profile_stack',
        // });
        // "path": "/viewPost?postId=-O1ReCPp9DPKQw9dUEF8"}
        return {
          ...state,
          routes: [
            {
              ...state?.routes[0],
              state: {
                ...state?.routes[0].state,
                routes: [
                  {
                    name: 'user_profile_stack',
                    state: {
                      routes: [
                        {name: 'user_profile'},
                        // Add other routes here if needed
                      ],
                    },
                  },
                ],
              },
            },
          ],
        };
      }

      return state;
    },
  };
  useEffect(() => {
    // Request permissions on iOS and Android permissions
    !IS_IOS &&
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    const requestNotificationPermission = async () => {
      try {
        let notificationRes = await messaging().requestPermission();
      } catch (error) {
        console.error('Notification permission denied', error);
      }
    };

    // Call the permission request function when component mounts
    requestNotificationPermission();

    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onMessageReceived(remoteMessage);
    });

    // Handle initial notification when app is opened by a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          notificationNavigationHandler(remoteMessage?.data); // Ensure this navigates correctly
        }
      })
      .catch(error => {
        console.error('Error fetching initial notification:', error);
      });
    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   if (remoteMessage) {
    //     notificationNavigationHandler(remoteMessage?.data?.status); // Ensure this navigates correctly
    //   }
    // });
    // notifee.onForegroundEvent(async ({detail}) => {
    //   const {notification} = detail;

    //   // Navigate based on the received data
    //   notificationNavigationHandler('new');
    // });
    notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          notificationNavigationHandler(detail?.notification?.data);
          break;
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // const getIsProStatus = async () => {
    databaseRef(`users/${details?.uid}/isPro`).on('value', snapshot => {
      if (snapshot.val()) {
        let isPro = snapshot.val();
        dispatch(updateDetails(isPro));
      }
    });
    // };
    // getIsProStatus();

    return () => {
      databaseRef(`users/${details?.uid}/isPro`).off('value');
    };
  }, []);

  async function onMessageReceived(message: any) {
    // if (Platform.OS === 'android') {
    // Create a notification channel if it does not exist
    // if (Platform.OS === 'android'){

    // }
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: message?.notification?.title,
      body: message?.notification?.body,
      data: message?.data,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        smallIcon: 'ic_launcher', // Ensure this icon exists in your project
      },
    });
    // } else {
    //   // iOS notifications handled automatically
    // }
  }

  return (
    <NavigationContainer
      linking={linking}
      onReady={() => {
        isReadyRef.current = true;
      }}
      ref={navigationRef}>
      <Navigator
        initialRouteName={
          details?._auth?._user?.uid
            ? rootStackName.HOME_DRAWER
            : rootStackName.AUTH
        }
        screenOptions={{
          orientation: 'portrait',
          headerShown: false,
          headerShadowVisible: false,
        }}>
        {!details?.uid ? (
          <>
            <Screen name={rootStackName.AUTH} component={AuthNavigation} />
          </>
        ) : (
          <>
            <Screen
              name={rootStackName.HOME_DRAWER}
              component={HomeDrawerNavigation}
            />
            <Screen
              name={rootStackName.SCREEN_STACK}
              component={ScreenStackNavigation}
            />
            <Screen name={rootStackName.SHARE_POST} component={SharePost} />
            <Screen
              name={rootStackName.USER_PROFILE_STACK}
              component={UserProfileStackNavigation}
            />
            <Screen
              name={rootStackName.BOTTOM_TABS}
              component={BottomTabNavigation}
              options={{headerShadowVisible: false, headerShown: false}}
            />
            <Screen
              name={rootStackName.SEARCH_STACK}
              component={SearchStackNavigation}
            />
            <Screen name={rootStackName.BOOKING} component={Booking} />
            <Screen
              name={rootStackName.TOP_TABS}
              component={TopTabNavigation}
            />
          </>
        )}
      </Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
