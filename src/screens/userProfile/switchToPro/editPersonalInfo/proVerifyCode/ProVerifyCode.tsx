import {ActivityIndicator} from 'react-native';
import React, {useCallback} from 'react';
import CustomText from 'src/shared/components/customText/CustomText';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import renderPersonalInfo from '../PersonalInfo.style';
import {useTranslation} from 'react-i18next';

import OtpInputs from 'react-native-otp-inputs';
import {colors} from 'src/theme/colors';
import Container from 'src/shared/components/container/Container';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import {otpStyle} from './ProVerify.style';
import useProVerifyCode from './useProVerifyCode';
import CountDownTimer from './component/CountDown';
import CountDown from './component/CountDown';

export default function ProVerifyCode({route: {params}}: any) {
  const {
    sendOtp,
    resendOtp,
    setOtp,
    isResend,
    otp,
    isLoading,
    ref,
    setIsResendEnable,
    isResendEnable,
  } = useProVerifyCode(params);
  const {t} = useTranslation();
  const handleTextChange = (text: string) => {
    setOtp(text);
  };
  const resetOTP = useCallback(() => {
    setTimeout(() => {
      ref.current && ref.current.reset();
    }, 0);

    return clearTimeout;
  }, []);

  return (
    <Container
      contentContainerStyle={{
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
      }}>
      <CustomText fontSize={18} marginBottom={25}>
        {t('customWords:enterTheCodeReceivedBySMS')}
      </CustomText>
      <OtpInputs
        ref={ref}
        autofillFromClipboard={false}
        handleChange={value => {
          handleTextChange(value);
        }}
        numberOfInputs={6}
        style={otpStyle.otpContainer}
        inputContainerStyles={otpStyle.otpInputContainer}
        inputStyles={otpStyle.otpInput}
        textContentType="oneTimeCode"
      />
      <CustomText color="grey" marginBottom={20}>
        {t('customWords:theCodeHaveBeenSentAtThe')} {''}
        <CustomText color="grey" style={{textDecorationLine: 'underline'}}>
          {params?.proNumber}
        </CustomText>
      </CustomText>
      {isResendEnable ? (
        <CustomButton
          type="unstyled"
          alignSelf="center"
          style={{height: 25}}
          textProps={{}}
          onPress={() => {
            resendOtp();
            resetOTP();
          }}>
          {isResend ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <CustomText fontFamily="openSansRegular" color="primary">
              {t('customWords:SendTheCodeAgain')}
            </CustomText>
          )}
        </CustomButton>
      ) : (
        <CountDown
          initialValue={120}
          onCountDownEnd={() => setIsResendEnable(true)}
        />
      )}

      <CustomButton
        disabled={otp?.trim()?.length < 6}
        isLoading={isLoading}
        style={[
          renderPersonalInfo.button,
          {position: 'absolute', bottom: 8, left: '5%'},
        ]}
        onPress={sendOtp}>
        {t('customWords:continue')}
      </CustomButton>
    </Container>
  );
}
