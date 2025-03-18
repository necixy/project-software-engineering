import {FlatList, Platform} from 'react-native';
import React from 'react';
import Container from 'src/shared/components/container/Container';
import CustomText from 'src/shared/components/customText/CustomText';
import useFollowing from './useFollowing';
import FollowingListComponent from '../components/followingListComponent/FollowingListComponent';
import {useAppSelector} from 'src/redux/reducer/reducer';
import Empty from 'src/shared/components/placeholder/Empty';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import RefreshControlComponent from 'src/shared/components/refreshControlComponent/RefreshControlComponent';

const Following = () => {
  const {following, loading, isRefreshing, onRefresh, count} = useFollowing();
  const {t} = useTranslation();

  return (
    <Container
      isLoading={loading}
      contentContainerStyle={{marginHorizontal: 10}}
      isScrollable={false}>
      <FlatList
        data={following}
        ListHeaderComponentStyle={{marginTop: Platform.OS === 'ios' ? 50 : 10}}
        ListHeaderComponent={
          count ?? 0 ? (
            <CustomText
              fontFamily="openSansBold"
              style={{margin: 10}}
              color="grey"
              fontSize={12}>
              {`${count} ${t('common:following')}`}
            </CustomText>
          ) : null
        }
        refreshControl={
          <RefreshControlComponent
            onRefresh={onRefresh}
            refreshing={isRefreshing}
          />
        }
        renderItem={({item, index}) => {
          return <FollowingListComponent key={index} item={item} />;
        }}
        ListEmptyComponent={
          <Empty
            text={t('customWords:noFollowing')}
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

export default Following;
