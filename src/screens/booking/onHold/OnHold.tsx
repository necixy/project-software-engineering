import moment from 'moment';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, FlatList, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
import onHoldStyle from './OnHold.style';

const OnHold = ({route}: any) => {
  const {t} = useTranslation();
  const {navigate} = useStackNavigation();
  const bookingId = route?.params?.bookingId;
  const {
    bookings,
    fetchMoreData,
    refreshData,
    progressState: {isRefetching, isLoading, hasMoreData, isFetching},
  } = useRequestWitPagination(
    statusType.requested,
    filterChildKeys.clientUserUId_status,
    bookingId!,
  );
  return (
    <Container
      isScrollable={false}
      isLoading={isLoading}
      contentContainerStyle={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item?.id + ''}
        data={bookings}
        ListEmptyComponent={
          !isLoading && (bookings == null || bookings?.length == 0) ? (
            <Empty
              text={t('customWords:noOnHoldYet')}
              iconElement={
                <MaterialCommunityIcons
                  name="motion-pause"
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
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          fetchMoreData();
        }}
        renderItem={({item}) => {
          return (
            <View style={onHoldStyle.mainContainer}>
              <CustomText fontSize={18} style={[onHoldStyle.userBoldDetails]}>
                {` ${moment(item.orderDate?.date).format(
                  'dddd MMMM D',
                )} at ${moment(item.orderDate?.time, ['HH:mm']).format(
                  'h:mm A',
                )}  `}
              </CustomText>
              <CustomCard
                onNavigation={() => {
                  navigate(tabStackRouteName.BOOKING, {
                    screen: bookingSackRouteName.REQUEST_DETAIL,
                    params: {
                      headingText: t('common:bookingDetails'),
                      displayCancel: true,
                      displayBadge: true,
                      badgeText: t('common:onHold'),
                      details: item,
                    },
                  });
                }}
                request={item}
                displayButton={false}
                displayBadge={true}
                badgeText={t('common:onHold')}
              />
            </View>
          );
        }}
        ListFooterComponent={
          isFetching ? (
            <ActivityIndicator color={colors?.primary} size={'large'} />
          ) : null
        }
      />
    </Container>
  );
};

export default OnHold;
