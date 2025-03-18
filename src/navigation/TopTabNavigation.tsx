import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Missions from '../screens/booking/missions/Missions';
import Requests from '../screens/booking/requests/Requests';
import Accepted from 'src/screens/booking/accepted/Accepted';
import {colors} from 'src/theme/colors';
import OnHold from 'src/screens/booking/onHold/OnHold';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import {useTranslation} from 'react-i18next';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {topTabNavRouteName} from './constant/topTabNavRouteName';
import {topTabNavParam} from './params/topTabNavParam';

const {Navigator, Screen} = createMaterialTopTabNavigator<topTabNavParam>();
export default function TopTabNavigation({route}: any) {
  const userDetails = useAppSelector(state => state?.userReducer?.userType);
  const {t} = useTranslation();

  return (
    <Navigator
      // initialRouteName={topTabNavRouteName.ON_HOLD}
      initialRouteName={topTabNavRouteName.REQUESTS}
      screenOptions={{
        tabBarLabelStyle: {
          textTransform: 'capitalize',
          fontFamily: fonts.openSansBold,
          fontSize: fontSizePixelRatio(13),
          width: SCREEN_WIDTH / 4,
        },
        tabBarStyle: {elevation: 0},
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#808080',
        tabBarIndicatorStyle: {backgroundColor: colors.primary},
      }}>
      {userDetails === 'client' ? (
        <>
          <Screen
            name={topTabNavRouteName.ON_HOLD}
            component={OnHold}
            options={{tabBarLabel: t('common:onHold')}}
          />
          <Screen
            name={topTabNavRouteName.ACCEPTED}
            component={Accepted}
            options={{tabBarLabel: t('common:accepted')}}
          />
        </>
      ) : (
        <>
          <Screen
            name={topTabNavRouteName.MISSIONS}
            component={Missions}
            options={{tabBarLabel: t('common:missions')}}
          />
          <Screen
            name={topTabNavRouteName.REQUESTS}
            component={Requests}
            options={{tabBarLabel: t('common:requests')}}
          />
          <Screen
            name={topTabNavRouteName.ON_HOLD}
            component={OnHold}
            options={{tabBarLabel: t('common:onHold')}}
          />
          <Screen
            name={topTabNavRouteName.ACCEPTED}
            component={Accepted}
            options={{tabBarLabel: t('common:accepted')}}
          />
        </>
      )}
    </Navigator>
  );
}
