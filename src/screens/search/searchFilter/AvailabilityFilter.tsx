import React, { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import Icon from 'src/assets/svg';
import { globalStyles } from 'src/constants/globalStyles.style';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import BottomSheetPicker from 'src/shared/components/customPicker/BottomSheetPicker';
import CustomText from 'src/shared/components/customText/CustomText';
import { colors } from 'src/theme/colors';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import SearchFilterHeader from './searchFilterComponent/SearchFilterHeader';
import { Calendar } from 'react-native-calendars';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'src/redux/reducer/reducer';
import { updateAvailability } from 'src/redux/reducer/searchFilterReducer';
import moment from 'moment';
import { t } from 'i18next';
import { SCREEN_WIDTH } from 'src/constants/deviceInfo';

const AvailabilityFilter = () => {
  const timeListData: string[] = [
    '7:00',
    '7:30',
    '8:00',
    '8:30',
    '9:00',
    '9:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
  ];
  const { goBack } = useStackNavigation();
  const { availability } = useAppSelector(state => state.searchFilterReducer);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [startCalendarOpen, setStartCalendarOpen] = useState<boolean>(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState<boolean>(false);
  const [bottomColor1, setBottomColor1] = useState<keyof typeof colors>('grey');
  const [bottomColor2, setBottomColor2] = useState<keyof typeof colors>('grey');
  const dispatch = useDispatch();
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [startModalOpen, setStartModalOpen] = useState<boolean>(false);
  const [endModalOpen, setEndModalOpen] = useState<boolean>(false);
  return (
    <Container
      isScrollable={false}
      contentContainerStyle={{ backgroundColor: colors.secondary }}>
      <SearchFilterHeader name="Availability" hasBottomBorder />
      <View
        style={[
          globalStyles.row,
          {
            paddingHorizontal: 20,
            flex: 0.9,
            paddingTop: 15,
            justifyContent: 'space-between',
          },
        ]}>
        <View>
          <CustomText fontFamily="openSansBold" color="grey" fontSize={12}>
            {t('customWords:startDate')}
          </CustomText>
          <CustomInput
            otherChildren={
              <BottomSheetPicker
                modalStyle={{ paddingBottom: 80 }}
                actionElement={
                  <Icon
                    name="calendar"
                    color={colors.grey}
                    height={20}
                    width={20}
                    style={{
                      position: 'absolute',
                      right: 0,
                      backgroundColor: colors.secondary,
                    }}
                  />
                }
                FloatingComponent={
                  <Calendar
                    onDayPress={(day: any) => {
                      setStartDate(String(day.dateString));
                      setStartCalendarOpen(false);
                    }}
                    hideExtraDays
                  />
                }
                isOpen={startCalendarOpen}
                onOpen={() => setStartCalendarOpen(true)}
              />
            }
            value={
              startDate != '' ? moment(startDate).format('YYYY-MM-DD') : null
            }
            placeHolderText="00 / 00 / 0000"
            containerStyle={{ width: SCREEN_WIDTH * 0.4 }}
            textInputProps={{ cursorColor: colors[bottomColor1] }}
            performOnBlur={() => {
              setBottomColor1('grey');
            }}
            performOnFocus={() => {
              setBottomColor1('primary');
            }}

            keyboardType="number-pad"
            inputContainer={{
              marginBottom: 20,
              borderWidth: 0,
              borderBottomWidth: 1,
              borderColor: colors[bottomColor1],
            }}
          />

          <BottomSheetPicker
            modalStyle={{
              marginTop: 300,
              paddingTop: 30,
            }}
            pressableStyle={[
              {
                borderWidth: 1,
                paddingHorizontal: 5,
                gap: 50,
                borderColor: colors.defaultBlack,
                borderRadius: 2,
              },
              globalStyles.rowSpaceBetween,
            ]}
            onClosed={() => setStartModalOpen(false)}
            actionElement={
              <>
                <Pressable
                  style={{ flexDirection: 'row', gap: 30, alignItems: 'center' }}
                  hitSlop={{ bottom: 30, left: 30, right: 30 }}
                  onPress={() => {
                    setStartModalOpen(true);
                  }}>
                  <CustomText fontFamily="openSansRegular" fontSize={12}>
                    {startTime == '' ? t('customWords:time') : startTime}
                  </CustomText>
                  <Icon name="down" color={colors?.defaultBlack} />
                </Pressable>
              </>
            }
            isOpen={startModalOpen}
            flatListProps={{
              data: timeListData,
              showsVerticalScrollIndicator: false,
              style: {
                width: 200,
                alignSelf: 'center',
              },
              renderItem: ({ item }) => {
                return (
                  <View>
                    <CustomButton
                      alignSelf="stretch"
                      onPress={() => {
                        setStartTime(item);
                        setStartModalOpen(false);
                      }}
                      style={[
                        {
                          backgroundColor:
                            startTime == item
                              ? colors.secondary
                              : colors.primary,
                          borderRadius: 10,
                          alignItems: 'center',
                          flex: 1,
                          margin: 5,
                          height: 35,
                          width: 200,
                          borderColor:
                            startTime == item
                              ? colors.primary
                              : colors.secondary,
                          borderWidth: startTime == item ? 2 : 0,
                          alignSelf: 'center',
                        },
                      ]}>
                      <CustomText
                        color={startTime == item ? 'primary' : 'secondary'}>
                        {item}
                      </CustomText>
                    </CustomButton>
                  </View>
                );
              },
            }}
          />
        </View>
        <View>
          <CustomText fontFamily="openSansBold" color="grey" fontSize={12}>
            {t('customWords:endDate')}
          </CustomText>
          <CustomInput
            otherChildren={
              <BottomSheetPicker
                pressableStyle={{ padding: 0 }}
                actionElement={
                  <Icon
                    name="calendar"
                    color={colors.grey}
                    height={20}
                    width={20}
                    style={{
                      position: 'absolute',
                      right: 0,
                      backgroundColor: colors.secondary,
                    }}
                  />
                }
                FloatingComponent={
                  <Calendar
                    onDayPress={(day: any) => {
                      setEndDate(String(day.dateString));
                      setEndCalendarOpen(false);
                    }}
                    hideExtraDays
                  />
                }
                isOpen={endCalendarOpen}
                onOpen={() => setEndCalendarOpen(true)}
              />
            }
            value={endDate != '' ? moment(endDate).format('YYYY-MM-DD') : null}
            placeHolderText="00 / 00 / 0000"
            containerStyle={{ width: SCREEN_WIDTH * 0.4 }}
            textInputProps={{ cursorColor: colors[bottomColor2] }}
            performOnBlur={() => {
              setBottomColor2('grey');
            }}
            performOnFocus={() => {
              setBottomColor2('primary');
            }}
            keyboardType="number-pad"
            inputContainer={{
              borderWidth: 0,
              marginBottom: 20,
              borderBottomWidth: 1,
              borderColor: colors[bottomColor2],
            }}
          />
          <BottomSheetPicker
            modalStyle={{
              marginTop: 300,
              paddingTop: 30,
            }}
            pressableStyle={[
              {
                borderWidth: 1,
                paddingHorizontal: 5,
                gap: 50,
                borderColor: colors.defaultBlack,
                borderRadius: 2,
              },
              globalStyles.rowSpaceBetween,
            ]}
            onClosed={() => setEndModalOpen(false)}
            actionElement={
              <>
                <Pressable
                  style={{ flexDirection: 'row', gap: 30, alignItems: 'center' }}
                  hitSlop={{ bottom: 30, left: 30, right: 30 }}
                  onPress={() => {
                    setEndModalOpen(true);
                  }}>
                  <CustomText fontFamily="openSansRegular" fontSize={12}>
                    {endTime == '' ? t('customWords:time') : endTime}
                  </CustomText>
                  <Icon name="down" color={colors?.defaultBlack} />
                </Pressable>
              </>
            }
            isOpen={endModalOpen}
            flatListProps={{
              data: timeListData,
              showsVerticalScrollIndicator: false,
              style: {
                width: 200,
                alignSelf: 'center',
              },
              renderItem: ({ item }) => {
                return (
                  <View>
                    <CustomButton
                      alignSelf="stretch"
                      onPress={() => {
                        setEndTime(item);
                        setEndModalOpen(false);
                      }}
                      style={[
                        {
                          backgroundColor:
                            endTime == item
                              ? colors?.secondary
                              : colors.primary,
                          borderRadius: 10,
                          alignItems: 'center',
                          flex: 1,
                          margin: 5,
                          height: 35,
                          width: 200,
                          borderColor:
                            endTime == item
                              ? colors.primary
                              : colors?.secondary,
                          borderWidth: endTime == item ? 2 : 0,
                          alignSelf: 'center',
                        },
                      ]}>
                      <CustomText
                        color={endTime == item ? 'primary' : 'secondary'}>
                        {item}
                      </CustomText>
                    </CustomButton>
                  </View>
                );
              },
            }}
          />
        </View>
      </View>
      <View style={{ flex: 0.1 }}>
        {startDate != '' && endDate != '' && (
          <CustomButton
            alignSelf="center"
            style={{ width: '80%', position: 'absolute', bottom: 20 }}
            onPress={() => {
              let start = moment(startDate);
              let availabilityArray = [];
              for (
                let currentDate = start;
                currentDate <= moment(endDate);
                currentDate.add(1, 'day')
              ) {
                availabilityArray.push(currentDate.format('YYYY-MM-DD'));
              }
              let availabilityTimeArray = timeListData.splice(
                timeListData.indexOf(startTime),
                timeListData.indexOf(endTime) + 1,
              );
              let newArr =
                availabilityTimeArray.length == 0
                  ? timeListData
                  : availabilityTimeArray;
              dispatch(
                updateAvailability({
                  availabilityArray,
                  availabilityTimeArray: newArr,
                }),
              );
              goBack();
            }}>
            {t('common:save')}
          </CustomButton>
        )}
      </View>
    </Container>
  );
};

export default AvailabilityFilter;
