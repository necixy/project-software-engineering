import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {useEffect, useRef, useState} from 'react';
import {EventRegister} from 'react-native-event-listeners';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import {filterChildKeys, statusType} from '../component/RequestsJSON';

const PAGE_SIZE = 300;
const useMissionHistory = (
  orderByChild: keyof typeof filterChildKeys,
  bookingId?: string,
) => {
  const bookingKeys = useRef<Object>({});
  const {uid} = useAppSelector(state => state?.userReducer?.userDetails);
  let statusValue = [
    `${uid}_${statusType?.canceled}`,
    `${uid}_${statusType?.completed}`,
  ];
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

    // Register the event listener
    const listener = EventRegister.addEventListener('updateStatus', data => {
      fetchInitialData();
    });

    // Ensure the listener is a string
    if (typeof listener === 'string') {
      // Cleanup the event listener when the component unmounts
      return () => {
        EventRegister.removeEventListener(listener);
      };
    }
  }, [
    orderByChild,
    bookingId,
    // uid,
    // statusValue
  ]);

  const fetchInitialData = async () => {
    setProgressState(prevState => ({...prevState, isLoading: true}));
    const ref = databaseRef('booking')
      .orderByChild(orderByChild)
      .equalTo(uid)
      .limitToLast(PAGE_SIZE);

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

    // customized data
    let bookingList: TBookingHistory[] = [];
    let bookingsPromises: Promise<void | FirebaseDatabaseTypes.DataSnapshot>[] =
      [];
    const filteredData = dataArray?.filter((item: TBookingDetails) =>
      statusValue?.includes(item?.proUserUId_status!),
    );
    // const filteredData = dataArray?.filter((item: TBookingDetails) =>
    //   orderByChild == filterChildKeys.clientUserUId_status
    //     ? item?.clientUserUId_status == `${uid}_${statusType.completed}` ||
    //       item?.clientUserUId_status == `${uid}_${statusType.canceled}`
    //     : item?.proUserUId_status == `${uid}_${statusType.completed}` ||
    //       item?.proUserUId_status == `${uid}_${statusType.canceled}`,
    // );
    filteredData?.forEach((item: TBookingDetails) => {
      let otherUserDetails: TUserDetails;
      let userPromise = databaseRef(
        `users/${
          orderByChild == filterChildKeys.proUserUId
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

    let finalBookingList: TBookingHistory[] = [];
    let ratingsPromises: Promise<void | FirebaseDatabaseTypes.DataSnapshot>[] =
      [];

    bookingList?.forEach((item: TBookingHistory) => {
      // let tempDetailStructure: TBookingHistory;
      let ratingDetails: TBookingHistory;
      let ratingPromise = databaseRef(`reviews`)
        ?.orderByChild('orderId')
        ?.equalTo(`${item?.id}`)
        // ?.orderByChild('clientPro')
        // ?.equalTo(`${item?.clientUserUId}_${item?.proUserUId}`)
        ?.once('value', async snapshot => {
          if (snapshot.val()) {
            let rating: TRatingData[] = Object.values(snapshot.val());

            ratingDetails = {
              rating: {
                grade: rating?.[0]?.rating!,
                description: rating?.[0]?.review!,
              },
              orderId: item?.id,
              ...item,
            };
          } else {
            ratingDetails = {
              orderId: item?.id,
              ...item,
            };
          }
          finalBookingList?.push(ratingDetails);
        });
      ratingsPromises?.push(ratingPromise);
    });
    await Promise.all(ratingsPromises);

    const sortedBookings = finalBookingList.sort(
      (a: TBookingHistory, b: TBookingHistory) => b?.createdAt - a?.createdAt,
    );

    setBookings(sortedBookings);

    if (dataArray.length > 0) {
      setLastItemKey(dataArray[dataArray.length - 1].key);
      if (filteredData?.length < PAGE_SIZE) {
        fetchMoreData(dataArray[dataArray.length - 1].key);
      }
    }

    setProgressState(prevState => ({
      ...prevState,
      isLoading: false,
      hasMoreData: dataArray.length === PAGE_SIZE,
    }));
  };

  const fetchMoreData = async (lastKey?: string) => {
    if (progressState.isFetching || (!progressState.hasMoreData && !lastKey))
      return;

    setProgressState(prevState => ({...prevState, isFetching: true}));

    const ref = databaseRef('booking')
      .orderByChild(orderByChild)
      .startAt(uid)
      .endAt(uid, lastKey ?? lastItemKey)
      .limitToLast(PAGE_SIZE + 1);

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

    // customized data
    let bookingList: TBookingHistory[] = [];
    let bookingsPromises: Promise<void | FirebaseDatabaseTypes.DataSnapshot>[] =
      [];

    const filteredData = dataArray?.filter((item: TBookingDetails) =>
      statusValue?.includes(item?.proUserUId_status!),
    );
    // const filteredData = dataArray?.filter((item: TBookingDetails) =>
    //   orderByChild == filterChildKeys.clientUserUId_status
    //     ? item?.clientUserUId_status == `${uid}_${statusType.completed}` ||
    //       item?.clientUserUId_status == `${uid}_${statusType.canceled}`
    //     : item?.proUserUId_status == `${uid}_${statusType.completed}` ||
    //       item?.proUserUId_status == `${uid}_${statusType.canceled}`,
    // );
    filteredData?.forEach((item: TBookingDetails) => {
      let otherUserDetails: TUserDetails;
      let userPromise = databaseRef(
        `users/${
          orderByChild == filterChildKeys.proUserUId
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

    let finalBookingList: TBookingHistory[] = [];
    let ratingsPromises: Promise<void | FirebaseDatabaseTypes.DataSnapshot>[] =
      [];

    bookingList?.forEach((item: TBookingHistory) => {
      // let tempDetailStructure: TBookingHistory;
      let ratingDetails: TBookingHistory;
      let ratingPromise = databaseRef(`reviews`)
        ?.orderByChild('orderId')
        ?.equalTo(`${item?.orderId ?? item?.id}`)
        // ?.equalTo(`${item?.clientUserUId}_${item?.proUserUId}`)
        ?.once('value', async snapshot => {
          if (snapshot.val()) {
            let rating: TRatingData[] = Object.values(snapshot.val());
            ratingDetails = {
              rating: {
                grade: rating?.[0]?.rating!,
                description: rating?.[0]?.review!,
              },
              orderId: item?.id,
              ...item,
            };
          } else {
            ratingDetails = {
              orderId: item?.id,
              ...item,
            };
          }
          finalBookingList?.push(ratingDetails);
        });
      ratingsPromises?.push(ratingPromise);
    });
    await Promise.all(ratingsPromises);

    const sortedBookings = finalBookingList.sort(
      (a: TBookingHistory, b: TBookingHistory) => b?.createdAt - a?.createdAt,
    );

    setBookings(prevItems => [...prevItems, ...sortedBookings]);

    if (allFetchedData.length > dataArray.length && newLastKey !== lastKey) {
      // setBookings(prevItems => [...prevItems, ...dataArray]);
      fetchMoreData(newLastKey);
    } else if (dataArray.length > 0) {
      setLastItemKey(dataArray[dataArray.length - 1].key);
      if (filteredData?.length < PAGE_SIZE) {
        fetchMoreData(dataArray[dataArray.length - 1].key);
      }
    }

    setProgressState(prevState => ({
      ...prevState,
      isFetching: false,
      hasMoreData: dataArray.length === PAGE_SIZE,
    }));
  };

  const refreshData = async () => {
    setLastItemKey(null);
    setProgressState(prevState => ({
      ...prevState,
      isRefetching: true,
      // lastItemKey: null,
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
export default useMissionHistory;
