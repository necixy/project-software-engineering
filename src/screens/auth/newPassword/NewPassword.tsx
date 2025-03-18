import React from 'react';
import Container from 'src/shared/components/container/Container';
import ForgotHeader from '../components/ForgotHeader';
import {useNavigation} from '@react-navigation/native';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import {AuthStackRouteName} from 'src/navigation/constant/authStackRouteName';
import useNewPassword from './useNewPassword';
import {colors} from 'src/theme/colors';

export default function NewPassword() {
  const {navigate} = useNavigation();
  const {
    formik: {
      values: {newPassword, confirmPassword},
      errors,
      touched,
      handleChange,
      submitForm,
    },
    t,
  } = useNewPassword();
  return (
    <Container
      contentContainerStyle={{alignItems: 'center', paddingHorizontal: 20}}>
      <ForgotHeader
        label={t('message:resetYourPassword')}
        subHeading={t('message:enterNewPassword')}
      />
      <CustomInput
        textInputProps={{placeholderTextColor: colors.placeHolderInput}}
        placeHolderText={t('customWords:newPassword')}
        value={newPassword}
        onChangeText={handleChange('newPassword')}
        error={touched?.newPassword && errors?.newPassword}
        keyboardType="email-address"
        containerStyle={{marginBottom: 30}}
        inputBoxStyle={{fontSize: fontSizePixelRatio(18)}}
        inputContainer={{
          height: 50,
          width: SCREEN_WIDTH - 60,
          backgroundColor: colors.inputBackground,
          borderColor: colors.inputBorder,
          borderRadius: 10,
        }}
      />

      <CustomInput
        textInputProps={{placeholderTextColor: colors.placeHolderInput}}
        placeHolderText={'Confirm new password'}
        onChangeText={handleChange('confirmPassword')}
        value={confirmPassword}
        containerStyle={{marginBottom: 30}}
        error={touched.confirmPassword && errors?.confirmPassword}
        inputBoxStyle={{fontSize: fontSizePixelRatio(18)}}
        inputContainer={{
          height: 50,
          width: SCREEN_WIDTH - 60,
          backgroundColor: colors.inputBackground,
          borderColor: colors.inputBorder,
          borderRadius: 10,
        }}
      />

      <CustomButton
        onPress={submitForm}
        alignSelf="center"
        style={{width: '80%', marginVertical: 20, borderRadius: 10}}>
        {t('customWords:resetPassWord')}
      </CustomButton>
      <CustomText
        color="primary"
        marginTop={10}
        onPress={() => navigate(AuthStackRouteName.LOGIN)}>
        {t('common:backToLogIn')}
      </CustomText>
    </Container>
  );
}
