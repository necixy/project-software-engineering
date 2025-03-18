import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import {statusType} from '../component/RequestsJSON';
import updateBookingStatus from './updateBookingStatus';

const useCustomCard = ({
  data,
  status,
}: {
  data?: TBookingDetails;
  status?: string | undefined;
}) => {
  const {t} = useTranslation();
  const {navigate, goBack} = useStackNavigation();
  const {userDetails, userType} = useAppSelector(state => state?.userReducer);
  const [otherUserDetails, setOtherUserDetails] = useState<TUserDetails>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [existingReview, setExistingReview] = useState<TRatingData | null>();
  const [provideRating, setProvideRating] = useState<boolean>(false);
  const [rateLoading, setRateLoading] = useState<boolean>(false);
  const [showMap, setShowMap] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // useEffect(() => {
  //   setLoading(true);

  //   data?.status == statusType?.completed && fetchRating();
  //   if (
  //     status == t('common:onHold') ||
  //     status == t('common:accepted') ||
  //     userDetails?.uid === data?.clientUserUId
  //   ) {
  //     // getProUserDetails();

  //     getOtherUserDetails(data?.proUserUId);
  //   } else if (
  //     status == t('common:requests') ||
  //     status == t('common:missions') ||
  //     userDetails?.uid === data?.proUserUId
  //   ) {
  //     // getClientUserDetails();
  //     getOtherUserDetails(data?.clientUserUId);
  //   }
  // }, []);

  // // get details of other user in Booking details
  // const getOtherUserDetails = async (otherUser: string | undefined) => {
  //   try {
  //     await databaseRef(`users/${otherUser}`)?.once('value', snapshot => {
  //       let snap = snapshot.val();
  //       setOtherUserDetails(snap);
  //     });
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     console.error({error});
  //   }
  // };

  // const fetchRating = async () => {
  //   setRateLoading(true);
  //   try {
  //     await databaseRef('reviews')
  //       ?.orderByChild('clientPro')
  //       ?.equalTo(`${data?.clientUserUId}_${data?.proUserUId}`)
  //       ?.once('value', snapshot => {
  //         let snap = snapshot?.val();
  //         if (snap !== null) {
  //           snap = Object.values(snap);
  //           setExistingReview(snap?.[0]);
  //         }
  //       });
  //   } catch (error) {
  //     console.error({error});
  //   } finally {
  //     setRateLoading(false);
  //   }
  // };

  const {toUpdateBookings} = updateBookingStatus({
    screen: 'CustomCard',
    back: false,
    details: data!,
    clientUserUId: data?.clientUserUId!,
    proUserUId: data?.proUserId!,
  });

  return {
    // otherUserDetails,
    // existingReview,
    uid: userDetails?.uid,
    // isLoading: loading || rateLoading,
    toUpdateBookings,
    navigate,
    goBack,
    t,
    showMap,
    setShowMap,
    modalOpen,
    setModalOpen,
  };
};

export default useCustomCard;
