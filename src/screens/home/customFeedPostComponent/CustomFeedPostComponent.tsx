// This code renders the component for the flatlist inside the home screen of the application
import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  Keyboard,
  KeyboardEvent,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import PaginationDot from 'react-native-insta-pagination-dots';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import {
  default as Ionicons,
  default as IonIcons,
} from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {homeScreenStackName} from 'src/navigation/constant/homeScreenStackRouteName';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {userProfileStackName} from 'src/navigation/constant/userProfileStackName';
import {useAppSelector} from 'src/redux/reducer/reducer';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import BottomSheetPicker from 'src/shared/components/customPicker/BottomSheetPicker';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import LoadingSpinner from 'src/shared/components/placeholder/LoadingSpinner';
import {colors} from 'src/theme/colors';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useTimeCalculation from 'src/utils/useTimeCalculation/useTimeCalculation';
import Icon from '../../../assets/svg';
import {IS_IOS, SCREEN_WIDTH} from '../../../constants/deviceInfo';
import {globalStyles} from '../../../constants/globalStyles.style';
import CustomText from '../../../shared/components/customText/CustomText';
import CommentComponent from '../commentComponent/CommentComponent';
import DeleteModalComponent from './DeleteModalComponent';
import useFeedComponent from './useFeedComponent';
import VideoPlayer from './VideoPlayer';

//Functional component code for the home screen feed component.
const CustomFeedPostComponent = ({
  // feedPostString,
  screen,
  navigation,
  post: feedPostObject,
  play = true,
}: {
  screen: 'home' | 'viewPost';
  navigation?: any;
  // feedPostString: string;
  post: TFeedPostObject;
  play?: boolean;
}) => {
  // The code below destructures functions and data from the  custom hook useFeedComponent
  const {
    currentPage,
    isLiked,
    setCurrentPage,
    setIsLiked,
    timeString,
    uid,
    t,
    // feedPostObject,
    modalOpen,
    setModalOpen,
    profile,
    modalLoading,
    setUserComment,
    userComment,
    submit,
    comments,
    replyTo,
    setReplyTo,
    likeObj,
    creatorRating,
    commentsNumber,
    likeData,
    commentCount,
    commentLoading,
  } = useFeedComponent({
    feedPostString: feedPostObject?.id,
  });
  const [playNumber, setPlayNumber] = useState(0);
  // const {navigate} = useStackNavigation();
  const userDetails = useAppSelector(state => state?.userReducer?.userDetails);
  const [fallBackImage, setFallBackImage] = useState(undefined);
  const [fallBackName, setFallBackName] = useState(undefined);
  const [fallBackRating, setFallBackRating] = useState(undefined);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  useEffect(() => {
    const fetchPhoto = async () => {
      await databaseRef(`users/${feedPostObject.createdBy}/photoURL`).once(
        'value',
        snapshot => {
          if (snapshot.exists()) {
            setFallBackImage(snapshot.val());
          }
        },
      );
    };
    const fetchName = async () => {
      await databaseRef(`users/${feedPostObject.createdBy}/displayName`).once(
        'value',
        snapshot => {
          if (snapshot.exists()) {
            setFallBackName(snapshot.val());
          }
        },
      );
    };
    const fetchRating = async () => {
      await databaseRef(`users/${feedPostObject.createdBy}/rating`).once(
        'value',
        snapshot => {
          if (snapshot.exists()) {
            setFallBackRating(snapshot.val());
          }
        },
      );
    };
    if (proImage == undefined) {
      fetchPhoto();
    }
    if (feedPostObject?.userDetails?.displayName == undefined) {
      fetchName();
    }
    if (!feedPostObject?.userDetails?.rating) fetchRating();
  }, []);
  const proImage = useMemo(
    () => feedPostObject?.userDetails?.photoURL,
    [feedPostObject?.userDetails?.photoURL],
  );

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    function onKeyboardDidShow(e: KeyboardEvent) {
      // Remove type here if not using TypeScript
      setKeyboardHeight(e.endCoordinates.height);
      console.log(e.endCoordinates.height, e, 'keyBoard');
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
      // console.log(keyboardHeight, 'keyHEight');
    }

    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow,
    );

    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardDidHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return (
    <View style={{backgroundColor: colors.secondary, flex: 1}}>
      <View style={{flexDirection: 'row'}}>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            width: SCREEN_WIDTH * 0.7,
          }}
          onPress={() => {
            userDetails?.uid !== feedPostObject?.createdBy
              ? navigation.navigate(homeScreenStackName.VIEW_USER, {
                  uid: feedPostObject?.createdBy,
                  tabName: 'A',
                })
              : navigation.navigate(rootStackName.USER_PROFILE_STACK, {
                  screen: userProfileStackName.USER_PROFILE,
                });
          }}>
          <Avatar
            resizeMode="cover"
            source={
              proImage
                ? {uri: proImage}
                : fallBackImage
                ? {uri: fallBackImage}
                : undefined
            }
            style={[
              globalStyles.circleImage,
              {height: 30, width: 30, margin: 10},
            ]}
          />

          <CustomText
            textAlign="center"
            fontFamily="openSansBold"
            color={'defaultBlack'}
            fontSize={12}
            style={{fontWeight: '500'}}>
            {feedPostObject?.userDetails?.displayName
              ? feedPostObject?.userDetails?.displayName
              : fallBackName}{' '}
          </CustomText>
        </Pressable>
        <Pressable
          onPress={() => setDeleteModalVisible(true)}
          style={({pressed}) => [
            {marginHorizontal: 5, marginTop: 2.5},
            pressed
              ? {
                  backgroundColor: colors.inputGrey,
                  borderRadius: 30, // Adjust the radius to create an oval shape
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  padding: 10,
                }
              : {
                  alignItems: 'center',
                  justifyContent: 'center',
                  // marginTop: 50,
                  // padding: 10,
                  alignSelf: 'center',
                  padding: 10,
                },
          ]}>
          <SimpleLineIcons name="options" />
        </Pressable>
      </View>
      <BottomSheetPicker
        onClose={() => setDeleteModalVisible(false)}
        isOpen={deleteModalVisible}
        modalStyle={{
          borderWidth: 1,
          borderRadius: 15,
          padding: 13,
          paddingHorizontal: 10,
        }}
        children={
          <DeleteModalComponent
            navigation={navigation}
            screen={screen}
            media={feedPostObject.media}
            setDeleteModalVisible={setDeleteModalVisible}
            currentUser={uid}
            createdBy={feedPostObject.createdBy}
            postId={feedPostObject.id}
          />
        }
      />
      <View>
        <Carousel
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
          loop={false}
          vertical={false}
          onProgressChange={(_, absoluteProgress) => {
            setCurrentPage(Math.round(absoluteProgress));
            setPlayNumber(Math.round(absoluteProgress));
          }}
          // pagingEnabled
          width={SCREEN_WIDTH}
          height={SCREEN_WIDTH}
          data={feedPostObject?.media}
          scrollAnimationDuration={300}
          renderItem={({item, index}) => {
            return (
              <View style={{flex: 1}}>
                <LinearGradient
                  colors={
                    item?.type?.includes('video')
                      ? ['#fff', '#fff']
                      : ['rgba(45, 155, 240, 0.5)', 'rgba(255, 255, 255, 0.5)']
                  }
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={{
                    ...StyleSheet.absoluteFillObject,
                  }}
                />
                {item?.type?.includes('video') ? (
                  <VideoPlayer
                    index={index}
                    play={play}
                    playNumber={playNumber}
                    url={item?.uri}
                  />
                ) : (
                  <FastImage
                    key={index}
                    resizeMode="cover"
                    source={
                      item
                        ? {uri: item?.uri ?? item}
                        : require('../../../assets/png/userDefault.jpg')
                    }
                    style={{
                      width: SCREEN_WIDTH,
                      aspectRatio: 1,
                      alignSelf: 'center',
                    }}
                  />
                )}
              </View>
            );
          }}
        />
        {/* {feedPostObject?.media?.length > 1 && (
          <View
            style={{
              alignItems: 'center',
              marginTop: 10,
              position: 'absolute',
              bottom: -20,
              alignSelf: 'center',
            }}>
            <PaginationDot
              curPage={currentPage}
              maxPage={feedPostObject?.media?.length}
              activeDotColor={colors.primary}
              sizeRatio={0.5}
            />
          </View>
        )} */}
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginVertical: 3,
          alignItems: 'center',
          // borderWidth: 1,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            // flex: 1,
            flexDirection: 'row',
            gap: 7,
            alignItems: 'flex-start',
            // borderWidth: 1,
            width: SCREEN_WIDTH * 0.25,
            paddingHorizontal: 5,
            // justifyContent: 'space-evenly',
          }}>
          <CustomButton
            style={{alignSelf: 'flex-start'}}
            type="unstyled"
            onPress={() => {
              setIsLiked(isLiked => !isLiked);
              try {
                if (isLiked) {
                  databaseRef(
                    `/posts/${feedPostObject?.id}/likes/${uid}`,
                  ).remove(() => {});
                  databaseRef(
                    `/likes/${feedPostObject?.createdBy}/${feedPostObject?.id}/${uid}`,
                  ).remove(() => {});
                  databaseRef(`/likedBy/${uid}/${feedPostObject?.id}`).remove(
                    () => {},
                  );
                } else {
                  databaseRef(`posts/${feedPostObject?.id}/likes/${uid}`).set(
                    true,
                    () => {
                      console.log('likePost+');
                    },
                  );
                  databaseRef(
                    `/likes/${feedPostObject?.createdBy}/${feedPostObject?.id}/${uid}`,
                  ).set(true, () => {
                    console.log('like+');
                  });
                  databaseRef(`/likedBy/${uid}/${feedPostObject?.id}`).set(
                    true,
                    () => {
                      console.log('likedBy-');
                    },
                  );
                }
              } catch (error) {
                console.error(error);
              }
            }}>
            {isLiked ? (
              <Ionicons
                // onPress={() => {
                //   setIsLiked(!isLiked);
                //   try {
                //     databaseRef(
                //       `/posts/${feedPostObject.id}/likes/${uid}`,
                //     ).remove();
                //   } catch (error) {
                //     console.error(error);
                //   }
                // }}
                name="heart"
                size={26}
                color={colors.red}
              />
            ) : (
              <Ionicons
                // onPress={() => {
                //   setIsLiked(!isLiked);
                //   try {
                //     databaseRef(`posts/${feedPostObject.id}/likes/${uid}`).set(
                //       true,
                //     );
                //   } catch (error) {
                //     console.error(error);
                //   }
                // }}
                name="heart-outline"
                size={26}
                style={{color: colors.defaultBlack}}
              />
            )}
          </CustomButton>
          <CustomButton
            style={{alignSelf: 'flex-start', marginTop: 2}}
            onPress={() => {
              setModalOpen(true);
            }}
            type="unstyled">
            <Ionicons
              name="chatbubble-outline"
              size={23}
              style={{color: colors.defaultBlack, transform: [{scaleX: -1}]}}
            />
            {/* <Ionicons
              name="chatbubble-outline"
              size={27.5}
              style={{
                marginTop: 2,
                color: colors.defaultBlack,
                paddingTop: 2,
                transform: [{scaleX: -1}],
              }}
            /> */}
          </CustomButton>

          <CustomButton
            style={{alignSelf: 'flex-start'}}
            type="unstyled"
            onPress={() =>
              Share.share({
                message: `Share this post https://vita-abe0f.web.app/viewPost?postId=${feedPostObject?.id}`,
              })
            }>
            <IonIcons
              name="paper-plane-outline"
              color={colors?.defaultBlack}
              size={23}
              style={{
                color: colors.defaultBlack,
                transform: [{rotate: '20deg'}],
              }}
            />
          </CustomButton>
        </View>
        {feedPostObject?.media?.length > 1 && (
          <View
            style={{
              alignItems: 'center',
              marginRight: 45,
              // position: 'absolute',
              // bottom: -20,
              alignSelf: 'center',
              // borderWidth: 1,
            }}>
            <PaginationDot
              curPage={currentPage}
              maxPage={feedPostObject?.media?.length}
              activeDotColor={colors.primary}
              sizeRatio={0.5}
            />
          </View>
        )}
        {!(feedPostObject?.userDetails?.rating || fallBackRating) ? (
          <View style={{width: 60}} />
        ) : (
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => {
              (feedPostObject?.id && userDetails?.uid !== feedPostObject?.id) ??
              feedPostObject?.createdBy
                ? navigation.navigate(homeScreenStackName.VIEW_USER, {
                    uid: feedPostObject?.id ?? feedPostObject?.createdBy,
                    tabName: 'B',
                  })
                : navigation.navigate(rootStackName.USER_PROFILE_STACK, {
                    screen: userProfileStackName.USER_PROFILE,
                    params: {tab: 'B'},
                  });
            }}>
            <FastImage
              resizeMode="cover"
              source={require('../../../assets/png/yelloStar.png')}
              style={{aspectRatio: 1, width: 30}}
            />
            <CustomText
              fontSize={14}
              fontFamily="openSansRegular"
              color="defaultBlack"
              style={{marginRight: 10, lineHeight: 20, bottom: 0}}>
              {String(
                Number(
                  feedPostObject?.userDetails?.rating ?? fallBackRating,
                ).toFixed(1),
              )}
            </CustomText>
          </Pressable>
        )}
      </View>
      <CustomText
        fontFamily={'openSansBold'}
        fontSize={10}
        style={{
          color: '#000',
          fontWeight: '500',
          margin: 2,
          marginHorizontal: 10,
        }}>
        {likeData ? Object.keys(likeData).length : '0'} {t('common:likes')}
      </CustomText>
      <View style={{marginHorizontal: 10}}>
        <CustomText
          fontSize={10}
          fontFamily="openSansRegular"
          style={{
            color: '#000',
            justifyContent: 'center',
          }}>
          <CustomText
            fontFamily={'openSansBold'}
            fontSize={10}
            style={{
              color: '#000',
              justifyContent: 'center',
            }}>
            {feedPostObject?.userDetails?.displayName
              ? feedPostObject?.userDetails?.displayName
              : fallBackName}{' '}
          </CustomText>
          {'  '}
          {feedPostObject?.caption}
        </CustomText>
      </View>
      <BottomSheetPicker
        adjustToContentHeight={false}
        keyboardAvoidingBehavior={Platform.OS == 'ios' ? 'padding' : 'padding'}
        modalStyle={{
          marginTop: 100,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          bottom: Platform?.OS == 'ios' ? 20 : 30,
        }}
        onClose={() => setModalOpen(false)}
        isOpen={modalOpen}
        actionElement={
          <TouchableOpacity
            onPress={() => setModalOpen(true)}
            style={{margin: 2, marginHorizontal: 10}}>
            <CustomText fontFamily="openSansRegular" fontSize={10} color="grey">
              {commentCount
                ? `${
                    t('customWords:viewAll') +
                    ' ' +
                    commentCount +
                    ' ' +
                    t('common:comments')
                  }`
                : '0 ' + t('common:comments')}
            </CustomText>
          </TouchableOpacity>
        }
        HeaderComponent={
          <View style={[globalStyles.alignCenter, globalStyles.mv2]}>
            <CustomText fontSize={15}>{t('common:comments')}</CustomText>
          </View>
        }
        FooterComponent={
          <View
            // keyboardVerticalOffset={!IS_IOS ? 40 : 20}
            // behavior={Platform.OS == 'ios' ? 'padding' : 'padding'}
            // role="alertdialog"
            style={{
              borderTopWidth: replyTo != null ? 0.4 : 0,
              borderColor: colors.inputGrey,
              paddingBottom: keyboardHeight && !IS_IOS ? 30 : 0,
            }}>
            {replyTo != null && (
              <View
                style={{
                  padding: 5,
                  paddingLeft: 50,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <CustomText
                  fontFamily="arialRegular"
                  fontSize={18}
                  color="grey">
                  {t('customWords:replyingTo')} : {replyTo?.profileName}
                </CustomText>
                <CustomButton onPress={() => setReplyTo(null)} type="unstyled">
                  <Icon name="cancel" height={20} width={20} />
                </CustomButton>
              </View>
            )}
            <View
              style={[
                globalStyles.row,
                {
                  paddingHorizontal: 10,
                  marginBottom: keyboardHeight && !IS_IOS ? 50 : 30,
                  marginTop: 10,
                  // alignItems: 'center',
                },
              ]}>
              <Avatar
                style={{height: 40, width: 40, marginRight: 10}}
                source={profile ? {uri: profile} : undefined}
              />
              {/* <TextInput
                textContentType="oneTimeCode"
                onSubmitEditing={submit}
                placeholderTextColor={colors.placeHolder}
                selectionColor={colors.lightGrey}
                placeholder={t('customWords:addComment')}
                value={userComment}
                onChangeText={e => {
                  setUserComment(e);
                  // setInputValue(e);
                  // onChangeText && onChangeText(e);
                }}
                // onBlur={(e: any) => {
                //   setIsFocusedState(false);
                //   isFocused.value = false;
                //   textInputProps?.onBlur && textInputProps?.onBlur(e);
                //   performOnBlur();
                // }}
                // onFocus={(e: any) => {
                //   setTimeout(() => setIsFocusedState(true), 800);
                //   isFocused.value = true;
                //   textInputProps?.onFocus && textInputProps?.onFocus(e);
                //   performOnFocus();
                // }}
                style={[
                  {
                    height: 60,
                    width: '80%',
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    color: colors.grey,
                    alignItems: 'center',
                    textAlign: 'left',
                    justifyContent: 'center',
                    fontFamily: fonts.arialRegular,
                    // position: 'absolute',
                    fontSize: fontSizePixelRatio(14),
                    paddingLeft: 20,
                    borderRadius: 25,
                    borderWidth: 1,
                  },
                  globalStyles.flex,
                  globalStyles.justifyContent,
                ]}
                // scrollEnabled={isFocusedState }
              /> */}
              <CustomInput
                // performOnFocus={() => setBottomPadding(true)}
                // performOnBlur={() => setBottomPadding(false)}
                value={userComment}
                onChangeText={text => {
                  setUserComment(text);
                }}
                textInputProps={{onSubmitEditing: submit}}
                placeHolderText={t('customWords:addComment')}
                containerStyle={[
                  globalStyles.flex,
                  globalStyles.justifyContent,
                ]}
                inputBoxStyle={{
                  fontSize: fontSizePixelRatio(14),
                  alignItems: 'center',
                  paddingLeft: 20,
                }}
                inputContainer={{
                  height: 40,
                  borderRadius: 25,
                  borderWidth: 1,
                  padding: 10,
                }}
                onIconPress={submit}
                iconLoading={commentLoading}
                icon
              />
            </View>
          </View>
        }
        flatListProps={{
          data: comments,
          ItemSeparatorComponent: () => <View style={{height: 5}} />,
          contentContainerStyle: {marginBottom: 0},
          ListEmptyComponent: () =>
            modalLoading ? (
              <LoadingSpinner />
            ) : (
              <View style={[globalStyles.screenCenter, {height: 350}]}>
                <CustomText fontSize={20}>
                  {t('customWords:noComments')}
                </CustomText>
                <CustomText>{t('customWords:startConversation')}</CustomText>
              </View>
            ),
          renderItem: ({item, index}) => {
            return (
              <CommentComponent
                item={item}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
                key={index}
                author={feedPostObject?.createdBy}
                feedPostString={feedPostObject?.id}
              />
            );
          },
        }}
      />
      <CustomText
        fontSize={7}
        fontFamily="openSansRegular"
        color="grey"
        style={{margin: 2, marginHorizontal: 10}}>
        {useTimeCalculation({time: feedPostObject?.createdAt, short: false})}
      </CustomText>
    </View>
  );
};

export default memo(CustomFeedPostComponent);
