import {firebase} from '@react-native-firebase/auth';
import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
interface channelsType {
  [key: string]: {
    image: string;
    name: string;
    id: string;
    lastMessage: string;
    imageRender: boolean;
  };
}

const useSwipeList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [channelList, setChannelList] = useState<string[]>([]);
  const [archiveList, setArchiveList] = useState<string[]>([]);

  const [channelDetails, setChannelDetails] = useState<channelsType | null>(
    null,
  );
  const userId: any = firebase.auth().currentUser?.uid;

  useEffect(() => {
    const fetchChannelList = async () => {
      try {
        const id = databaseRef(`channelIndex/${userId}/channels`).on(
          'value',
          snap => {
            const data = snap.val();
            const archiveChannelList: any[] = [];
            const simpleChannelList: any[] = [];
            for (let i in data) {
              if (data[i]?.status === 'chatList') {
                simpleChannelList.push({id: i, created: data[i]?.createdAt});
              } else if (data[i]?.status === 'archive') {
                archiveChannelList.push({id: i, created: data[i]?.createdAt});
              } else {
                archiveChannelList.push({id: i, created: data[i]?.createdAt});
              }
            }

            snap.forEach((res: FirebaseDatabaseTypes.DataSnapshot) => {
              const arr = Object.keys(res?.val()?.participants ?? {}).filter(
                item => item !== userId,
              );

              databaseRef(`channels/${res?.val()?.id}/lastMessage`).on(
                'value',
                async snap => {
                  if (snap.exists()) {
                    setChannelDetails(prev => ({
                      ...prev,
                      [res?.val()?.id]: {
                        ...prev?.[res?.val()?.id],
                        lastMessage: snap.val()?.text,
                        imageRender: snap.val()?.image,
                        lastMessageId: snap.val()?._id,
                      },
                    }));
                  }
                },
              );

              const channelDetailRef = databaseRef(`users/${arr[0]}`);
              channelDetailRef.on('value', profileSnap => {
                const profileDetail = profileSnap.val();

                setChannelDetails(prev => ({
                  ...prev,
                  [res?.val()?.id]: {
                    ...prev?.[res?.val()?.id],
                    id: res?.val()?.id,
                    image: profileDetail?.photoURL,
                    name: profileDetail?.displayName,
                    uId: arr[0],
                  },
                }));
              });

              return undefined;
            });
            simpleChannelList.sort((a, b) => b?.created - a?.created);
            archiveChannelList.sort((a, b) => b?.created - a?.created);

            setChannelList(simpleChannelList);
            setArchiveList(archiveChannelList);
            setIsLoading(false);
          },
        );
        return () => {
          databaseRef(`channelIndex/${userId}/channels`).off('value', id);
        };
      } catch (err) {
        setIsLoading(false);
        console.error(err);
      }
    };
    fetchChannelList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log({channelList, archiveList, lastMessageId});

  return {
    channelDetails,
    channelList,
    userId,
    archiveList,
    isLoading,
  };
};

export default useSwipeList;
