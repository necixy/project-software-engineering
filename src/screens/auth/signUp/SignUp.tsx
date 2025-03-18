import React from 'react';
import {View} from 'react-native';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {globalStyles} from 'src/constants/globalStyles.style';
import {AuthStackRouteName} from 'src/navigation/constant/authStackRouteName';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CheckBox from 'src/shared/components/customCheckBox/CustomCheckBox';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {
  comingSoonAlert,
  fontSizePixelRatio,
} from 'src/utils/developmentFunctions';
import Heading from '../components/Heading';
import singUpStyles from './SignUp.style';
import useSignUp from './useSignUp';

export default function SignUp() {
  const {
    t,
    navigate,
    formik: {
      values: {username, email, password, confirmPassword, termsAccepted},
      submitForm,
      setFieldValue,
      handleChange,
      errors,
      touched,
    },
    lang,
    loading,
    fetching,
    isTermAndCondition,
    setIsTermAndCondition,
    serverType,
  } = useSignUp();
  return (
    <Container isScrollable>
      <View style={singUpStyles.container}>
        <Heading
          text={t('customWords:logInText')}
          container={{marginBottom: 20}}
        />

        <CustomInput
          placeHolderText={t('customWords:username')}
          textInputProps={{placeholderTextColor: colors.placeHolderInput}}
          inputBoxStyle={{
            fontSize: fontSizePixelRatio(18),
          }}
          inputContainer={{
            height: 50,
            width: SCREEN_WIDTH - 70,
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            borderRadius: 10,
          }}
          containerStyle={{
            marginBottom: 25,
          }}
          value={username.toLowerCase()}
          onChangeText={handleChange('username')}
          error={touched?.username && errors?.username}
        />
        <CustomInput
          placeHolderText={t('common:email')}
          textInputProps={{placeholderTextColor: colors.placeHolderInput}}
          keyboardType="email-address"
          inputBoxStyle={{fontSize: fontSizePixelRatio(18)}}
          inputContainer={{
            height: 50,
            width: SCREEN_WIDTH - 70,
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            borderRadius: 10,
          }}
          containerStyle={{marginBottom: 25, width: SCREEN_WIDTH - 70}}
          value={email}
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
          error={touched?.email && errors?.email}
        />
        <CustomInput
          placeHolderText={t('customWords:password')}
          textInputProps={{placeholderTextColor: colors.placeHolderInput}}
          inputBoxStyle={{fontSize: fontSizePixelRatio(18)}}
          secureTextEntry
          inputContainer={{
            height: 50,
            width: SCREEN_WIDTH - 70,
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            borderRadius: 10,
          }}
          containerStyle={{marginBottom: 25, width: SCREEN_WIDTH - 70}}
          value={password}
          onChangeText={handleChange('password')}
          error={touched?.password && errors?.password}
        />
        <CustomInput
          placeHolderText={t('customWords:confirmPassword')}
          secureTextEntry
          textInputProps={{placeholderTextColor: colors.placeHolderInput}}
          inputBoxStyle={{
            fontSize: fontSizePixelRatio(18),
          }}
          inputContainer={{
            height: 50,
            width: SCREEN_WIDTH - 70,
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            borderRadius: 10,
          }}
          containerStyle={{marginBottom: 20, width: SCREEN_WIDTH - 70}}
          value={confirmPassword}
          onChangeText={handleChange('confirmPassword')}
          error={touched?.confirmPassword && errors?.confirmPassword}
        />
        <View
          style={[
            globalStyles.row,
            globalStyles.mt2,
            {marginBottom: 40, width: SCREEN_WIDTH - 75},
          ]}>
          <CustomButton
            style={{
              width: '8%',
            }}
            type="unstyled">
            <CheckBox
              style={{alignSelf: 'center'}}
              isChecked={termsAccepted}
              onPress={() => {
                if (termsAccepted) setFieldValue('termsAccepted', false);
                if (!termsAccepted) setFieldValue('termsAccepted', true);
              }}
            />
          </CustomButton>
          <View style={{width: '80%'}}>
            <CustomText
              style={{
                marginStart: 5,
                fontFamily: fonts?.openSansRegular,
                lineHeight: 25,
              }}>
              {t('customWords:iHaveReadAndAcceptTheVita')}
              <CustomText
                onPress={() => {
                  navigate(AuthStackRouteName.PDF_VIEWER, {
                    sourceUri: `https://vita-abe0f.web.app/${lang!}/term-condition.pdf`,

                    // sourceUri: 'term-condition',
                  });
                }}
                style={{
                  color: colors.primary,
                  fontFamily: fonts?.openSansRegular,
                }}>
                {t('common:termsOfUse')}
              </CustomText>
              <CustomText style={{fontFamily: fonts?.openSansRegular}}>
                {` ${t('common:and')} `}
              </CustomText>
              <CustomText
                onPress={() => {
                  navigate(AuthStackRouteName.PDF_VIEWER, {
                    sourceUri: `https://vita-abe0f.web.app/${lang!}/privacy-policy.pdf`,

                    // sourceUri: 'privacy-policy',
                  });
                }}
                style={{
                  color: colors.primary,
                  fontFamily: fonts?.openSansRegular,
                }}>
                {t('common:privacyPolicy')}
              </CustomText>
            </CustomText>
          </View>
        </View>

        <CustomButton
          isLoading={loading}
          alignSelf="center"
          style={{
            width: '80%',
            height: 45,
            borderRadius: 12,
            marginBottom: 30,
          }}
          textProps={{
            style: {
              fontSize: fontSizePixelRatio(18),
              fontFamily: fonts.openSansBold,
            },
          }}
          onPress={submitForm}>
          {t('customWords:signUp')}
        </CustomButton>

        <CustomText
          style={{
            marginStart: 5,
            fontFamily: fonts.openSansRegular,
          }}>
          {t('customWords:alreadyHaveAccount')}
          {/* <CustomButton
            type="unstyled"
            alignSelf="center"
            // onPress={() => {
            //   navigate(AuthStackRouteName.LOGIN);
            // }}
            > */}
          <CustomText
            onPress={() => {
              navigate(AuthStackRouteName.LOGIN);
            }}
            style={{
              color: colors.primary,
              fontFamily: fonts.openSansBold,
            }}>
            {t('customWords:logIn')}
          </CustomText>
          {/* </CustomButton> */}
        </CustomText>
      </View>
    </Container>
  );
}
