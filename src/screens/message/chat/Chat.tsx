/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';
import {
  Actions,
  Composer,
  GiftedChat,
  InputToolbar,
  LoadEarlier,
  Message,
  MessageImage,
  MessageText,
  Send,
} from 'react-native-gifted-chat';

import {firebase} from '@react-native-firebase/auth';
import ImageIcon from 'react-native-vector-icons/EvilIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {IS_IOS} from 'src/constants/deviceInfo';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {screenStackParams} from 'src/navigation/params/screenStackParams';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import LoadingSpinner from 'src/shared/components/placeholder/LoadingSpinner';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import Gallary from './Gallary';
import chatStyle from './chat.style';
import useChat from './useChat';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
type Props = NativeStackScreenProps<screenStackParams, screenStackName.Chat>;
const Chat = ({route}: Props) => {
  const {channelId, uid, profile, name} = route.params;

  const {
    openGallery,
    imageData,
    isLoading,
    onImageSend,
    onSend,
    messages,
    userDetails,
    setMessages,
    targetChannelId,
    onSendLoading,
    lastTimeStamp,
    nextPage: {isFetching, isLoadMore, setIsFetching, setIsLoadMore},
    disableChat,
  } = useChat(uid ?? '', channelId ?? '');

  const debounceTimeoutRef = useRef<any>(null);
  const debounce = (callback: any, delay: number) => {
    clearTimeout(debounceTimeoutRef?.current);
    debounceTimeoutRef.current = setTimeout(callback, delay);
  };
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const navigation = useStackNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader
          titleType="custom"
          back
          lineHeight={25}
          fontFamily={'openSansBold'}
          fontSize={18}
          titleColor={'black'}
          textAlignTitle="left"
          headerContainer={{
            justifyContent: 'flex-start',
            borderBottomWidth: 0.2,
            borderBottomColor: colors.lightGrey,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              alignItems: 'center',
              width: '100%',
            }}>
            <Avatar
              source={
                profile
                  ? {
                      uri: profile,
                    }
                  : undefined
              }
              style={{
                width: 40,
                height: 40,
                zIndex: 99,
                borderRadius: 50,
                marginEnd: 10,
              }}
            />
            <CustomText
              numberOfLines={2}
              fontFamily="openSansBold"
              style={{width: '80%'}}>
              {name ?? 'user'}
            </CustomText>
          </View>
        </CustomHeader>
      ),
    });
  }, []);
  useEffect(() => {
    const loginUserUid = firebase.auth().currentUser?.uid;

    if (targetChannelId) {
      const id = databaseRef(`channels/${targetChannelId}/typing`).on(
        'value',
        snap => {
          if (snap.exists()) {
            const temp = snap.val();
            for (let uId in temp) {
              if (uId !== loginUserUid) {
                setIsTyping(temp[uId]);
              }
            }
          }
        },
      );

      return () =>
        databaseRef(`channels/${targetChannelId}/typing`).off('value', id);
    }
  }, [targetChannelId]);
  const onChange = (value: string) => {
    if (value && targetChannelId) {
      const userChannelsRef = databaseRef(
        `channels/${targetChannelId}/typing/${userDetails?.uid}`,
      );
      userChannelsRef.set(true);
      debounce(() => {
        userChannelsRef.set(false);
      }, 2000);
    }
  };
  // const renderDay = (props: any) => {
  //   const {currentMessage} = props;
  //   return (
  //     <View style={{alignItems: 'center', marginBottom: 10}}>
  //       <Text>{moment(currentMessage.createdAt).format('MMM DD h:mm a')}</Text>
  //     </View>
  //   );
  // };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: IS_IOS ? SCREEN_HEIGHT * 0.01 : 0,
      }}>
      {/* <Container isScrollable={false} contentContainerStyle={chatStyle.container}> */}
      {imageData.length ? (
        <Gallary
          data={imageData}
          onPress={() => onImageSend()}
          isLoading={onSendLoading}
        />
      ) : null}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <GiftedChat
          // disableComposer={disableChat.checkAnyoneIBlocked}
          inverted={true}
          isTyping={isTyping}
          renderAvatar={() => (
            <Avatar
              source={profile ? {uri: profile} : undefined}
              style={chatStyle.image}
            />
            // <CustomImage source={{uri: profile}} style={chatStyle.image} />
          )}
          renderMessageText={props => {
            return (
              <MessageText
                {...props}
                textStyle={{
                  right: {
                    color: 'white',
                  },
                }}
                containerStyle={{
                  left: {backgroundColor: '#EFEFEF', borderRadius: 20},
                }}
              />
            );
          }}
          renderMessageImage={(props: any) => {
            return (
              <MessageImage
                {...props}
                imageStyle={chatStyle.imageStyle}
                // currentMessage={{
                //   text: 'hello',
                //   image: 'https://picsum.photos/536/354',
                // }} // containerStyle={chatStyle.imageContainerStyle}
              />
            );
          }}
          renderLoadEarlier={props => {
            return (
              <LoadEarlier
                {...props}
                wrapperStyle={{backgroundColor: 'white'}}
                activityIndicatorColor={colors.primary}
              />
            );
          }}
          // renderLoading={() => {
          //   return (
          //     <View style={{justifyContent: 'center', alignItems: 'center'}}>
          //       <ActivityIndicator size={25} color={colors.primary} />
          //     </View>
          //   );
          // }}

          // disable
          renderInputToolbar={props => {
            if (
              disableChat.checkAnyoneIBlocked ||
              disableChat.checkAnyoneIReported ||
              disableChat.toCheckIfBlocked ||
              disableChat.toCheckIfReported
            ) {
              return null;
            }
            return (
              <InputToolbar
                {...props}
                containerStyle={{
                  alignItems: 'center',
                  backgroundColor: '#eeee',
                  borderRadius: 20,
                  marginBottom: IS_IOS ? 5 : 5,
                  marginRight: 5,
                  marginLeft: 5,
                  paddingRight: 5,
                  opacity:
                    disableChat.checkAnyoneIBlocked ||
                    disableChat.checkAnyoneIReported ||
                    disableChat.toCheckIfBlocked ||
                    disableChat.toCheckIfReported
                      ? 0.4
                      : 1,
                }}
              />
            );
          }}
          renderActions={props => {
            return (
              <Actions
                {...props}
                containerStyle={chatStyle.actionContainer}
                icon={() => <ImageIcon name="image" color="black" size={40} />}
                onPressActionButton={openGallery}
              />
            );
          }}
          renderTime={() => null}
          // renderComposer={props => {
          //   return (
          //     <Composer
          //       {...props}
          //       multiline={false}
          //       // multiline
          //       textInputStyle={chatStyle.composer}
          //       placeholderTextColor={colors.grey}
          //     />
          //   );
          // }}
          renderSend={props => {
            return (
              <Send
                {...props}
                disabled={!props.text}
                containerStyle={chatStyle.send}>
                {/* <Icon name="send" size={24} color="black" /> */}
                {onSendLoading ? (
                  <ActivityIndicator size={'small'} />
                ) : (
                  <IonIcons
                    name="paper-plane-outline"
                    color={colors?.defaultBlack}
                    size={25}
                    style={{
                      color: colors.defaultBlack,
                      // transform: [{rotate: '40deg'}],
                    }}
                  />
                )}
              </Send>
            );
          }}
          renderMessage={props => {
            return <Message {...props} />;
          }}
          onSend={(msg: any) => onSend(msg)}
          // onLoadEarlier={() => {

          // }}
          listViewProps={{
            showsVerticalScrollIndicator: false,
            scrollEventThrottle: 10,
            onScroll: async ({
              nativeEvent,
            }: NativeSyntheticEvent<NativeScrollEvent>) => {
              if (isCloseToTop(nativeEvent)) {
                // loadMoreMessages();

                if (isLoadMore && !isFetching) {
                  setIsFetching(true);
                  const arr: any = [];

                  try {
                    await databaseRef(`messages/${targetChannelId}`)
                      .orderByChild('createdAt')
                      .endAt(
                        Date.parse(messages[messages.length - 1]?.createdAt),
                      )
                      .limitToLast(20)
                      .once('value', snapshot => {
                        let isInclude = false;
                        let msg: any = {};
                        if (snapshot.exists()) {
                          snapshot.forEach((data: any) => {
                            msg = {
                              ...data.val(),
                              createdAt: new Date(data.val().createdAt),
                            };
                            if (lastTimeStamp) {
                              if (data?.val()?._id === lastTimeStamp) {
                                isInclude = true;
                                setIsLoadMore(false);
                              }
                            }
                            arr.push(msg);
                            return undefined;
                          });

                          if (arr.length < 20) {
                            setIsLoadMore(false);
                          }

                          arr.pop();

                          if (lastTimeStamp && isInclude) {
                            arr.reverse();
                            const temp: any = [];
                            for (let i = 0; i <= arr.length - 1; i++) {
                              if (arr[i]?._id === lastTimeStamp) {
                                break;
                              } else {
                                temp.push(arr[i]);
                              }
                            }

                            setMessages((prev: any) => [...prev, ...temp]);
                          } else {
                            setMessages((prev: any) => [
                              ...prev,
                              ...arr.reverse(),
                            ]);
                          }
                        }
                      });
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setIsFetching(false);
                  }
                }
              }
            },
            onMomentumScrollBegin: () => {
              // isLoadingEarlierRef.current = true;
            },
          }}
          showAvatarForEveryMessage
          messages={messages}
          user={{
            _id: userDetails?.email,
          }}
          onInputTextChanged={onChange}
          infiniteScroll
          scrollToBottom
          loadEarlier
          isLoadingEarlier={isFetching}
          keyboardShouldPersistTaps={'handled'}
          alwaysShowSend
          placeholder="Message...."
        />
      )}
      {/* </Container> */}
    </View>
  );
};
const isCloseToTop = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeScrollEvent) => {
  const paddingToTop = 80;
  return (
    contentSize.height - layoutMeasurement.height - paddingToTop <=
    contentOffset.y
  );
};
export default Chat;
