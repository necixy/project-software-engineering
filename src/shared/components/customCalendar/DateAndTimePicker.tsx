import {View, Text, Keyboard} from 'react-native';
import React, {ReactNode, useEffect, useState} from 'react';
import {Portal} from 'react-native-portalize';
import {Modalize, useModalize} from 'react-native-modalize';
import CustomButton from '../customButton/CustomButton';
import DatePicker from 'react-native-date-picker';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

type IProps = {
  value?: Date;
  mode?: 'date' | 'time' | 'datetime';
  isOpen?: boolean;
  is24Hour?: boolean;
  onChange?: (value: Date) => void;
  onClose: () => void;
  minDate?: Date;
  maxDate?: Date;
  actionElement?: ReactNode;
};

const DateAndTimePicker = ({
  minDate,
  maxDate,
  mode,
  is24Hour,
  value,
  onChange,
  actionElement,
  isOpen,
  onClose,
}: IProps) => {
  const {close, open, ref} = useModalize();
  useEffect(() => {
    isOpen ? open() : close();
  }, [isOpen]);

  const [date, setDate] = useState(
    typeof value?.getMonth === 'function' ? value : new Date(),
  );

  const {t} = useTranslation();
  return (
    <>
      {actionElement ? (
        <CustomButton
          type="unstyled"
          onPress={() => {
            open();
            Keyboard.dismiss();
          }}>
          {actionElement}
        </CustomButton>
      ) : null}
      <Portal>
        <Modalize
          onClose={onClose}
          ref={ref}
          adjustToContentHeight
          handlePosition="inside"
          useNativeDriver={true}
          avoidKeyboardLikeIOS
          rootStyle={{
            backgroundColor: 'rgba(0, 46, 107, 0.3)',
          }}>
          <View
            style={{
              paddingVertical: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <DatePicker
              maximumDate={maxDate}
              minimumDate={minDate}
              androidVariant="iosClone"
              mode={mode ?? 'date'}
              theme="light"
              is24hourSource="locale"
              locale={is24Hour ? 'en-GB' : 'en'}
              date={date}
              onDateChange={_value => setDate(_value)}
              textColor="#000"
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <CustomButton
                type="grey"
                style={{marginEnd: 20}}
                onPress={() => {
                  close();
                  setDate(value ?? new Date());
                }}>
                {t('common:close')}
              </CustomButton>
              <CustomButton
                type="blue"
                onPress={() => {
                  onChange && onChange(date);
                  close();
                }}>
                {t('common:save')}
              </CustomButton>
            </View>
          </View>
        </Modalize>
      </Portal>
    </>
  );
};

export default DateAndTimePicker;
