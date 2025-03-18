import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

const useFollowing = () => {
  const {userDetails} = useAppSelector(state => state.userReducer);
  const uid = userDetails?.uid;

  const [following, setFollowing] = useState<TViewProfileData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [count, setCount] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    databaseRef(`following/${uid}/count`).on('value', snapshot => {
      console.log('snapshot?.val()', snapshot?.val());
      setCount(snapshot?.val() ?? 0);
    });
    loading && getData();
    return () => {
      databaseRef(`following/${uid}/count`).off('value');
    };
  }, [uid, isFocused, loading]);

  const getData = async () => {
    try {
      await databaseRef(`following/${uid}`).once('value', async snapshot => {
        if (snapshot.exists()) {
          const target = snapshot.val();

          const followersArray = Object.keys(target);
          var usersArray: TViewProfileData[] = [];
          let usersDataPromise: Promise<number | undefined>[] = [];

          followersArray?.forEach((userId: string | null) => {
            if (userId) {
              let promise = getDataUserData(userId).then(
                res => res && usersArray.push(res),
              );
              usersDataPromise.push(promise);
            }
          });

          await Promise.all(usersDataPromise);
          setFollowing(usersArray);
          setLoading(false);
          setIsRefreshing(false);
        } else {
          setFollowing([]);
          setLoading(false);
          setIsRefreshing(false);
        }
      });
    } catch (error) {
      console.error('Error in getting followers', error);
      setLoading(false);
      setIsRefreshing(false);
    } finally {
    }
  };

  const getDataUserData = async (
    userId: string,
  ): Promise<TViewProfileData | undefined> => {
    return new Promise(async (resolve, reject) => {
      try {
        let snapshot = await databaseRef(`users/${userId}`).once('value');
        if (snapshot.exists()) {
          const userValue: TViewProfileData = snapshot.val();
          resolve(userValue);
        } else {
          resolve(undefined);
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    getData();
  };

  return {
    following,
    loading,

    onRefresh,
    isRefreshing,
    uid: userDetails?.uid,
    count,
  };
};

export default useFollowing;
