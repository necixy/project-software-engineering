import {firebase} from '@react-native-firebase/auth';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Share} from 'react-native';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

const useViewProfileHeader = (uid: String) => {
  const {t} = useTranslation();

  const userDetails = useAppSelector(state => state?.userReducer?.userDetails);
  const [data, setData] = useState<TViewProfileData>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [reportModal, setReportModal] = useState<boolean>(false);
  const [reportSuccessModal, setReportSuccessModal] = useState<boolean>(false);

  const userFunctionStatus = [
    {
      id: 1,
      name: 'share',
      label1: 'Share this profile',
    },
    {
      id: 2,
      name: 'report',
      label1: 'Report',
      label2: 'Reported',
      status: false,
    },
  ];
  // const [userFunctionStatus, setUserFunctionStatus] = useState([
  //   {
  //     id: 1,
  //     name: 'share',
  //     label1: 'Share this profile',
  //     // label2: 'Unfollow',
  //     status: false,
  //   },
  //   {
  //     id: 2,
  //     name: 'report',
  //     label1: 'Report',
  //     label2: 'Reported',
  //     status: false,
  //   },
  // ]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [reported, setReported] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const onValueChange = databaseRef(`users/${uid}`).on(
          'value',
          snapshot => {
            setData(snapshot.val());
          },
        );
        return () => databaseRef(`users/${uid}`).off('value', onValueChange);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
    isReported();
  }, [uid]);

  // debounce for the function
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
    await databaseRef(`blocked/${uid}`).once('value', snapshot => {
      let dataList: TBlockedUserData[] | null = snapshot.exists()
        ? Object.values(snapshot.val())
        : null;
      let blockedUserFound = dataList?.filter(
        (item: TBlockedUserData) => item?.blockedUserId == uid,
      );
      // const updatedUserFunctionStatus = userFunctionStatus.map(item => {
      //   if (item.id === 2) {
      //     return {...item, status: blockedUserFound?.length! > 0};
      //   }
      //   return item;
      // });
      // setUserFunctionStatus(updatedUserFunctionStatus);
    });
  };

  // const handleBlockPro = async () => {
  //   setIsButtonLoading(prev => ({...prev, blockLoading: true}));

  //   try {
  //     // ${userDetails?.uid}
  //     await databaseRef(`blocked/${uid}`).once('value', async snapshot => {
  //       let dataList: TBlockedUserData[] | null = snapshot.exists()
  //         ? Object.values(snapshot.val())
  //         : null;
  //       console.log({dataList});
  //       let blockedUserFound: TBlockedUserData[] | undefined = dataList?.filter(
  //         (item: TBlockedUserData) => item?.blockedUserId == uid,
  //       );

  //       if (blockedUserFound?.length! > 0) {
  //         console.log('1', {blockedUserFound});

  //         await databaseRef(
  //           `blocked/${uid}/${userDetails?.uid}`,
  //           // `blocked/${userDetails?.uid}/${blockedUserFound!?.[0]?.id}`,
  //         ).remove();
  //         // const updatedUserFunctionStatus = userFunctionStatus.map(item => {
  //         //   if (item.id === 2) {
  //         //     return {...item, status: false};
  //         //   }
  //         //   return item;
  //         // });
  //         // setUserFunctionStatus(updatedUserFunctionStatus);
  //         setReported(false);
  //       } else {
  //         console.log({blockedUserFound});

  //         const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
  //         await databaseRef(`blocked/${uid}/${userDetails?.uid}`).set({
  //           createdAt: firebaseTimestamp,
  //           blockedUserId: uid,
  //           blockingUser: userDetails?.uid,
  //         });
  //         // let blockedUserDataRef = blockedUserRef.push();
  //         // let blockUserData = {
  //         //   id: blockedUserDataRef?.key!,
  //         //   createdAt: firebaseTimestamp,
  //         //   blockedUserId: opponentUserId,
  //         //   blockingUser: userDetails?.uid,
  //         // };
  //         // blockedUserDataRef.set(blockUserData);
  //         // const updatedUserFunctionStatus = userFunctionStatus.map(item => {
  //         //   if (item.id === 2) {
  //         //     return {...item, status: true};
  //         //   }
  //         //   return item;
  //         // });

  //         // setUserFunctionStatus(updatedUserFunctionStatus);
  //         setReported(false);

  //         console.log('blocked users called');
  //       }
  //     });
  //     setIsButtonLoading(prev => ({...prev, blockLoading: false}));
  //   } catch (error) {
  //     setIsButtonLoading(prev => ({...prev, blockLoading: false}));
  //     console.error({error});
  //   }
  // };

  const isReported = async () => {
    // setIsButtonLoading(prev => ({...prev, reportLoading: true}));

    try {
      await databaseRef(`reported/${uid}`).once('value', snapshot => {
        let dataList: TReportedUserData[] | null = snapshot.exists()
          ? Object.values(snapshot.val())
          : null;
        let reportedUserFound = dataList?.filter(
          (item: TReportedUserData) => item?.reportedUserId == uid,
        );
        if (reportedUserFound?.length! > 0) {
          // const updatedUserFunctionStatus = userFunctionStatus.map(item => {
          //   if (item.id === 2) {
          //     return {...item, status: reportedUserFound?.length! > 0};
          //   }
          //   return item;
          // });

          // setUserFunctionStatus(updatedUserFunctionStatus);
          setReported(reportedUserFound?.length! > 0);
        }
      });
      // setIsButtonLoading(prev => ({...prev, reportLoading: false}));
      setIsButtonLoading(false);
    } catch (error) {
      // setIsButtonLoading(prev => ({...prev, reportLoading: false}));
      setIsButtonLoading(false);
      console.error({error});
    }
  };

  const handleReportedPro = async () => {
    // setIsButtonLoading(prev => ({...prev, reportLoading: true}));
    setIsButtonLoading(true);

    try {
      // fetch the blocked list
      await databaseRef(`reported/${uid}`).once('value', async snapshot => {
        let dataList: TReportedUserData[] | null = snapshot.exists()
          ? Object.values(snapshot.val())
          : null;
        let reportedUserFound: TReportedUserData[] | undefined =
          dataList?.filter(
            (item: TReportedUserData) =>
              item?.reportedUserId == uid &&
              item?.reportingUser == userDetails?.uid,
          );
        if (reportedUserFound?.length! > 0) {
          // await databaseRef(
          //   `reported/${uid}/${userDetails?.uid}`,
          //   // `reported/${opponentUserId}/${userDetails?.uid}/${reportedUserFound!?.[0]?.id}`,
          // ).remove();
          showModal({message: t('message:alreadyReported')});

          // setReportSuccessModal(true);
          setReported(true);
          setReportModal(false);
        } else {
          const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
          await databaseRef(`reported/${uid}/${userDetails?.uid}`).set({
            createdAt: firebaseTimestamp,
            reportedUserId: uid,
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
          // const updatedUserFunctionStatus = userFunctionStatus.map(item => {
          //   if (item.id === 2) {
          //     return {...item, status: true};
          //   }
          //   return item;
          // });

          // setUserFunctionStatus(updatedUserFunctionStatus);

          setReportModal(false);
          setReported(true);
          setReportSuccessModal(true);
        }
      });
      // setIsButtonLoading(prev => ({...prev, reportLoading: false}));
      setIsButtonLoading(false);
    } catch (error) {
      // setIsButtonLoading(prev => ({...prev, reportLoading: false}));
      setIsButtonLoading(false);
      console.error({error});
    }
  };

  // let handleFollow = debounce(handleFollowings, 500);
  const handleShare = () => {
    Share.share({
      message: `Share this profile https://vita-abe0f.web.app/viewUser?userId=${uid}`,
    });
  };

  const handleUserFunctions = (item: any) => {
    switch (item?.id) {
      case 1:
        handleShare();
        setModalOpen(false);
        break;

      case 2:
        // handleReportedPro();
        setReportModal(true);
        setModalOpen(false);
        break;
    }
  };

  return {
    t,
    data,
    modalOpen,
    setModalOpen,
    userFunctionStatus,
    handleUserFunctions,
    isButtonLoading,
    setIsButtonLoading,
    reported,
    setReported,
    reportModal,
    setReportModal,
    reportSuccessModal,
    setReportSuccessModal,
    handleReportedPro,
  };
};

export default useViewProfileHeader;
