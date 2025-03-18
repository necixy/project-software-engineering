import moment from 'moment';
import React, {Dispatch, SetStateAction} from 'react';
import {FlatList} from 'react-native';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from '../../../theme/colors';

interface TimeListProps {
  header?: any;
  selectedTime: string[];
  setSelectedTime: Dispatch<SetStateAction<string[]>>;
  timeListData?: {time: string}[];
  availability: any;
  selectedDate:
    | {
        dateString: string;
        day: number;
        month: number;
        timestamp?: number;
        year: number;
      }[]
    | undefined;
  bookingTimesData: any;
  selectionType: 'single' | 'multiple';
}

const TimeList = ({
  header,
  selectedTime,
  setSelectedTime,
  availability,
  selectedDate,
  timeListData,
  bookingTimesData,
  selectionType,
}: TimeListProps) => {
  // const [multipleDateSlots, setMultipleDateSlots] = useState(
  //   bookingTimesData! &&
  //     selectedDate! &&
  //     selectedDate?.length > 1 &&
  //     Object.entries(bookingTimesData!)
  //       .filter(
  //         date =>
  //           moment(date[0]) >= moment(selectedDate!?.[0]?.dateString) &&
  //           moment(date[0]) <= moment(selectedDate!?.[1]?.dateString),
  //       )
  //       .flat(2),
  // );
  // const [bookedSlots, setBookedSlots] = useState(
  //   selectionType! === 'single'
  //     ? selectedDate! && bookingTimesData!
  //     : // &&bookingTimesData[selectedDate?.[0]?.dateString]
  //       bookingTimesData! &&
  //         selectedDate! &&
  //         selectedDate!.length > 1 &&
  //         multipleDateSlots,
  // );

  // useEffect(() => {
  //   setMultipleDateSlots(
  //     bookingTimesData! &&
  //       selectedDate! &&
  //       selectedDate?.length > 1 &&
  //       Object.entries(bookingTimesData!)
  //         .filter(
  //           date =>
  //             moment(date[0]) >= moment(selectedDate!?.[0]?.dateString) &&
  //             moment(date[0]) <= moment(selectedDate!?.[1]?.dateString),
  //         )
  //         .flat(2),
  //   );

  //   setBookedSlots(
  //     selectionType! === 'single'
  //       ? selectedDate! && bookingTimesData!
  //       : // &&bookingTimesData[selectedDate?.[0]?.dateString]
  //         bookingTimesData! &&
  //           selectedDate! &&
  //           selectedDate!.length > 1 &&
  //           multipleDateSlots,
  //   );
  // }, [selectedDate]);

  const multipleDateSlots =
    bookingTimesData! &&
    selectedDate! &&
    selectedDate!.length > 1 &&
    Object.entries(bookingTimesData!)
      .filter(
        date =>
          moment(date[0]) >= moment(selectedDate!?.[0]?.dateString) &&
          moment(date[0]) <= moment(selectedDate!?.[1]?.dateString),
      )
      .flat(2);

  const bookedSlots =
    selectionType! === 'single'
      ? selectedDate! &&
        bookingTimesData! &&
        bookingTimesData[selectedDate?.[0]?.dateString]
      : // && bookingTimesData!
        // &&bookingTimesData[selectedDate?.[0]?.dateString]
        bookingTimesData! &&
        selectedDate! &&
        selectedDate!.length > 1 &&
        multipleDateSlots;

  return (
    <FlatList
      contentContainerStyle={{paddingBottom: 70}}
      ListHeaderComponent={header}
      data={timeListData}
      renderItem={({item}) => {
        return (
          <CustomButton
            alignSelf="stretch"
            onPress={() => {
              if (selectedTime?.includes(item?.time!)) {
                setSelectedTime(
                  selectedTime.filter(elem => elem !== item.time),
                );
              } else {
                setSelectedTime([...selectedTime, item.time]);
              }
            }}
            disabled={
              bookedSlots?.length ? bookedSlots.includes(item?.time!) : null
            }
            style={[
              {
                backgroundColor:
                  bookedSlots?.length && bookedSlots?.includes(item?.time)
                    ? colors?.secondary
                    : selectedTime?.includes(item.time)
                    ? colors?.buttonColors
                    : colors.lightGrey,

                borderRadius: 10,
                alignItems: 'center',
                flex: 1,
                margin: 14,

                borderWidth:
                  bookedSlots?.length && bookedSlots?.includes(item?.time)
                    ? 2
                    : 0,
                borderColor: colors.primary,
              },
            ]}>
            <CustomText
              fontSize={13}
              color={
                bookedSlots?.length && bookedSlots?.includes(item?.time)
                  ? 'defaultBlack'
                  : selectedTime?.includes(item?.time)
                  ? 'secondary'
                  : 'defaultBlack'
              }
              fontFamily={'openSansBold'}>
              {item?.time}
            </CustomText>
          </CustomButton>
        );
      }}
      keyExtractor={(_, index) => index + ''}
      numColumns={3}
    />
  );
};

export default TimeList;
