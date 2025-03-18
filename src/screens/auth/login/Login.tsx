import React from 'react';
import {useTranslation} from 'react-i18next';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {globalStyles} from 'src/constants/globalStyles.style';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import Heading from '../components/Heading';
import useLogin from './useLogin';

export default function Login() {
  const {
    formik: {
      values: {email, password},
      errors,
      touched,
      submitForm,
      handleChange,
      setFieldValue,
    },
    navSignUp,
    navForgot,
    fetching,
    serverType,
  } = useLogin();
  // const optimizedFn = useCallback(debounce(submitForm, 500), []);
  const {t} = useTranslation();
  return (
    <Container
      // isLoading={fetching}
      contentContainerStyle={[
        globalStyles.screenCenter,
        globalStyles.pb2,
        {backgroundColor: '#fff', paddingHorizontal: 30},
      ]}>
      <Heading
        text={t('customWords:logInText')}
        container={{marginBottom: 20}}
      />

      <CustomInput
        placeHolderText={t('common:email')}
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
        keyboardType="email-address"
        containerStyle={{marginBottom: 25}}
        textInputProps={{placeholderTextColor: colors.placeHolderInput}}
        error={touched?.email && errors?.email}
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
        placeHolderText={t('customWords:password')}
        secureTextEntry
        textInputProps={{placeholderTextColor: colors.placeHolderInput}}
        onChangeText={handleChange('password')}
        value={password}
        inputBoxStyle={{
          fontSize: fontSizePixelRatio(18),
        }}
        error={touched.password && errors?.password}
        inputContainer={{
          height: 50,
          width: SCREEN_WIDTH - 60,
          backgroundColor: colors.inputBackground,
          borderColor: colors.inputBorder,
          borderRadius: 10,
        }}
      />
      <CustomButton
        type="unstyled"
        onPress={navForgot}
        style={[globalStyles.mb30, {marginTop: 15, alignSelf: 'flex-end'}]}>
        <CustomText color="primary" fontFamily="openSansBold">
          {t('customWords:forgotPassword')}
        </CustomText>
      </CustomButton>
      <CustomButton
        isLoading={fetching}
        alignSelf="center"
        style={{
          marginTop: 30,
          marginBottom: 20,
          height: 45,
          width: '80%',
          borderRadius: 10,
        }}
        textProps={{
          style: {
            fontSize: fontSizePixelRatio(20),
            fontFamily: fonts?.openSansBold,
          },
        }}
        onPress={submitForm}>
        {t('customWords:logIn')}
      </CustomButton>

      <CustomText
        style={{
          marginStart: 5,
          fontFamily: fonts?.openSansRegular,
          fontSize: fontSizePixelRatio(14),
        }}>
        {t('customWords:dontHaveAccount')}{' '}
        <CustomText
          onPress={() => {
            navSignUp();
          }}
          style={{
            color: colors.primary,
            fontFamily: fonts?.openSansBold,
          }}>
          {t('customWords:signUp')}
        </CustomText>
      </CustomText>
    </Container>
  );
}
