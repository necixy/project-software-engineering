import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import database from '@react-native-firebase/database';
import {auth} from 'src/firebase/databaseRoute';
import {firebase} from '@react-native-firebase/auth';
const useViewProfile = (
  uid: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
  const [postList, setPostList] = useState<any>([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setIsLoading(true);

        // const onValueChange = databaseRef('posts').on('value', snapshot => {});
        let res = await databaseRef('posts').once('value', snapshot => {
          let data = snapshot.val();
          if (data) {
            setPostList(
              Object.values(snapshot.val())
                .filter((item: TUserDetails | any) => item.createdBy === uid)
                .sort(
                  (a: TUserDetails | any, b: TUserDetails | any) =>
                    b.createdAt - a.createdAt,
                ),
            );
          }
        });
        // return () => {
        //   databaseRef(`posts`).off('value', onValueChange);
        // };
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getPosts();
  }, [setIsLoading, uid]);

  return {postList};
};

export default useViewProfile;
