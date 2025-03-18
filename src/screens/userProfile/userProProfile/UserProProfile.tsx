import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import React, {useState} from 'react';
import {Share, View} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {useAppSelector} from 'src/redux/reducer/reducer';
import Container from 'src/shared/components/container/Container';
import CustomImage from 'src/shared/components/customImage/CustomImage';
import CustomText from 'src/shared/components/customText/CustomText';
import Empty from 'src/shared/components/placeholder/Empty';
import LoadingSpinner from 'src/shared/components/placeholder/LoadingSpinner';
import RefreshControlComponent from 'src/shared/components/refreshControlComponent/RefreshControlComponent';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import RenderPostItems from '../userProfileHeader/RenderPostItems';
import UserProfileHeader from '../userProfileHeader/UserProfileHeader';
import ReviewList from './ReviewList';
import useFetchPostsWithPagination from './hooks/useFetchPostsWithPagination';
import {t} from 'i18next';
// import useFetchReviews from './hooks/useFetchReviews';

const UserProProfile = ({tab}: {tab?: 'A' | 'B'}) => {
  // const {postList, loadMorePosts, loading, refreshPosts, refreshing} =
  //   useFetchPost();

  const {
    posts,
    loadMorePosts,
    isError,
    isFetching,
    isFetchingMore,
    isLoading,
    isRefreshing,
    refreshPosts,
  } = useFetchPostsWithPagination();

  const [like, setLike] = useState(false);
  const serverType = useAppSelector(
    state => state?.serverReducer?.baseUrl?.serverType,
  );
  const uid = useAppSelector(state => state?.userReducer?.userDetails?.uid);
  // const {reviews, replyTo, setReplyTo, reviewReply, setReviewRelpy, submit} =
  //   useFetchReviews(uid);
  const {navigate, getState} = useStackNavigation();
  const handleShare = () => {
    Share.share({
      message: `Share this profile https://vita-abe0f.web.app/viewUser?userId=${uid}`,
    });
  };
  return (
    <Container isScrollable={false}>
      <Tabs.Container
        initialTabName={tab ?? 'A'}
        renderHeader={() => (
          <View>
            <CustomHeader
              headerContainer={{
                marginTop: -5,
                alignItems: 'center',
              }}
              back={getState().index == 0 ? false : true}
              leftIconColor="blue"
              leftIcon
              title="Vita"
              fontSize={24}
              fontFamily={fonts?.fredokaSemiBold}
              lineHeight={30}
              rightIcon={
                <Feather name="share-2" color={colors?.primary} size={24} />
              }
              handleRight={handleShare}
            />

            {serverType !== 'LIVE' ? (
              <CustomText textAlign="center" fontSize={8} color="lightGrey">
                {uid}
              </CustomText>
            ) : null}
            <UserProfileHeader />
          </View>
        )}
        headerContainerStyle={{
          shadowOpacity: 0,
          elevation: 0,
        }}
        containerStyle={{backgroundColor: '#FFF', flex: 1}}>
        <Tabs.Tab
          name="A"
          label={() => {
            return (
              <View
                style={{
                  width: '100%',
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Entypo name="menu" size={30} color={colors?.primary} />
              </View>
            );
          }}>
          <Tabs.FlatList
            nestedScrollEnabled
            contentContainerStyle={{
              padding: 0,
              backgroundColor: '#fff',
            }}
            style={{alignSelf: 'center'}}
            numColumns={3}
            data={posts}
            renderItem={({item, index}) => {
              return (
                <RenderPostItems
                  item={item}
                  index={index}
                  onPress={() =>
                    navigate(screenStackName.VIEW_POST, {
                      feedPostId: item,
                    })
                  }
                />
              );
            }}
            keyExtractor={item => item?.id}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMorePosts}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControlComponent
                refreshing={isRefreshing}
                onRefresh={refreshPosts}
              />
            }
            ListFooterComponent={
              isFetchingMore ? (
                <>
                  {__DEV__ && console.log('loading')}
                  <LoadingSpinner textDisable style={{marginVertical: 20}} />
                </>
              ) : null
            }
            ListEmptyComponent={
              isLoading ? (
                <LoadingSpinner style={{marginBottom: SCREEN_WIDTH}} />
              ) : (
                <Empty
                  text={t('common:noPostYet')}
                  iconElement={
                    <FontAwesome5Icon
                      name="images"
                      size={40}
                      color={colors?.grey}
                    />
                  }
                />
              )
            }
          />
        </Tabs.Tab>
        <Tabs.Tab
          name="B"
          children={
            <Tabs.ScrollView nestedScrollEnabled>
              <ReviewList proId={undefined} />
            </Tabs.ScrollView>
          }
          label={() => {
            return (
              <View
                style={{
                  width: '50%',
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CustomImage
                  source={require('src/assets/images/star.png')}
                  style={{width: 24, height: 24}}
                />
              </View>
            );
          }}
        />
      </Tabs.Container>
    </Container>
  );
};

export default UserProProfile;
