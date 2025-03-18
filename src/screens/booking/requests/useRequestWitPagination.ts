import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {useEffect, useRef, useState} from 'react';
import {EventRegister} from 'react-native-event-listeners';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import {filterChildKeys, statusType} from '../component/RequestsJSON';
const PAGE_SIZE = 3;
function useRequestWitPagination(
  status: keyof typeof statusType,
  orderByChild: keyof typeof filterChildKeys,
  param?: string,
) {
  const bookingKeys = useRef<Object>({});
  const {uid} = useAppSelector(state => state?.userReducer?.userDetails);
  const statusValue = `${uid}_${status}`;
  const [bookings, setBookings] = useState<any[]>([]);
  const [lastItemKey, setLastItemKey] = useState(null);
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

    const newBookings = EventRegister.addEventListener(
      'fetchNewBookings',
      () => {
        fetchInitialData();
      },
    );

    // Ensure the listener is a string
    if (typeof listener === 'string') {
      // Cleanup the event listener when the component unmounts
      return () => {
        EventRegister.removeEventListener(listener);
      };
    }

    if (typeof newBookings == 'string') {
      return () => {
        EventRegister.removeEventListener(newBookings);
      };
    }
  }, [statusValue, status, param]);

  const fetchInitialData = async () => {
    setProgressState(prevState => ({...prevState, isLoading: true}));
    const ref = databaseRef('booking')
      .orderByChild(orderByChild)
      .equalTo(statusValue)
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
    // console.log({bookingKeys});
    dataArray.reverse();

    // customized data
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

    const sortedBookings = bookingList.sort(
      (a: TBookingHistory, b: TBookingHistory) => b?.createdAt - a?.createdAt,
    );

    setBookings(sortedBookings);
    // setBookings(dataArray);
    if (dataArray.length > 0) {
      setLastItemKey(dataArray[dataArray.length - 1].key);
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
      .startAt(`${uid}_${status}`)
      .endAt(statusValue, lastKey ?? lastItemKey)
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

    const sortedBookings = bookingList.sort(
      (a: TBookingHistory, b: TBookingHistory) => b?.createdAt - a?.createdAt,
    );

    setBookings(prevItems => [...prevItems, ...sortedBookings]);
    if (allFetchedData.length > dataArray.length && newLastKey !== lastKey) {
      // setBookings(prevItems => [...prevItems, ...dataArray]);
      fetchMoreData(newLastKey);
    } else if (dataArray.length > 0) {
      setLastItemKey(dataArray[dataArray.length - 1].key);
    }

    setProgressState(prevState => ({
      ...prevState,
      isFetching: false,
      hasMoreData: dataArray.length === PAGE_SIZE,
    }));
  };

  const refreshData = async () => {
    bookingKeys.current = {};
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
}

export default useRequestWitPagination;
