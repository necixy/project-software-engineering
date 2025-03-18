import {firebase} from '@react-native-firebase/auth';
import {useEffect, useRef, useState} from 'react';
import {useAppSelector} from 'src/redux/reducer/reducer';
import useCheckFollower from 'src/screens/follows/useCheckFollower';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

const useProfileHeaderButtons = (
  opponentUserId: string,
  type: 'follower' | 'following',
) => {
  const isNewFollowing = useCheckFollower(type, opponentUserId);
  const navigation = useStackNavigation();
  const [isFollowing, setIsFollowing] = useState<boolean>();
  const [isFollowers, setIsFollowers] = useState<boolean>();

  const [block, setBlock] = useState(false);
  const [reported, setReported] = useState(false);

  // if(isFollowing !== isNewFollowing){
  //   setIsFollowing(isNewFollowing)
  // }

  const {userDetails} = useAppSelector(state => state.userReducer);
  const [isButtonLoading, setIsButtonLoading] = useState({
    followLoading: false,
    blockLoading: false,
    reportLoading: false,
  });
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const isClicked = useRef(false);

  const [userFunctionStatus, setUserFunctionStatus] = useState([
    {
      id: 1,
      name: 'follow',
      label1: 'Follow',
      label2: 'Unfollow',
      status: false,
    },
    {
      id: 2,
      name: 'block',
      label1: 'Block',
      label2: 'Unblock',
      status: false,
    },
    {
      id: 3,
      name: 'report',
      label1: 'Report',
      label2: 'Reported',
      status: false,
    },
  ]);
  const updateIsClicked = () => {
    isClicked.current = !isClicked.current;
  };

  const handleFollowers = async () => {
    const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
    if (isClicked.current) return null;
    updateIsClicked();
    try {
      setIsButtonLoading(prev => ({...prev, followLoading: true}));
      if (isFollowers) {
        await databaseRef(
          `following/${opponentUserId}/${userDetails?.uid}`,
        ).remove();
        await databaseRef(`following/${opponentUserId}/count`).transaction(
          (perv = 0) => perv - 1,
        );
        await databaseRef(
          `followers/${userDetails?.uid}/${opponentUserId}`,
        ).remove();
        await databaseRef(`followers/${userDetails?.uid}/count`).transaction(
          (perv = 0) => perv - 1,
        );
      } else {
        await databaseRef(
          `followers/${opponentUserId}/${userDetails?.uid}`,
        ).update({
          createdAt: firebaseTimestamp,
        });
        await databaseRef(`followers/${opponentUserId}/count`).transaction(
          (perv = 0) => perv + 1,
        );
        await databaseRef(
          `following/${userDetails?.uid}/${opponentUserId}`,
        ).update({
          createdAt: firebaseTimestamp,
        });
        await databaseRef(`following/${userDetails?.uid}/count`).transaction(
          (perv = 0) => perv + 1,
        );
      }
      setIsButtonLoading(prev => ({...prev, followLoading: false}));
    } catch (error) {
      setIsButtonLoading(prev => ({...prev, followLoading: false}));
      console.error('error on update Following', error);
      showModal({
        type: 'error',
        message: 'Internal server error! \n' + JSON.stringify(error),
      });
    } finally {
      // setIsButtonLoading(false);
      updateIsClicked();
    }
  };

  const handleFollowings = async () =>
    // opponentUserId: string
    {
      console.log('isClicked.current  +++ ', isClicked.current, {isFollowing});
      if (isClicked.current) return null;
      updateIsClicked();

      const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;

      try {
        setIsButtonLoading(prev => ({...prev, followLoading: true}));
        if (isFollowing) {
          await databaseRef(
            `followers/${opponentUserId}/${userDetails?.uid}`,
          ).remove();
          await databaseRef(`followers/${opponentUserId}/count`).transaction(
            (perv = 0) => {
              return perv - 1 < 0 ? 0 : perv - 1;
            },
          );
          await databaseRef(
            `following/${userDetails?.uid}/${opponentUserId}`,
          ).remove();
          await databaseRef(`following/${userDetails?.uid}/count`).transaction(
            (perv = 0) => {
              return perv - 1 < 0 ? 0 : perv - 1;
            },
          );

          const updatedUserFunctionStatus = userFunctionStatus.map(item => {
            if (item.id === 1) {
              return {...item, status: false};
            }
            return item;
          });

          setUserFunctionStatus(updatedUserFunctionStatus);
        } else {
          await databaseRef(
            `followers/${opponentUserId}/${userDetails?.uid}`,
          ).update({
            createdAt: firebaseTimestamp,
          });
          await databaseRef(`followers/${opponentUserId}/count`).transaction(
            (perv = 0) => {
              return perv + 1;
            },
          );
          await databaseRef(
            `following/${userDetails?.uid}/${opponentUserId}`,
          ).update({
            createdAt: firebaseTimestamp,
          });
          await databaseRef(`following/${userDetails?.uid}/count`).transaction(
            (perv = 0) => {
              return perv + 1;
            },
          );

          const updatedUserFunctionStatus = userFunctionStatus.map(item => {
            if (item.id === 1) {
              return {...item, status: true};
            }
            return item;
          });

          setUserFunctionStatus(updatedUserFunctionStatus);
        }
        // setIsButtonLoading(false);
        setIsButtonLoading(prev => ({...prev, followLoading: false}));
      } catch (error) {
        setIsButtonLoading(prev => ({...prev, followLoading: false}));

        console.error('error on update Following', error);

        showModal({
          type: 'error',
          message: 'Internal server error!',
        });
      } finally {
        // setIsButtonLoading(false);
        updateIsClicked();
      }
    };

  // if(isFollowing !== isNewFollowing){
  //   console.log('again',{isNewFollowing});
  //   const updatedUserFunctionStatus = userFunctionStatus.map(item => {
  //     if (item.id === 1) {
  //       console.log("22", {isFollowing})
  //       return {...item, status: isFollowing};
  //     }
  //     return item;
  //   });

  //   setUserFunctionStatus(updatedUserFunctionStatus);
  //   setIsFollowing(isNewFollowing);
  // }

  useEffect(() => {
    setIsFollowing(isNewFollowing);
    setIsFollowers(isNewFollowing);
    // const updatedUserFunctionStatus = userFunctionStatus.map(item => {
    //   if (item.id === 1) {
    //     console.log("22", {item, isFollowing})
    //     return {...item, status: isFollowing? true: false };
    //   }
    //   return item;
    // });

    // setUserFunctionStatus(updatedUserFunctionStatus);
    isBlocked();
    isReported();
  }, [isNewFollowing]);

  function debounce(func: (...args: any[]) => void, delay: number) {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  const isBlocked = async () => {
    await databaseRef(`blocked/${opponentUserId}`).once('value', snapshot => {
      let dataList: TBlockedUserData[] | null = snapshot.exists()
        ? Object.values(snapshot.val())
        : null;
      let blockedUserFound = dataList?.filter(
        (item: TBlockedUserData) => item?.blockedUserId == opponentUserId,
      );
      const updatedUserFunctionStatus = userFunctionStatus.map(item => {
        if (item.id === 2) {
          return {...item, status: blockedUserFound?.length! > 0};
        }
        return item;
      });
      setUserFunctionStatus(updatedUserFunctionStatus);
    });
  };

  const handleBlockPro = async () => {
    setIsButtonLoading(prev => ({...prev, blockLoading: true}));

    try {
      // ${userDetails?.uid}
      await databaseRef(`blocked/${opponentUserId}`).once(
        'value',
        async snapshot => {
          let dataList: TBlockedUserData[] | null = snapshot.exists()
            ? Object.values(snapshot.val())
            : null;
          console.log({dataList});
          let blockedUserFound: TBlockedUserData[] | undefined =
            dataList?.filter(
              (item: TBlockedUserData) => item?.blockedUserId == opponentUserId,
            );

          if (blockedUserFound?.length! > 0) {
            console.log('1', {blockedUserFound});

            await databaseRef(
              `blocked/${opponentUserId}/${userDetails?.uid}`,
              // `blocked/${userDetails?.uid}/${blockedUserFound!?.[0]?.id}`,
            ).remove();
            const updatedUserFunctionStatus = userFunctionStatus.map(item => {
              if (item.id === 2) {
                return {...item, status: false};
              }
              return item;
            });

            setUserFunctionStatus(updatedUserFunctionStatus);
          } else {
            console.log({blockedUserFound});

            const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
            await databaseRef(
              `blocked/${opponentUserId}/${userDetails?.uid}`,
            ).set({
              createdAt: firebaseTimestamp,
              blockedUserId: opponentUserId,
              blockingUser: userDetails?.uid,
            });
            // let blockedUserDataRef = blockedUserRef.push();
            // let blockUserData = {
            //   id: blockedUserDataRef?.key!,
            //   createdAt: firebaseTimestamp,
            //   blockedUserId: opponentUserId,
            //   blockingUser: userDetails?.uid,
            // };
            // blockedUserDataRef.set(blockUserData);
            const updatedUserFunctionStatus = userFunctionStatus.map(item => {
              if (item.id === 2) {
                return {...item, status: true};
              }
              return item;
            });

            setUserFunctionStatus(updatedUserFunctionStatus);

            console.log('blocked users called');
          }
        },
      );
      setIsButtonLoading(prev => ({...prev, blockLoading: false}));
    } catch (error) {
      setIsButtonLoading(prev => ({...prev, blockLoading: false}));
      console.error({error});
    }
  };

  const isReported = async () => {
    // setIsButtonLoading(prev => ({...prev, reportLoading: true}));

    try {
      await databaseRef(`reported/${opponentUserId}`).once(
        'value',
        snapshot => {
          let dataList: TReportedUserData[] | null = snapshot.exists()
            ? Object.values(snapshot.val())
            : null;
          let reportedUserFound = dataList?.filter(
            (item: TReportedUserData) => item?.reportedUserId == opponentUserId,
          );
          if (reportedUserFound?.length! > 0) {
            const updatedUserFunctionStatus = userFunctionStatus.map(item => {
              if (item.id === 3) {
                return {...item, status: reportedUserFound?.length! > 0};
              }
              return item;
            });

            setUserFunctionStatus(updatedUserFunctionStatus);
          }
        },
      );
      // setIsButtonLoading(prev => ({...prev, reportLoading: false}));
    } catch (error) {
      // setIsButtonLoading(prev => ({...prev, reportLoading: false}));
      console.error({error});
    }
  };

  const handleReportedPro = async () => {
    setIsButtonLoading(prev => ({...prev, reportLoading: true}));

    try {
      //fetch the blocked list
      await databaseRef(`reported/${opponentUserId}`).once(
        'value',
        async snapshot => {
          let dataList: TReportedUserData[] | null = snapshot.exists()
            ? Object.values(snapshot.val())
            : null;
          let reportedUserFound: TReportedUserData[] | undefined =
            dataList?.filter(
              (item: TReportedUserData) =>
                item?.reportedUserId == opponentUserId,
            );

          if (reportedUserFound?.length! > 0) {
            await databaseRef(
              `reported/${opponentUserId}/${userDetails?.uid}`,
              // `reported/${opponentUserId}/${userDetails?.uid}/${reportedUserFound!?.[0]?.id}`,
            ).remove();
            const updatedUserFunctionStatus = userFunctionStatus.map(item => {
              if (item.id === 3) {
                return {...item, status: false};
              }
              return item;
            });

            setUserFunctionStatus(updatedUserFunctionStatus);
          } else {
            const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
            await databaseRef(
              `reported/${opponentUserId}/${userDetails?.uid}`,
            ).set({
              createdAt: firebaseTimestamp,
              reportedUserId: opponentUserId,
              reportingUser: userDetails?.uid,
            });
            // let reportedUserDataRef = reportedUserRef.push();
            // let reportedUserData = {
            //   // id: reportedUserDataRef?.key!,
            //   createdAt: firebaseTimestamp,
            //   reportedUserId: opponentUserId,
            //   reportingUser: userDetails?.uid,
            // };
            // reportedUserDataRef.set(reportedUserData);
            const updatedUserFunctionStatus = userFunctionStatus.map(item => {
              if (item.id === 3) {
                return {...item, status: true};
              }
              return item;
            });

            setUserFunctionStatus(updatedUserFunctionStatus);
          }
        },
      );
      setIsButtonLoading(prev => ({...prev, reportLoading: false}));
    } catch (error) {
      setIsButtonLoading(prev => ({...prev, reportLoading: false}));
      console.error({error});
    }
  };

  let handleFollow = debounce(handleFollowings, 500);

  const handleUserFunctions = (item: any) => {
    switch (item?.id) {
      case 1:
        handleFollow();
        setModalOpen(false);
        break;

      case 2:
        handleBlockPro();
        setModalOpen(false);
        break;

      case 3:
        handleReportedPro();
        setModalOpen(false);
        break;
    }
  };

  return {
    isButtonLoading,
    uid: userDetails?.uid,
    isFollowing,
    handleFollow: debounce(handleFollowings, 500),
    handleFollowers: debounce(handleFollowers, 500),
    isFollowers,
    navigation,
    handleUserFunctions,
    modalOpen,
    setModalOpen,
    userFunctionStatus,
    setUserFunctionStatus,
  };
};
export default useProfileHeaderButtons;
