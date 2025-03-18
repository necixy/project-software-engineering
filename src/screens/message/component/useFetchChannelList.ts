import {firebase} from '@react-native-firebase/auth';
import {useEffect} from 'react';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

const useFetchChannelList = () => {
  useEffect(() => {
    const userId = firebase.auth().currentUser?.uid;

    return () => {};
  }, []);

  // const fetchChannels = async () => {
  //   const userChannelsRef = databaseRef(`users/${userId}/channels`);
  //   await userChannelsRef.on('value', snap => {
  //     const channelList = Object.keys(snap?.val() ?? {});
  //     for (let i = 0; i < channelList?.length; i++) {}
  //   });
  // };
  return {};
};

export default useFetchChannelList;
