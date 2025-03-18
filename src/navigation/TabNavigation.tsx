import {
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import {Platform, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {colors} from 'src/theme/colors';
import Icon from '../assets/svg';
// import Icon from '../assets/svg';
import React from 'react';
import Booking from 'src/screens/booking/Booking';
import Message from 'src/screens/message/Message';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import useGetUserData from 'src/utils/useGetUserData';
import HomeScreenStackNavigation from './HomeScreenStackNavigation';
import SearchStackNavigation from './SearchStackNavigation';
import UserProfileStackNavigation from './UserProfileStackNavigation';
import {tabStackRouteName} from './constant/tabNavRouteName';
import {tabNavParam} from './params/tabNavParam';
import {IS_IOS} from 'src/constants/deviceInfo';
import {useTranslation} from 'react-i18next';

const {Navigator, Screen} = createBottomTabNavigator<tabNavParam>();

function BottomTabNavigation({}) {
  useGetUserData();
  const {t} = useTranslation();
  return (
    <Navigator
      initialRouteName={tabStackRouteName.HOME_STACK}
      sceneContainerStyle={{zIndex: 0}}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors?.secondary,
          height: Platform.OS === 'ios' ? 70 : 50,
          paddingBottom: Platform.OS === 'ios' ? 9 : 0,
        },
        headerShadowVisible: false,
        header: ({navigation, route, options}) => {
          return (
            <CustomHeader
              title={options?.title}
              // leftIconStyle={
              //   {
              //     // width: route?.name == tabStackRouteName.BOOKING ? '20%' : '0%',
              //     // marginEnd: 0,
              //   }
              // }
              back={route?.name == tabStackRouteName.BOOKING}
              // fontSize={fontSizePixelRatio(30)}
              // lineHeight={fontSizePixelRatio(35)}
              fontSize={24}
              lineHeight={28}
              fontFamily={
                options?.title == 'Vita'
                  ? 'fredokaSemiBold'
                  : !IS_IOS
                  ? 'arialBold'
                  : 'openSansBold'
              }
              titleStyle={
                {
                  // width:
                  //   route?.name == tabStackRouteName.BOOKING ? '50%' : '100%',
                }
              }
              rightIcon
              headerContainer={{
                paddingHorizontal: 0,
                // height: IS_IOS ? 100 : 60,
                // paddingTop: IS_IOS ? 30 : 20,
              }}
            />
          );
        },
      }}>
      <Screen
        name={tabStackRouteName.HOME_STACK}
        component={HomeScreenStackNavigation}
        options={{
          title: 'Vita',
          headerShown: false,
          headerShadowVisible: false,
          tabBarShowLabel: false,
          tabBarIcon: ({focused}: any) => {
            return focused ? (
              <Foundation name="home" size={34} color="black" />
            ) : (
              <>
                <Icon name="homeOutline" width={30} height={30} />
              </>
            );
          },
        }}
      />
      <Screen
        name={tabStackRouteName.EXPLORER}
        component={SearchStackNavigation}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({focused}: any) => {
            return focused ? (
              <FontAwesome name="search" size={29} color="black" />
            ) : (
              <Ionicons name="search-outline" size={30} color="black" />
            );
          },
        }}
      />
      <Screen
        name={tabStackRouteName.BOOKING}
        component={Booking}
        options={{
          headerShown: false,
          title: 'Vita',
          tabBarLabelStyle: {
            color: colors?.primary,
            fontSize: fontSizePixelRatio(25),
          },
          tabBarShowLabel: false,
          tabBarIcon: ({focused}: any) => {
            return (
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 5,
                  paddingHorizontal: 3,
                  paddingVertical: 2,
                  backgroundColor: focused ? 'black' : colors?.secondary,
                }}>
                <Octicons
                  name="three-bars"
                  size={20}
                  color={focused ? 'white' : 'black'}
                />
              </View>
            );
          },
        }}
      />
      <Screen
        name={tabStackRouteName.MESSAGE}
        component={Message}
        options={{
          header: () => (
            <CustomHeader
              textAlignTitle="left"
              title={t('common:discussion')}
              titleColor="blue"
              titleStyle={{
                paddingLeft: 10,
                //  marginBottom: 10
              }}
              fontSize={20}
              lineHeight={30}
              fontFamily={'openSansBold'}
            />
          ),
          tabBarShowLabel: false,
          tabBarIcon: ({focused}: any) => {
            return focused ? (
              <Ionicons name="chatbox" size={30} color="black" />
            ) : (
              <Ionicons name="chatbox-outline" size={30} color="black" />
            );
          },
        }}
      />
      <Screen
        name={tabStackRouteName.USER_PROFILE_STACK}
        component={UserProfileStackNavigation}
        options={{
          title: 'Vita',
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({focused}: any) => {
            return focused ? (
              <MaterialIcons name="person" size={33} color="black" />
            ) : (
              <Icon name="userOutline" width={30} height={30} />
            );
          },
        }}
      />
    </Navigator>
  );
}

export default BottomTabNavigation;
