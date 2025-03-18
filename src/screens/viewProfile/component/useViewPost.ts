import React, {useEffect, useState} from 'react';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

export default function useViewPost(route: any) {
  const [posts, setPosts] = useState({feedPostObject: undefined});
  const [isLoading, setIsLoading] = useState(false);
  // const {feedPosts} = useFetchHomePosts();
  console.log(route?.params?.postId);

  const handleData = async () => {
    try {
      setIsLoading(true);
      await databaseRef(`posts/${route?.params?.postId!}`).once(
        'value',
        snapshot => {
          let userData = snapshot.val();
          setPosts({...posts, feedPostObject: userData});
        },
      );
    } catch (error) {
      console.error({error});
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    route?.params?.postId! && handleData();
  }, []);

  return {posts, isLoading};
}
