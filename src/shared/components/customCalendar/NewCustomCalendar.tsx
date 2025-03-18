import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {colors} from '../../../theme/colors';
import {fonts} from 'src/theme/fonts';
import moment from 'moment';
import {SCREEN_WIDTH} from '../../../constants/deviceInfo';
import {Direction} from 'react-native-calendars/src/types';
import Entypo from 'react-native-vector-icons/Entypo';
import {globalStyles} from 'src/constants/globalStyles.style';
import CustomText from '../customText/CustomText';
import {
  DateState,
  SelectedDate,
} from 'src/screens/manageAvailability/hooks/useManageAvailability';

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
}

const NewCustomCalendar = ({
  selectedDate,
  setSelectedDate,
  selectionType,
  date,
  setDates,
  markedDates,
  availability,
}: CustomCalendarProps) => {
  const userType = useAppSelector(state => state.userReducer.userType);
  const leapYear = (year: number) => {
    return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
  };
  const [dateRange, setDateRange] = useState(date);

  const [selectMonth, setSelectMonth] = useState<string>(
    moment().format('YYYY-MM'),
  );
  useEffect(() => {
    const obj: any = {};

    if (userType == 'pro' && selectedDate?.length) {
      if (
        selectedDate?.[0].month !== selectedDate?.[1]?.month &&
        selectedDate.length === 2
      ) {
        const start = selectedDate[0]?.dateString;
        const end = selectedDate[1]?.dateString;

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
          const date = `${startYear}-${startMonth <= 9 ? 0 : ''}${startMonth}-${
            i <= 9 ? 0 : ''
          }${i}`;
          if (i === startDate) {
            obj[date] = {
              startingDay: true,
              color: colors.primary,
              textColor: colors?.secondary,
              // disableTouchEvent: true,
            };
          } else {
            obj[date] = {
              color: colors.primary,
              textColor: colors?.secondary,
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
                  color: colors.primary,
                  textColor: colors?.secondary,
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
                color: colors.primary,
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
              color: colors.primary,
              textColor: colors?.secondary,
              // disableTouchEvent: true,
            };
          }
        }
      }
    }
    setDateRange(obj);
  }, [selectedDate, selectMonth]);

  const [year, setYear] = useState<any>();
  const [isRefresh, setIsRefresh] = useState(false);
  const _renderArrow = useCallback((direction: Direction) => {
    return (
      <View style={{borderWidth: 1}}>
        {direction === 'left' ? (
          <Entypo
            name="chevron-left"
            color={colors?.primary}
            size={25}
            style={{
              right: -SCREEN_WIDTH / 1.5,
            }}
          />
        ) : (
          <Entypo
            name="chevron-right"
            color={colors?.primary}
            size={25}
            style={{right: -SCREEN_WIDTH * 0.04}}
          />
        )}
      </View>
    );
  }, []);
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
      initialDate={moment(new Date()).format('YYYY-MM-DD')}
      markingType={'period'}
      monthFormat={selectMonth}
      minDate={new Date().toDateString()}
      onDayPress={(day: SelectedDate) => {
        if (selectionType == 'multiple') {
          if (selectedDate?.length <= 1 && userType == 'pro') {
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
      // theme={{
      //   selectedDayBackgroundColor: colors?.primary,
      //   selectedDayTextColor: colors?.secondary,
      //   dayTextColor: colors?.defaultBlack,
      //   // monthTextColor: colors?.primary,
      //   calendarBackground: colors?.secondary,
      //   textSectionTitleColor: colors?.defaultBlack,
      //   textDayFontFamily: fonts.arial,
      //   todayBackgroundColor: colors?.secondary,
      //   // todayTextColor: colors?.primary,
      //   // textDayHeaderFontSfontsize: 14,
      //   // textDayFontSfontsize: 12,
      //   textMonthFontFamily: fonts.arial,
      //   textDayHeaderFontFamily: fonts.openSansBold,
      //   weekVerticalMargin: 0,
      //   // todayDotColor: colors?.white,
      //   arrowStyle: {
      //     backgroundColor: 'pink',
      //     right: -SCREEN_WIDTH - 10,
      //     // position:"absolute"
      //   },
      // }}

      arrowsHitSlop={{left: 300, top: 20}}
      // hideArrows={true}
      renderArrow={_renderArrow}
      headerStyle={{}}
      renderHeader={date => {
        let month = moment().format('MMMM');
        let year = moment().format('YYYY');

        /*Return JSX*/
        return (
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              position: 'absolute',
              left: -SCREEN_WIDTH * 0.46,
              top: -10,
              zIndex: -1,
            }}>
            <View
              // type="unstyled"
              // onPress={handleNextMonth}
              style={[
                globalStyles?.flexRow,
                {
                  justifyContent: 'flex-start',
                  //   backgroundColor: 'red',
                },
              ]}>
              <CustomText
                color="defaultBlack"
                fontFamily="arialBold"
                fontSize={17}>
                {`${moment(selectMonth).format('MMMM YYYY') ?? month}`}
              </CustomText>
              <Entypo name="chevron-right" color={colors?.primary} size={20} />
            </View>
          </View>
        );
      }}
      // Enable the option to swipe between months. Default = false
      enableSwipeMonths={true}
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

export default NewCustomCalendar;
