import moment from 'moment';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Entypo from 'react-native-vector-icons/Entypo';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {
  DateState,
  SelectedDate,
} from 'src/screens/manageAvailability/hooks/useManageAvailability';
import {SCREEN_WIDTH} from '../../../constants/deviceInfo';
import {colors} from '../../../theme/colors';
import CustomButton from '../customButton/CustomButton';
import CustomText from '../customText/CustomText';
import DateAndTimePicker from './DateAndTimePicker';

interface CustomCalendarProps {
  selectedDate?: {
    dateString: any;
    day: number;
    month: number;
    timestamp?: number;
    year: number;
  }[];
  selectionType?: 'single' | 'multiple';
  setSelectedDate?: Dispatch<SetStateAction<any>>;
  markedDates?: any;
  setSelectMonth?: (month: string) => void;
  isLoading?: boolean;
  selectMonth?: string;
  availability?: object;
  date?: DateState;
  setDates?: Dispatch<SetStateAction<any>>;
  isSetAvailability?: boolean;
}

const CustomCalendar = ({
  selectedDate,
  setSelectedDate,
  selectionType,
  date,
  setDates,
  markedDates,
  availability,
  isSetAvailability = false,
}: CustomCalendarProps) => {
  const userType = useAppSelector(state => state.userReducer.userType);
  const leapYear = (year: number) => {
    return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
  };
  const [dateRange, setDateRange] = useState(date);

  const [selectMonth, setSelectMonth] = useState<string>(
    selectedDate
      ? moment(selectedDate?.[0]?.dateString).format('YYYY-MM')
      : moment().format('YYYY-MM'),
  );

  useEffect(() => {
    const obj: any = {};

    if (isSetAvailability) {
      if (userType === 'pro' && selectedDate?.length) {
        if (
          selectedDate?.[0].month !== selectedDate?.[1]?.month &&
          selectedDate.length === 2
        ) {
          const start = selectedDate[0]?.dateString;
          let end;
          if (selectionType === 'single') {
            end = start;
          } else if (selectionType === 'multiple') {
            end = selectedDate[1]?.dateString;
          }

          const startDate = Number(moment(start).format('DD'));
          const startYear = Number(moment(start).format('YYYY'));
          const startMonth = Number(moment(start).format('MM'));
          const endMonth = Number(moment(end).format('MM'));
          const endDate = Number(moment(end).format('DD'));
          const endYear = Number(moment(end).format('YYYY'));

          // provide limits for each month
          const limit = [1, 3, 5, 7, 8, 10, 12].includes(startMonth)
            ? 31
            : startMonth === 2 && leapYear(startYear)
            ? 29
            : startMonth === 2 && !leapYear(startYear)
            ? 28
            : 30;

          for (let i = startDate; i <= limit; i++) {
            // const date = moment(
            //   new Date(`${startYear}-${startMonth}-${i}`)
            // ).format('YYYY-MM-DD');
            const date = `${startYear}-${
              startMonth <= 9 ? 0 : ''
            }${startMonth}-${i <= 9 ? 0 : ''}${i}`;
            if (i === startDate) {
              obj[date] = {
                startingDay: true,
                endingDay: selectionType === 'single' && true,
                color: colors.primary,
                textColor: colors?.secondary,
                // disableTouchEvent: true,
              };
            } else {
              obj[date] = {
                color: selectionType === 'multiple' && colors.lightGrey,
                textColor: selectionType === 'multiple' && '#8c8989',
                // disableTouchEvent: true,
              };
            }
          }
          for (let i = startMonth + 1; i <= endMonth; i++) {
            if (i === endMonth) {
              for (let j = 1; j <= endDate; j++) {
                // const date = moment(new Date(`${endYear}-${i}-${j}`)).format(
                //   'YYYY-MM-DD'
                // );
                const date = `${endYear}-${i <= 9 ? 0 : ''}${i}-${
                  j <= 9 ? 0 : ''
                }${j}`;
                if (j === endDate) {
                  obj[date] = {
                    endingDay: true,
                    color: colors.primary,
                    textColor: colors?.secondary,
                    // disableTouchEvent: true,
                  };
                } else {
                  obj[date] = {
                    color: colors.lightGrey,
                    textColor: '#8c8989',
                    // disableTouchEvent: true,
                  };
                }
              }
            } else {
              const midValueLimit = [1, 3, 5, 7, 8, 10, 12].includes(i)
                ? 31
                : i === 2 && leapYear(endYear)
                ? 29
                : i === 2 && !leapYear(endYear)
                ? 28
                : 30;
              for (let j = 1; j <= midValueLimit; j++) {
                // const date = moment(new Date(`${endYear}-${i}-${j}`)).format(
                //   'YYYY-MM-DD'
                // );
                const date = `${endYear}-${i <= 9 ? 0 : ''}${i}-${
                  j <= 9 ? 0 : ''
                }${j}`;
                obj[date] = {
                  color: colors.lightGrey,
                  textColor: '#8c8989',
                  // disableTouchEvent: true,
                };
              }
            }
          }
        } else {
          const limit = selectedDate[1]?.day
            ? selectedDate[1]?.day
            : selectedDate[0].day;

          for (let i = selectedDate[0].day; i <= limit; i++) {
            const date =
              selectedDate[0].month <= 9 && i <= 9
                ? `${selectedDate[0].year}-0${selectedDate[0].month}-0${i}`
                : selectedDate[0].month <= 9 && i >= 10
                ? `${selectedDate[0].year}-0${selectedDate[0].month}-${i}`
                : selectedDate[0].month >= 10 && i <= 9
                ? `${selectedDate[0].year}-${selectedDate[0].month}-0${i}`
                : `${selectedDate[0].year}-${selectedDate[0].month}-${i}`;

            if (i === selectedDate[0].day) {
              obj[date] = {
                startingDay: true,
                endingDay: selectionType === 'single' && true,
                color: colors.primary,
                textColor: colors?.secondary,
                // disableTouchEvent: true,
              };
            } else if (i === selectedDate[1].day) {
              obj[date] = {
                endingDay: true,
                color: colors.primary,
                textColor: colors?.secondary,
                // disableTouchEvent: true,
              };
            } else {
              obj[date] = {
                color: colors.lightGrey,
                textColor: '#8c8989',
                // disableTouchEvent: true,
              };
            }
          }
        }
      }

      // Handle availability
      if (availability) {
        Object.keys(availability).forEach(date => {
          if (obj[date]) {
            obj[date].dotColor = '#4fd97a';
            obj[date].marked = true;
          } else {
            obj[date] = {
              marked: true,
              dotColor: '#4fd97a',
            };
          }
        });
      }
    } else {
      // Single date selection logic
      if (selectedDate?.length) {
        const selected = selectedDate[0];
        const date = selected?.dateString;
        obj[date] = {
          startingDay: true,
          endingDay: true,
          color: colors.primary,
          textColor: colors.secondary,
        };
      } else {
        // Default to today's date if no date is selected
        const date = moment().format('YYYY-MM-DD');
        obj[date].startingDay = true;
        obj[date].endingDay = true;
        obj[date].color = colors.primary;
        obj[date].textColor = colors.secondary;
      }
    }
    setDateRange(obj);
  }, [selectedDate, selectMonth, availability]);

  // useEffect(() => {
  //   if (selectionType === 'single' && !selectedDate?.length) {
  //     setSelectedDate([
  //       {
  //         dateString: moment().format('YYYY-MM-DD'),
  //         day: Number(moment().format('DD')),
  //         month: Number(moment().format('MM')),
  //         timestamp: moment(),
  //         year: Number(moment().format('YYYY')),
  //       },
  //     ]);
  //   }
  // }, []);

  const handleAddMonth = () => {
    const newDate = moment(selectMonth).add(1, 'month').format('YYYY-MM');
    setSelectMonth(newDate);
  };

  const handleSubtractMonth = () => {
    const newDate = moment(selectMonth).subtract(1, 'month').format('YYYY-MM');
    setSelectMonth(newDate);
  };

  const [year, setYear] = useState<any>();

  const [isRefresh, setIsRefresh] = useState(false);

  // const _renderArrow = useCallback((direction: Direction) => {
  //   return (
  //     <>
  //       {direction === 'left' ? (
  //         <Entypo
  //           name="chevron-left"
  //           color={colors?.primary}
  //           size={25}
  //           style={{
  //             right: -SCREEN_WIDTH / 1.5,
  //           }}
  //         />
  //       ) : (
  //         <Entypo
  //           name="chevron-right"
  //           color={colors?.primary}
  //           size={25}
  //           style={{right: -SCREEN_WIDTH * 0.04}}
  //         />
  //       )}
  //     </>
  //   );
  // }, []);

  useEffect(() => {
    if (year) {
      setIsRefresh(true);
      // setSelectedDate(year);
      setTimeout(() => {
        setIsRefresh(false);
      }, 0);
    }
  }, [year]);

  return (
    <Calendar
      key={selectMonth}
      current={selectMonth}
      markingType={'period'}
      monthFormat={selectMonth}
      minDate={new Date().toDateString()}
      onDayPress={(day: SelectedDate) => {
        if (selectionType === 'multiple') {
          if (selectedDate?.length <= 1 && userType === 'pro') {
            setSelectedDate((prev: SelectedDate) => [...prev, day]);
          } else {
            setSelectedDate([day]);
          }
        } else {
          setSelectedDate([day]);
        }
      }}
      onMonthChange={month => {
        setSelectMonth && setSelectMonth(moment(month).format('YYYY-MM-DD'));
        setYear(moment(month).format('YYYY-MM-DD'));
      }}
      hideExtraDays={true}
      markedDates={{
        ...dateRange,
        // ...markedDate,
      }}
      // theme={
      // {
      // selectedDayBackgroundColor: colors?.primary,
      // selectedDayTextColor: colors?.secondary,
      // dayTextColor: colors?.defaultBlack,
      // monthTextColor: colors?.primary,
      // calendarBackground: colors?.secondary,
      // textSectionTitleColor: colors?.defaultBlack,
      // textDayFontFamily: fonts.arial,
      // todayBackgroundColor: colors?.secondary,
      // todayTextColor: colors?.primary,
      // textDayHeaderFontSfontsize: 14,
      // textDayFontSfontsize: 12,
      // textMonthFontFamily: fonts.arial,
      // textDayHeaderFontFamily: fonts.openSansBold,
      // weekVerticalMargin: 0,
      // todayDotColor: colors?.white,
      // arrowStyle: {
      //   backgroundColor: 'pink',
      //   right: -SCREEN_WIDTH - 10,
      //   position:"absolute"
      // },
      // }
      // }
      hideArrows={true}
      // renderArrow={_renderArrow}
      // headerStyle={{}}
      // renderHeader={date => {
      //   let month = moment().format('MMMM');
      //   let year = moment().format('YYYY');

      //   /*Return JSX*/
      //   return (
      //     <View
      //       style={{
      //         alignSelf: 'center',
      //         flexDirection: 'row',
      //         justifyContent: 'space-between',
      //         position: 'absolute',
      //         left: -SCREEN_WIDTH * 0.46,
      //         top: -10,
      //         zIndex: -1,
      //       }}>
      //       <View
      //         // type="unstyled"
      //         // onPress={handleNextMonth}
      //         style={[
      //           globalStyles?.flexRow,
      //           {
      //             justifyContent: 'flex-start',
      //             //   backgroundColor: 'red',
      //           },
      //         ]}>
      //         <CustomText
      //           color="defaultBlack"
      //           fontFamily="arialBold"
      //           fontSize={17}>
      //           {`${moment(selectMonth).format('MMMM YYYY') ?? month}`}
      //         </CustomText>
      //         <Entypo name="chevron-right" color={colors?.primary} size={20} />
      //       </View>
      //     </View>
      //   );
      // }}

      renderHeader={() => (
        /* Return JSX */
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: SCREEN_WIDTH * 0.95,
          }}>
          <View
            style={{
              width: SCREEN_WIDTH * 0.65,
            }}>
            <DateAndTimePicker
              minDate={new Date()}
              actionElement={
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <CustomText
                    fontSize={18}
                    style={{
                      marginHorizontal: 5,
                      color: colors.defaultBlack,
                    }}>
                    {moment(selectMonth).format('MMMM YYYY')}
                  </CustomText>
                  <Entypo
                    name="chevron-right"
                    size={20}
                    color={colors.primary}
                  />
                </View>
              }
              value={
                selectedDate.length > 0
                  ? new Date(
                      selectedDate[0].year,
                      selectedDate[0].month - 1,
                      selectedDate[0].day,
                    )
                  : new Date()
              }
              onChange={value => {
                setSelectMonth &&
                  setSelectMonth(moment(value).format('YYYY-MM-DD'));
                setYear(moment(value).format('YYYY-MM-DD'));
                setSelectedDate([
                  {
                    dateString: moment(value).format('YYYY-MM-DD'),
                    day: Number(moment(value).format('DD')),
                    month: Number(moment(value).format('MM')),
                    timestamp: moment(value),
                    year: Number(moment(value).format('YYYY')),
                  },
                ]);
              }}
              onClose={() => {}}
            />
          </View>

          <CustomButton
            type="unstyled"
            onPress={handleSubtractMonth}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              marginHorizontal: 20,
            }}>
            <Entypo name="chevron-left" size={25} color={colors.primary} />
          </CustomButton>
          <CustomButton
            type="unstyled"
            onPress={handleAddMonth}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              marginHorizontal: 20,
            }}>
            <Entypo name="chevron-right" size={25} color={colors.primary} />
          </CustomButton>
        </View>
      )}
      // Enable the option to swipe between months. Default = false
      enableSwipeMonths={true}
      pagingEnabled={true}
      onVisibleMonthsChange={(
        date: {
          dateString: string;
          day: number;
          month: number;
          timestamp: number;
          year: number;
        }[],
      ) => {
        setSelectMonth && setSelectMonth(date[0]?.dateString);
      }}
    />
  );
};

export default CustomCalendar;
