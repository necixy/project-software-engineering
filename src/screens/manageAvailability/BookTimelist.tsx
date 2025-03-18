import React, {Dispatch, SetStateAction} from 'react';
import {FlatList, Platform} from 'react-native';
import {IS_IOS, SCREEN_HEIGHT, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import Empty from 'src/shared/components/placeholder/Empty';
import {colors} from 'src/theme/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';

interface TimeListProps {
  header?: any;
  selectedTime?: string[];
  setSelectedTime?: Dispatch<SetStateAction<string[]>>;
  timeListData?: {time: string}[];
  availability?: any;
  selectedDate:
    | {
        dateString: string;
        day: number;
        month: number;
        timestamp?: number;
        year: number;
      }[]
    | undefined;
  bookedTime?: string[];
  setBookedTime?: Dispatch<SetStateAction<string[]>>;
  alreadyBooked?: string[];
}

const BookTimelist = ({
  header,
  selectedTime,
  setSelectedTime,
  availability,
  selectedDate,
  timeListData,
  bookedTime,
  setBookedTime,
  alreadyBooked,
}: TimeListProps) => {
  const currentTime = moment();

  const currentDateString = moment().format('YYYY-MM-DD');

  const filteredTimeListData = timeListData?.filter(item => {
    const isSameDate =
      selectedDate && selectedDate[0].dateString === currentDateString;
    return isSameDate ? moment(item.time, 'HH:mm').isAfter(currentTime) : true;
  });

  return (
    <FlatList
      ListHeaderComponent={header}
      ListHeaderComponentStyle={{width: '100%'}}
      contentContainerStyle={{
        paddingBottom: 70,
        width: SCREEN_WIDTH,
        alignItems: 'center',
      }}
      ListEmptyComponent={
        <Empty
          style={{height: SCREEN_HEIGHT / 4}}
          text="No slots available"
          iconElement={
            <Entypo name="time-slot" size={40} style={{color: '#808080'}} />
          }
        />
      }
      showsVerticalScrollIndicator={false}
      data={filteredTimeListData}
      renderItem={({item}) => {
        // if(Object.keys(alreadyBooked).includes(selectedDate[0].dateString) && alreadyBooked[selectedDate[0].dateString]==item?.time){
        //   return null
        // }
        return (
          <CustomButton
            alignSelf="stretch"
            onPress={() => {
              setBookedTime([item?.time]);
            }}
            style={[
              {
                backgroundColor: bookedTime?.includes(item.time)
                  ? colors.secondary
                  : colors.buttonColors,
                borderRadius: 10,
                alignItems: 'center',
                width: SCREEN_WIDTH / 4,
                margin: 10,
                borderColor: colors.buttonColors,
                borderWidth: 1.5,
              },
            ]}>
            <CustomText
              fontSize={13}
              color={
                bookedTime?.includes(item?.time) ? 'buttonColors' : 'secondary'
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

export default BookTimelist;
