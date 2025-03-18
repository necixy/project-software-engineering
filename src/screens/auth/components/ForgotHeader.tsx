import {View, Text} from 'react-native';
import React from 'react';
import CustomText from 'src/shared/components/customText/CustomText';
import FastImage from 'react-native-fast-image';
import Icon from 'src/assets/svg';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import Entypo from 'react-native-vector-icons/Entypo';
import {SCREEN_HEIGHT} from 'src/constants/deviceInfo';
import {AuthStackRouteName} from 'src/navigation/constant/authStackRouteName';
import {useNavigation} from '@react-navigation/native';

type TForgot = {
  label: string;
  subHeading: string;
};
export default function ForgotHeader({label, subHeading}: TForgot) {
  const {navigate} = useNavigation();
  return (
    <>
      <CustomButton
        style={{
          alignSelf: 'center',
          position: 'absolute',
          left: '5%',
          top: '2%',
        }}
        type="unstyled"
        onPress={() => {
          navigate(AuthStackRouteName.LOGIN);
        }}>
        <Entypo name="cross" size={35} color={'#000'} />
      </CustomButton>
      <View style={{alignItems: 'center', marginTop: SCREEN_HEIGHT * 0.08}}>
        <Icon name="locker" style={{marginBottom: 30}} />
        <CustomText fontFamily="openSansBold" fontSize={18} marginBottom={30}>
          {label}
        </CustomText>
        <CustomText
          textAlign="center"
          fontFamily="openSansRegular"
          marginHorizontal={20}
          marginBottom={30}>
          {subHeading}
        </CustomText>
      </View>
    </>
  );
}
