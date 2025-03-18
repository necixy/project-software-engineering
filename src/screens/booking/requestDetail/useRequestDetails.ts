import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import updateBookingStatus from '../hooks/updateBookingStatus';
import {statusType} from '../component/RequestsJSON';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

const useRequestDetails = (route: {
  params: {
    headingText?: string | undefined;
    badgeText?: string | undefined;
    displayButton?: boolean | undefined;
    displayComplete?: boolean | undefined;
    displayCancel?: boolean | undefined;
    details?: TBookingHistory | undefined;
    displayBadge?: boolean | undefined;
  };
}) => {
  const {
    headingText,
    badgeText,
    displayButton,
    displayComplete,
    displayCancel,
    details,
    displayBadge,
  } = route?.params;
  const [showMap, setShowMap] = useState<boolean>(false);

  const {userDetails, userType} = useAppSelector(state => state?.userReducer);
  // details to be shown in request details page
  const [bookingDetails, setBookingDetails] = useState<
    TDetailsPageData | null | TBookingDetails
  >(null);

  const [existingReview, setExistingReview] = useState<TRatingData | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [missionModalOpen, setMissionModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const {t} = useTranslation();
  const {goBack, pop} = useStackNavigation();
  const initialData = {
    headingText: t('common:requestDetails'),
    badgeText: t('common:onHold'),
    displayButton: false,
    displayComplete: false,
    displayCancel: false,
    displayBadge: false,
  };
  const [additionalDetails, setAdditionalDetails] = useState(initialData);

  useEffect(() => {
    // getBookingDetails();

    if (
      badgeText == t('common:onHold') ||
      badgeText == t('common:accepted') ||
      userDetails?.uid == details?.clientUserUId!
    ) {
      if (details?.status == statusType.completed) {
        fetchRating();
      }
      getOtherUserDetails(details?.proUserUId!);
    } else if (
      badgeText == t('common:requests') ||
      badgeText == t('common:missions') ||
      userDetails?.uid == details?.proUserUId!
    ) {
      getOtherUserDetails(details?.clientUserUId!);
    }
  }, [details?.id]);
  // useFocusEffect(
  //   useCallback(() => {
  //     if (
  //       // badgeText == t('common:onHold') ||
  //       // badgeText == t('common:accepted') ||
  //       userDetails?.uid == details?.clientUserUId!
  //     ) {
  //       if (details?.status == statusType.completed) {
  //         fetchRating();
  //       }
  //       getOtherUserDetails(details?.proUserUId!);
  //     } else if (
  //       // badgeText == t('common:requests') ||
  //       // badgeText == t('common:missions') ||
  //       userDetails?.uid == details?.proUserUId!
  //     ) {
  //       getOtherUserDetails(details?.clientUserUId!);
  //     }
  //   }, []),
  // );

  const fetchRating = async () => {
    try {
      await databaseRef('reviews')
        ?.orderByChild('clientPro')
        ?.equalTo(`${details?.clientUserUId}_${details?.proUserUId}`)
        ?.once('value', snapshot => {
          let snap = snapshot?.val();
          if (snap !== null) {
            snap = Object.values(snap);
            setExistingReview(snap);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getOtherUserDetails = async (otherUserId: string) => {
    await databaseRef(`users/${otherUserId}`).once('value', snapshot => {
      let otherUser: TUserDetails | null = snapshot.val();
      if (otherUser !== null && otherUser) {
        arrangeBookingDetails(otherUser);
      } else {
        setLoading(false);
      }
    });
  };

  //arrange booking details for showing in details page
  const arrangeBookingDetails = (
    otherUser: TUserDetails,
    bookingDetails?: TBookingHistory,
  ) => {
    try {
      if (details) {
        setBookingDetails({
          id: bookingDetails?.id!,
          name: otherUser?.displayName!,
          photoUrl: otherUser?.photoURL!,
          userUId: otherUser?.uid!,
          bookingDate: {
            date: bookingDetails?.orderDate?.date!,
            time: bookingDetails?.orderDate?.time!,
          },
          orderDetails: bookingDetails?.orderDetails!,
          orderAddress: bookingDetails?.orderAddress!,
          note: bookingDetails?.note,
          status: bookingDetails?.status,
          clientUserUId: bookingDetails?.clientUserUId,
          proUserUId: bookingDetails?.proUserUId,
          fcmTokens: otherUser?.fcmTokens,
        });
        // if (
        //   (badgeText == t('common:onHold') ||
        //     badgeText == t('common:accepted')) &&
        //   otherUser !== null
        // ) {
        //   setBookingDetails({
        //     id: details?.id,
        //     name: otherUser?.displayName!,
        //     photoUrl: otherUser?.photoURL!,
        //     userUId: otherUser?.uid!,
        //     bookingDate: details?.orderDate,
        //     orderDetails: details?.orderDetails,
        //     orderAddress: details?.orderAddress,
        //     note: details?.note,
        //     status: details?.status,
        //     clientUserUId: details?.clientUserUId,
        //     proUserUId: details?.proUserUId,
        //   });
        // } else if (
        //   (badgeText == t('common:requests') ||
        //     badgeText == t('common:missions')) &&
        //   otherUser !== null
        // ) {
        //   setBookingDetails({
        //     id: details?.id,
        //     name: otherUser?.displayName!,
        //     photoUrl: otherUser?.photoURL!,
        //     userUId: otherUser?.uid!,
        //     bookingDate: details?.orderDate,
        //     orderDetails: details?.orderDetails,
        //     orderAddress: details?.orderAddress,
        //     note: details?.note,
        //     status: details?.status,
        //     clientUserUId: details?.clientUserUId,
        //     proUserUId: details?.proUserUId,
        //   });
        // }
      }
    } catch (error) {
      console.error({error});
    } finally {
      setLoading(false);
    }
  };
  const cancelBooking = async () => {
    try {
      let changedStatus = {
        clientUserUId_status: `${details?.clientUserUId}_canceled`,
        proUserUId_status: `${details?.proUserUId}_canceled`,
        status: `canceled`,
      };

      await databaseRef(`booking/${details?.id}`)
        .update(changedStatus)
        .then(() => {
          showModal({
            message: t('message:canceledSuccessfully'),
            type: 'success',
          });
          goBack();
        });
    } catch (error) {
      console.error('Cancel Booking', error);
    }
  };

  const {toUpdateBookings} = updateBookingStatus({
    screen: 'RequestDetail',
    back: true,
    details: details!,
    clientUserUId: details?.otherUserUId ?? details?.clientUserUId,
    proUserUId: details?.proUserId,
  });

  // const toUpdateBookings = async (newStatus: string) => {
  //   try {
  //     let changedStatus = {
  //       clientUserUId_status: `${
  //         details?.clientUserUId
  //       }_${newStatus?.toLocaleLowerCase()}`,
  //       proUserUId_status: `${
  //         details?.proUserUId
  //       }_${newStatus?.toLocaleLowerCase()}`,
  //       status: `${newStatus?.toLocaleLowerCase()}`,
  //     };
  //     await databaseRef(`booking/${details?.id}`)
  //       .update(changedStatus)
  //       .then(() => {
  //         let messageShown: string =
  //           newStatus == t('common:canceled')
  //             ? t('message:canceledSuccessfully')
  //             : newStatus == t('customWords:completed')
  //             ? t('message:completedSuccessfully')
  //             : t('customWords:updatedSuccessfully');
  //         showModal({
  //           message: messageShown,
  //           type: 'success',
  //         });
  //         goBack();
  //       });
  //   } catch (error) {
  //     console.error('Booking Update Error: ', error);
  //   }
  // };

  const getBookingDetails = async () => {
    setLoading(true);

    try {
      await databaseRef(`booking/${details?.id}`).once('value', snapshot => {
        if (snapshot.exists()) {
          let orderDetail: TBookingHistory | null = snapshot.val();

          if (orderDetail !== null) {
            setBookingDetails(orderDetail);
          }
          if (
            // badgeText == t('common:onHold') ||
            // badgeText == t('common:accepted') ||
            userDetails?.uid == details?.clientUserUId!
          ) {
            setAdditionalDetails(additionalDetails => ({
              ...additionalDetails,
              displayBadge: true,
            }));

            if (details?.status == statusType.completed) {
              fetchRating();
            } else if (details?.status == statusType.requested) {
              setAdditionalDetails(additionalDetails => ({
                ...additionalDetails,
                displayCancel: true,
              }));
            }

            // if()
            getOtherUserDetails(details?.proUserUId!);
          } else if (
            // badgeText == t('common:requests') ||
            // badgeText == t('common:missions') ||
            userDetails?.uid == details?.proUserUId!
          ) {
            getOtherUserDetails(details?.clientUserUId!);
          }
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    userDetails,
    userType,
    headingText,
    badgeText,
    displayButton,
    displayBadge,
    displayCancel,
    details,
    t,
    bookingDetails,
    loading,
    modalOpen,
    setModalOpen,
    cancelBooking,
    toUpdateBookings,
    displayComplete,
    existingReview,
    showMap,
    setShowMap,
    pop,
    missionModalOpen,
    setMissionModalOpen,
  };
};

export default useRequestDetails;
