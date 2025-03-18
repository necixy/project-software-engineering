import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import Icon from 'src/assets/svg';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import {colors} from 'src/theme/colors';
import renderPersonalInfo from '../PersonalInfo.style';
import {SCREEN_HEIGHT} from 'src/constants/deviceInfo';
import useProPhoneNumber from './useProPhoneNumber';

export default function ProPhoneNumber() {
  const {t} = useTranslation();
  const {
    formik: {
      values: {proPhoneNumber},
      handleSubmit,
      handleChange,
      errors,
      touched,
    },
    isLoading,
    userData,
  } = useProPhoneNumber();

  return (
    <Container contentContainerStyle={{paddingHorizontal: 20}}>
      <Avatar
        resizeMode="cover"
        source={
          userData?.profileImg
            ? {uri: userData?.profileImg}
            : userData?.photoURL
            ? {uri: userData?.photoURL}
            : undefined
        }
        style={[
          {
            width: 100,
            height: 100,
            zIndex: -1,
            borderRadius: 50,
            borderColor: colors.grey,
            alignSelf: 'center',
            marginBottom: 20,
          },
        ]}
      />
      <CustomText fontSize={18} textAlign="center" marginBottom={20}>
        {t('common:wellDone')} {userData?.displayName} !
      </CustomText>
      <CustomText
        fontFamily="openSansRegular"
        textAlign="center"
        paddingHorizontal={20}
        marginBottom={40}>
        {t('customWords:phoneNumberMessage')}
      </CustomText>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: '16%',
        }}>
        <Icon name="franceFlag" height={30} width={30} style={{}} />
        <View
          style={{
            flex: 1,
            marginStart: 10,
            marginBottom: 15,
            height: '72%',
            justifyContent: 'center',
          }}>
          <CustomText color="grey" marginStart={7}>
            {t('customWords:phoneNumber')}
          </CustomText>
          <CustomInput
            inputContainer={[renderPersonalInfo.inputContainer, {marginTop: 3}]}
            textInputProps={{placeholderTextColor: colors.grey}}
            inputBoxStyle={[renderPersonalInfo.inputBox]}
            value={proPhoneNumber}
            error={touched?.proPhoneNumber && errors?.proPhoneNumber}
            errorStyle={renderPersonalInfo.errorStyle}
            onChangeText={handleChange('proPhoneNumber')}
          />
        </View>
      </View>

      <CustomButton
        isLoading={isLoading}
        style={[
          renderPersonalInfo.button,
          {marginTop: SCREEN_HEIGHT * 0.3, marginBottom: 5},
          // {position: 'absolute', bottom: 8, left: '6%'},
        ]}
        onPress={() => handleSubmit()}>
        {t('customWords:continue')}
      </CustomButton>
    </Container>
  );
}
