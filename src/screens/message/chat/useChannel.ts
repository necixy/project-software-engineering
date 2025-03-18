import {firebase} from '@react-native-firebase/auth';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
const loginUserUid = firebase.auth().currentUser?.uid;
const useChannel = () => {
  const createChannel = async (newChannelData: createChannelType) => {
    try {
      const {participants, channelInfo} = newChannelData;
      const channelsRef = databaseRef('channels');
      const snapshot = await channelsRef.once('value');
      if (!snapshot.exists()) {
        await channelsRef.set({});
      } else {
        const userChannelsRef = databaseRef(
          `channelIndex/${loginUserUid}/channels`,
        );
        const snap = await userChannelsRef.once('value');
        const channelsData: channelsType = snap.val();

        for (let channelId in channelsData) {
          if (
            channelsData?.[channelId]?.type === 'chat' &&
            channelInfo?.type === 'chat'
          ) {
            let tempParticipants = Object.keys(
              channelsData?.[channelId]?.participants ?? {},
            );
            let isAlreadyExist = tempParticipants?.filter(
              item => participants?.[item] === undefined,
            );
            if (!isAlreadyExist?.length) {
              return channelId;
            }
          }
        }
      }
      const newChannelRef = channelsRef.push();

      // Prepare the channel data to be saved in the database.
      const channel = {
        id: newChannelRef.key,
        ...newChannelData,
      };

      // Save the channel in the database.
      await newChannelRef.set(channel);
      let participantsArray = Object.keys(participants);

      participantsArray.forEach(async participant => {
        const userRef = databaseRef(`channelIndex/${participant}`);
        if (newChannelRef.key) {
          await userRef.child('channels').child(newChannelRef.key).set({
            participants,
            type: channelInfo?.type,
            id: newChannelRef.key,
            status: 'chatList',
            createdAt: firebase.database.ServerValue.TIMESTAMP,
          });
        }
      });
      return newChannelRef.key;
    } catch (err) {
      console.error({err});
    }
  };
  return {createChannel};
};

export default useChannel;
