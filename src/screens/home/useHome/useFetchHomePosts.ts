// // the component below will get the following list (from redux state) of the logged in user
// import {useEffect, useState} from 'react';
// import {useAppSelector} from 'src/redux/reducer/reducer';
// import {databaseRef} from 'src/utils/useFirebase/useFirebase';
// import {useTranslation} from 'react-i18next';
// import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
// import {BackHandler} from 'react-native';
// const PAGE_SIZE = 3;
// interface Post {
//   key: string;
//   caption: string;
//   createdAt: number;
//   createdBy: string;
//   id: string;
//   media: string[];
//   rating: number;
//   userName: string;
// }
// const useFetchHomePosts = () => {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [lastVisible, setLastVisible] = useState<Post | null>(null);
//   const [loading, setLoading] = useState(false);
//   const {t} = useTranslation();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const following = useAppSelector(
//     state => state.userReducer.userDetails?.following,
//   );

//   const uid = useAppSelector(state => state.userReducer.userDetails?.uid);
//   const [refreshing, setRefreshing] = useState(false);
//   const followingArray: string[] = following ? Object.values(following) : [];
//   const [feedPosts, setFeedPosts] = useState<string[]>([]);
//   const fetch = async () => {
//     try {
//       if (followingArray?.length) {
//         let array = followingArray;
//         array.push(uid);
//         setIsLoading(true);
//         let tempPost: string[] = [];
//         for (let i = 0; i < array.length && i < 100; i++) {
//           await databaseRef(`users/${followingArray[i]}/posts`).once(
//             'value',
//             snapshot => {
//               if (snapshot.exists()) {
//                 tempPost.push(snapshot.val());
//               }
//             },
//           );
//         }

//         setFeedPosts(
//           tempPost
//             .flatMap(obj => Object.keys(obj).map(key => ({[key]: obj[key]})))
//             .sort((a, b) => Object.values(b)[0] - Object.values(a)[0])
//             .map(obj => Object.keys(obj)[0]),
//         );
//       } else {
//         await databaseRef(`/posts`)
//           .orderByChild('createdAt')
//           .limitToLast(5)
//           .once('value', snapshot => {
//             if (snapshot.exists()) {
//               // tempPost.push(snapshot.val());
//             }
//           });
//       }
//     } catch (error) {
//       console.error(error, 'err at home');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // useEffect(() => {
//   //   // fetchPosts();
//   // }, []);

//   // const fetchPosts = async (loadMore = false) => {
//   //   setLoading(true);

//   //   let query = databaseRef('posts')
//   //     .orderByChild('createdAt')
//   //     .limitToLast(PAGE_SIZE);

//   //   if (loadMore && lastVisible) {
//   //     query = databaseRef('posts')
//   //       .orderByChild('createdAt')
//   //       .endAt(lastVisible.createdAt - 1) // exclusive of the last fetched item
//   //       .limitToLast(PAGE_SIZE);
//   //   }

//   //   try {
//   //     const snapshot = await query.once('value');
//   //     if (snapshot.exists()) {
//   //       let fetchedPosts: Post[] = [];
//   //       snapshot.forEach(childSnapshot => {
//   //         const post = childSnapshot.val() as Post;
//   //         fetchedPosts.push({
//   //           // key: childSnapshot.key as string,
//   //           ...post,
//   //         });
//   //         return undefined; // Ensure the function returns undefined
//   //       });

//   //       fetchedPosts = fetchedPosts.reverse(); // to get the correct order

//   //       if (loadMore) {
//   //         setPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
//   //       } else {
//   //         setPosts(fetchedPosts);
//   //       }

//   //       setLastVisible(fetchedPosts[fetchedPosts.length - 1]);
//   //     }
//   //   } catch (error) {
//   //     console.error(error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   useEffect(() => {
//     //below code will fetch the posts list of the users that are being followed by the logged in user.
//     fetch();
//   }, [following]);
//   return {
//     feedPosts,
//     t,
//     isLoading,
//     fetch,
//     refreshing,
//   };
// };
// export default useFetchHomePosts;

// import {View, Text} from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {databaseRef} from 'src/utils/useFirebase/useFirebase';
// import {useTranslation} from 'react-i18next';
// import {useAppSelector} from 'src/redux/reducer/reducer';

// const PAGE_SIZE = 3;

// const useFetchHomePosts = () => {
//   const [posts, setPosts] = useState<TFeedPostObject[]>([]);
//   const [lastVisible, setLastVisible] = useState<TFeedPostObject | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isFetching, setIsFetching] = useState(false);
//   const [isRefetching, setIsRefetching] = useState(false);
//   const {t} = useTranslation();
//   const following = useAppSelector(
//     state => state.userReducer.userDetails?.following,
//   );

//   useEffect(() => {
//     fetchFollowing();
//   }, []);

//   const fetchFollowing = async () => {
//     try {
//       // if (!following?.length) {
//       //   return setLoading(false);
//       // }

//       await fetchPosts();
//     } catch (error) {
//       console.error('Error fetching following list:', error);
//     }
//   };

//   const fetchPosts = async (loadMore = false, refetch = false) => {
//     const followingArray = Object.values(following ?? {});

//     if (followingArray.length === 0) {
//       return setLoading(false);
//     }

//     if (refetch) {
//       setIsRefetching(true);
//     } else {
//       loadMore ? setIsFetching(true) : setLoading(true);
//     }

//     try {
//       let postsQuery = databaseRef('posts')
//         .orderByChild('createdAt')
//         .limitToLast(PAGE_SIZE);

//       if (loadMore && lastVisible) {
//         postsQuery = postsQuery.endAt(lastVisible.createdAt - 1);
//       }

//       const postsSnapshot = await postsQuery.once('value');
//       const fetchedPosts: TFeedPostObject[] = [];

//       const postPromises: Promise<void>[] = [];

//       postsSnapshot.forEach(childSnapshot => {
//         const post = childSnapshot.val() as TFeedPostObject;
//         if (followingArray.includes(post.createdBy)) {
//           const userPromise = databaseRef(`users/${post.createdBy}`)
//             .once('value')
//             .then(userSnapshot => {
//               const user = userSnapshot.val() as TUserDetails;
//               fetchedPosts.push({
//                 ...post,
//                 userDetails: user,
//               });
//             });
//           postPromises.push(userPromise);
//         }
//         return undefined;
//       });

//       await Promise.all(postPromises);

//       fetchedPosts.reverse(); // to get the correct order

//       if (loadMore) {
//         setPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
//       } else {
//         setPosts(fetchedPosts);
//       }

//       setLastVisible(fetchedPosts[fetchedPosts.length - 1]);
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     } finally {
//       if (refetch) {
//         setIsRefetching(false);
//       } else {
//         loadMore ? setIsFetching(false) : setLoading(false);
//       }
//     }
//   };

//   const handleLoadMore = () => {
//     if (!loading && !isFetching && lastVisible) {
//       fetchPosts(true);
//     }
//   };

//   const onRefetch = () => {
//     if (!loading && !isRefetching) {
//       setIsRefetching(true);
//       fetchPosts(false, true);
//     }
//   };

//   return {
//     t,
//     isLoading: loading,
//     posts,
//     handleLoadMore,
//     loading,
//     isFetching,
//     onRefetch,
//     isRefetching,
//   };
// };

// export default useFetchHomePosts;

// the component below will get the following list (from redux state) of the logged in user
import {useCallback, useEffect, useRef, useState} from 'react';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import {useTranslation} from 'react-i18next';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {BackHandler} from 'react-native';
import {setNativeProps} from 'react-native-reanimated';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
const useFetchHomePosts = () => {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isError, setIsError] = useState(false);

  const uid = useAppSelector(state => state.userReducer.userDetails?.uid);
  const detail = useAppSelector(state => state?.userReducer?.userDetails);
  const [refreshing, setRefreshing] = useState(false);

  const [feedPosts, setFeedPosts] = useState<string[]>([]);
  const [postData, setPostData] = useState<TFeedPostObject[]>([]);
  const {isFocused} = useStackNavigation();
  const [mostVisibleIndex, setMostVisibleIndex] = useState(null);

  const viewabilityConfig = {
    minimumViewTime: 10,
    viewAreaCoveragePercentThreshold: 70,
  };
  const onViewableItemsChanged = useRef(({viewableItems}) => {
    viewableItems.forEach(item => {
      setMostVisibleIndex(item.index);
    });
  }).current;
  const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig, onViewableItemsChanged},
  ]).current;
  const fetchPosts = async () => {
    try {
      let array = [];
      const followingRef = await databaseRef(`following/${uid}`)
        .once('value');
      const followingObject = followingRef.val();
      array = Object.keys(followingObject ?? {});
      array.push(uid);
      let usersPromises: Promise<void | FirebaseDatabaseTypes.DataSnapshot>[] =
        [];

      let users = new Map();

      array?.forEach((userId: string) => {
        // let tempDetailStructure: TBookingHistory;

        let userPromise = databaseRef(`users/${userId}`)?.once(
          'value',
          async snapshot => {
            let otherUserDetails: TUserDetails = snapshot.val();
            users.set(userId, otherUserDetails);
          },
        );
        usersPromises?.push(userPromise);
      });

      await Promise.all(usersPromises);
      const tempPostPromises = array.slice(0, 100).map(async userId => {
        if (userId === 'count') return null;
        const snapshot = await databaseRef(`users/${userId}/posts`).once(
          'value',
        );
        return snapshot.exists() ? snapshot.val() : null;
      });

      const tempPosts = (await Promise.all(tempPostPromises)).filter(Boolean);
      const sortedFeedPosts = tempPosts
        .flatMap(obj => Object.keys(obj).map(key => ({[key]: obj[key]})))
        .sort((a, b) => Object.values(b)[0] - Object.values(a)[0])
        .map(obj => Object.keys(obj)[0]);

      const postPromises = sortedFeedPosts.map(async postId => {
        const snapshot = await databaseRef(`posts/${postId}`).once('value');
        const postDetails: TFeedPostObject = snapshot.val();
        return snapshot.exists()
          ? {
              ...postDetails,
              userDetails: users.get(postDetails?.createdBy),
            }
          : null;
      });

      const postData = (await Promise.all(postPromises)).filter(Boolean);
      setPostData(postData);
    } catch (error) {
      console.error(error, 'Error fetching posts');
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [detail?.posts?.length]);

  const onRefresh = () => {
    setIsRefetching(true);
    fetchPosts();
  };
  return {
    feedPosts: postData,
    t,
    isLoading,
    fetchPosts,
    refreshing,
    viewabilityConfigCallbackPairs,
    isFocused,
    mostVisibleIndex,
    viewabilityConfig,
    isError,
    isRefetching,
    onRefresh,
  };
};
export default useFetchHomePosts;
