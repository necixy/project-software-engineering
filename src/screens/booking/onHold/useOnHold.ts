import {useFocusEffect} from '@react-navigation/native';
import {isDate} from 'moment';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import {filterChildKeys, statusType} from '../component/RequestsJSON';
import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {EventRegister} from 'react-native-event-listeners';
import {Alert} from 'react-native';

const LIMIT_PAGE = 3;

// const useOnHold = () => {
//   const [bookings, setBookings] = useState<TBookingDetails[] | null>([]);
//   const [bookingKeys, setBookingKeys] = useState<string[]>();
//   const [fetching, setFetching] = useState<boolean>(false);
//   // const [lastKey, setLastKey] = useState<string | null>(null);
//   // const [endReached, setEndReached] = useState(false);
//   const [noMoreData, setNoMoreData] = useState(false);
//   const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
//   const {uid} = useAppSelector(state => state?.userReducer?.userDetails);

//   //pagination related useStates
//   const [initialFetching, setInitialFetching] = useState<boolean>(false);
//   const [fetchingMoreData, setFetchingMoreData] = useState<boolean>(false);

//   const [lastKey, setLastKey] = useState<string | null>(null);
//   const [endReached, setEndReached] = useState(false);
//   const [initialKeys, setInitialKeys] = useState<string[]>([]);

//   // // working code: DO NOT DELETE
//   // const getOnHoldBookings = async () => {
//   //   setFetching(true);
//   //   try {
//   //     let res = await databaseRef(`booking`)
//   //       .orderByChild('clientUserUId_status')
//   //       .equalTo(`${uid}_requested`)
//   //       .limitToFirst(LIMIT_PAGE)
//   //       .once('value')
//   //       .then(function (snapshot) {
//   //         let snap = snapshot.val();
//   //         if (snap !== null) {
//   //           const onHoldBooking: TBookingDetails[] = Object.values(snap);
//   //           let id = Object.keys(snap);
//   //           // if (bookingIds?.includes(id[0])) {
//   //           // }
//   //           // if (onHoldBooking.length < LIMIT_PER_PAGE) {
//   //           //   setEndReached(true);
//   //           // }
//   //           if (onHoldBooking?.length > 0) {
//   //             const sorted = onHoldBooking.sort((a, b) => {
//   //               const dateA = new Date(
//   //                 `${a?.orderDate?.date} ${a?.orderDate?.time}`,
//   //               ).valueOf();
//   //               const dateB = new Date(
//   //                 `${b?.orderDate?.date} ${b?.orderDate?.time}`,
//   //               ).valueOf();

//   //               if (dateA > dateB) {
//   //                 return 1; // return -1 here for DESC order
//   //               }
//   //               return -1; // return 1 here for DESC Order
//   //             });

//   //             // const findItem = onHoldBooking?.filter(
//   //             //   item => item?.id == '-Nzaqy61eaLRmV5m2eYM',
//   //             // );
//   //             // if (findItem) {
//   //             // }
//   //             // setBookings(onHoldBooking);

//   //             let finalBookingData: TBookingHistory[] = [];
//   //             onHoldBooking?.forEach(async order => {
//   //               let bookingDetails: TBookingHistory;
//   //               let clientUser: TUserDetails;
//   //               // get other user data
//   //               await databaseRef(`users/${order?.clientUserUId}`)
//   //                 ?.once('value', snapshot => {
//   //                   if (snapshot?.val()) {
//   //                     clientUser = snapshot.val();
//   //                     bookingDetails = {
//   //                       otherUserName: clientUser?.displayName!,
//   //                       otherUserProfileImg: clientUser?.photoURL!,
//   //                       otherUserUId: order?.clientUserUId!,
//   //                       orderDetails: order?.orderDetails,
//   //                       createdAt: order?.createdAt,
//   //                       id: order?.id,
//   //                       note: order?.note,
//   //                       orderAddress: order?.orderAddress,
//   //                       orderDate: order?.orderDate,
//   //                       status: order?.status,
//   //                       ...order,
//   //                     };
//   //                   }
//   //                   finalBookingData.push(bookingDetails!);
//   //                 })
//   //                 .catch(err => {
//   //                   console.error(err);
//   //                 });

//   //               // ARRANGE BASED ON ORDER DATE
//   //               finalBookingData = finalBookingData?.sort((a, b) => {
//   //                 const dateA = new Date(a?.orderDate?.date!).valueOf();
//   //                 // ?.date`${a?.orderDate?.date} ${a?.orderDate?.time}`,
//   //                 const dateB = new Date(b?.orderDate?.date!).valueOf();
//   //                 // `${b?.orderDate?.date} ${b?.orderDate?.time}`,

//   //                 if (dateA > dateB) {
//   //                   return 1; // return -1 here for DESC order
//   //                 }
//   //                 if (
//   //                   dateA == dateB &&
//   //                   a?.orderDate?.time! > b?.orderDate?.time!
//   //                 ) {
//   //                   return 1;
//   //                 }
//   //                 return -1; // return 1 here for DESC Order
//   //               });

//   //               setBookings(finalBookingData);
//   //               // await databaseRef(`reviews`)
//   //               //   ?.orderByChild(`clientPro`)
//   //               //   ?.equalTo(
//   //               //     `${reqBooking?.clientUserUId}_${reqBooking?.proUserUId}`,
//   //               //   )
//   //               //   ?.once('value', snapshot => {
//   //               //     let ratingReviewData = snapshot?.forEach(
//   //               //       (childSnapshot: TRatingData) => {
//   //               //         if (childSnapshot?.id) {
//   //               //           return childSnapshot;
//   //               //         }
//   //               //       },
//   //               //     );
//   //               //   });
//   //             });
//   //           }
//   //         } else {
//   //           if (bookings?.length == 0) {
//   //             setBookings(snap);
//   //           }
//   //           setEndReached(true);
//   //         }
//   //       });
//   //   } catch (error) {
//   //     console.error({ error });
//   //   } finally {
//   //     setFetching(false);
//   //   }
//   // };

//   useEffect(() => {
//     if (bookings?.length! <= 0) {
//       fetchInitialData();
//     }

//     // Register the event listener
//     const listener = EventRegister.addEventListener('updateStatus', data => {
//       __DEV__ && Alert.alert(`data ${data?.newStatus} and id ${data?.id}`);
//       fetchInitialData();
//     });

//     // Ensure the listener is a string
//     if (typeof listener === 'string') {
//       // Cleanup the event listener when the component unmounts
//       return () => {
//         EventRegister.removeEventListener(listener);
//       };
//     }
//   }, []);

//   const loadMoreData = () => {
//     fetchMoreData();
//   };

//   const fetchInitialData = async () => {
//     if (initialFetching || endReached) return;
//     setInitialFetching(true);
//     const snapshot = await databaseRef('booking')
//       .orderByChild('clientUserUId_status')
//       .startAt(`${uid}_${statusType?.requested}`)
//       .endAt(`${uid}_${statusType?.requested}`)
//       .limitToLast(LIMIT_PAGE)
//       .once('value');

//     let requestedBookings: TBookingHistory[] = [];

//     const data = snapshot.val() || {};
//     const dataArray = Object.entries(data).map(([key, value]) => ({
//       // key,
//       ...value,
//     }));
//     // only to console the keys
//     const keys = Object.keys(data);
//     setInitialKeys(keys);
//     const postPromises: Promise<void | FirebaseDatabaseTypes.DataSnapshot>[] =
//       [];

//     dataArray?.forEach(item => {
//       let proUserDetails: TUserDetails;
//       let userPromise = databaseRef(`users/${item?.proUserUId}`)?.once(
//         'value',
//         async snapshot => {
//           proUserDetails = snapshot.val();
//           const bookingDetails: TBookingHistory = {
//             otherUserName: proUserDetails?.displayName!,
//             otherUserProfileImg: proUserDetails?.photoURL!,
//             otherUserUId: proUserDetails?.uid!,
//             ...item,
//           };
//           requestedBookings?.push(bookingDetails);
//         },
//       );
//       postPromises.push(userPromise);
//     });
//     await Promise.all(postPromises);

//     // // ARRANGE BASED ON ORDER DATE
//     // requestedBookings = requestedBookings?.sort((a, b) => {
//     //   const dateA = new Date(a?.orderDate?.date!).valueOf();
//     //   // ?.date`${a?.orderDate?.date} ${a?.orderDate?.time}`,
//     //   const dateB = new Date(b?.orderDate?.date!).valueOf();
//     //   // `${b?.orderDate?.date} ${b?.orderDate?.time}`,

//     //   if (dateA > dateB) {
//     //     return 1; // return -1 here for DESC order
//     //   } else if (dateA == dateB && a?.orderDate?.time! > b?.orderDate?.time!) {
//     //     return 1;
//     //   }
//     //   return -1; // return 1 here for DESC Order
//     // });

//     setBookings(requestedBookings?.reverse());
//     if (dataArray?.length > 0) {
//       setLastKey(dataArray[0].id);
//     }
//     setInitialFetching(false);
//     if (dataArray?.length < LIMIT_PAGE) setEndReached(true);
//   };

//   const fetchMoreData = async () => {
//     if (fetchingMoreData || endReached) return;
//     if (lastKey) {
//       setFetchingMoreData(true);
//       const snapshot = await databaseRef('booking')
//         .orderByChild('clientUserUId_status')
//         .startAt(`${uid}_${statusType?.requested}`)
//         .endAt(`${uid}_${statusType?.requested}`, lastKey)
//         .limitToLast(LIMIT_PAGE + 1)
//         .once('value');
//       let requestedBookings: TBookingHistory[] = [];

//       const data = snapshot.val();
//       const dataArray = Object.entries(data).map(([key, value]) => ({
//         // key,
//         ...value,
//       }));

//       const newKeys = Object.keys(data);

//       setInitialKeys((prev: string[]) =>
//         Array.from(new Set([...prev, ...newKeys])),
//       );

//       let newDataArray = dataArray.filter(
//         item => item?.id !== lastKey && !initialKeys?.includes(item?.id),
//       ); // Exclude the duplicate last item

//       // only to console data
//       const keysToMerge = newDataArray.map(item => {
//         return item?.id;
//       });

//       const postPromises: Promise<void | FirebaseDatabaseTypes.DataSnapshot>[] =
//         [];
//       newDataArray?.forEach(item => {
//         let proUserDetails: TUserDetails;
//         const userPromise = databaseRef(`users/${item?.proUserUId}`)?.once(
//           'value',
//           async snapshot => {
//             proUserDetails = snapshot.val();
//             const bookingDetails: TBookingHistory = {
//               otherUserName: proUserDetails?.displayName!,
//               otherUserProfileImg: proUserDetails?.photoURL!,
//               otherUserUId: proUserDetails?.uid!,
//               ...item,
//             };
//             requestedBookings?.push(bookingDetails);
//           },
//         );
//         postPromises.push(userPromise);
//       });

//       await Promise.all(postPromises);
//       // let finalBookingsList = [...bookings!, ...requestedBookings];
//       // // ARRANGE BASED ON ORDER DATE
//       // finalBookingsList = finalBookingsList?.sort((a, b) => {
//       //   const dateA = new Date(a?.orderDate?.date!).valueOf();
//       //   // ?.date`${a?.orderDate?.date} ${a?.orderDate?.time}`,
//       //   const dateB = new Date(b?.orderDate?.date!).valueOf();
//       //   // `${b?.orderDate?.date} ${b?.orderDate?.time}`,

//       //   if (dateA > dateB) {
//       //     return 1; // return -1 here for DESC order
//       //   }
//       //   if (dateA == dateB && a?.orderDate?.time! > b?.orderDate?.time!) {
//       //     return 1;
//       //   }
//       //   return -1; // return 1 here for DESC Order
//       // });
//       // setBookings(finalBookingsList?.reverse());
//       setBookings(prevItems => [
//         ...prevItems!,
//         ...requestedBookings?.reverse(),
//       ]);

//       if (newDataArray.length > 0) {
//         setLastKey(newDataArray[0].id);
//       } else {
//         setEndReached(true);
//       }
//       setFetchingMoreData(false);
//       if (dataArray.length < LIMIT_PAGE) setEndReached(true);
//     }
//   };

//   return {
//     bookings,
//     fetching,
//     // getOnHoldBookings,
//     // loadMore,
//     fetchInitialData,
//     fetchMoreData,
//     isFetchingNextPage,
//     // refreshBookings,
//     loadMoreData,
//     initialFetching,
//     fetchingMoreData,
//   };
// };

const useOnHold = (status: keyof typeof statusType, orderByChild: string) => {
  const bookingKeys = useRef<Object>({});
  const {uid} = useAppSelector(state => state?.userReducer?.userDetails);
  const statusValue = `${uid}_${status}`;
  const [bookings, setBookings] = useState<any[]>([]);
  const [lastItemKey, setLastItemKey] = useState();
  const [progressState, setProgressState] = useState({
    isLoading: true,
    isFetching: false,
    hasMoreData: false,
    isRefetching: false,
  });

  useEffect(() => {
    fetchInitialData();
  }, [statusValue, status]);

  const fetchInitialData = async () => {
    setProgressState(prevState => ({...prevState, isLoading: true}));
    const ref = databaseRef('booking')
      .orderByChild(orderByChild)
      .equalTo(statusValue)
      .limitToLast(LIMIT_PAGE);

    const snapshot = await ref.once('value');
    const data = snapshot.val() || {};
    const dataArray = Object.entries(data).map(([key, value]) => {
      bookingKeys.current = {
        ...bookingKeys.current,
        [key]: true,
      };
      return {
        key,
        ...value,
      };
    });
    dataArray.reverse();
    let bookingList: TBookingHistory[] = [];
    let bookingsPromises: Promise<void | FirebaseDatabaseTypes.DataSnapshot>[] =
      [];
    dataArray?.forEach((item: TBookingDetails) => {
      let otherUserDetails: TUserDetails;
      let userPromise = databaseRef(
        `users/${
          orderByChild == filterChildKeys.proUserUId_status
            ? item?.clientUserUId
            : item?.proUserUId
        }`,
      )?.once('value', snapshot => {
        otherUserDetails = snapshot.val();
        const bookingDetails: TBookingHistory = {
          otherUserName: otherUserDetails?.displayName!,
          otherUserProfileImg: otherUserDetails?.photoURL!,
          otherUserUId: otherUserDetails?.uid!,
          ...item,
        };

        bookingList?.push(bookingDetails);
      });
      bookingsPromises?.push(userPromise);
    });
    await Promise.all(bookingsPromises);

    setBookings(bookingList);
    if (dataArray.length > 0) {
      setLastItemKey(dataArray[dataArray.length - 1].key);
    }
    setProgressState(prevState => ({
      ...prevState,
      isLoading: false,
      hasMoreData: dataArray.length === LIMIT_PAGE,
    }));
  };

  const fetchMoreData = async (lastKey?: string) => {
    if (progressState.isFetching || (!progressState.hasMoreData && !lastKey))
      return;

    setProgressState(prevState => ({...prevState, isFetching: true}));

    const ref = databaseRef('booking')
      .orderByChild(orderByChild)
      .startAt(`${uid}_${status}`)
      .endAt(statusValue, lastKey ?? lastItemKey)
      .limitToLast(LIMIT_PAGE + 1);

    const snapshot = await ref.once('value');
    const data = snapshot.val() || {};
    const allFetchedData = Object.entries(data);
    let dataArray = allFetchedData.reduce((acc, [key, value]) => {
      if (bookingKeys?.current?.[key]) {
        return acc;
      }
      bookingKeys.current = {
        ...bookingKeys.current,
        [key]: true,
      };

      acc.push({key, ...value});
      return acc;
    }, []);

    dataArray.reverse();

    // Remove the last item if it is duplicated
    // dataArray = dataArray.filter(item => item.key !== lastItemKey);

    const newLastKey = Object.keys(data)?.[0];

    let bookingList: TBookingHistory[] = [];
    let bookingsPromises: Promise<void | FirebaseDatabaseTypes.DataSnapshot>[] =
      [];
    dataArray?.forEach((item: TBookingDetails) => {
      let otherUserDetails: TUserDetails;
      let userPromise = databaseRef(
        `users/${
          orderByChild == filterChildKeys.proUserUId_status
            ? item?.clientUserUId
            : item?.proUserUId
        }`,
      )?.once('value', snapshot => {
        otherUserDetails = snapshot.val();
        const bookingDetails: TBookingHistory = {
          otherUserName: otherUserDetails?.displayName!,
          otherUserProfileImg: otherUserDetails?.photoURL!,
          otherUserUId: otherUserDetails?.uid!,
          ...item,
        };

        bookingList?.push(bookingDetails);
      });
      bookingsPromises?.push(userPromise);
    });
    await Promise.all(bookingsPromises);
    setBookings(prevItems => [...prevItems, ...dataArray]);
    if (allFetchedData.length > dataArray.length && newLastKey !== lastKey) {
      fetchMoreData(newLastKey);
    } else if (dataArray.length > 0) {
      // setBookings(prevItems => [...prevItems, ...dataArray]);
      setLastItemKey(dataArray[dataArray.length - 1].key);
    }

    setProgressState(prevState => ({
      ...prevState,
      isFetching: false,
      hasMoreData: dataArray.length === LIMIT_PAGE,
    }));
  };

  const refreshData = async () => {
    setProgressState(prevState => ({
      ...prevState,
      isRefetching: true,
      lastItemKey: null,
      hasMoreData: false,
    }));
    await fetchInitialData();
    setProgressState(prevState => ({...prevState, isRefetching: false}));
  };

  return {
    bookings,
    progressState,
    refreshData,
    fetchMoreData,
  };
};

export default useOnHold;
