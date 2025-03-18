/* eslint-disable react-hooks/exhaustive-deps */
import {firebase} from '@react-native-firebase/auth';
import {useCallback, useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {handleMediaPermission} from 'src/screens/newPost/hooks/UsePermission';

import storage from '@react-native-firebase/storage';

import uuid from 'react-native-uuid';

import {BackHandler, Linking} from 'react-native';
import {IS_IOS} from 'src/constants/deviceInfo';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useChannel from './useChannel';
import {sendNotifications} from 'src/api/notification/notification';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';

const useChat = (uid: string, channelId: string) => {
  const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
  const loginUserUid: any = firebase.auth().currentUser?.uid;
  const [messages, setMessages] = useState<any[]>([]);
  const [targetChannelId, setTargetChannelId] = useState<string>(channelId);

  const [imageData, setImageData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApiCall, setApiCall] = useState<boolean>(false);
  const [isLoadMore, setIsLoadMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [lastTimeStamp, setLastTimeStamp] = useState(null);
  const [onSendLoading, setOnSendLoading] = useState<boolean>(false);
  const [isFirstTimeRender, setIsFirstTimeRender] = useState<boolean>(true);
  const [channelDetails, setChannelDetails] = useState<{
    detail: any;
    id: string;
  }>({detail: null, id: ''});
  const {userDetails} = useAppSelector(state => state?.userReducer);
  const {createChannel} = useChannel();

  const [disableChat, setDisableChat] = useState({
    toCheckIfBlocked: false,
    checkAnyoneIBlocked: false,
    toCheckIfReported: false,
    checkAnyoneIReported: false,
  });

  console.log({disableChat});
  useEffect(() => {
    const toCheckIfBlocked = async () => {
      try {
        await databaseRef(`blocked/${loginUserUid}/${uid}`).on(
          'value',
          snapshot => {
            if (snapshot.exists()) {
              setDisableChat(prev => ({...prev, toCheckIfBlocked: true}));
            } else {
              setDisableChat(prev => ({...prev, toCheckIfBlocked: false}));
            }
          },
        );
      } catch (error) {
        console.error('error', error);
      }
    };

    const checkAnyoneIBlocked = async () => {
      try {
        await databaseRef(`blocked/${uid}/${loginUserUid}`).on(
          'value',
          snapshot => {
            if (snapshot.exists()) {
              setDisableChat(prev => ({
                ...prev,
                checkAnyoneIBlocked: true,
              }));
            } else {
              setDisableChat(prev => ({
                ...prev,
                checkAnyoneIBlocked: false,
              }));
            }
          },
        );
      } catch (error) {
        console.error('error', error);
      }
    };

    const toCheckIfReported = async () => {
      try {
        await databaseRef(`reported/${loginUserUid}/${uid}`).on(
          'value',
          snapshot => {
            if (snapshot.exists()) {
              setDisableChat(prev => ({
                ...prev,
                toCheckIfReported: true,
              }));
            } else {
              setDisableChat(prev => ({
                ...prev,
                toCheckIfReported: false,
              }));
            }
          },
        );
      } catch (error) {
        console.error('error', error);
      }
    };

    const checkAnyoneIReported = async () => {
      try {
        await databaseRef(`reported/${uid}/${loginUserUid}`).on(
          'value',
          snapshot => {
            if (snapshot.exists()) {
              setDisableChat(prev => ({
                ...prev,
                checkAnyoneIReported: true,
              }));
            } else {
              setDisableChat(prev => ({
                ...prev,
                checkAnyoneIReported: false,
              }));
            }
          },
        );
      } catch (error) {
        console.error('error', error);
      }
    };
    toCheckIfBlocked();
    checkAnyoneIBlocked();
    toCheckIfReported();
    checkAnyoneIReported();

    return () => {
      databaseRef(`blocked/${loginUserUid}/${uid}`).off('value');
      databaseRef(`blocked/${uid}/${loginUserUid}`).off('value');
      databaseRef(`reported/${loginUserUid}/${uid}`).off('value');
      databaseRef(`reported/${uid}/${loginUserUid}`).off('value');
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (imageData.length) {
        setImageData([]);
        return true;
      } else {
        return false;
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [imageData]);

  useEffect(() => {
    const fetchChannel = async () => {
      if (!channelId) {
        let newChannelId: any;
        await databaseRef(`channelIndex/${loginUserUid}/channels`)
          .once('value')
          .then(snapshot => {
            snapshot.forEach(data => {
              if (data?.exists()) {
                const temp = data?.val();

                for (let i in temp) {
                  if (i === 'participants') {
                    if (Object.keys(temp[i] ?? {}).includes(uid)) {
                      newChannelId = temp?.id;

                      setTargetChannelId(temp?.id);
                      setChannelDetails({
                        detail: {...temp, status: 'chatList'},
                        id: uid,
                      });
                    }
                  }
                }
              }
              return undefined;
            });
          });
        if (newChannelId) {
          await databaseRef(`channelIndex/${uid}/channels`)
            .once('value')
            .then(snapshot => {
              snapshot.forEach(data => {
                if (data?.exists()) {
                  const temp = data?.val();
                  if (temp?.id === newChannelId) {
                    setChannelDetails({detail: null, id: ''});
                    return undefined;
                  }
                }
              });
            });
        } else if (!newChannelId) {
          await databaseRef(`channelIndex/${uid}/channels`)
            .once('value')
            .then(snapshot => {
              snapshot.forEach(data => {
                if (data?.exists()) {
                  const temp = data?.val();

                  for (let i in temp) {
                    if (i === 'participants') {
                      if (Object.keys(temp[i] ?? {}).includes(loginUserUid)) {
                        newChannelId = temp?.id;

                        setTargetChannelId(temp?.id);
                        setChannelDetails({
                          detail: {...temp, status: 'chatList'},
                          id: loginUserUid,
                        });
                      }
                    }
                  }
                  return undefined;
                }
              });
            });
        }
      }
    };
    fetchChannel();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (isFirstTimeRender) {
        setIsFirstTimeRender(false);
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (!targetChannelId) {
      return () => {};
    }

    const fetchMessage = async () => {
      try {
        if (isFirstTimeRender) {
          setIsLoading(true);
        }
        let lastMessageId: any = null;
        await databaseRef(`channels/${targetChannelId}/deleteMessage`).once(
          'value',
          snapshot => {
            const data = snapshot.val();

            for (let key in data) {
              if (key === loginUserUid) {
                lastMessageId = data[key]?.time;
                setLastTimeStamp(data[key]?.id);
              }
            }
          },
        );
        const id = databaseRef(`messages/${targetChannelId}`)
          .orderByChild('createdAt')
          .startAt(lastMessageId)
          .limitToLast(20)
          .on('child_added', snapshot => {
            if (snapshot.exists()) {
              const msg = {
                ...snapshot.val(),
                createdAt: new Date(snapshot?.val()?.createdAt),
              };

              setMessages((previousMessages: any) =>
                GiftedChat.append(previousMessages, msg),
              );
            }
          });

        // const id = databaseRef(`messages/${targetChannelId}`)
        //   .limitToLast(20)
        //   .on('child_added', snapshot => {
        //     if (snapshot.exists()) {
        //       const msg = {
        //         ...snapshot.val(),
        //         createdAt: new Date(snapshot?.val()?.createdAt),
        //       };

        //       setMessages((previousMessages: any) =>
        //         GiftedChat.append(previousMessages, msg),
        //       );
        //     }
        //   });

        return () =>
          databaseRef(`messages/${targetChannelId}`).off('child_added', id);
      } catch (err) {
        console.error({err});
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessage();
  }, [targetChannelId]);

  const onSend = useCallback(
    async (m = []) => {
      try {
        setOnSendLoading(true);

        let newChannelID: string | null | undefined = targetChannelId;
        if (!targetChannelId) {
          newChannelID = await handleCreateChannel();

          setTargetChannelId(newChannelID ?? '');
        } else {
          // check ch
          if (!channelDetails?.detail) {
            databaseRef(
              `channelIndex/${loginUserUid}/channels/${newChannelID}`,
            ).update({
              createdAt: firebaseTimestamp,
            });
            databaseRef(`channelIndex/${uid}/channels/${newChannelID}`).update({
              createdAt: firebaseTimestamp,
            });
          } else {
            const id = channelDetails?.id === uid ? loginUserUid : uid;
            databaseRef(`channelIndex/${id}/channels/${newChannelID}`).update({
              createdAt: firebaseTimestamp,
            });
          }
        }
        if (channelDetails?.detail) {
          await databaseRef(
            `channelIndex/${channelDetails?.id}/channels/${targetChannelId}`,
          ).set({...channelDetails?.detail, createdAt: firebaseTimestamp});
          await databaseRef(`channels/${targetChannelId}/delete`).remove();
        }
        const msg: any = m[0];
        const messageRef = databaseRef(`messages/${newChannelID}`);

        // const snapshot = await messageRef.once('value');

        // if (!snapshot.exists()) {
        //   await messageRef.set({});
        // }

        const newMessageRef = messageRef.push();
        const myMessage: MessagePayload = {
          ...msg,
          sender: userDetails?.uid!,
          receiver: uid,
          createdAt: Date.parse(msg?.createdAt),
          // author: loginUserUid,

          delivered: {
            [loginUserUid]: true,
          },
          readBy: {
            [loginUserUid]: true,
          },
          // id: newMessageRef?.key,
        };

        await newMessageRef.set(myMessage);

        sendNotifications({
          userIds: [uid],
          message: myMessage?.text,
          type: 'chat',
          title: userDetails?.displayName,
          data: {
            profile: userDetails?.photoURL,
            uid: loginUserUid,
            name: userDetails?.displayName,
            status: 'chat',
          },
        });
        await databaseRef(`channels/${newChannelID}/lastMessage`).set(
          myMessage,
        );
      } catch (err) {
        console.error({err});
      } finally {
        setOnSendLoading(false);
      }
    },
    [targetChannelId, channelDetails],
  );

  const onImageSend = async () => {
    try {
      setOnSendLoading(true);
      const arr: any = [];
      let newChannelID: string | null | undefined = targetChannelId;
      if (!targetChannelId) {
        newChannelID = await handleCreateChannel();

        setTargetChannelId(newChannelID ?? '');
      } else {
        if (!channelDetails?.detail) {
          databaseRef(
            `channelIndex/${loginUserUid}/channels/${newChannelID}`,
          ).update({
            createdAt: firebaseTimestamp,
          });
          databaseRef(`channelIndex/${uid}/channels/${newChannelID}`).update({
            createdAt: firebaseTimestamp,
          });
        } else {
          const id = channelDetails?.id === uid ? loginUserUid : uid;
          databaseRef(`channelIndex/${id}/channels/${newChannelID}`).update({
            createdAt: firebaseTimestamp,
          });
        }
      }
      if (channelDetails?.detail) {
        await databaseRef(
          `channelIndex/${channelDetails?.id}/channels/${targetChannelId}`,
        ).set({...channelDetails?.detail, createdAt: firebaseTimestamp});
        await databaseRef(`channels/${targetChannelId}/delete`).remove();
      }

      imageData?.map(async (item: any) => {
        const {path: uri} = item;
        const length = uri.length;
        const path = uri?.slice(60, length);
        const mId = uuid.v4();

        arr.push({
          image: uri,
          _id: mId,
          createdAt: Date.parse(new Date().toISOString()),
          user: {
            _id: userDetails?.email,
          },
        });

        await storage()
          .ref(`chat/${newChannelID}/${path}`)
          .putFile(uri)
          .then(() => {
            storage()
              .ref(`chat/${newChannelID}/${path}`)
              .getDownloadURL()
              .then(async res => {
                const messageRef = databaseRef(`messages/${newChannelID}`);

                // const snapshot = await messageRef.once('value');

                // if (!snapshot.exists()) {
                //   await messageRef.set({});
                // }

                const newMessageRef = messageRef.push();

                await newMessageRef.set({
                  image: res,
                  _id: mId,
                  createdAt: Date.parse(new Date().toISOString()),
                  user: {
                    _id: userDetails?.email,
                  },
                  sender: userDetails?.uid!,
                  receiver: uid!,
                  // author: loginUserUid,

                  delivered: {
                    [loginUserUid]: true,
                  },
                  readBy: {
                    [loginUserUid]: true,
                  },
                  // id: newMessageRef?.key,
                });

                sendNotifications({
                  userIds: [uid],
                  message: 'Image',
                  type: 'chat',
                  title: userDetails?.displayName,
                  data: {
                    profile: userDetails?.photoURL,
                    uid: uid,
                    name: userDetails?.displayName,
                    status: 'chat',
                  },
                });
                await databaseRef(`channels/${newChannelID}/lastMessage`).set({
                  image: res,
                  _id: mId,
                  createdAt: Date.parse(new Date().toISOString()),
                  user: {
                    _id: userDetails?.email,
                  },
                  sender: userDetails?.uid!,
                  receiver: uid!,

                  delivered: {
                    [loginUserUid]: true,
                  },
                  readBy: {
                    [loginUserUid]: true,
                  },
                  id: newMessageRef?.key,
                });
                setOnSendLoading(false);
                setImageData([]);
              })
              .finally(() => {
                setOnSendLoading(false);
                setImageData([]);
              });
          });
      });
    } catch (err) {
      setImageData([]);
    } finally {
      // setOnSendLoading(false);
    }
  };

  const openGallery = async () => {
    // const isPermission = await handlePhotoPermission();
    const isPermission = await handleMediaPermission();

    const permission = IS_IOS ? true : isPermission;
    if (permission) {
      ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        multiple: true,
        mediaType: 'photo',
      })
        .then(image => {
          setImageData(image);
        })
        .catch(err => {
          console.error({err});
        });
    } else {
      showModal({
        title: 'Need media permission',
        successTitle: 'Settings',
        successFn() {
          Linking.openSettings();
        },
        showCancelButton: true,
      });
    }
  };
  const handleCreateChannel = async () => {
    const channelData: createChannelType = {
      admins: [userDetails?.uid],
      channelInfo: {
        name: 'Channel Name',
        createdBy: userDetails?.uid,
        picture:
          'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg',
        type: 'chat',
      },
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      dateUpdated: firebase.database.ServerValue.TIMESTAMP,
      isActive: true,
      participants: {
        [uid]: true,
        [userDetails?.uid]: true,
      },
      lastMessage: null,
    };
    const newChannelId = await createChannel(channelData);
    return newChannelId;
  };
  return {
    openGallery,
    imageData,
    setImageData,
    isApiCall,
    isLoading,
    setApiCall,
    onImageSend,
    onSend,
    messages,
    userDetails,
    setMessages,
    handleCreateChannel,
    targetChannelId,
    onSendLoading,
    disableChat,
    // blockedChat,
    // reportedChat,
    nextPage: {
      isLoadMore,
      setIsLoadMore,
      isFetching,
      setIsFetching,
    },
    lastTimeStamp,
  };
};
export default useChat;
