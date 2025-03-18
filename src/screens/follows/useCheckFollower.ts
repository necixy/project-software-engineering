import {useIsFocused} from '@react-navigation/native';
import {database} from 'firebase-functions/v1/firestore';
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

function useCheckFollower(
  type: 'follower' | 'following',
  opponentUserId: string,
) {
  const isFocused = useIsFocused();

  const [isFollowers, setIsFollowers] = useState<boolean>();
  const uid = useAppSelector(state => state.userReducer?.userDetails?.uid);
  useEffect(() => {
    const url =
      type === 'follower'
        ? `followers/${uid}/${opponentUserId}`
        : `following/${uid}/${opponentUserId}`;
    databaseRef(url).on('value', snapshot => {
      setIsFollowers(snapshot.exists());
    });

    return () => {
      databaseRef(url).off('value');
    };
  }, [uid, opponentUserId, isFocused]);

  return isFollowers;
}

export default useCheckFollower;
