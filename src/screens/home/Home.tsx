// This code renders the home screen of the application
import {firebase} from '@react-native-firebase/messaging';
import {
  useFocusEffect,
  useRoute,
  useScrollToTop,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Animated, FlatList, Linking, View} from 'react-native';
import {getDeviceId} from 'react-native-device-info';
import {useAppSelector} from 'src/redux/reducer/reducer';
import Container from 'src/shared/components/container/Container';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import Error from 'src/shared/components/placeholder/Error';
import RefreshControlComponent from 'src/shared/components/refreshControlComponent/RefreshControlComponent';
import {colors} from 'src/theme/colors';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import {IS_IOS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants/deviceInfo';
import {globalStyles} from '../../constants/globalStyles.style';
import CustomText from '../../shared/components/customText/CustomText';
import CustomFeedPostComponent from './customFeedPostComponent/CustomFeedPostComponent';
import useFetchPost from './useHome/useFetchPost';
//Functional component code for the home screen (Currently only has a  flatlist).
// const Home = () => {
//   const route = useRoute();
//   const [focus, setFocus] = useState<boolean>(true);
//Functional component code for the home screen (Currently only has a  flatlist).

export const CustomHeader = () => {
  const {t} = useTranslation();
  return (
    <View
      style={[
        {
          paddingTop: 10,
          backgroundColor: colors?.secondary,
          width: '100%',
        },
        globalStyles.alignCenter,
        globalStyles.flexRow,
      ]}>
      <CustomText
        fontFamily="fredokaSemiBold"
        fontSize={24}
        style={[
          {
            marginBottom: IS_IOS ? 0 : 10,
            color: colors?.primary,
          },
        ]}>
        {t('common:vita')}
      </CustomText>
    </View>
  );
};

const Home = () => {
  const [focus, setFocus] = useState<boolean>(true);
  const uid = useAppSelector(state => state?.userReducer?.userDetails?.uid);
  // const {
  //   // onRefetch,
  //   isRefetching,
  //   isError,
  //   onRefresh,
  //   t,
  //   isLoading,
  //   feedPosts,
  //   refreshing,
  //   fetchPosts,
  //   // isFetching,
  //   // handleLoadMore,
  //   isFocused,
  //   mostVisibleIndex,
  //   viewabilityConfigCallbackPairs,
  //   viewabilityConfig,
  // } = useFetchHomePosts();
  // const {
  //   // onRefetch,
  //   isRefetching,
  //   isError,
  //   onRefresh,
  //   t,
  //   isLoading,
  //   feedPosts,
  //   refreshing,
  //   fetchPosts,
  //   // isFetching,
  //   // handleLoadMore,
  //   isFocused,
  //   mostVisibleIndex,
  //   viewabilityConfigCallbackPairs,
  //   viewabilityConfig,
  // } = useFetchHomePosts();
  const {
    t,
    renderablePostData,
    paginateArrayOnEnd,
    viewabilityConfig,
    viewabilityConfigCallbackPairs,
    refreshing,
    onRefresh,
    mostVisibleIndex,
    isRefetching,
    isFocused,
    isError,
    // fetchPosts,
    isLoading,
  } = useFetchPost();

  useEffect(() => {
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        const deviceId = getDeviceId();

        if (!!enabled) {
          firebase
            .messaging()
            .getToken()
            .then((res: any) => {
              const deviceId = getDeviceId();

              res && databaseRef(`/fcmTokens/${uid}/${deviceId}`).set(res);
              databaseRef(`deviceIndex/${deviceId}`).set(uid);
            })
            .catch(err => console.error('res error of token', err));
        } else {
          showModal({
            message: 'Please allow notification access',
            successFn() {
              console.log('notifications allowed');
              Linking.openSettings();
            },
          });
        }
      });
  }, [uid]);

  // useFocusEffect(
  //   useCallback(() => {
  //     setFocus(true);
  //     return () => {
  //       setFocus(false);
  //     };
  //   }, []),
  // );

  const ref = React.useRef(null);

  useScrollToTop(ref);

  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 64);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 64],
    outputRange: [0, -64],
    // inputRange: [0, 100],
    // outputRange: [0, -100],
  });
  const navigation = useStackNavigation();
  // const AnimatedViewHeight = 1;
  return (
    <Container isLoading={isLoading} isScrollable={false} isError={isError}>
      {/* {AnimatedAppBar(translateY, navigation)} */}

      <FlatList
        ref={ref}
        // stickyHeaderHiddenOnScroll
        nestedScrollEnabled
        data={renderablePostData}
        ListHeaderComponent={<CustomHeader />}
        // stickyHeaderIndices={[0]}
        // data={feedPosts}
        contentContainerStyle={{paddingBottom: 15}}
        keyExtractor={item => item?.id}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
        viewabilityConfig={viewabilityConfig}
        // iOS offset for RefreshControl
        // contentInset={{
        //   top: 1,
        // }}
        // contentOffset={{
        //   y: -AnimatedViewHeight,
        // }}
        // scrollEventThrottle={100}
        onScroll={e => {
          scrollY.setValue(Math.ceil(e.nativeEvent.contentOffset.y / 5) * 5);
        }}
        renderItem={({item, index}) => {
          return (
            <CustomFeedPostComponent
              screen="home"
              navigation={navigation}
              post={item}
              play={mostVisibleIndex === index && focus}
            />
          );
        }}
        ListEmptyComponent={
          isError ? (
            <View
              style={{
                height: SCREEN_HEIGHT * 0.8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Error />
            </View>
          ) : (
            <View
              style={{
                marginVertical: 20,
                alignItems: 'center',
                width: SCREEN_WIDTH * 0.7,
                alignSelf: 'center',
              }}>
              <CustomText color="defaultBlack" fontFamily="openSansBold">
                {t('customWords:welcome')}
              </CustomText>
              <CustomText
                textAlign="center"
                color="grey"
                fontSize={12}
                fontFamily="openSansBold"
                style={{marginVertical: 10}}>
                {t('customWords:pleaseFollow')}
              </CustomText>
            </View>
          )
        }
        // ListFooterComponent={
        //   isFetching && posts?.length ? (
        //     <View
        //       style={[
        //         globalStyles.rowCenter,
        //         globalStyles.flex,
        //         {justifyContent: 'center', marginVertical: 20},
        //       ]}>
        //       <ActivityIndicator
        //         color={colors.primary}
        //         size={'small'}
        //         style={{transform: [{scaleX: 1.5}, {scaleY: 1.5}]}}
        //       />
        //     </View>
        //   ) : null
        // }
        onEndReached={paginateArrayOnEnd}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControlComponent
            refreshing={isRefetching}
            onRefresh={onRefresh}
          />
        }
        removeClippedSubviews={false}
        windowSize={5}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={5}
      />
    </Container>
  );
};

export default Home;
