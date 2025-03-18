import {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

const useFetchPost = () => {
  const pageSize = 10;
  const [renderablePostData, setRenderablePostData] = useState<
    TFeedPostObject[]
  >([]);
  const lastPostObject = useRef<TFeedPostObject | null>(null);
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [postData, setPostData] = useState<TFeedPostObject[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const uid = useAppSelector(state => state.userReducer.userDetails?.uid);
  const detail = useAppSelector(state => state?.userReducer?.userDetails);
  const {isFocused} = useStackNavigation();
  const [mostVisibleIndex, setMostVisibleIndex] = useState<number | null>(0);
  const [refetchAgain, setRefetchAgain] = useState<boolean>(false);

  // const fetchPostsUsingOn = () => {
  //   console.log('FETCH POST USING ON CALLED');
  //   setIsLoading(true);

  //   try {
  //     const followingRef = databaseRef(`following/${uid}`);
  //     const postListeners: any = [];

  //     const fetchPosts = (followingObject: any) => {
  //       const array = [...Object.keys(followingObject), uid];
  //       console.log({array});

  //       const usersPromises = array.map(userId =>
  //         databaseRef(`users/${userId}`).once('value'),
  //       );

  //       Promise.all(usersPromises).then(usersSnapshots => {
  //         const users = new Map();
  //         usersSnapshots.forEach(snapshot => {
  //           if (snapshot.exists()) {
  //             users.set(snapshot.key, snapshot.val());
  //           }
  //         });

  //         const tempPostPromises = array
  //           .slice(0, 100)
  //           .map(userId => databaseRef(`users/${userId}/posts`).once('value'));
  //         console.log({tempPostPromises});

  //         Promise.all(tempPostPromises).then(tempPostsSnapshots => {
  //           const tempPosts = tempPostsSnapshots
  //             .filter(snapshot => snapshot.exists())
  //             .map(snapshot => snapshot.val());

  //           const sortedFeedPosts = tempPosts
  //             .flatMap(obj => Object.keys(obj).map(key => ({[key]: obj[key]})))
  //             .sort((a, b) => Object.values(b)[0] - Object.values(a)[0])
  //             .map(obj => Object.keys(obj)[0]);

  //           console.log({sortedFeedPosts});

  //           // Listen to each post in real-time
  //           sortedFeedPosts.forEach(postId => {
  //             const postRef = databaseRef(`posts/${postId}`);
  //             const postListener = postRef.on('value', snapshot => {
  //               if (snapshot.exists()) {
  //                 const post = snapshot.val();
  //                 const userRating = users.get(post.ratingArray);
  //                 const postData = {
  //                   ...post,
  //                   userDetails: users.get(post.createdBy),
  //                 };

  //                 // Filter out reported posts
  //                 if (
  //                   post?.reportedBy &&
  //                   Object.keys(post.reportedBy).includes(uid)
  //                 ) {
  //                   return;
  //                 }

  //                 setPostData(prevPosts => {
  //                   const updatedPosts = [...prevPosts];
  //                   const postIndex = updatedPosts.findIndex(
  //                     p => p.id === postData.id,
  //                   );

  //                   // If the post exists, update it, otherwise add a new one
  //                   if (postIndex >= 0) {
  //                     updatedPosts[postIndex] = postData;
  //                   } else {
  //                     updatedPosts.push(postData);
  //                   }
  //                   return updatedPosts;
  //                 });
  //               }
  //             });

  //             // Store the listener for cleanup
  //             postListeners.push({postId, postRef, postListener});
  //           });
  //         });
  //       });
  //     };

  //     followingRef.on('value', snapshot => {
  //       const followingObject = snapshot.val() ?? {};
  //       fetchPosts(followingObject);
  //     });

  //     return () => {
  //       followingRef.off(); // Stop listening to changes in "following"
  //       // Remove all post listeners
  //       postListeners.forEach(({postRef, postListener}: any) => {
  //         postRef.off('value', postListener);
  //       });
  //     };
  //   } catch (error) {
  //     console.error(error);
  //   }

  //   // Cleanup listener
  // };

  // useEffect(() => {
  //   const cleanup = fetchPostsUsingOn();

  //   return cleanup;
  // }, [refetchAgain]);

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

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const followingRef = await databaseRef(`following/${uid}`).once('value');
      const followingObject = followingRef.val() ?? {};
      const array = [...Object.keys(followingObject), uid];

      const usersPromises = array.map(userId =>
        databaseRef(`users/${userId}`).once('value'),
      );

      const usersSnapshots = await Promise.all(usersPromises);

      const users = new Map();
      usersSnapshots.forEach(snapshot => {
        if (snapshot.exists()) {
          // console.log('usersSnapshots    =>   ', snapshot.val());
          users.set(snapshot.key, snapshot.val());
        }
      });
      // console.log({users});

      const tempPostPromises = array
        .slice(0, 100)
        .map(userId => databaseRef(`users/${userId}/posts`).once('value'));

      const tempPostsSnapshots = await Promise.all(tempPostPromises);

      const tempPosts = tempPostsSnapshots
        .filter(snapshot => snapshot.exists())
        .map(snapshot => snapshot.val());

      const sortedFeedPosts = tempPosts
        .flatMap(obj => Object.keys(obj).map(key => ({[key]: obj[key]})))
        .sort((a, b) => Object.values(b)[0] - Object.values(a)[0])
        .map(obj => Object.keys(obj)[0]);

      const postPromises = sortedFeedPosts.map(postId =>
        databaseRef(`posts/${postId}`).once('value'),
      );

      const postSnapshots = await Promise.all(postPromises);
      const postData = postSnapshots
        .filter(snapshot => {
          if (snapshot.val()?.reportedBy) {
            if (!snapshot.val()?.reportedBy[uid]) {
              return snapshot.exists();
            }
          } else {
            return snapshot.exists();
          }
        })
        .map(snapshot => {
          const userRating = users.get(snapshot.val().ratingArray);
          return {
            ...snapshot.val(),
            userDetails: users.get(snapshot.val().createdBy),
          };
        });
      let dataOfPost = await Promise.all(
        postData.filter(obj => {
          if ('reportedBy' in obj) {
            if (Object.keys(obj.reportedBy).includes(uid)) {
              return;
            }
          } else {
            return obj;
          }
        }),
      );
      // await Promise.all(dataOfPost)

      setPostData(dataOfPost);
    } catch (error) {
      console.error(error, 'Error fetching posts');
      setIsError(true);
    } finally {
      // setIsLoading(false);
      setIsRefetching(false);
    }
  }, [uid, refetchAgain]);

  // useEffect(() => {
  //   const fetchPostsUsingOn = async () => {
  //     console.log('FETCH POST USING ON CALLED');
  //     setIsLoading(true);
  //     try {
  //       const followingRef = databaseRef(`following/${uid}`);
  //       followingRef.on('value', async snapshot => {
  //         const followingObject = snapshot.val() ?? {};
  //         const array = [...Object.keys(followingObject), uid];

  //         const usersPromises = array.map(userId =>
  //           databaseRef(`users/${userId}`).once('value'),
  //         );
  //         const usersSnapshots = await Promise.all(usersPromises);

  //         const users = new Map();
  //         usersSnapshots.forEach(snapshot => {
  //           if (snapshot.exists()) {
  //             users.set(snapshot.key, snapshot.val());
  //           }
  //         });

  //         const tempPostPromises = array
  //           .slice(0, 100)
  //           .map(userId => databaseRef(`users/${userId}/posts`).once('value'));

  //         const tempPostsSnapshots = await Promise.all(tempPostPromises);
  //         const tempPosts = tempPostsSnapshots
  //           .filter(snapshot => snapshot.exists())
  //           .map(snapshot => snapshot.val());

  //         const sortedFeedPosts = tempPosts
  //           .flatMap(obj => Object.keys(obj).map(key => ({[key]: obj[key]})))
  //           .sort((a, b) => Object.values(b)[0] - Object.values(a)[0])
  //           .map(obj => Object.keys(obj)[0]);

  //         console.log({sortedFeedPosts});

  //         const postPromises = sortedFeedPosts.map(postId =>
  //           databaseRef(`posts/${postId}`).once('value'),
  //         );

  //         const postSnapshots = await Promise.all(postPromises);
  //         const postData = postSnapshots
  //           .filter(snapshot => {
  //             const post = snapshot.val();
  //             if (post?.reportedBy && post?.reportedBy[uid]) {
  //               return false; // Skip reported posts
  //             }
  //             return snapshot.exists();
  //           })
  //           .map(snapshot => {
  //             const post = snapshot.val();
  //             return {
  //               ...post,
  //               userDetails: users.get(post?.createdBy),
  //             };
  //           });

  //         const dataOfPost = postData.filter(obj => {
  //           if ('reportedBy' in obj) {
  //             if (Object.keys(obj.reportedBy).includes(uid)) {
  //               return false;
  //             }
  //           }
  //           return true;
  //         });

  //         setPostData(dataOfPost);
  //       });
  //     } catch (error) {
  //       console.error(error, 'Error fetching posts');
  //       setIsError(true);
  //     } finally {
  //       setIsLoading(false);
  //       setIsRefetching(false);
  //     }
  //   };

  //   fetchPostsUsingOn();

  //   return () => {
  //     databaseRef(`following/${uid}`).off(); // Remove listener on component unmount
  //   };
  // }, [refetchAgain]);

  useEffect(() => {
    fetchPosts();

    const newPosts = EventRegister.addEventListener('fetchNewPosts', () => {
      fetchPosts();
    });

    // Register the event listener
    const deleteOrReportThePost = EventRegister.addEventListener(
      'deleteOrReportPost',
      ({postId}) => {
        __DEV__ && Alert.alert(`deleteOrReportThePost pro`, postId);
        setRefetchAgain(true);
        let updatedPostData = postData?.filter(({item}: {item: any}) => {
          console.log('item', {item});
          return item?.id !== postId;
        });

        setPostData(updatedPostData);
        fetchPosts();

        setRefetchAgain(false);
      },
    );

    // Register the event listener
    const uploadThePost = EventRegister.addEventListener('uploadPost', () => {
      // setPostData([]);
      __DEV__ && Alert.alert(`uploadPost pro`);
      setRefetchAgain(true);
      fetchPosts();
      setRefetchAgain(false);
    });

    // Ensure the listener is a string
    if (typeof deleteOrReportThePost === 'string') {
      // Cleanup the event listener when the component unmounts
      return () => {
        EventRegister.removeEventListener(deleteOrReportThePost);
      };
    }

    // // Ensure the listener is a string
    // if (typeof reportThePost === 'string') {
    //   // Cleanup the event listener when the component unmounts
    //   return () => {
    //     EventRegister.removeEventListener(reportThePost);
    //   };
    // }

    // Ensure the listener is a string
    if (typeof uploadThePost === 'string') {
      // Cleanup the event listener when the component unmounts
      return () => {
        EventRegister.removeEventListener(uploadThePost);
      };
    }

    if (typeof newPosts == 'string') {
      return () => {
        EventRegister.removeEventListener(newPosts);
      };
    }
  }, []);

  useEffect(() => {
    paginateArrayOnEnd();
  }, [postData]);

  const onRefresh = useCallback(() => {
    setPostData([]);
    setIsRefetching(true);
    fetchPosts();
  }, []);

  const paginateArrayOnEnd = useCallback(() => {
    try {
      if (postData.length > renderablePostData.length) {
        const idIndex = postData.findIndex(
          post => post.id === lastPostObject.current?.id,
        );
        const tempArray = postData.slice(idIndex + 1, idIndex + 1 + pageSize);
        setRenderablePostData(prevPosts => [...prevPosts, ...tempArray]);
        lastPostObject.current = tempArray[tempArray.length - 1];
      }
    } catch (error) {
      console.error(error, 'Error paginating posts');
    } finally {
    }
  }, [postData, renderablePostData]);

  useEffect(() => {
    if (postData.length >= 0 && renderablePostData.length >= 0) {
      setIsLoading(false);
    }
  }, [postData, renderablePostData]);

  return {
    feedPosts: postData,
    t,
    isLoading,
    // fetchPosts,
    refreshing,
    viewabilityConfigCallbackPairs,
    isFocused,
    mostVisibleIndex,
    viewabilityConfig,
    isError,
    isRefetching,
    onRefresh,
    renderablePostData,
    paginateArrayOnEnd,
  };
};

export default useFetchPost;
