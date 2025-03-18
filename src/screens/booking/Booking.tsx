import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useCallback, useState, useTransition} from 'react';
import TopTabNavigation from 'src/navigation/TopTabNavigation';
import {bookingSackRouteName} from 'src/navigation/constant/bookingStackRouteName';
import {bookingStackParams} from 'src/navigation/params/bookingStackParams';
import RequestDetail from './requestDetail/RequestDetail';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import {EventRegister} from 'react-native-event-listeners';

const {Screen, Navigator} = createNativeStackNavigator<bookingStackParams>();

const Booking = () => {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 3000);

  //   return () => {
  //     clearTimeout;
  //   };
  // }, []);

  // if (isLoading) {
  //   return <LoadingSpinner style={{backgroundColor: '#fff'}} />;
  // }

  // return <TopTabNavigation />;

  useFocusEffect(
    useCallback(() => {
      const triggerEvent = () => {
        EventRegister.emit('fetchNewBookings');
      };
      triggerEvent();
    }, []),
  );

  return (
    <Navigator
      screenOptions={{
        header: ({navigation, route}: any) => {
          return (
            <CustomHeader
              headerContainer={{
                alignItems: 'center',
              }}
              leftIconColor="blue"
              back
              title={'Vita'}
              titleStyle={{width: '100%'}}
              fontFamily={'fredokaSemiBold'}
              fontSize={24}
              lineHeight={30}
              navigation={navigation}
              titleColor={'blue'}
              rightIcon
            />
          );
        },
      }}>
      <Screen
        name={bookingSackRouteName.TOP_TAB_NAVIGATION}
        component={TopTabNavigation}
        // options={{headerShown: false}}
      />
      <Screen
        name={bookingSackRouteName.REQUEST_DETAIL}
        component={RequestDetail}
        // options={{headerShown: false}}
      />
    </Navigator>
  );
};

export default Booking;
