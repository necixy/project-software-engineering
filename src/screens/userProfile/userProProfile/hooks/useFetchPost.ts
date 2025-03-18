// //This function will get the number of post uploaded by the user logged in the application.
// import {useEffect, useState} from 'react';
// import {useAppSelector} from 'src/redux/reducer/reducer';
// import {
//   hideLoadingSpinner,
//   showLoadingSpinner,
// } from 'src/shared/components/modalProvider/ModalProvider';
// import {databaseRef} from 'src/utils/useFirebase/useFirebase';

// const useFetchPost = () => {
//   const [postList, setPostList] = useState<TFeedPostObject[]>([]);
//   const postData = useAppSelector(
//     state => state?.userReducer.userDetails?.posts,
//   );
//   const uid = useAppSelector(state => state.userReducer?.userDetails?.uid);
//   // const posts = Object.keys(postData)
//   useEffect(() => {
//     const fn = async () => {
//       try {
//         // showLoadingSpinner({});
//         let postArray: TFeedPostObject[] = [];
//         if (postData?.length > 0 && postArray !== null) {
//           await databaseRef(`posts`)
//             .orderByChild('createdBy')
//             .equalTo(`${uid}`)
//             .limitToLast(15)
//             .once('value', snapshot => {
//               let snap = snapshot.val();
//               if (snap) {
//                 postArray = Object.values(snapshot.val());
//                 // console.log(Object.keys(snapshot.val()));
//               }
//               postArray = Object.values(snapshot.val());
//             });

//           setPostList([...postArray].sort((a, b) => b.createdAt - a.createdAt));
//         }
//       } catch (error) {
//         console.error('Error in fetching post', error);
//       } finally {
//         // hideLoadingSpinner();
//       }
//     };

//     fn();
//   }, [postData]);
//   return {
//     posts: postData,
//     postList,
//   };
// };

// export default useFetchPost;

import {useEffect, useState} from 'react';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from 'src/shared/components/modalProvider/ModalProvider';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

const useFetchPost = () => {
  const [postList, setPostList] = useState<TFeedPostObject[]>([]);
  const [lastVisible, setLastVisible] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const postData = useAppSelector(
    state => state?.userReducer.userDetails?.posts,
  );
  const uid = useAppSelector(state => state.userReducer?.userDetails?.uid);

  useEffect(() => {
    fetchPosts();
  }, [postData]);

  const fetchPosts = async (isRefresh = false) => {
    if (loading) return;

    setLoading(true);
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        showLoadingSpinner({});
      }

      let postArray: TFeedPostObject[] = [];
      let query = databaseRef('posts')
        .orderByChild('createdBy')
        .startAt(uid)
        .endAt(uid)
        .limitToLast(15);

      if (lastVisible && !isRefresh) {
        query = query.endAt(lastVisible);
      }

      const snapshot = await query.once('value');
      let snap = snapshot.val();
      if (snap) {
        postArray = Object.values(snap);
        setLastVisible(
          postArray[postArray.length - 1]?.createdAt?.toString() || null,
        );
      }

      if (isRefresh) {
        setPostList([...postArray].sort((a, b) => b.createdAt - a.createdAt));
      } else {
        setPostList(prevPosts => [
          ...prevPosts,
          ...postArray.sort((a, b) => b.createdAt - a.createdAt),
        ]);
      }
    } catch (error) {
      console.error('Error in fetching post', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      hideLoadingSpinner();
    }
  };

  const loadMorePosts = () => {
    if (!loading) {
      fetchPosts();
    }
  };

  const refreshPosts = () => {
    if (!refreshing) {
      setLastVisible(null);
      fetchPosts(true);
    }
  };

  return {
    posts: postData,
    postList,
    loadMorePosts,
    refreshPosts,
    loading,
    refreshing,
  };
};

export default useFetchPost;
