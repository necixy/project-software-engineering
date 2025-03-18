import {firebase} from '@react-native-firebase/database';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {
  hideLoadingSpinner,
  showLoadingSpinner,
  showModal,
} from 'src/shared/components/modalProvider/ModalProvider';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';

export interface SelectedDate {
  dateString: string;
  day: number;
  month: number;
  timestamp?: number;
  year: number;
}

export interface AlreadyBooked {
  key: string;
  value: string[];
}

export interface BookingTimes {
  createdAt: string;
  date: string;
  status: keyof typeof bookedTimesStatus;
  time: string[];
}
export interface DateState {
  startDate: string;
}

export enum bookedTimesStatus {
  pending = 'pending',
  successful = 'successful',
}

const useBookAvailability = ({proUserId}: {proUserId: string}) => {
  const {t} = useTranslation();
  const navigation = useStackNavigation();
  const [timeListData, setTimeListData] = useState([]);
  const [selectedTime, setSelectedTime] = useState<string[]>([]);
  const [bookedTime, setBookedTime] = useState<string[]>([]);
  const [alreadyBooked, setAlreadyBooked] = useState<string[]>();
  const [availability, setAvailability] = useState<string[]>([]);
  const [date, setDates] = useState<DateState>({
    startDate: moment().format('YYYY-MM-DD'),
  });
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<SelectedDate[]>([
    {
      dateString: date?.startDate,
      day: Number(moment(date?.startDate).format('DD')),
      month: Number(moment(date?.startDate).format('MM')),
      year: Number(moment(date?.startDate).format('YYYY')),
    },
  ]);

  useEffect(() => {
    const fetchBookedTimes = async () => {
      try {
        await databaseRef(`bookingTimes/${proUserId}`)
          ?.orderByChild(`date`)
          ?.equalTo(selectedDate[0]?.dateString)
          ?.once('value', snapshot => {
            let bookedData = snapshot.exists()
              ? Object.values(snapshot.val())
              : null;

            bookedData = bookedData?.map(item => {
              if (item?.status == bookedTimesStatus.successful) {
                return item?.time;
              }
            });
            if (availability[selectedDate?.[0]?.dateString]) {
              // Filter out the booked time from availability
              availability[selectedDate?.[0]?.dateString] = availability[
                selectedDate?.[0]?.dateString
              ].filter(time => {
                return !bookedData.includes(time);
              });
            }
            setAlreadyBooked(bookedData);

            // bookedData?.map((item: BookingTimes) => {
            //   // if (alreadyBookedList[item?.date]) {
            //   //   let dateRelatedTime = alreadyBookedList[item?.date];
            //   //   alreadyBookedList[item?.date] = [...dateRelatedTime, item?.time];
            //   // } else {
            //   //   alreadyBookedList[item?.date] = [item?.time];
            //   // }
            //   alreadyBookedList[item?.date]?.push(item?.time);
            // });

            // console.log({alreadyBookedList});
            // let bookedTimesList = bookedData?.map(item => item?.time);
            // if (bookedTimesList) {
            //   let confirmBookedTime = bookedData?.filter(
            //     item => item?.status == bookedTimesStatus?.successful,
            //   );

            //   setAlreadyBooked(confirmBookedTime);
            // }
          });
      } catch (error) {
        console.error({error});
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookedTimes();

    const getUserAvailability = async () => {
      try {
        showLoadingSpinner({});

        let snapshot = await databaseRef(`availability/${proUserId}`).once(
          'value',
        );
        if (snapshot.val() !== null) {
          setAvailability(snapshot.val());
          // let availabilityTime = snapshot.val();
          // await databaseRef(`bookingTimes/${proUserId}`)?.once(
          //   'value',
          //   snapshot => {
          //     let bookedData = snapshot.val()
          //       ? Object.values(snapshot.val())
          //       : null;

          //     let alreadyBookedList = new Map();
          //     bookedData?.map(item => {
          //       if (alreadyBookedList.has(item?.date)) {
          //         let relatedTimeList = alreadyBookedList.get(item?.date);
          //         alreadyBookedList[item?.date] = [
          //           ...relatedTimeList,
          //           item?.time,
          //         ];
          //       } else {
          //         alreadyBookedList[item?.date] = [item?.time];
          //       }
          //     });
          //     console.log({zzzzz});

          //     let bookedTimesList = bookedData?.map(item => item?.time);
          //     if (bookedTimesList) {
          //       let confirmBookedTime = bookedData?.map(item => {
          //         if (item?.status == bookedTimesStatus?.successful) {
          //           return item?.time;
          //         }
          //       });

          //       // setAlreadyBooked(confirmBookedTime);

          //       if (availabilityTime[selectedDate?.[0]?.dateString]) {
          //         // Filter out the booked time from availabilityTime
          //         availabilityTime[selectedDate?.[0]?.dateString] =
          //           availabilityTime[selectedDate?.[0]?.dateString].filter(
          //             time => {
          //               console.log(
          //                 {confirmBookedTime},
          //                 availabilityTime[selectedDate?.[0]?.dateString],
          //               );
          //               return !confirmBookedTime!.includes(time);
          //             },
          //           );
          //       }
          //       console.log(
          //         '{availabilityTime}',
          //         availabilityTime?.[selectedDate?.[0]?.dateString],
          //       );

          //       setAvailability(availabilityTime);
          //     }
          //   },
          // );

          const allDate = Object.keys(snapshot.val())
            .map(dateString => {
              return {
                dateString,
                day: new Date(dateString).getDate(),
                month: new Date(dateString).getMonth() + 1,
                timestamp: new Date(dateString).getTime(),
                year: new Date(dateString).getFullYear(),
              };
            })
            .sort((a, b) => a.timestamp - b.timestamp);

          let startDate = allDate[0];

          const today = moment().format('YYYY-MM-DD');

          // compare if today is before start date
          let availableDate = allDate?.filter(item =>
            moment(item?.dateString).isSameOrAfter(today),
          );
          if (availableDate?.length > 0) {
            startDate = availableDate?.[0];
          } else {
            startDate = {
              dateString: moment().format('YYYY-MM-DD'),
              day: Number(moment().format('DD')),
              month: Number(moment().format('MM')),
              timestamp: Number(moment()),
              year: Number(moment().format('YYYY')),
            };
          }
          const selectedTime: string[] = Object.values(snapshot.val())[
            Object.values(snapshot.val()).length - 1
          ];
          setSelectedDate([startDate]);
          setSelectedTime(selectedTime);
        } else {
          showModal({
            message: 'No availability yet',
            successFn() {
              navigation.goBack();
            },
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        hideLoadingSpinner();
      }
    };
    // const getUserBooking = async () => {
    //   try {
    //     await databaseRef(`bookingTimes/${proUserId}`).once(
    //       'value',
    //       snapshot => {
    //         if (snapshot.val() !== null) {
    //           setAlreadyBooked(snapshot.val());
    //         }
    //       },
    //     );
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    getUserAvailability();

    // getUserBooking();
  }, []);

  useEffect(() => {
    if (alreadyBooked && availability) {
      if (availability[selectedDate?.[0]?.dateString]) {
        // Filter out the booked time from availability
        availability[selectedDate?.[0]?.dateString] = availability[
          selectedDate?.[0]?.dateString
        ].filter(time => {
          return !alreadyBooked.includes(time);
        });
      }
      // Iterate over each date in alreadyBooked
      // Object.keys(alreadyBooked).forEach(dateString => {
      //   // Check if the dateString exists in availability
      //   if (availability[dateString]) {
      //     // Filter out the booked time from availability
      //     availability[dateString] = availability[dateString].filter(time => {
      //       console.log({alreadyBooked}, availability[dateString]);
      //       return !alreadyBooked.includes(time);
      //     });
      //   }
      // });
    }
  }, [alreadyBooked, availability, selectedDate]);

  useEffect(() => {
    setBookedTime([]);
    availability[selectedDate[0]?.dateString]
      ? setTimeListData([
          ...availability[selectedDate[0]?.dateString].map(elem => {
            return {time: elem};
          }),
        ])
      : setTimeListData([]);
    availability[selectedDate[0]?.dateString]
      ? setSelectedTime(availability[selectedDate[0]?.dateString])
      : setSelectedTime([]);
  }, [selectedDate, availability]);

  const removeBookingTimes = async ({item}: any) => {
    await databaseRef(`bookingTimes/${proUserId}/${item?.key}`).remove();
  };

  const bookTimesSlot = async (bookingCheckoutParams: any) => {
    try {
      await databaseRef(`bookingTimes/${proUserId}`)
        ?.orderByChild(`date`)
        ?.equalTo(selectedDate?.[0]?.dateString)
        ?.once('value', snapshot => {
          let bookedData = snapshot.val()
            ? Object.entries(snapshot.val()).map(([key, value]) => ({
                ...value,
                key,
              }))
            : null;
          let bookedTimesList = bookedData?.map((item: BookingTimes) => {
            let diff = moment().from(item?.createdAt).split(' ');
            if (
              diff[2] == 'day' ||
              diff[2] == 'days' ||
              diff[2] == 'hour' ||
              diff[2] == 'hours' ||
              (diff[2] == 'minutes' && parseInt(diff[1]) > 2)
            ) {
              // should also remove the time slot !!
              removeBookingTimes({item});
              return;
            } else {
              return item?.time;
            }
          });

          // bookedTimesList = bookedTimesList?.map(item => item?.time);
          if (!bookedTimesList?.includes(bookedTime?.[0])) {
            const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;
            let bookingRef = databaseRef(`bookingTimes/${proUserId}`);
            let bookingTimesDataRef = bookingRef?.push();
            let bookedTimesData = {
              status: bookedTimesStatus.pending,
              createdAt: firebaseTimestamp,
              date: selectedDate?.[0]?.dateString,
              time: bookedTime?.[0],
            };
            bookingTimesDataRef.set(bookedTimesData);
            navigation?.navigate(screenStackName.BOOKING_CHECKOUT, {
              item: bookingCheckoutParams,
            });
          } else {
            showModal({
              message:
                'This slot is under process. Please check after some time whether its allotted',
            });
          }
        });
    } catch (error) {
      console.error({error});
    }
  };

  return {
    t,
    availability,
    selectedDate,
    setSelectedDate,
    date,
    setDates,
    selectedTime,
    setSelectedTime,
    uid: proUserId,
    timeListData,
    navigation,
    bookedTime,
    setBookedTime,
    alreadyBooked,
    bookTimesSlot,
    isLoading,
  };
};

export default useBookAvailability;

// const setFirebaseBooking = async () => {
//   try {
//     const result: any = {...alreadyBooked}; // Copy alreadyBooked data

//     // Iterate over each selected date
//     const selectedDateString = selectedDate[0].dateString;
//     const selectedTimeArray = result[selectedDateString] || []; // Get existing booked times or empty array if no bookings for selected date

//     // If the selected time is not already booked on the selected date, add it
//     if (!selectedTimeArray.includes(selectedTime[0])) {
//       result[selectedDateString] = [...selectedTimeArray, ...bookedTime];
//     }

//     // Update the database with the new booking times
//     await databaseRef(`bookingTimes/${proUserId}`).update(result);
//     // navigation.goBack();
//   } catch (error) {
//     console.error(error);
//   }
// };

// ---------

// const checkBookingTimeAvailable = (
//   proUserId?: string,
//   orderDate?: string,
//   orderTime?: string[],
// ) => {
//   // clientUserId, proUserId, menuId, productId, paymentMethodId
//   return new Promise(async (resolve, reject) => {
//     // Check booking time is already alloted or not

//     let bookingDetails = await databaseRef(`bookingTimes/${proUserId}`).once(
//       'value',
//     );
//     let isOrderTimeAvailable: string[] =
//       bookingDetails.val() !== null ? bookingDetails.val()[orderDate] : [];

//     if (!isOrderTimeAvailable?.includes(orderTime?.[0])) {
//       // Booking time allot in this if booking time is not already alloted.
//       let bookedTime =
//         isOrderTimeAvailable?.length > 0
//           ? [...isOrderTimeAvailable, ...orderTime]
//           : orderTime;

//       await databaseRef(`bookingTimes/${proUserId}`)?.set(
//         bookedTime,
//       );

//       resolve({
//         bookingTime: true,
//         message: 'Booking time store successfully.',
//       });
//     } else {
//       // Throw error is already booked this time

//       Alert.alert(`Booking time slot is already booked`);
//       const message = {message: 'Booking time slot is already booked'};
//       reject(message);
//     }
//   });
// };
