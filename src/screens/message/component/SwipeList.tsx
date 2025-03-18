/* eslint-disable react-hooks/exhaustive-deps */
import {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {ListRenderItem, Pressable, View} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import ImageIcon from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {colors} from 'src/theme/colors';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import renderSwipeList from './SwipeList.style';
import useSwipeList from './useSwipeList';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';

interface TSwipeList {
  channelList: Array<string>;
  channelDetails: channelsType | null;
  userId: string;
  archiveList: Array<string>;
  archive?: boolean;
}
const SwipeList = ({
  archive = false,
  archiveList,
  channelDetails,
  channelList,
  userId,
}: TSwipeList) => {
  const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
  const {} = useSwipeList();
  const {t} = useTranslation();
  // const deleteFile = async (filePath: any) => {
  //   const ref = storage().ref(filePath);
  //   return await ref.delete();
  // };
  // const deleteFolderRecursive = async (folderPath: any) => {
  //   const ref = storage().ref(folderPath);
  //   const list = await ref.listAll();

  //   let filesDeleted = 0;

  //   for await (const fileRef of list.items) {
  //     await deleteFile(fileRef.fullPath);
  //     filesDeleted++;
  //   }
  //   // for await (const folderRef of list.prefixes) {
  //   //   filesDeleted += await deleteFolderRecursive(folderRef.fullPath);
  //   // }
  //   return filesDeleted;
  // };
  // const deleteFolder = async (path: any) => {
  //   try {
  //     const filesDeleted = await deleteFolderRecursive(path);
  //     // you can now, for instance, unblock the UI at this point
  //   } catch (err) {
  //     // probably denied permissions or 'path/to/storage/folder' is not a folder
  //     console.error(err);
  //   }
  // };
  // const [count, setCount] = useState<number>(0);
  // const {channelList, channelDetails, userId, archiveList} = useSwipeList();
  const {navigate} = useNavigation<any>();
  const closeRow = ({rowMap, rowKey}: {rowMap: any; rowKey: any}) => {
    if (rowMap !== undefined && rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteChannelHandler = async (
    channelId: string,
    lastMessageId: string,
  ) => {
    try {
      await databaseRef(`channels/${channelId}/delete`).update({
        [userId]: lastMessageId,
      });
      await databaseRef(`channels/${channelId}/deleteMessage`).update({
        [userId]: {time: firebaseTimestamp, id: lastMessageId},
      });
      // databaseRef(`channels/${channelId}/lastDeleteMessage/${userId}`).set(
      //   lastMessageId?.[channelId]?.id,
      // );
      await databaseRef(
        `channelIndex/${userId}/channels/${channelId}`,
      ).remove();
      // await storage().ref(`${userId}/Chat/${channelId}`).delete();

      await databaseRef(`channels/${channelId}`).once('value', async snap => {
        const data = snap.val();
        const participants = Object.keys(data?.participants ?? {});
        const deleteParticipants = Object.keys(data?.delete ?? {});
        if (participants?.length === deleteParticipants?.length) {
          await databaseRef(`channels/${channelId}`).remove();
          await databaseRef(`messages/${channelId}`).remove();
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const renderData: ListRenderItem<any> = useCallback(
    ({item, index}) => {
      return (
        <>
          <Pressable
            style={[renderSwipeList.tab]}
            onPress={() => {
              navigate(rootStackName.SCREEN_STACK, {
                screen: screenStackName.Chat,
                params: {
                  name: channelDetails ? channelDetails[item?.id]?.name : '',
                  profile: channelDetails
                    ? channelDetails[item?.id]?.image
                    : '',
                  channelId: null,
                  uid: channelDetails ? channelDetails[item?.id]?.uId : '',
                },
              });
            }}>
            <Avatar
              source={
                channelDetails?.[item?.id]?.image
                  ? {
                      uri: channelDetails?.[item?.id]?.image,
                    }
                  : undefined
              }
              style={renderSwipeList.userImg}
            />

            <View style={renderSwipeList.border}>
              <CustomText
                fontSize={13}
                style={renderSwipeList.userTitle}
                numberOfLines={1}>
                {channelDetails ? channelDetails[item?.id]?.name : ''}
              </CustomText>
              {channelDetails?.[item?.id]?.lastMessage ? (
                <CustomText
                  numberOfLines={2}
                  fontSize={13}
                  style={renderSwipeList.userDescription}>
                  {channelDetails ? channelDetails[item?.id]?.lastMessage : ''}
                </CustomText>
              ) : null}
              {channelDetails?.[item?.id]?.imageRender ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <ImageIcon name="image" color="black" size={20} />
                  <CustomText
                    style={{fontSize: 12, position: 'relative', top: 2}}>
                    Photo
                  </CustomText>
                </View>
              ) : null}
            </View>
          </Pressable>
          {(archive
            ? index === archiveList.length - 1
            : index === channelList.length - 1) && (
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#e6e6e6',
                width: SCREEN_WIDTH * 0.8,
                alignSelf: 'flex-end',
                marginBottom: 2,
              }}
            />
          )}
        </>
      );
    },
    [channelList, channelDetails],
  );

  const renderHiddenData = (
    {item, index}: {item: any; index: number},
    rowMap: any,
    rowKey: any,
  ) => {
    return (
      <View style={[renderSwipeList.hiddenContainer]}>
        <Pressable
          style={[renderSwipeList.icon, {backgroundColor: '#F24726'}]}
          onPress={() => {
            closeRow({rowMap, rowKey: index});
            showModal({
              message: t('customWords:DoYouWantToDelete'),
              type: 'info',
              successFn() {
                deleteChannelHandler(
                  item?.id,
                  channelDetails?.[item?.id]?.lastMessageId,
                );
              },
              showCancelButton: true,
            });
            // deleteChannelHandler(
            //   item?.id,
            //   channelDetails?.[item?.id]?.lastMessageId,
            // );
          }}>
          <FontAwesome5 name="trash-alt" size={20} color={colors.secondary} />
        </Pressable>

        {archive ? (
          <CustomButton
            type="unstyled"
            style={[renderSwipeList.icon, {backgroundColor: '#79BFF4'}]}>
            <MaterialCommunityIcons
              name="arrow-left-top-bold"
              size={22}
              color={colors.secondary}
              onPress={() => {
                closeRow({rowMap, rowKey: index});
                databaseRef(
                  `channelIndex/${userId}/channels/${item?.id}`,
                ).update({
                  status: 'chatList',
                });
              }}
            />
          </CustomButton>
        ) : (
          <CustomButton
            type="unstyled"
            style={[renderSwipeList.icon, {backgroundColor: '#79BFF4'}]}
            onPress={() => {
              closeRow({rowMap, rowKey: index});
              databaseRef(`channelIndex/${userId}/channels/${item?.id}`).update(
                {
                  status: 'archive',
                },
              );
            }}>
            <FontAwesome5 name="archive" size={20} color={colors.secondary} />
          </CustomButton>
        )}
      </View>
    );
  };

  return (
    <SwipeListView
      closeOnRowPress
      previewRowKey="0"
      previewDuration={200}
      previewOpenValue={-102}
      disableRightSwipe
      keyExtractor={(_, index) => index + ''}
      data={!archive ? channelList : archiveList}
      renderItem={renderData}
      renderHiddenItem={renderHiddenData}
      ItemSeparatorComponent={
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#e6e6e6',
            width: SCREEN_WIDTH * 0.8,
            alignSelf: 'flex-end',
          }}
        />
      }
      SectionSeparatorComponent={
        <View style={{borderBottomWidth: 1, borderBottomColor: '#e6e6e6'}} />
      }
      rightOpenValue={-102}
    />
  );
};

export default SwipeList;
// databaseRef(`channels/${item}/lastReadMessage`)
//   .child(userId)
//   .on('value', async snap => {
//     const data = snap.val();
//     if (data) {
//       await databaseRef(`messages/${item}`)
//         .orderByKey()
//         .startAt(data)
//         .once('value', snapData => {
//           const unreadMessage = snapData.val();
//           setCount(Object.keys(unreadMessage ?? {}).length - 1);
//         });
//     } else {
//       await databaseRef(`messages/${item}`).once('value', snapData => {
//         const unreadMessage = snapData.val();
//         setCount(Object.keys(unreadMessage ?? {}).length);
//       });
//     }
//   });
