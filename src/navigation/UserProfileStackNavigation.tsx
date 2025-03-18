import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useAppSelector} from 'src/redux/reducer/reducer';
import Followers from 'src/screens/follows/followers/Followers';
import UserProfile from 'src/screens/userProfile/UserProfile';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {
  capitalizeString,
  fontSizePixelRatio,
} from 'src/utils/developmentFunctions';
import {userProfileStackName} from './constant/userProfileStackName';
import {userProfileStackParams} from './params/UserProfileStackParams';
import Following from 'src/screens/follows/following/Following';
import ViewPost from 'src/screens/viewProfile/component/ViewPost';
import BookingHistory from 'src/screens/booking/bookingHistory/BookingHistory';
import {Platform} from 'react-native';
import {IS_IOS} from 'src/constants/deviceInfo';

const Stack = createNativeStackNavigator<userProfileStackParams>();
const UserProfileStackNavigation = () => {
  const {userDetails} = useAppSelector(state => state?.userReducer);

  return (
    <Stack.Navigator initialRouteName={userProfileStackName.USER_PROFILE}>
      <Stack.Screen
        name={userProfileStackName.USER_PROFILE}
        component={UserProfile}
        options={{headerShown: false, headerShadowVisible: false}}
      />

      <Stack.Screen
        name={userProfileStackName.FOLLOWERS}
        component={Followers}
        options={{
          headerLargeStyle: {},
          header: ({navigation}) => (
            <CustomHeader
              back
              leftIconColor="black"
              // headerContainer={
              //   {
              //     // height: userDetails?.displayName?.length > 20 ? 60 : 50,
              //   }
              // }
              // leftIconStyle={{width: '10%'}}
              // fontFamily={!IS_IOS ? fonts?.openSansBold : fonts.openSansBold}
              fontFamily={fonts?.openSansBold}
              fontSize={userDetails?.displayName?.length > 20 ? 16 : 20}
              lineHeight={30}
              // lineHeight={userDetails?.displayName?.length > 20 ? 60 : 50}
              title={capitalizeString(userDetails?.displayName)}
              titleColor="black"
              titleStyle={{
                // borderWidth: 1,
                width: '100%',
                // paddingTop: userDetails?.displayName?.length > 20 ? 10 : 0,
              }}
              rightIcon
            />
          ),
        }}
      />

      <Stack.Screen
        name={userProfileStackName.FOLLOWING}
        component={Following}
        options={{
          header: () => (
            <CustomHeader
              headerContainer={{
                height: userDetails?.displayName?.length > 20 ? 60 : 50,
              }}
              title={userDetails?.displayName}
              back
              leftIconColor="black"
              textAlignTitle="center"
              fontFamily={'openSansBold'}
              fontSize={userDetails?.displayName?.length > 20 ? 16 : 20}
              lineHeight={30}
              titleColor="black"
              rightIcon
              titleStyle={
                {
                  // borderWidth: 1,
                  // width: '100%',
                  // fontFamily: fonts?.openSansBold,
                  // fontSize: fontSizePixelRatio(20),
                  // color: colors.defaultBlack,
                  // paddingTop: 10,
                }
              }
            />
          ),
        }}
      />

      <Stack.Screen
        name={userProfileStackName.VIEW_POST}
        component={ViewPost}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default UserProfileStackNavigation;
