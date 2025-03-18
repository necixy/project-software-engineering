import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {useEffect, useState} from 'react';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

const useFollowers = (proId: string) => {
  const [followers, setFollowers] = useState<TViewProfileData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userData: TUserDetails = useAppSelector(
    state => state.userReducer?.userDetails,
  );
  const [followersCount, setFollowersCount] = useState(0);
  useEffect(() => {
    const getFollowers = async () => {
      try {
        await databaseRef(`followers/${proId ?? userData?.uid}/count`).on(
          'value',
          snapshot => {
            setFollowersCount(snapshot.val() ?? 0);
          },
        );
        return () => {
          databaseRef(`followers/${proId ?? userData?.uid}/count`).off('value');
        };
      } catch (error) {
        console.error({error});
      }
    };
    getFollowers();
  }, [userData?.uid]);

  useEffect(() => {
    setLoading(true);
    getData();
  }, [proId]);
  const getData = async () => {
    try {
      await databaseRef(`followers/${proId}`).once('value', async snapshot => {
        if (snapshot.exists()) {
          const target = snapshot.val();
          // console.log(target, Object.keys(target));

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
          setFollowers(usersArray);
          setLoading(false);
          setIsRefreshing(false);
        } else {
          setFollowers([]);
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

  return {followers, loading, getData, onRefresh, isRefreshing, followersCount};
};

export default useFollowers;
