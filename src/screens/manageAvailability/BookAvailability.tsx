import React, {useLayoutEffect} from 'react';
import {View} from 'react-native';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {globalStyles} from 'src/constants/globalStyles.style';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomCalendar from 'src/shared/components/customCalendar/CustomCalendar';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import BookTimelist from './BookTimelist';
import useBookAvailability from './hooks/useBookAvailability';
import {fonts} from 'src/theme/fonts';

const BookAvailability = ({
  route: {params},
}: {
  route: {
    params: {
      item?: any;
      name: string;
      profile: string;
      uid: string;
      fcmTokens?: any;
      menuId: any;
      rating?: string;
      default_currency?: string;
    };
  };
}) => {
  const {
    item,
    name,
    profile,
    uid: proUserId,
    fcmTokens,
    menuId,
    rating,
    default_currency,
  } = params ?? {};
  const {
    t,
    availability,
    selectedDate,
    setSelectedDate,
    date,
    setDates,
    selectedTime,
    setSelectedTime,
    uid,
    isLoading,
    timeListData,
    navigation,
    bookTimesSlot,
    bookedTime,
    setBookedTime,
    alreadyBooked,
  } = useBookAvailability({proUserId});

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader
          titleType="custom"
          leftIconColor="white"
          leftIconContainer={{
            width: '10%',
          }}
          leftIconStyle={{width: '100%'}}
          back
          lineHeight={25}
          fontFamily={'openSansBold'}
          fontSize={18}
          titleColor={'black'}
          textAlignTitle="left"
          headerContainer={{
            justifyContent: 'flex-start',
            backgroundColor: colors?.primary,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              alignItems: 'center',
              width: '100%',
            }}>
            <Avatar
              source={
                !!profile
                  ? {
                      uri: profile,
                    }
                  : undefined
              }
              style={{
                width: 40,
                height: 40,
                zIndex: 99,
                borderRadius: 50,
                marginEnd: 10,
              }}
            />
            <CustomText
              style={{paddingEnd: 20}}
              numberOfLines={2}
              color={'secondary'}
              fontFamily="openSansBold">
              {name ?? 'user'}
            </CustomText>
          </View>
        </CustomHeader>
      ),
    });
  }, []);

  const BookTimeListHeader = () => {
    return (
      <View>
        <CustomText
          style={{margin: 10, marginVertical: 20}}
          fontFamily="openSansBold"
          color="grey"
          fontSize={14}>
          {t('common:chooseBookingTime')}
        </CustomText>

        <View style={{paddingVertical: 20}}>
          <CustomCalendar
            availability={availability}
            date={date}
            selectedDate={selectedDate}
            setDates={setDates}
            setSelectedDate={setSelectedDate}
          />
        </View>
      </View>
    );
  };

  // console.log({timeListData, bookedTime, alreadyBooked, availability});
  return (
    <Container
      isLoading={isLoading}
      contentContainerStyle={[globalStyles.mh2]}
      isScrollable={false}>
      <BookTimelist
        header={BookTimeListHeader}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        availability={availability}
        selectedDate={selectedDate}
        timeListData={timeListData}
        bookedTime={bookedTime}
        setBookedTime={setBookedTime}
        alreadyBooked={alreadyBooked}
      />
      {bookedTime?.length ? (
        <CustomButton
          type="blue"
          style={{
            width: SCREEN_WIDTH * 0.7,
            alignSelf: 'center',
            marginVertical: 20,
          }}
          textProps={{
            fontFamily: 'openSansBold',
          }}
          onPress={() => {
            let bookingCheckoutParams = {
              item,
              name,
              profile,
              uid: proUserId,
              date: selectedDate,
              time: bookedTime,
              fcmTokens,
              menuId,
              rating,
              default_currency,
            };
            bookTimesSlot(bookingCheckoutParams);
          }}>
          {t('common:save')}
        </CustomButton>
      ) : null}
    </Container>
  );
};

export default BookAvailability;
