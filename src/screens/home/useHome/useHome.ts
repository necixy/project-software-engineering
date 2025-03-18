//This function calls for the post uploaded to the firebase for its rendering on home screen.

import {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import {useTranslation} from 'react-i18next';

const useHome = () => {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [feedPost, setFeedPost] = useState<TFeedPostObject[]>([]);
  const customSort = (a: any, b: any) => {
    let timestampA = a.time;
    let timestampB = b.time;
    return timestampB - timestampA;
  };

  useEffect(() => {
    const getFirebaseData = async () => {
      try {
        const onValueChange = await databaseRef('posts').on(
          'value',
          snapshot => {
            if (snapshot.val() != null) {
              setFeedPost(Object.values(snapshot.val()).sort(customSort));
            }
            setIsLoading(false);
          },
        );
        return () => databaseRef('posts').off('value', onValueChange);
      } catch (error) {
        console.error({error});
      }
    };
    getFirebaseData();
  }, []);
  return {
    isLoading,
    setIsLoading,
    feedPost,
    t,
  };
};

export default useHome;
