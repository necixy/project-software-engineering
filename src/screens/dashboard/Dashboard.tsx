import {useRoute} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {StatusBar, View} from 'react-native';
import {IS_IOS, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import Container from 'src/shared/components/container/Container';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import StarIcon from 'src/shared/components/ratingComponent/src/StarIcon';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {capitalizeString} from 'src/utils/developmentFunctions';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import HeaderDashboard from './component/HeaderDashboard';
import TransactionRow from './component/TransactionRow';
import useDashboard from './useDashboard';

const Dashboard = () => {
  const {
    userDetails,
    isLoading,
    transactionData,
    accountDetails,
    dashboardData,
    updateAccountDetails,
    isEdit,
    t,
    newFormatDate,
  } = useDashboard();

  const navigation = useStackNavigation();
  const route = useRoute();
  const totalBookings = useMemo(
    () =>
      transactionData?.filter((item: any) => item?.object !== 'payout').length,
    [transactionData],
  );

  return (
    <Container
      headerColor={isLoading ? 'white' : 'blue'}
      contentContainerStyle={{
        backgroundColor: isLoading ? colors.secondary : colors?.primary,
      }}
      isLoading={isLoading}>
      <StatusBar barStyle={'light-content'} backgroundColor={colors?.primary} />
      {/* User profile Info Section  */}
      <View style={{backgroundColor: colors?.primary, zIndex: 1}}>
        <CustomHeader
          headerContainer={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: colors?.primary,
          }}
          textAlignTitle="center"
          back
          leftIconColor="white"
          leftIconContainer={{
            width: '10%',
            marginEnd: 0,
          }}
          leftIconStyle={{width: '100%', marginEnd: 0}}
          titleStyle={{
            borderWidth: 0,
            fontFamily: !IS_IOS ? fonts?.openSansBold : fonts.openSansBold,
            // fontWeight: Platform.OS == 'ios' ? '700' : '500',
          }}
          // fontFamily={fonts?.openSansBold}
          fontSize={18}
          titleColor="white"
          navigation={navigation}
          route={route}
          rightIcon
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          height: SCREEN_WIDTH * 0.5,
          alignSelf: 'flex-start',
          paddingHorizontal: 16,
          zIndex: 10,
          paddingTop: '5%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignSelf: 'flex-start',
          }}>
          <Avatar
            source={
              userDetails?.photoURL
                ? {
                    uri: userDetails?.photoURL,
                  }
                : undefined
            }
            style={{
              width: 64,
              height: 64,
              zIndex: 99,
              borderRadius: 50,
              marginEnd: 16,
            }}
          />
          <View style={{width: SCREEN_WIDTH * 0.7}}>
            <CustomText
              fontSize={17}
              numberOfLines={2}
              style={{
                color: colors?.secondary,
                fontFamily: fonts?.openSansBold,
                marginBottom: 3,
              }}>
              {capitalizeString(userDetails?.displayName)}
            </CustomText>
            {userDetails?.rating ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <StarIcon type={'full'} size={20} color={colors?.secondary} />
                <CustomText
                  style={{
                    color: colors?.secondary,
                    fontFamily: !IS_IOS
                      ? fonts?.openSansBold
                      : fonts.openSansBold,
                    marginTop: 2,
                    marginStart: 2,
                  }}>
                  {Number(userDetails?.rating).toFixed(1) ??
                    userDetails?.rating}
                </CustomText>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {/* User Wallet balance  */}

      <View
        style={{
          flex: 1,
          backgroundColor: colors?.secondary,
          width: SCREEN_WIDTH,
          paddingHorizontal: 10,
          alignSelf: 'center',
        }}>
        <HeaderDashboard
          dashboardData={dashboardData!}
          accountDetails={accountDetails}
          totalBookings={totalBookings ?? 0}
          isLoading={isEdit}
          updateAccountDetails={updateAccountDetails}
          nextPayout={newFormatDate}
          default_currency={userDetails?.default_currency}
        />

        {!!transactionData?.length && (
          <CustomText
            fontFamily={'openSansBold'}
            fontSize={20}
            style={{color: colors?.grey, margin: 10, marginVertical: 20}}>
            {t('customWords:transaction')}
          </CustomText>
        )}

        {transactionData?.map((item: any, index: number) => (
          <TransactionRow item={item} key={index} />
        ))}

        {/* <FlatList ListHeaderComponent={HeaderDashboard}  data={[]} renderItem={TansactionItems} keyExtractor={item => item??''} /> */}
      </View>
    </Container>
  );
};

export default Dashboard;
