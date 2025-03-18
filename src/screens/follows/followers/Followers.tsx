import {Alert, FlatList, Platform} from 'react-native';
import React from 'react';
import Container from 'src/shared/components/container/Container';
import CustomText from 'src/shared/components/customText/CustomText';
import FollowerListComponent from '../components/followerListComponent/FollowerListComponent';
import useFollowers from './useFollowers';
import {useAppSelector} from 'src/redux/reducer/reducer';
import ViewFollowerListComponent from '../components/viewFollowerListComponent/ViewFollowerListComponent';
import Empty from 'src/shared/components/placeholder/Empty';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import RefreshControlComponent from 'src/shared/components/refreshControlComponent/RefreshControlComponent';

const Followers = (uid: any) => {
  const proId = uid?.route?.params?.uid;

  const userId = useAppSelector(state => state?.userReducer?.userDetails?.uid);
  const {followers, loading, getData, isRefreshing, onRefresh, followersCount} =
    useFollowers(proId);
  const {t} = useTranslation();
  // console.log({followersCount});
  return (
    <Container
      isLoading={loading}
      contentContainerStyle={{
        marginHorizontal: 10,
        borderWidth: 1,
        paddingTop: 0,
      }}
      isScrollable={false}>
      <FlatList
        data={followers}
        refreshControl={
          <RefreshControlComponent
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
        ListHeaderComponent={
          !!followersCount ? (
            <CustomText
              fontFamily="openSansBold"
              style={{marginVertical: 10, marginHorizontal: 20}}
              color="grey"
              fontSize={12}>
              {followersCount} Followers
            </CustomText>
          ) : followers?.length ? (
            <CustomText
              fontFamily="openSansBold"
              style={{marginVertical: 10, marginHorizontal: 20}}
              color="grey"
              fontSize={12}>
              {followers?.length} Followers
            </CustomText>
          ) : null
        }
        renderItem={({item, index}) => {
          return proId !== userId ? (
            <ViewFollowerListComponent proData={item} />
          ) : (
            <FollowerListComponent key={index} proData={item} index={index} />
          );
        }}
        ListEmptyComponent={
          <Empty
            text={t('customWords:noFollower')}
            iconElement={
              <MaterialCommunityIcons
                name="briefcase-check"
                size={40}
                style={{color: '#808080'}}
              />
            }
          />
        }
      />
    </Container>
  );
};

export default Followers;
