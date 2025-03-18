import moment from 'moment';
import * as React from 'react';
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
import requestStyle from './Requests.style';
import useRequestWitPagination from './useRequestWitPagination';

const Requests = ({route}: any) => {
  const {t} = useTranslation();
  const {navigate} = useStackNavigation();
  const bookingId = route?.params?.bookingId;
  console.log({bookingId});

  const {
    bookings,
    fetchMoreData,
    refreshData,
    progressState: {isRefetching, isLoading, hasMoreData, isFetching},
  } = useRequestWitPagination(
    statusType.requested,
    filterChildKeys.proUserUId_status,
    bookingId!,
  );
  // Write a function to find the longest common prefix string amongst an array of strings.
  // If there is no common prefix, return an empty string "".

  // Example 1:

  // // Input: strs = ["flower","flow","flight"]
  // Output: "fl"
  // Example 2:

  // Input: strs = ["dog","racecar","car"]
  // Output: ""
  // Explanation: There is no common prefix among the input strings.
  // var longestCommonPrefix = function(strs) {
  //  let firstValue = strs[0]
  // let newArray=firstValue?.split('')
  // for(i=0;i<newArray.length;i++){
  // if(newArray[i]===strs[i+1])}
  // };
  return (
    <Container
      isScrollable={false}
      isLoading={isLoading}
      contentContainerStyle={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item?.id?.toString() ?? ''}
        data={bookings}
        refreshControl={
          <RefreshControlComponent
            refreshing={isRefetching}
            onRefresh={refreshData}
          />
        }
        onEndReachedThreshold={0.3}
        onEndReached={() => fetchMoreData()}
        ListEmptyComponent={
          !isLoading && (bookings == null || bookings?.length == 0) ? (
            <Empty
              text={t('customWords:noRequestYet')}
              iconElement={
                <FontAwesome5
                  name="inbox"
                  size={40}
                  style={{color: '#808080'}}
                />
              }
            />
          ) : null
        }
        renderItem={({item}) => (
          <View style={requestStyle.mainContainer}>
            <CustomText
              fontSize={18}
              style={[requestStyle.userBoldDetails, {left: 10}]}>
              {`${moment(item?.orderDate?.date).format(
                'dddd MMMM D',
              )} at ${moment(item?.orderDate?.time, ['HH:mm']).format(
                'h:mm A',
              )} `}
            </CustomText>

            <CustomCard
              onNavigation={() => {
                navigate(tabStackRouteName.BOOKING, {
                  screen: bookingSackRouteName.REQUEST_DETAIL,
                  params: {
                    headingText: t('common:requests'),
                    displayCancel: false,
                    displayButton: true,
                    badgeText: t('common:requests'),
                    details: item,
                  },
                });
              }}
              request={item}
              displayButton={true}
              displayBadge={false}
              badgeText={t('common:requests')}
            />
          </View>
        )}
        ListFooterComponent={
          isFetching ? (
            <ActivityIndicator size={'large'} color={colors?.primary} />
          ) : null
        }
      />
    </Container>
  );
};

export default Requests;
