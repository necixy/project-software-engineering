import moment from 'moment';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, FlatList, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {bookingSackRouteName} from 'src/navigation/constant/bookingStackRouteName';
import {tabStackRouteName} from 'src/navigation/constant/tabNavRouteName';
import Container from 'src/shared/components/container/Container';
import CustomText from 'src/shared/components/customText/CustomText';
import Empty from 'src/shared/components/placeholder/Empty';
import RefreshControlComponent from 'src/shared/components/refreshControlComponent/RefreshControlComponent';
import {colors} from 'src/theme/colors';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import CustomCard from '../component/CustomCard';
import {filterChildKeys, statusType} from '../component/RequestsJSON';
import useRequestWitPagination from '../requests/useRequestWitPagination';
import missionStyle from './Missions.style';

const Missions = ({route}: any) => {
  const {t} = useTranslation();
  const {navigate} = useStackNavigation();
  const bookingId = route?.params?.bookingId;
  const {
    bookings,
    fetchMoreData,
    refreshData,
    progressState: {isRefetching, isLoading, hasMoreData, isFetching},
  } = useRequestWitPagination(
    statusType.accepted,
    filterChildKeys.proUserUId_status,
    bookingId!,
  );

  return (
    <Container
      isScrollable={false}
      isLoading={isLoading}
      contentContainerStyle={{backgroundColor: '#fff', flex: 1}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          // !initialFetching
          !isLoading && (bookings == null || bookings?.length == 0) ? (
            <Empty
              text={t('common:noMissionYet')}
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
        refreshControl={
          <RefreshControlComponent
            refreshing={isRefetching}
            onRefresh={refreshData}
          />
        }
        data={bookings}
        renderItem={({item, index}: {item: TBookingDetails; index: number}) => (
          <>
            {bookings !== null &&
            bookings[index - 1]?.orderDate?.date !==
              bookings[index]?.orderDate?.date ? (
              <CustomText fontSize={14} style={missionStyle.listHeader}>
                {` ${moment(item?.orderDate?.date).format('dddd MMMM D')}`}
              </CustomText>
            ) : null}
            <View style={missionStyle.mainContainer}>
              <CustomText
                fontSize={14}
                style={[missionStyle.userBoldDetails, {left: 10}]}>
                {`${moment(item?.orderDate?.time, ['HH:mm'])?.format(
                  'h:mm A',
                )} `}
              </CustomText>
              <CustomCard
                onNavigation={() => {
                  navigate(tabStackRouteName.BOOKING, {
                    screen: bookingSackRouteName.REQUEST_DETAIL,
                    params: {
                      headingText: t('common:missions'),
                      displayCancel: true,
                      displayComplete: true,
                      displayBadge: false,
                      badgeText: t('common:missions'),
                      details: item,
                    },
                  });
                }}
                request={item}
                displayButton={false}
                displayBadge={false}
                badgeText={t('common:missions')}
              />
            </View>
          </>
        )}
        onEndReachedThreshold={0.3}
        onEndReached={() => fetchMoreData()}
        ListFooterComponent={
          // fetchingMoreData
          isFetching ? (
            <ActivityIndicator size={'large'} color={colors?.primary} />
          ) : null
        }
      />
    </Container>
  );
};

export default Missions;
