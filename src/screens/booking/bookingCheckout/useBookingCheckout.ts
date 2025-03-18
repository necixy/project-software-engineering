import Geolocation from '@react-native-community/geolocation';
import {firebase} from '@react-native-firebase/database';
import {confirmPayment} from '@stripe/stripe-react-native';
import {useFormik} from 'formik';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {BackHandler} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import MapView from 'react-native-maps/lib/MapView';
import {goBack} from 'react-navigation-helpers';
import {getSymbols} from 'src/api/getSymbols';
import {sendNotifications} from 'src/api/notification/notification';
import {
  createPaymentIntent,
  getSavedCards,
} from 'src/api/stripe/stripeCustomerId/stripeCustomerId';

import {useAppSelector} from 'src/redux/reducer/reducer';
import {bookedTimesStatus} from 'src/screens/manageAvailability/hooks/useBookAvailability';
import {requestLocationPermission} from 'src/screens/newPost/hooks/UsePermission';
import {getCompleteAddressByLatLong} from 'src/screens/viewMap/component/googlePlaceInput/getCompleteAddress';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {bookingRequestToPro} from 'src/shared/notificationPayload/NotificationPayload';
import {debounce, useDebounce} from 'src/utils/useDebounce';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import * as yup from 'yup';

const useBookingCheckout = (
  data?: bookingDetailsProps,
  mapRef?: React.MutableRefObject<MapView | null>,
) => {
  console.log({data});
  const userInfo = useAppSelector(state => state?.userReducer?.userDetails);
  const [bookingDetails, setBookingDetails] = useState(data!);
  const [bookingTime, setBookingTime] = useState(
    `${moment(data?.date?.[0]?.timestamp ?? new Date()).format(
      'dddd MMMM D',
    )} at ${moment(data?.time?.[0] ?? new Date()?.getTime(), ['HH:mm']).format(
      'hh:mm a',
    )}`,
  );

  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [currencyList, setCurrencyList] = useState<string>('');
  const [startModalOpen, setStartModalOpen] = useState<boolean>(false);
  const [showTimer, setShowTimer] = useState(true);
  const [disableBooking, setDisableBooking] = useState(false);
  const [userLocationData, setUserLocationData] = useState<AddressInfo>();
  const [currentLocation, setCurrentLocation] = useState<AddressInfo | null>();
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [savedCards, setSavedCards] = useState<any>();
  const [selectedCardId, setSelectedCardId] = useState<any>();
  const serverType = useAppSelector(
    state => state?.serverReducer?.baseUrl?.serverType,
  );
  useEffect(() => {
    if (savedCards?.length > 0) {
      setSelectedCardId(savedCards[0]);
    }
  }, [savedCards]);
  const {t} = useTranslation();
  const onCreatePaymentIntent = async () => {
    if (!bookingDetails?.uid || !selectedCardId) {
      throw new Error('Missing Data');
    }
    if (bookingDetails?.uid && selectedCardId)
      try {
        const response = await createPaymentIntent({
          proUserId: bookingDetails?.uid,
          paymentMethodId: selectedCardId?.id,
          menuId: bookingDetails?.menuId,
          clientUserId: uid,
          productId: bookingDetails?.item?.id,
          serverType,
          date: bookingDetails?.date?.[0]?.dateString,
          time: bookingDetails?.time,
          // proUserInfo: {
          //   name: bookingDetails?.name,
          //   uid: bookingDetails?.uid,
          // },
          // service: {
          //   name: bookingDetails?.item?.serviceName,
          //   price: bookingDetails?.item?.servicePrice,
          //   currency: bookingDetails?.default_currency,
          // },
          // clientUserInfo: {
          //   name: userInfo?.name,
          //   email: userInfo?.email,
          //   uid: userInfo?.uid,
          // },
        });
        // setSecretKey(prevSecretKey => {
        //   return clientSecret;
        // });
        return response;
      } catch (error) {
        setLoading(false);
      }
  };
  // useEffect(() => {
  //   if (selectedCardId) !!savedCards?.length && createSecretKey();
  // }, [selectedCardId]);
  // Getting current location of user
  const getCurrentLocation = async () => {
    try {
      const result = await requestLocationPermission(t);

      if (result) {
        setLocationLoading(true);
        Geolocation.getCurrentPosition(
          async position => {
            if (mapRef?.current) {
              mapRef.current.animateToRegion({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });

              const addressData = await getCompleteAddressByLatLong(
                position.coords.latitude,
                position.coords.longitude,
              );

              setCurrentLocation(addressData);
              formik?.setFieldValue('orderAddress', addressData);

              setLocationLoading(false);
            }
          },
          error => {
            console.error(error.message);
            setLocationLoading(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Set new location of user
  const changeLocation = async () => {
    try {
      const result = await requestLocationPermission(t);

      if (result && userLocationData) {
        if (mapRef?.current) {
          mapRef.current.animateToRegion({
            latitude: userLocationData.latitude,
            longitude: userLocationData.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // startTimer();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    changeLocation();

    // Register the event listener
    const listener = EventRegister.addEventListener(
      'getUserLocationEvent',
      data => {
        if (data) {
          setUserLocationData(data);
          formik?.setFieldValue('orderAddress', data);
        }
      },
    );

    // Ensure the listener is a string
    if (typeof listener === 'string') {
      // Cleanup the event listener when the component unmounts
      return () => {
        EventRegister.removeEventListener(listener);
      };
    }
  }, [userLocationData]);

  const navigation = useStackNavigation();
  const {uid} = useAppSelector(state => state?.userReducer?.userDetails);

  const {message, title, type} = bookingRequestToPro;
  let today = moment(data?.date?.[0]?.timestamp ?? new Date()).format(
    'dddd MMMM D',
  );
  const [bookingDate, setBookingDate] = useState<Date | string>(
    `${today} at ${data?.time?.[0]}`,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const validationBooking = yup.object().shape({
    note: yup?.string()?.notRequired().max(100, 'exceed 100 words limits'),
    orderAddress: yup?.object()?.required(t('customWords:addressRequired')),
  });
  const savedCardHandler = async () => {
    try {
      const data = await getSavedCards(uid, serverType);
      setSavedCards(data);
    } catch (error) {
      console.error('checking cards list', error);
    }
  };
  useEffect(() => {
    savedCardHandler();
  }, [savedCards?.length]);
  const brandIcons: any = {
    visa: 'cc-visa',
    mastercard: 'cc-mastercard',
    amex: 'cc-amex',
    discover: 'cc-discover',
    jcb: 'cc-jcb',
    diners: 'cc-diners-club',
    unionpay: 'cc-unionpay',
  };

  // useEffect(() => {
  //   const backAction = () => {
  //     removePendingBookingTimes({
  //       date: data?.date!,
  //       time: data?.time!,
  //       proUid: data?.uid!,
  //     });

  //     // if (imageData.length) {
  //     //   //  setImageData([]);
  //     //   return true;
  //     // } else {
  //     //   return false;
  //     // }
  //   };
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);
  // remove the booked time on back press
  const removePendingBookingTimes = async ({
    date,
    time,
    proUid,
  }: {
    date: any;
    time: string | string[];
    proUid: string;
  }) => {
    // let {uid, date, time} = data!;
    try {
      await databaseRef(`bookingTimes/${proUid}`)
        ?.orderByChild(`date`)
        ?.equalTo(
          date?.[0]?.dateString ?? bookingDetails?.date?.[0]?.dateString,
        )
        ?.once('value', async snapshot => {
          let bookedData = snapshot.val()
            ? Object.entries(snapshot.val()).map(([key, value]) => ({
                key,
                ...value,
              }))
            : null;
          let bookedTimesList:
            | any
            | {
                key: string;
                createdAt: number;
                date: string;
                status: keyof typeof bookedTimesStatus;
                time: string;
              }[] = bookedData?.filter(
            item => item?.time == time?.[0] || item?.time == time,
          );

          if (bookedTimesList) {
            await databaseRef(
              `bookingTimes/${proUid}/${bookedTimesList?.[0]?.key}`,
            ).remove();
          }
        });
      navigation.goBack();
    } catch (error) {
      console.error({error});
    }
  };

  const formik = useFormik<{note: string; orderAddress: AddressInfo | null}>({
    initialValues: {
      note: '',
      orderAddress: currentLocation ?? null,
    },
    validationSchema: validationBooking,
    onSubmit: async values => {
      setLoading(true);
      let bookingKey: string;
      if (savedCards?.length < 0) {
        showModal({message: 'Please add payment method to proceed'});
      }
      try {
        if (userLocationData ? userLocationData : currentLocation) {
          try {
            const {clientSecret, paymentIntent} = await onCreatePaymentIntent();

            const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;

            let ref = databaseRef(`pendingBooking/${paymentIntent?.id}`);

            let tempRef = ref;
            bookingKey = paymentIntent?.id;
            let bookingData = {
              createdAt: firebaseTimestamp,
              id: bookingKey,
              note: values?.note ?? null,
              orderAddress: userLocationData ?? currentLocation,
              orderDetails: bookingDetails?.item,
              proUserUId: bookingDetails?.uid,
              clientUserUId: uid,
              status: 'payment-pending',
              dateOfOrder: bookingDetails?.date?.[0]?.timestamp,
              orderDate: {
                date: bookingDetails?.date?.[0]?.timestamp ?? bookingDate,
                time: bookingDetails?.time?.[0],
              },
              clientUserUId_status: `${uid}_requested`,
              proUserUId_status: `${bookingDetails?.uid}_requested`,
              paymentStatus: 'pending',
              paymentStatus_bookingStatus: 'pending_requested',
              paymentIntentId: paymentIntent?.id,
              default_currency: bookingDetails?.default_currency,
            };
            await tempRef?.set(bookingData);

            const {error} = await confirmPayment(clientSecret, {
              paymentMethodType: 'Card',
              paymentMethodData: {
                paymentMethodId: selectedCardId?.id,
                billingDetails: {
                  name: userInfo?.name,
                  email: userInfo?.email,
                  address: {
                    city: values?.orderAddress?.city!,
                    country: values?.orderAddress?.country!,
                    postalCode: values?.orderAddress?.zip!,
                    state: values?.orderAddress?.state!,
                    line1: values?.orderAddress?.formattedAddress!,
                  },
                },
              },
            });

            if (error) {
              console.error('Payment confirmation failed:', error);
              showModal({
                message: error?.message,
                type: 'error',
              });
              // Handle payment confirmation failure
            } else {
              showModal({
                message: t('customWords:updatedSuccessfully'),
                type: 'success',
              });
              let detailsMessage = userInfo?.displayName + ' ' + message;

              sendNotifications({
                type,
                userIds: [bookingDetails?.uid],
                message: detailsMessage,
                title,
                data: {
                  status: bookingRequestToPro?.data?.status,
                  bookingKey,
                },
              });

              navigation?.popToTop();

              // Payment succeeded, proceed with next steps (e.g., navigate to success screen)
            }
          } catch (error: any) {
            bookingDetails == undefined && goBack();
            bookingDetails == undefined &&
              showModal({
                type: 'error',
                message:
                  'Something went wrong while connecting to the server. ! Please try again',
              });
            // Handle error as needed
          }
          // } else {
          //   showModal({
          //     message: 'Payment intent not created! Please try again later',
          //     type: 'error',
          //   });
          // }

          // if (bookingKey) {
          //   await sendNotifications(bookingDetails?.fcmTokens, message, title);
          //   if (secretKey) {
          //     try {
          //       const {error} = await confirmPayment(secretKey, {
          //         paymentMethodType: 'Card',
          //         paymentMethodData: {
          //           paymentMethodId: selectedCardId?.id,
          //         },
          //       });
          //       if (error) {
          //         console.error('Payment confirmation failed:', error);
          //         // Handle payment confirmation failure
          //       } else {
          //         // Payment succeeded, proceed with next steps (e.g., navigate to success screen)
          //       }
          //     } catch (error) {
          //       console.error('Error confirming payment:', error);
          //       // Handle error as needed
          //     }
          //   }
          // showModal({
          //   message: t('customWords:updatedSuccessfully'),
          //   type: 'success',
          // });
          // }
          // navigation?.popToTop();
        } else {
          if (formik?.errors?.orderAddress) {
            showModal({message: 'Please select a location', type: 'info'});
          }
        }
      } catch (error) {
        console.error('Booking', {error});
      } finally {
        // setBookingDetails(null);
        setLoading(false);

        // let bookingHistoryIds: Array<string>;
        // let proBookingHistoryIds: Array<string>;

        // await databaseRef(`users/${uid}/bookingHistory`)
        //   .once('value', snapshot => {
        //     bookingHistoryIds = snapshot.val();
        //     bookingHistoryIds = bookingHistoryIds
        //       ? [...bookingHistoryIds, bookingKey]
        //       : [bookingKey];
        //   })
        //   .then(() => {
        //     databaseRef(`users/${uid}/bookingHistory`).set(bookingHistoryIds);
        //   });

        // await databaseRef(`users/${data?.uid}/bookingHistory`)
        //   .once('value', snapshot => {
        //     proBookingHistoryIds = snapshot.val();
        //     proBookingHistoryIds = proBookingHistoryIds
        //       ? [...proBookingHistoryIds, bookingKey]
        //       : [bookingKey];
        //   })
        //   .then(() => {
        //     databaseRef(`users/${data?.uid}/requests`).set(
        //       proBookingHistoryIds,
        //     );
        //   });
      }
    },
  });

  // // Timer To free the booking time slot for

  // const [counter, setCounter] = useState(); // Initialize counter state
  // const [timerRunning, setTimerRunning] = useState(false); // To track if the timer is running
  // let timeoutRef: any = null; // To store the timeout reference

  // const startTimer = () => {
  //   setTimerRunning(true); // Set the timer as running
  //   timeoutRef = setTimeout(() => {
  //     setCounter(prevCounter => prevCounter - 1); // Increment the counter
  //   }, 1000); // Set the timeout for 1 second (1000 ms)
  // };
  // console.log({timeoutRef, counter});

  // const stopTimer = () => {
  //   if (timeoutRef) {
  //     clearTimeout(timeoutRef); // Clear the timeout if it's running
  //   }
  //   setTimerRunning(false); // Set the timer as stopped
  // };

  // useEffect(() => {
  //   if (timerRunning) {
  //     startTimer(); // Start the timer if it's running
  //   }
  //   return () => {
  //     stopTimer(); // Clear the timeout on component unmount
  //   };
  // }, [counter, timerRunning]); // Depend on the counter and timerRunning state

  return {
    t,
    navigation,
    formik,
    bookingDate,
    loading,
    userLocationData,
    currentLocation,
    locationLoading,
    bookingDetails,
    bookingTime,
    proUserRating: data?.rating,
    getCurrentLocation,
    cards: {savedCards, brandIcons, setSavedCards},
    cardId: {selectedCardId, setSelectedCardId},
    removePendingBookingTimes,
    showTimer,
    setShowTimer,
    disableBooking,
    setDisableBooking,
    // counter,
    selectedCurrency,
    setSelectedCurrency,
    currencyList,
    setCurrencyList,
    startModalOpen,
    setStartModalOpen,
  };
};

export default useBookingCheckout;
