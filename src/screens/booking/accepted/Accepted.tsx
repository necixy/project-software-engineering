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
import acceptedStyle from './Accepted.style';

const Accepted = ({route}: any) => {
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
    filterChildKeys.clientUserUId_status,
    bookingId!,
  );
  return (
    <Container isScrollable={false} isLoading={isLoading}>
      <View style={{backgroundColor: '#fff', flex: 1}}>
        <FlatList
          data={bookings}
          ListEmptyComponent={
            !isLoading && (bookings == null || bookings?.length == 0) ? (
              <Empty
                text={t('customWords:nothingAcceptedYet')}
                iconElement={
                  <MaterialCommunityIcons
                    name="briefcase-check"
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
          onEndReached={() => fetchMoreData()}
          onEndReachedThreshold={0.2}
          renderItem={({item}) => (
            <View style={acceptedStyle.mainContainer}>
              <CustomText fontSize={18} style={[acceptedStyle.userBoldDetails]}>
                {`${moment(item?.orderDate?.date).format(
                  'dddd MMMM D',
                )} at ${moment(item?.orderDate?.time, ['HH:mm'])?.format(
                  'h:mm A',
                )} `}
              </CustomText>
              <CustomCard
                onNavigation={() => {
                  navigate(tabStackRouteName.BOOKING, {
                    screen: bookingSackRouteName.REQUEST_DETAIL,
                    params: {
                      headingText: t('common:bookingDetails'),
                      displayCancel: true,
                      displayBadge: true,
                      badgeText: t('common:accepted'),
                      details: item,
                    },
                  });
                }}
                request={item}
                displayButton={false}
                displayBadge={true}
                badgeText={t('common:accepted')}
              />
            </View>
          )}
          ListFooterComponent={
            isFetching ? (
              <ActivityIndicator size={'large'} color={colors?.primary} />
            ) : null
          }
        />
      </View>
    </Container>
  );
};

export default Accepted;
