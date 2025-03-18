import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {EventRegister} from 'react-native-event-listeners';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import {statusType} from '../component/RequestsJSON';

const LIMIT_PAGE = 3;
const useMission = () => {
  const {navigate} = useNavigation();
  const {t} = useTranslation();
  const [fetchRefreshedBookings, setFetchRefreshedBookings] =
    useState<boolean>(false);

  const [bookings, setBookings] = useState<TBookingDetails[] | null>([]);
  const {uid} = useAppSelector(state => state?.userReducer?.userDetails);
  // PAGINATION RELATED USESTATES
  const [initialFetching, setInitialFetching] = useState<boolean>(false);
  const [fetchingMoreData, setFetchingMoreData] = useState<boolean>(false);

  const [lastKey, setLastKey] = useState<string | null>(null);
  const [endReached, setEndReached] = useState(false);
  const [initialKeys, setInitialKeys] = useState<string[]>([]);
  // const getBookingMissions = async () => {
  //   try {
  //     await databaseRef(`booking`)
  //       .orderByChild('proUserUId_status')
  //       .equalTo(`${uid}_accepted`)
  //       .once('value')
  //       .then(function (snapshot) {
  //         let snap = snapshot.val();
  //         if (snap !== null) {
  //           let bookingMissions: TBookingDetails[] = Object.values(snap);
  //           if (bookingMissions) {
  //             bookingMissions = bookingMissions?.reverse();
  //             setBookings(bookingMissions);
  //           }
  //         } else {
  //           setBookings([]);
  //         }
  //       });
  //   } catch (error) {
  //     console.error('Missions', {error});
  //   } finally {
  //     setFetching(false);
  //   }
  // };

  // Register the event listener
  // const listener = EventRegister.addEventListener('updateStatus', data => {
  //   if (data?.newStatus == statusType?.canceled) {
  //     let newBookings = bookings?.filter(item => item?.id !== data?.id);
  //     setBookings(newBookings!);
  //     setFetchRefreshedBookings(true);
  //   }
  // });
  useEffect(() => {
    // getBookingMissions();
    if (bookings?.length! <= 0) {
      fetchInitialData();
    }

    // Register the event listener
    const listener = EventRegister.addEventListener('updateStatus', data => {
      // __DEV__ &&  Alert.alert(`data ${data?.newStatus} and id ${data?.id}`);
      fetchInitialData();
    });

    // Ensure the listener is a string
    if (typeof listener === 'string') {
      // Cleanup the event listener when the component unmounts
      return () => {
        EventRegister.removeEventListener(listener);
      };
    }
  }, []);

  const loadMoreData = () => {
    fetchMoreData();
  };

  const getBookingMissions = async () => {
    // setFetching(true);
    try {
      await databaseRef(`booking`)
        .orderByChild('proUserUId_status')
        .equalTo(`${uid}_accepted`)
        .once('value')
        .then(function (snapshot) {
          let snap = snapshot.val();
          if (snap !== null) {
            let finalBookingData: TBookingHistory[] = [];
            let bookingMissions: TBookingDetails[] = Object.values(snap);
            if (bookingMissions) {
              bookingMissions = bookingMissions?.reverse();
              let bookingDetails: TBookingHistory;
              let clientDetails: TUserDetails;
              bookingMissions?.forEach(async (order: TBookingDetails) => {
                await databaseRef(`users/${order?.clientUserUId}`)
                  ?.once('value', snapshot => {
                    clientDetails = snapshot.val();
                    bookingDetails = {
                      otherUserName: clientDetails?.displayName!,
                      otherUserProfileImg: clientDetails?.photoURL!,
                      otherUserUId: order?.clientUserUId!,
                      orderDetails: order?.orderDetails,
                      createdAt: order?.createdAt,
                      id: order?.id,
                      note: order?.note,
                      orderAddress: order?.orderAddress,
                      orderDate: order?.orderDate,
                      status: order?.status,
                      ...order,
                    };

                    finalBookingData.push(bookingDetails!);
                  })
                  .catch(err => {
                    console.error({err});
                  });

                // ARRANGE BASED ON ORDER DATE
                finalBookingData = finalBookingData?.sort((a, b) => {
                  const dateA = new Date(a?.orderDate?.date!).valueOf();
                  // ?.date`${a?.orderDate?.date} ${a?.orderDate?.time}`,
                  const dateB = new Date(b?.orderDate?.date!).valueOf();
                  // `${b?.orderDate?.date} ${b?.orderDate?.time}`,

                  if (dateA > dateB) {
                    return 1; // return -1 here for DESC order
                  }
                  if (
                    dateA == dateB &&
                    a?.orderDate?.time! > b?.orderDate?.time!
                  ) {
                    return 1;
                  }
                  return -1; // return 1 here for DESC Order
                });

                setBookings(finalBookingData);
              });
            }
          } else {
            setBookings(null);
          }
        });
    } catch (error) {
      console.error('Missions', {error});
    } finally {
      // setFetching(false);
    }
  };

  // PAGINATION LOGICS
  const fetchInitialData = async () => {
    if (initialFetching || endReached) return;
    setInitialFetching(true);
    const snapshot = await databaseRef('booking')
      .orderByChild('proUserUId_status')
      .startAt(`${uid}_${statusType?.accepted}`)
      .endAt(`${uid}_${statusType?.accepted}`)
      .limitToLast(LIMIT_PAGE)
      .once('value');

    let requestedBookings: TBookingHistory[] = [];

    const data = snapshot.val() || {};
    const dataArray = Object.entries(data).map(([key, value]) => ({
      // key,
      ...value,
    }));

    // only to console the keys
    const keys = Object.keys(data);
    setInitialKeys(keys);
    const postPromises: Promise<void | FirebaseDatabaseTypes.DataSnapshot>[] =
      [];

    dataArray?.forEach(item => {
      let clientUserDetails: TUserDetails;
      let userPromise = databaseRef(`users/${item?.clientUserUId}`)?.once(
        'value',
        async snapshot => {
          clientUserDetails = snapshot.val();
          const bookingDetails: TBookingHistory = {
            otherUserName: clientUserDetails?.displayName!,
            otherUserProfileImg: clientUserDetails?.photoURL!,
            otherUserUId: clientUserDetails?.uid!,
            ...item,
          };
          requestedBookings?.push(bookingDetails);
        },
      );
      postPromises.push(userPromise);
    });
    await Promise.all(postPromises);

    // // ARRANGE BASED ON ORDER DATE
    // requestedBookings = requestedBookings?.sort((a, b) => {
    //   const dateA = new Date(a?.orderDate?.date!).valueOf();
    //   // ?.date`${a?.orderDate?.date} ${a?.orderDate?.time}`,
    //   const dateB = new Date(b?.orderDate?.date!).valueOf();
    //   // `${b?.orderDate?.date} ${b?.orderDate?.time}`,

    //   if (dateA > dateB) {
    //     return 1; // return -1 here for DESC order
    //   } else if (dateA == dateB && a?.orderDate?.time! > b?.orderDate?.time!) {
    //     return 1;
    //   }
    //   return -1; // return 1 here for DESC Order
    // });

    setBookings(requestedBookings?.reverse());
    if (dataArray.length > 0) {
      setLastKey(dataArray[0].id);
    }
    setInitialFetching(false);
    if (dataArray.length < LIMIT_PAGE) setEndReached(true);
  };

  const fetchMoreData = async () => {
    if (fetchingMoreData || endReached) return;
    if (lastKey) {
      setFetchingMoreData(true);
      const snapshot = await databaseRef('booking')
        .orderByChild('proUserUId_status')
        .startAt(`${uid}_${statusType?.accepted}`)
        .endAt(`${uid}_${statusType?.accepted}`, lastKey)
        .limitToLast(LIMIT_PAGE + 1)
        .once('value');
      let requestedBookings: TBookingHistory[] = [];

      const data = snapshot.val();
      const dataArray = Object.entries(data).map(([key, value]) => ({
        // key,
        ...value,
      }));

      const newKeys = Object.keys(data);

      setInitialKeys((prev: string[]) =>
        Array.from(new Set([...prev, ...newKeys])),
      );

      let newDataArray = dataArray.filter(
        item => item?.id !== lastKey && !initialKeys?.includes(item?.id),
      ); // Exclude the duplicate last item

      // only to console data
      const keysToMerge = newDataArray.map(item => {
        return item?.id;
      });

      const postPromises: Promise<void | FirebaseDatabaseTypes.DataSnapshot>[] =
        [];
      newDataArray?.forEach(item => {
        let clientUserDetails: TUserDetails;
        const userPromise = databaseRef(`users/${item?.clientUserUId}`)?.once(
          'value',
          async snapshot => {
            clientUserDetails = snapshot.val();
            const bookingDetails: TBookingHistory = {
              otherUserName: clientUserDetails?.displayName!,
              otherUserProfileImg: clientUserDetails?.photoURL!,
              otherUserUId: clientUserDetails?.uid!,
              ...item,
            };
            requestedBookings?.push(bookingDetails);
          },
        );
        postPromises.push(userPromise);
      });

      await Promise.all(postPromises);
      // let finalBookingsList = [...bookings!, ...requestedBookings];
      // // ARRANGE BASED ON ORDER DATE
      // finalBookingsList = finalBookingsList?.sort((a, b) => {
      //   const dateA = new Date(a?.orderDate?.date!).valueOf();
      //   // ?.date`${a?.orderDate?.date} ${a?.orderDate?.time}`,
      //   const dateB = new Date(b?.orderDate?.date!).valueOf();
      //   // `${b?.orderDate?.date} ${b?.orderDate?.time}`,

      //   if (dateA > dateB) {
      //     return 1; // return -1 here for DESC order
      //   }
      //   if (dateA == dateB && a?.orderDate?.time! > b?.orderDate?.time!) {
      //     return 1;
      //   }
      //   return -1; // return 1 here for DESC Order
      // });
      // setBookings(finalBookingsList?.reverse());
      setBookings(prevItems => [
        ...prevItems!,
        ...requestedBookings?.reverse(),
      ]);

      if (newDataArray.length > 0) {
        setLastKey(newDataArray[0].id);
      } else {
        setEndReached(true);
      }
      setFetchingMoreData(false);
      if (dataArray.length < LIMIT_PAGE) setEndReached(true);
    }
  };

  // if (typeof listener === 'string') {
  //   // Cleanup the event listener when the component unmounts
  //   return () => {
  //     EventRegister.removeEventListener(listener);
  //   };
  // }

  return {
    fetchInitialData,
    bookings,
    getBookingMissions,
    t,
    navigate,
    // fetching,
    fetchRefreshedBookings,
    loadMoreData,
    initialFetching,
    fetchingMoreData,
    fetchMoreData,
  };
};

export default useMission;
