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
import useForgotPassword from './useForgotPassword';
import {useTranslation} from 'react-i18next';
import {colors} from 'src/theme/colors';

export default function ForgotPassword() {
  const {navigate} = useNavigation();
  const {t} = useTranslation();
  const {
    formik: {
      values: {email},
      errors,
      touched,
      submitForm,
      handleChange,
      setFieldValue,
    },
    serverType,
    isLoading,
  } = useForgotPassword();
  return (
    <Container
      contentContainerStyle={{alignItems: 'center', paddingHorizontal: 20}}>
      <ForgotHeader
        label={t('customWords:troubleLoggingIn')}
        subHeading={t('customWords:forgotPasswordLinkMessage')}
      />
      <CustomInput
        placeHolderText={t('customWords:userNameOrEmail')}
        onChangeText={
          serverType === 'LIVE'
            ? handleChange('email')
            : value => {
                const prefix = '@mailinator.com';
                let email = value.trim();
                // Check if the email prefix already contains a domain
                if (!/@/.test(email)) {
                  // If not, concatenate the fixed domain
                  email += prefix;
                } else if (email.split('@')?.[1] !== prefix) {
                  const pre = email.split('@');
                  pre[1] = prefix;
                  email = pre.join('');
                }

                setFieldValue('email', email);
              }
        }
        value={email}
        textInputProps={{placeholderTextColor: colors.placeHolderInput}}
        keyboardType="email-address"
        containerStyle={{marginBottom: 30}}
        error={touched.email && errors?.email}
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
        isLoading={isLoading}
        alignSelf="center"
        style={{width: '80%', marginVertical: 20, borderRadius: 10}}>
        {t('common:next')}
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
