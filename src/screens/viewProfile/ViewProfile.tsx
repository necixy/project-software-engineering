import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import CustomImage from 'src/shared/components/customImage/CustomImage';
import Empty from 'src/shared/components/placeholder/Empty';
import LoadingSpinner from 'src/shared/components/placeholder/LoadingSpinner';
import RefreshControlComponent from 'src/shared/components/refreshControlComponent/RefreshControlComponent';
import { colors } from 'src/theme/colors';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import useFetchPostsWithPagination from '../userProfile/userProProfile/hooks/useFetchPostsWithPagination';
import useFetchReviews from '../userProfile/userProProfile/hooks/useFetchReviews';
import ReviewList from '../userProfile/userProProfile/ReviewList';
import useViewProfile from './useViewProfile';
import ViewProfileHeader from './viewProfileHeader/ViewProfileHeader';
import RenderPostItems from '../userProfile/userProfileHeader/RenderPostItems';
import { screenStackName } from 'src/navigation/constant/screenStackName';
import { searchStackName } from 'src/navigation/constant/searchStackRouteName';

const ViewProfile = (params: any) => {
  const userId = params?.route?.params?.uid! ?? params?.route?.params?.userId!;
  const tabValue = params?.route?.params?.tabName!;
  const { t } = useTranslation();

  const [like, setLike] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { postList } = useViewProfile(userId, setIsLoading);
  const { navigate, replace } = useStackNavigation();
  const { reviews, replyTo, setReplyTo, reviewReply, setReviewRelpy, submit } =
    useFetchReviews(userId);
  const {
    posts,
    loadMorePosts,
    isError,
    isFetching,
    isFetchingMore,
    isLoading: loading,
    isRefreshing,
    refreshPosts,
  } = useFetchPostsWithPagination(userId);
  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <Tabs.Container
      initialTabName={tabValue ?? 'A'}
      renderHeader={() => ViewProfileHeader(userId, params)}
      key={Math.random()}
      containerStyle={{ backgroundColor: '#FFF', flex: 1 }}>
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
          style={{ alignSelf: 'center' }}
          numColumns={3}
          data={posts! ?? []}
          renderItem={({ item, index }) => {
            return (
              <RenderPostItems
                item={item}
                index={index}
                onPress={() => {
                  console.log({ item });
                  navigate(screenStackName.VIEW_POST, {
                    feedPostId: item!,
                  });
                }}
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
              <LoadingSpinner textDisable style={{ marginVertical: 20 }} />
            ) : null
          }
          ListEmptyComponent={
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
          }
        />
      </Tabs.Tab>
      <Tabs.Tab
        name="B"
        children={
          <Tabs.ScrollView nestedScrollEnabled>
            <ReviewList proId={userId} />
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
                style={{ width: 24, height: 24 }}
              />
            </View>
          );
        }}
      />
    </Tabs.Container>
  );
};

export default ViewProfile;

{
  /* <Tabs.FlatList
            contentContainerStyle={{
              padding: 0,
              backgroundColor: '#fff',
            }}
            numColumns={3}
            data={postList}
            renderItem={({
              item,
              index,
            }: {
              item: TFeedPostObject;
              index: number;
            }) => (
              <RenderPostItems
                item={item}
                index={index}
                onPress={() =>
                  navigate(rootStackName.SCREEN_STACK, {
                    screen: screenStackName.VIEW_POST,
                    params: {
                      feedPostId: item,
                    },
                  })
                }
              />
            )}
            keyExtractor={post => {
              return post?.id.toString();
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Empty
                text="No post yet"
                iconElement={
                  <FontAwesome5Icon
                    name="images"
                    size={40}
                    color={colors?.grey}
                  />
                }
              />
            }
          /> */
}
