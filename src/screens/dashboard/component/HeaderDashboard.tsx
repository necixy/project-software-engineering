import {View, Text, Platform, ActivityIndicator} from 'react-native';
import React, {useMemo} from 'react';
import CardContainer from './CardContainer';
import CustomText from 'src/shared/components/customText/CustomText';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {colors} from 'src/theme/colors';
import {IS_IOS, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import moment from 'moment';
import {t} from 'i18next';
import {getCurrencySymbol} from 'src/utils/getCurrencySymbol';

const HeaderDashboard = ({
  accountDetails,
  dashboardData,
  totalBookings = 0,
  isLoading,
  updateAccountDetails,
  nextPayout,
  default_currency,
}: {
  dashboardData: dashboardBalanceType;
  accountDetails: any;
  totalBookings: number;
  updateAccountDetails: () => void;
  isLoading: boolean;
  nextPayout?: any;
  default_currency?: string;
}) => {
  const walletDetails = [
    {
      id: 1,
      title: t('customWords:earnedToday'),
      value: `${getCurrencySymbol(
        default_currency,
      )}${dashboardData?.todayCharges?.completedBalance.toFixed(2)}`,
    },
    {
      id: 1,
      title: t('customWords:missionCompleted'),
      value: dashboardData?.bookingCount?.completedBookings ?? 0,
    },
    {
      id: 1,
      title: t('customWords:nextPayout'),
      value: nextPayout,
      // ?? moment().add(1, 'months').date(1).format('DD-MM-YYYY'),
    },
  ];

  const paymentDetails: {
    id: string;
    paymentMethod: string;
    paymentMethodValue: string;
    paymentDetails: string;
    paymentDetailsValue: string;
  }[] = useMemo(() => {
    return accountDetails?.map((item: any) => ({
      id: item?.id,
      paymentMethod: t('common:paymentMethod'),
      paymentMethodValue: item?.bank_name,
      paymentDetails: t('customWords:paymentDetails'),
      paymentDetailsValue: `XXXX XXXX XXXX ${item?.last4}`,
    }));
  }, [accountDetails]);

  // const paymentDetails = [
  //   {
  //     id: 1,
  //     title: t('common:paymentMethod'),
  //     value: accountDetails?.bank_name,
  //   },
  //   {
  //     id: 1,
  //     title: t('customWords:paymentDetails'),
  //     value: `XXXX XXXX XXXX ${accountDetails?.last4}`,
  //   },
  // ];

  const bookingDataList = [
    {
      id: 1,
      title: t('customWords:totalBooking'),
      value: totalBookings,
      icon: (
        <FontAwesome5Icon
          name="calendar-check"
          size={20}
          color={colors?.primary}
        />
      ),
    },
    {
      id: 1,
      title: t('customWords:payoutHistory'),
      value: dashboardData?.payouts?.totalCount ?? 0,

      icon: (
        <FontAwesome6Icon
          name="hand-holding-dollar"
          size={20}
          color={colors?.primary}
        />
      ),
    },
  ];

  const renderComponent = (item: any, index: any) => {
    return (
      <CardContainer
        key={index}
        containerStyle={{
          position: 'relative',
          width: SCREEN_WIDTH * 0.45,
          paddingVertical: 10,
          paddingHorizontal: 20,
          alignItems: 'flex-start',
          borderRadius: 16,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <CustomText fontSize={16}>{item?.value}</CustomText>
          <View>{item?.icon}</View>
        </View>

        <CustomText
          fontFamily="openSansRegular"
          style={{marginTop: 20}}
          color="lightGrey">
          {item?.title}
        </CustomText>
      </CardContainer>
    );
  };

  return (
    <>
      <CardContainer
        title={t('customWords:walletBalance')}
        containerStyle={{position: 'absolute', top: -90, zIndex: 1000}}>
        {/* <CustomText fontSize={15} fontFamily='openSansBold' color={'lightGrey'}></CustomText> */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {dashboardData?.balance?.pending?.map((item, index) =>
            item?.amount || index === 0 ? (
              <CustomText
                key={item?.currency}
                fontSize={28}
                fontFamily={'openSansBold'}
                color={'defaultBlack'}
                style={{
                  marginBottom: 20,
                  marginTop: 5,
                  marginEnd: item?.amount ? 10 : 0,
                }}>
                {getCurrencySymbol(item?.currency)}{' '}
                {item?.amount ? (item?.amount / 100).toFixed(2) : 0}{' '}
                {item?.amount &&
                dashboardData?.balance?.pending.length - 1 !== index
                  ? '|'
                  : ''}
              </CustomText>
            ) : null,
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          {walletDetails?.map((item, index) => {
            return (
              <View key={index} style={{marginEnd: 2, alignItems: 'center'}}>
                <CustomText
                  fontSize={12}
                  fontFamily={'openSansBold'}
                  color={'lightGrey'}
                  style={{marginBottom: 3}}>
                  {item?.title}
                </CustomText>
                <CustomText
                  fontSize={15}
                  fontFamily={'openSansBold'}
                  color="defaultBlack">
                  {item?.value}
                </CustomText>
              </View>
            );
          })}
        </View>
      </CardContainer>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 130,
          justifyContent: 'space-between',
        }}>
        {bookingDataList?.map(renderComponent)}
      </View>

      <CardContainer
        title={t('common:bankDetails')}
        titleStyle={{
          fontSize: 14,
          color: colors?.grey,
          flex: 1,
          flexWrap: 'nowrap',
          textAlign: 'left',

          // textAlign: 'center',
        }}
        titleContainerStyle={{
          // justifyContent: 'space-between',
          alignSelf: 'center',
          width: 'auto',
        }}
        sideBtn={
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <CustomButton
              onPress={updateAccountDetails}
              type="unstyled"
              style={{paddingHorizontal: 5}}
              textProps={{style: {color: colors?.primary}}}>
              {t('common:edit')}
            </CustomButton>
          )
        }
        // titleContainerStyle={{
        //   alignSelf: 'center',
        // }}
        // titleContainerStyle={{width: 'auto'}}
        containerStyle={{marginTop: 20}}>
        {paymentDetails?.map?.((item, index) => (
          <View
            key={item?.id}
            style={[
              {
                flexDirection: 'row',
                borderBottomWidth: paymentDetails?.length - 1 === index ? 0 : 1,
                borderColor: colors.inputBorder,

                // width: '100%',
                // justifyContent: 'space-between',
              },
              paymentDetails?.length === 1
                ? {paddingTop: 10}
                : {paddingVertical: 10},
            ]}>
            <View
              style={{
                marginEnd: 2,
                alignItems: 'flex-start',
                width: SCREEN_WIDTH / 2.3,
              }}>
              <CustomText
                fontSize={12}
                fontFamily={'openSansBold'}
                color={'lightGrey'}
                style={{marginBottom: 3}}>
                {item?.paymentMethod}
              </CustomText>
              <CustomText
                fontSize={14}
                numberOfLines={3}
                fontFamily="openSansRegular"
                color="grey"
                style={{marginEnd: 5}}>
                {item?.paymentMethodValue}
              </CustomText>
            </View>
            <View
              style={{
                marginEnd: 2,
                alignItems: 'flex-start',
                width: SCREEN_WIDTH / 2.3,
              }}>
              <CustomText
                fontSize={12}
                fontFamily={'openSansBold'}
                color={'lightGrey'}
                style={{marginBottom: 3}}>
                {item?.paymentDetails}
              </CustomText>
              <CustomText
                fontSize={14}
                numberOfLines={3}
                fontFamily="openSansRegular"
                color="grey"
                style={{marginEnd: 5}}>
                {item?.paymentDetailsValue}
              </CustomText>
            </View>
          </View>
        ))}
      </CardContainer>
    </>
  );
};

export default HeaderDashboard;
