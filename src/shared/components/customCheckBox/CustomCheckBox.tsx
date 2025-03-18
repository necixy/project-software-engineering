import {View, Text, ViewStyle} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomButton from '../customButton/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
interface ICheckBox {
  isChecked?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}
const CheckBox = ({isChecked = false, onPress, style}: ICheckBox) => {
  const [isCheck, setIsCheck] = useState(isChecked);
  useEffect(() => {
    setIsCheck(isChecked);
  }, [isChecked]);

  return (
    <CustomButton type="unstyled" onPress={onPress} style={style}>
      <Icon
        name={!isCheck ? 'square-outline' : 'checkbox-outline'}
        size={24}
        color={'#000'}
      />
    </CustomButton>
  );
};

export default CheckBox;
