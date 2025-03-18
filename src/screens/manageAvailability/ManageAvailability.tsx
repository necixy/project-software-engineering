import React, {useLayoutEffect} from 'react';
import {View} from 'react-native';
import {IS_IOS} from 'src/constants/deviceInfo';
import {globalStyles} from 'src/constants/globalStyles.style';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomCalendar from 'src/shared/components/customCalendar/CustomCalendar';
import CustomText from 'src/shared/components/customText/CustomText';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import TimeList from '../availability/component/TimeList';
import useManageAvailability from './hooks/useManageAvailability';

const ManageAvailability = ({route}: any) => {
  const {
    t,
    uid,
    availability,
    date,
    selectedDate,
    setDates,
    setSelectedDate,
    setSelectedTime,
    selectedTime,
    timeListData,
    navigation,
    setSelectionType,
    selectionType,
    isLoading,
    setFirebaseAvailability,
    bookingTimesData,
  } = useManageAvailability();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader
          route={route}
          leftIconColor="black"
          back
          lineHeight={25}
          fontFamily={fonts?.openSansBold}
          fontSize={16}
          titleColor={'black'}
          textAlignTitle="center"
          titleStyle={{alignSelf: 'stretch', width: '100%'}}
          leftIconStyle={{flex: 1.6}}
          rightIconStyle={{
            flex: 1.7,
            marginEnd: 10,
          }}
          rightIcon={
            // selectedDate?.length && selectedTime?.length
            //   ? availability[selectedDate[0]?.dateString] !==
            //       selectedTime.length && bookingTimesData
            //     ? bookingTimesData[selectedDate[0].dateString]?.length !==
            //       selectedTime?.length
            //     : availability[selectedDate[0]?.dateString]?.length !==
            //         selectedTime.length && (
            <CustomButton
              hitSlop={30}
              isLoading={isLoading}
              style={{
                alignSelf: 'flex-end',
                // height: 30,
                // alignSelf: 'flex-end',
                // marginEnd: 10,
              }}
              onPress={() => {
                setFirebaseAvailability();
              }}
              type="unstyled"
              fontSize={12}
              textProps={{
                style: {
                  fontFamily: fonts.openSansBold,
                  color: colors?.primary,
                },
              }}>
              {t('common:done')}
            </CustomButton>
            //     )
            // : null
          }
        />
      ),
    });
  }, [selectedDate, selectedTime]);
  const TimeListHeader = () => {
    return (
      <View>
        <CustomText
          style={{margin: 10, marginVertical: 20}}
          fontFamily="openSansBold"
          color="grey"
          fontSize={14}>
          {t('customWords:selectYourAvailability')}
        </CustomText>
        <CustomButton
          onPress={() => {
            setSelectionType(
              selectionType == 'multiple' ? 'single' : 'multiple',
            );
          }}
          type={selectionType === 'single' ? 'unstyled' : 'blue'}
          style={{
            borderColor: colors.primary,
            borderWidth: 1,
            borderRadius: 10,
            padding: 5,
            paddingHorizontal: 10,
            marginRight: 10,
            alignSelf: 'flex-end',
          }}>
          <CustomText
            color={selectionType == 'multiple' ? 'secondary' : 'primary'}>
            {t('customWords:selectMultipleDates')}
          </CustomText>
        </CustomButton>
        <View style={{paddingVertical: 20}}>
          <CustomCalendar
            selectionType={selectionType}
            availability={availability}
            date={date}
            selectedDate={selectedDate}
            setDates={setDates}
            setSelectedDate={setSelectedDate}
            isSetAvailability={true}
          />
        </View>
        <CustomButton
          onPress={() => {
            const allTimes = timeListData.map(item => item.time);
            setSelectedTime(allTimes);
          }}
          type="unstyled"
          style={{
            borderColor: colors.primary,
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: colors.secondary,
            padding: 5,
            paddingHorizontal: 10,
            marginRight: 10,
            alignSelf: 'flex-end',
          }}>
          <CustomText color="primary">{t('customWords:selectAll')}</CustomText>
        </CustomButton>
      </View>
    );
  };

  return (
    <Container contentContainerStyle={[globalStyles.mh2]} isScrollable={false}>
      <TimeList
        header={TimeListHeader}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        availability={availability}
        selectedDate={selectedDate}
        timeListData={timeListData}
        bookingTimesData={bookingTimesData}
        selectionType={selectionType}
      />
    </Container>
  );
};

export default ManageAvailability;
