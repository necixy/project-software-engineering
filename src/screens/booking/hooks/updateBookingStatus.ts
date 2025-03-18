import {useTranslation} from 'react-i18next';
import {EventRegister} from 'react-native-event-listeners';
import {updateBookingPaymentStatus} from 'src/api/booking/booking';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import {statusType} from '../component/RequestsJSON';

const updateBookingStatus = ({
  screen,
  back,
  details,
  clientUserUId,
  proUserUId,
  canceledById,
}: {
  screen?: 'RequestDetail' | 'CustomCard';
  back?: boolean;
  details?: TBookingDetails;
  clientUserUId?: string;
  proUserUId?: string;
  canceledById?: string;
}) => {
  // taking cancelByUId
  let canceledBy = useAppSelector(
    state => state?.userReducer?.userDetails?.uid,
  );
  const triggerEvent = ({newStatus, id}: {newStatus: string; id: string}) => {
    // Emit an event with some data
    EventRegister.emit('updateStatus', {newStatus, id});
  };
  const {goBack, pop} = useStackNavigation();
  const {t} = useTranslation();

  // const removeBookingTimes = async () => {
  //   // await databaseRef(`bookingTimes/${data?.uid!}`);
  //   try {
  //     await databaseRef(`bookingTimes/${details?.proUserId!}`)
  //       ?.orderByChild(`date`)
  //       ?.equalTo(moment(details?.orderDate?.date).format('YYYY-MM-DD'))
  //       ?.once('value', async snapshot => {
  //         let bookedData = snapshot.exists()
  //           ? Object.entries(snapshot.val()).map(([key, value]) => ({
  //               key,
  //               ...value,
  //             }))
  //           : null;
  //         let bookedTimesList: any = bookedData?.filter(
  //           item => item?.time == details?.orderDate?.time,
  //         );

  //         if (bookedTimesList) {
  //           await databaseRef(
  //             `bookingTimes/${details?.proUserUId}/${bookedTimesList?.[0]?.key}`,
  //           ).remove();
  //         }
  //       });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const checkStatus = async () => {
  //   try {
  //     await databaseRef(`bookings/${details?.id}`).once('value', snapshot => {
  //       let bookingData = snapshot.val();
  //     });
  //   } catch (error) {
  //     console.error({error});
  //   }
  // };

  const toUpdateBookings = async (newStatus: string, setModalOpen?: any) => {
    try {
      let res = await databaseRef(`booking/${details?.id}`).once('value');

      // if (res.val()?.status !== newStatus) {
      if (newStatus?.toLocaleLowerCase() == statusType?.completed) {
        if (res.val()?.status == statusType.accepted) {
          await updateBookingPaymentStatus(details?.id, 'completed');
          showModal({
            message: t('message:completedSuccessfully'),
            type: 'success',
          });
        } else {
          showModal({
            title: t('message:bookingStatusChanged'),
            message: t('message:refreshThePageTryAgain'),
          });
        }
        triggerEvent({newStatus, id: details?.id!});
        screen == 'RequestDetail' ? goBack() : null;
      } else if (newStatus.toLocaleLowerCase() == statusType?.canceled) {
        if (res.val()?.status !== statusType.canceled) {
          await updateBookingPaymentStatus(details?.id, 'canceled', canceledBy);
          // await removeBookingTimes();
          showModal({
            message: t('message:canceledSuccessfully'),
            type: 'success',
          });
        } else {
          showModal({
            title: t('message:bookingStatusChanged'),
            message: t('message:refreshThePageTryAgain'),
          });
        }
        triggerEvent({newStatus, id: details?.id!});
        screen == 'RequestDetail' ? goBack() : null;
      } else if (newStatus?.toLocaleLowerCase() == statusType.accepted) {
        let changedStatus = {
          clientUserUId_status: `${
            details?.clientUserUId
          }_${newStatus?.toLocaleLowerCase()}`,
          proUserUId_status: `${
            details?.proUserUId
          }_${newStatus?.toLocaleLowerCase()}`,
          status: `${newStatus?.toLocaleLowerCase()}`,
        };

        if (
          res.val()?.status == statusType.requested ||
          res.val()?.status == statusType.paymentPending
        ) {
          await databaseRef(`booking/${details?.id}`)
            .update(changedStatus)
            .then(() => {
              let messageShown: string =
                newStatus == statusType?.canceled
                  ? t('message:canceledSuccessfully')
                  : newStatus == statusType?.completed
                  ? t('message:completedSuccessfully')
                  : t('customWords:updatedSuccessfully');
              showModal({
                message: messageShown,
                type: 'success',
              });
            });
        } else {
          showModal({
            title: t('message:bookingStatusChanged'),
            message: t('message:refreshThePageTryAgain'),
          });
        }
        triggerEvent({newStatus, id: details?.id!});
        screen == 'RequestDetail' ? goBack() : null;
      }
    } catch (error) {
      setModalOpen && setModalOpen(false);
      console.error('Booking Update Error: ', error);
      showModal({
        message: `${error}`,
        type: 'error',
      });
    }
  };
  return {toUpdateBookings};
};

export default updateBookingStatus;
