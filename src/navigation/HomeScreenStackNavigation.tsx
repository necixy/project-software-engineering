import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {IS_IOS} from 'src/constants/deviceInfo';
import Followers from 'src/screens/follows/followers/Followers';
import Home from 'src/screens/home/Home';
import ViewPost from 'src/screens/viewProfile/component/ViewPost';
import ViewProfile from 'src/screens/viewProfile/ViewProfile';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import {homeScreenStackName} from './constant/homeScreenStackRouteName';
import {HomeScreenStackParams} from './params/homeScreenStackParams';
import {useFocusEffect} from '@react-navigation/native';
import {EventRegister} from 'react-native-event-listeners';

const {Navigator, Screen} = createNativeStackNavigator<HomeScreenStackParams>();

const HomeScreenStackNavigation = () => {
  const {t} = useTranslation();
  useFocusEffect(
    useCallback(() => {
      const triggerEvent = () => {
        EventRegister.emit('fetchNewPosts');
      };
      triggerEvent();
    }, []),
  );

  return (
    <Navigator
      initialRouteName={homeScreenStackName.HOME}
      screenOptions={{
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
        headerShown: true,
        headerShadowVisible: false,
        header: ({route, navigation}) => {
          return (
            <CustomHeader
              headerContainer={{
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
              }}
              color={'defaultBlack'}
              fontSize={20}
              fontFamily={'openSansBold'}
              lineHeight={20}
              titleColor={'black'}
              navigation={navigation}
              route={route}
            />
          );
        },
      }}>
      <Screen
        name={homeScreenStackName.HOME}
        component={Home}
        options={{
          headerShown: false,
          headerShadowVisible: false,
          // header: () => {
          //   return (
          //     <View
          //       style={[
          //         {
          //           paddingTop: Platform.OS == 'ios' ? 60 : 10,
          //           backgroundColor: colors?.secondary,
          //           // borderWidth: 1,
          //         },
          //         globalStyles.alignCenter,
          //         globalStyles.flexRow,
          //       ]}>
          //       <CustomText
          //         fontFamily="fredokaSemiBold"
          //         fontSize={24}
          //         style={[
          //           {
          //             marginBottom: IS_IOS ? 0 : 10,
          //             color: colors?.primary,
          //           },
          //         ]}>
          //         {t('common:vita')}
          //       </CustomText>
          //     </View>
          //   );
          // },
        }}
      />
      <Screen
        name={homeScreenStackName.VIEW_USER}
        component={ViewProfile}
        options={{headerShown: false, headerShadowVisible: false}}
      />

      <Screen
        name={homeScreenStackName.FOLLOWERS}
        component={Followers}
        options={{
          header: () => (
            <CustomHeader
              back
              leftIconColor="black"
              leftIconStyle={{width: '10%'}}
              fontFamily={!IS_IOS ? fonts?.arialBold : fonts.openSansBold}
              fontSize={fontSizePixelRatio(18)}
              lineHeight={fontSizePixelRatio(30)}
              title={t('common:followers')}
              titleColor="black"
              titleStyle={{
                color: colors.defaultBlack,
              }}
              headerContainer={{
                alignItems: 'center',
              }}
              rightIcon
            />
          ),
        }}
      />
      <Screen
        name={homeScreenStackName.VIEW_POST}
        component={ViewPost}
        options={{headerShown: false, headerShadowVisible: false}}
      />
    </Navigator>
  );
};

export default HomeScreenStackNavigation;
