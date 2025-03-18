import moment from 'moment';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, FlatList, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import Container from 'src/shared/components/container/Container';
import CustomText from 'src/shared/components/customText/CustomText';
import Empty from 'src/shared/components/placeholder/Empty';
import RefreshControlComponent from 'src/shared/components/refreshControlComponent/RefreshControlComponent';
import {colors} from 'src/theme/colors';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import CustomCard from '../component/CustomCard';
import {filterChildKeys, statusType} from '../component/RequestsJSON';
import missionStyle from '../missions/Missions.style';
import useBookingHistoryWithPagination from './useBookingHistoryWithPagination';

const BookingHistory = ({route}: any) => {
  const {t} = useTranslation();
  const navigation = useStackNavigation();
  const bookingId = route?.params?.bookingId!;

  const {
    fetchMoreData,
    bookings,
    refreshData,
    progressState: {isLoading, isRefetching, hasMoreData, isFetching},
  } = useBookingHistoryWithPagination(filterChildKeys.clientUserUId, bookingId);
  return (
    <Container
      isLoading={isLoading || (!bookings?.length && isFetching)}
      isScrollable={false}
      contentContainerStyle={{backgroundColor: '#fff'}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item?.id + ''}
        refreshControl={
          <RefreshControlComponent
            refreshing={isRefetching}
            onRefresh={() => {
              refreshData();
            }}
          />
        }
        data={bookings}
        onEndReached={() => fetchMoreData()}
        onEndReachedThreshold={0.2}
        renderItem={({item, index}: {item: TBookingHistory; index: number}) => {
          return (
            <>
              {bookings![index - 1]?.orderDate?.date !==
              bookings![index]?.orderDate?.date ? (
                <CustomText fontSize={18} style={missionStyle.listHeader}>
                  {` ${moment(item?.orderDate?.date).format('dddd MMMM D')}`}
                </CustomText>
              ) : null}
              <View style={missionStyle.mainContainer}>
                <CustomText
                  fontSize={14}
                  style={[missionStyle.userBoldDetails, {left: 10}]}>
                  {` ${moment(item?.orderDate?.time, ['HH:mm']).format(
                    'h:mm A',
                  )}`}
                </CustomText>

                <CustomCard
                  onNavigation={() => {
                    navigation.navigate(rootStackName.SCREEN_STACK, {
                      screen: screenStackName.REQUEST_DETAILS,
                      params: {
                        headingText:
                          route?.params?.headerName ??
                          t('common:bookingHistory'),
                        displayBadge:
                          item?.status === statusType.canceled && true,
                        badgeText: item?.status,
                        details: item,
                        ratePro: item?.status !== statusType.canceled && true,
                      },
                    });
                  }}
                  request={item}
                  displayButton={false}
                  displayBadge={item?.status === statusType.canceled && true}
                  badgeText={item?.status}
                  ratePro={item?.status === statusType.canceled && true}
                />
              </View>
            </>
          );
        }}
        ListEmptyComponent={
          !isFetching && (bookings == null || bookings?.length == 0) ? (
            <Empty
              text={
                route?.params?.headerName == t('common:missionsHistory')
                  ? t('common:noMissionYet')
                  : t('common:missionsHistory')
              }
              iconElement={
                <FontAwesome5
                  name="briefcase"
                  size={40}
                  style={{color: '#808080'}}
                />
              }
            />
          ) : null
        }
        ListFooterComponent={
          !bookings?.length && isFetching ? (
            <ActivityIndicator size={'large'} color={colors?.primary} />
          ) : null
        }
      />
    </Container>
  );
};

export default BookingHistory;
