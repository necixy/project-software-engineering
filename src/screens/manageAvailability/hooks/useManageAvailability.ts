import {useEffect, useState, Dispatch, SetStateAction} from 'react';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {
  hideLoadingSpinner,
  showLoadingSpinner,
  showModal,
} from 'src/shared/components/modalProvider/ModalProvider';
import {useNavigation} from '@react-navigation/native';
import {bookedTimesStatus} from './useBookAvailability';
export interface SelectedDate {
  dateString: string;
  day: number;
  month: number;
  timestamp?: number;
  year: number;
}
export interface DateState {
  startDate: string;
  endDate: string;
}
const useManageAvailability = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const timeListData: {time: string}[] = [
    {time: '7:00'},
    {time: '7:30'},
    {time: '8:00'},
    {time: '8:30'},
    {time: '9:00'},
    {time: '9:30'},
    {time: '10:00'},
    {time: '10:30'},
    {time: '11:00'},
    {time: '11:30'},
    {time: '12:00'},
    {time: '12:30'},
    {time: '13:00'},
    {time: '13:30'},
    {time: '14:00'},
    {time: '14:30'},
    {time: '15:00'},
    {time: '15:30'},
    {time: '16:00'},
    {time: '16:30'},
    {time: '17:00'},
    {time: '17:30'},
    {time: '18:00'},
    {time: '18:30'},
    {time: '19:00'},
    {time: '19:30'},
    {time: '20:00'},
    {time: '20:30'},
    {time: '21:00'},
    {time: '21:30'},
    {time: '22:00'},
    {time: '22:30'},
    {time: '23:00'},
  ];
  const uid = useAppSelector(state => state?.userReducer?.userDetails?.uid);
  const [selectionType, setSelectionType] = useState<'single' | 'multiple'>(
    'single',
  );
  const [selectedTime, setSelectedTime] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [date, setDates] = useState<DateState>({
    startDate: moment(new Date()).format('YYYY-MM-DD'),
    endDate:
      selectionType === 'single'
        ? moment(new Date()).format('YYYY-MM-DD')
        : moment(new Date()).add(7, 'days').format('YYYY-MM-DD'),
  });
  const [selectedDate, setSelectedDate] = useState<SelectedDate[]>([
    {
      dateString: date.startDate,
      day: Number(moment(date.startDate).format('DD')),
      month: Number(moment(date.startDate).format('MM')),
      year: Number(moment(date.startDate).format('YYYY')),
    },
    {
      dateString: date.endDate,
      day: Number(moment(date.endDate).format('DD')),
      month: Number(moment(date.endDate).format('MM')),
      year: Number(moment(date.endDate).format('YYYY')),
    },
  ]);
  const [bookingTimesData, setBookingTimesData] = useState<string[]>();
  const sortTimes = (times: string[]) => {
    return times.sort((a, b) => moment(a, 'HH:mm').diff(moment(b, 'HH:mm')));
  };
  const setFirebaseAvailability = async () => {
    if (!selectedDate?.length || !selectedTime?.length) {
      showModal({
        message: 'Please select time and date',
        type: 'error',
      });
    } else {
      setIsLoading(true);
      try {
        const result: any = {};
        const startDate = moment(selectedDate[0].dateString);
        // If only one date is selected
        if (selectedDate.length === 1) {
          const formattedDate = selectedDate[0].dateString;
          result[formattedDate] = sortTimes([...selectedTime]);
        } else {
          const endDate = moment(selectedDate[1].dateString);
          // Iterate over each date within the range
          for (
            let currentDate = startDate;
            currentDate <= endDate;
            currentDate.add(1, 'day')
          ) {
            const formattedDate = currentDate.format('YYYY-MM-DD');
            result[formattedDate] = sortTimes([...selectedTime]);
          }
        }
        await databaseRef(`availability/${uid}`).update(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        navigation.goBack();
        showModal({
          message: t('customWords:updatedSuccessfully'),
          type: 'success',
        });
      }
    }
  };
  const getBookingTimes = async () => {
    try {
      let bookedTimesList: string[] | any = [];
      showLoadingSpinner({});
      // await databaseRef(`bookingTimes/${uid}`).once('value', snapshot => {
      //   snapshot.val() && setBookingTimesData(snapshot.val());
      // });
      await databaseRef(`bookingTimes/${uid!}`)
        .orderByChild(`date`)
        .equalTo(`${selectedDate?.[0]?.dateString}`)
        .once('value', snapshot => {
          // if (snapshot.val()) {
          //   bookedTimesList = snapshot.val()
          //     ? Object.values(snapshot.val())?.map(item => {
          //         // if (item?.status == bookedTimesStatus.successful) {
          //         return item?.time;
          //         // }
          //         // snapshot.val() && setBookingTimesData(snapshot.val());
          //       })
          //     : [];
          // }

          if (snapshot.val()) {
            let snap = Object.values(snapshot.val());

            snap?.map((item: any) => {
              if (bookedTimesList[item?.date]) {
                bookedTimesList[item?.date] = [
                  ...bookedTimesList[item?.date],
                  item?.time,
                ];
              } else {
                bookedTimesList[item?.date] = [item?.time];
              }
            });
            setBookingTimesData(bookedTimesList);
          }
        });
    } catch (error) {
      console.error('Error in getting booking times', error);
    } finally {
      hideLoadingSpinner();
    }
  };
  useEffect(() => {
    getBookingTimes();
  }, []);
  useEffect(() => {
    const getUserAvailability = async () => {
      try {
        showLoadingSpinner({});
        const snapshot = await databaseRef(`availability/${uid}`).once('value');
        if (snapshot.val() !== null) {
          setAvailability(snapshot.val());
          const allDate = Object.keys(snapshot.val()).map(dateString => ({
            dateString,
            day: new Date(dateString).getDate(),
            month: new Date(dateString).getMonth() + 1,
            timestamp: new Date(dateString).getTime(),
            year: new Date(dateString).getFullYear(),
          }));
          const startDate = allDate[0];
          const endDate = allDate[allDate.length - 1];
          const selectedTime: string[] = Object.values(snapshot.val())[
            Object.values(snapshot.val()).length - 1
          ];
          const previousData = {
            selectedDate: [startDate, endDate],
            selectedTime,
          };
          const format = 'DD-MM-YYYY';
          const startDateHasPassed = moment(
            startDate?.dateString,
            format,
          ).isBefore(moment(new Date(), format));
          const endDateHasPassed = moment(endDate?.dateString, format).isBefore(
            moment(new Date(), format),
          );
          if (startDateHasPassed && !endDateHasPassed) {
            let newStartDate = {
              dateString: moment(new Date()).format('YYYY-MM-DD'),
              day: new Date().getDate(),
              month: new Date().getMonth() + 1,
              timestamp: new Date().getTime(),
              year: new Date().getFullYear(),
            };
            setSelectedDate([newStartDate, endDate]);
          } else if (startDateHasPassed && endDateHasPassed) {
            let newStartDate = {
              dateString: moment(new Date()).format('YYYY-MM-DD'),
              day: new Date().getDate(),
              month: new Date().getMonth() + 1,
              timestamp: new Date().getTime(),
              year: new Date().getFullYear(),
            };
            setSelectedDate([newStartDate]);
          } else if (!startDateHasPassed && !endDateHasPassed) {
            setSelectedDate([startDate, endDate]);
          } else {
            setSelectedTime(selectedTime);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        hideLoadingSpinner();
      }
    };
    getUserAvailability();
  }, []);
  useEffect(() => {
    setSelectedDate([]);
  }, [selectionType]);
  useEffect(() => {
    availability[selectedDate[0]?.dateString]
      ? setSelectedTime(availability[selectedDate[0]?.dateString])
      : setSelectedTime([]);
  }, [selectedDate]);
  return {
    t,
    availability,
    selectedDate,
    setSelectedDate,
    date,
    setDates,
    selectedTime,
    setSelectedTime,
    uid,
    timeListData,
    navigation,
    setSelectionType,
    selectionType,
    setFirebaseAvailability,
    isLoading,
    bookingTimesData,
  };
};
export default useManageAvailability;

// .orderByChild(`date`)
//         .equalTo(`${selectedDate?.[0]?.dateString}`)
